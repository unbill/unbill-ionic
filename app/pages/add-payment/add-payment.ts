import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { Validators } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Unbill } from '../../providers/unbill/unbill';

@Component({
  templateUrl: 'build/pages/add-payment/add-payment.html',
})
export class AddPaymentPage {

  public paymentType: string;
  public cardForm: FormGroup;
  public bankForm: FormGroup;
  public range: any;

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private unbill: Unbill
  ) {

    let now = new Date();
    let future = new Date();
    future.setFullYear(now.getFullYear() + 10);

    this.paymentType = 'credit';
    this.range = { start: now.getFullYear(), end: future.getFullYear() };

    this.cardForm = this.fb.group({
      cardNumber: ['', [<any>Validators.required]],
      cardCode: ['', [<any>Validators.required]],
      expDate: ['', [<any>Validators.required]],
      zipcode: ['', [<any>Validators.required]]
    });

    this.bankForm = this.fb.group({
      routingNumber: ['', [<any>Validators.required]],
      accountNumber: ['', [<any>Validators.required]],
      accountType: ['', [<any>Validators.required]]
    });

  }

  addPayment(form, isValid) {

    if (!isValid) {
      return;
    }

    var payment = Object.assign({}, form);

    payment.paymentType = this.paymentType;

    if (payment.expDate) {
      let date = payment.expDate.split('-');
      payment.expDate = `${date[1]}/${date[0]}`;
    }

    let loading = this.loadingCtrl.create({
      content: 'Adding payment...'
    });

    loading.present();

    this.unbill
      .addPaymentMethod(payment)
      .then(
        () => {
          loading.dismiss().then(() => {
            this.dismiss();
          });
        },
        error => {
          loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              title: 'Payment Error',
              subTitle: error,
              buttons: ['OK']
            });
            alert.present();
          });
        });

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
