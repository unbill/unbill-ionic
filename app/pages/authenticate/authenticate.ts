import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Events, ViewController } from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';
import { CompanyHeader } from '../../components/company-header/company-header';
import { BillModalHeader } from '../../components/bill-modal-header/bill-modal-header';

@Component({
  templateUrl: 'build/pages/authenticate/authenticate.html',
  directives: [ CompanyHeader, BillModalHeader ]
})
export class AuthenticatePage {

  public company: any;
  public credentials: any;
  public bill: any;
  public mfaToken: string;
  public mfaType: string;
  public mfaResponses: any;
  public mfaQuestions: any;
  public mfaCodeList: any;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    private params: NavParams,
    private events: Events,
    private unbill: Unbill
  ) {
    this.company = this.params.get('company');
    this.credentials = {};
    this.unbill
      .getCompany(this.company._id)
      .then(company => {
        this.company = company;
      });
  }

  authenticate() {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.unbill
      .auth(this.company._id, this.credentials)
      .then(
        response => {
          loading.dismiss().then(() => {
            this.handleSuccessResponse(response)
          });
        },
        err => {
          loading.dismiss().then(() => {
            this.handleErrorResponse(err)
          });
        })
  }

  handleSuccessResponse(response) {

    console.log('handleSuccessResponse', response);

		var status = response.statusCode;

		if (status === 200) {
			this.finishAuthentication(response)
		}
		else if (status === 201) {
			this.handleMfaResponse(response);
		}

	}

	handleErrorResponse(err) {

    let alert = this.alertCtrl.create({
      title: 'Unable to Link Account',
      subTitle: err,
      buttons: ['OK']
    });
    alert.present();

		if (this.mfaToken) {
			this.reset();
		}

	}

  finishAuthentication(response) {

		this.mfaToken = undefined;

		var bill = response.bill;
    var balance = Number(bill.balance);

		if (balance) {
			this.bill = bill;
		}
		else {
			this.onward();
		}

	}

	handleMfaResponse(response) {

		this.mfaToken = response.token;
		this.mfaType = response.type;

		if (response.type === 'questions') {
			this.mfaResponses = [];
			this.mfaQuestions = response.mfa;
		}

		if (response.type === 'list') {
			this.mfaCodeList = response.mfa;
		}

	}

	sendMfaResponse(identifier) {

		let mfaPayload;

		if (this.mfaType === 'questions') {
			mfaPayload = this.mfaResponses;
		}

		if (this.mfaType === 'list') {
			mfaPayload = { identifier: identifier };
		}

    let loading = this.loadingCtrl.create({
      content: 'Sending response...'
    });

    loading.present();

		this.unbill
			.authStep(this.company._id, this.mfaToken, mfaPayload)
			.then(
        response => {
          loading.dismiss().then(() => {
            this.handleSuccessResponse(response)
          });
        },
        err => {
          loading.dismiss().then(() => {
            this.handleErrorResponse(err)
          });
        }
      );

	}

	reset() {
		this.mfaToken = undefined;
		this.mfaType = undefined;
		this.mfaResponses = undefined;
		this.mfaCodeList = undefined;
		this.credentials = {};
	}

  onward() {
    this.viewCtrl.dismiss({ authenticated: true });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
