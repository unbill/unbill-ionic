import { Component } from '@angular/core';
import { App, NavController, ModalController, Storage, LocalStorage, Events } from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';
import { SignUpPage } from '../signup/signup';
import { AddPaymentPage } from '../add-payment/add-payment';

@Component({
  templateUrl: 'build/pages/profile/profile.html',
})
export class ProfilePage {

  public storage: Storage;
  public userName: string;
  public payment: any = {};
  public loaded: boolean = false;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private unbill: Unbill,
    private app: App
  ) {
    this.storage = new Storage(LocalStorage);
  }

  ionViewWillEnter() {
    this.getUser();
    this.getPayment();
  }

  getUser() {
    this.storage.get('unbillUserName').then(name => {
      this.userName = name;
    });
  }

  getPayment() {
    this.unbill
      .getPaymentMethod()
      .then(payment => {
        this.payment = payment;
        this.loaded = true;
      })
      .catch(error => {
        this.loaded = true;
      });
  }

  changePayment() {
    let paymentModal = this.modalCtrl.create(AddPaymentPage);
    paymentModal.onDidDismiss(() => {
      this.getPayment();
    });
    paymentModal.present();
  }

  logout() {
    this.storage.clear().then(() => {
      this.app.getRootNav().setRoot(SignUpPage, {}, { animate: true, direction: 'forward' });
    });
  }

}
