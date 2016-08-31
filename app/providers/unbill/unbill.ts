import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage, LocalStorage } from 'ionic-angular';
import 'rxjs/Rx';

@Injectable()
export class Unbill {

  public host: string = 'https://sandbox.unbill.co/partner/v2';
  public key: string = 'sandbox-api-key';
  public storage: Storage;

  constructor(private http: Http) {
    this.storage = new Storage(LocalStorage);
  }

  // Auth Endpoints
  auth(companyId, credentials) {
    return this.request('/auth', {
      companyId: companyId,
      form: credentials
    })
  }

  authStep(companyId, mfaToken, mfaPayload) {
    return this.request('/auth/step', {
      companyId: companyId,
      token: mfaToken,
      mfa: mfaPayload
    })
  }

  // Bill Endpoints
  getBillOverview() {
    return this.request('/bill/overview', {});
  }

  getBillDetail(companyId) {
    return this.request('/bill/detail', {
      companyId: companyId
    });
  }

  fixBillHold(companyId) {
    return this.request('/bill/fix-hold', {
      companyId: companyId
    });
  }

  removeBill(companyId) {
    return this.request('/bill/remove', {
      companyId: companyId
    });
  }

  // User Endpoints
  createUser(user) {
    return this.request('/user/create', user);
  }

  // Company Endpoints
  getCompanyCategories() {
    return this.request('/company/categories', {});
  }

  searchCompanies(search) {
    return this.request('/company/search', search);
  }

  getCompany(companyId) {
    return this.request('/company/get', {
      companyId: companyId
    });
  }

  // Payment Endpoints
  saveAutopay(companyId, enabled) {
    return this.request('/payment/autopay', {
      companyId: companyId,
      autopay: (enabled ? 'enabled' : 'disabled')
    });
  }

  getPaymentMethod() {
    return this.request('/payment/get', {});
  }

  addPaymentMethod(payment) {
    return this.request('/payment/add', payment);
  }

  retryPaymentMethod() {
    return this.request('/payment/retry', {});
  }

  request(endpoint, payload) {

      let url = `${this.host}${endpoint}`;
      let headers = new Headers({
        'Content-Type': 'application/json'
      });

      return this.storage.get('unbillUserId').then(userId => {

        payload.userId = userId;
        payload.unbillKey = this.key;

        return this.http.post(url, payload, { headers: headers })
          .map(res => {
            var response = res.json();
            response.statusCode = res.status;
            return response;
          })
          .toPromise()
          .catch(this.handleError);

      });

  }

  handleError(error) {
      return Promise.reject(error.json().message || 'Server error');
  }

}
