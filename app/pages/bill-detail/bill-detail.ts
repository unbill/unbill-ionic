import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, AlertController} from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';
import { CompanyHeader } from '../../components/company-header/company-header';
import { BillModalHeader } from '../../components/bill-modal-header/bill-modal-header';
import { BillSettingsPage } from '../bill-settings/bill-settings';

@Component({
  templateUrl: 'build/pages/bill-detail/bill-detail.html',
  directives: [ CompanyHeader, BillModalHeader ]
})
export class BillDetailPage {

  public detail: any;
  public viewSettings: boolean = true;

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private unbill: Unbill,
    private params: NavParams
  ) {
    this.detail = this.params.get('detail');
    this.detail.payments = [];
  }

  ionViewWillEnter() {
    this.getDetail();
  }

  getDetail() {
    this.unbill
      .getBillDetail(this.detail.company._id)
      .then(detail => {
        this.detail = detail;
      });
  }

  headlineButton(button) {

    if (button.type === 'bill-settings') {
      this.navCtrl.push(BillSettingsPage, { company: this.detail.company });
    }

    if (button.type === 'pay-now') {
      this.payNow();
    }

  }

  payNow() {

    let confirm = this.alertCtrl.create({
      title: 'Confirm Payment',
      message: `Are you sure you want to make a payment of $${this.detail.bill.balance}?`,
      buttons: [
        'No',
        {
          text: 'Yes',
          handler: () => {
            this.makePayment();
          }
        }
      ]
    });

    confirm.present();

  }

  makePayment() {
    this.unbill
      .makePayment(this.detail.company._id)
      .then(() => {
        this.getDetail();
      });
  }

}
