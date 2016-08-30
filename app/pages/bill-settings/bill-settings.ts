import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';

@Component({
  templateUrl: 'build/pages/bill-settings/bill-settings.html',
})
export class BillSettingsPage {

  public autopay: boolean;
  public company: any;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private unbill: Unbill,
    private params: NavParams
  ) {}

  ionViewWillEnter() {
    this.company = this.params.get('company');
    this.unbill
      .getBillDetail(this.company._id)
      .then(detail => {
        this.autopay = detail.bill.settings.autopay;
      })
  }

  toggleAutopay() {
    this.unbill
      .saveAutopay(this.company._id, this.autopay)
      .then(() => {
        // Updated
      },
      error => {

        this.autopay = true;

        let alert = this.alertCtrl.create({
          title: 'Autopay Error',
          subTitle: error,
          buttons: ['OK']
        });

        alert.present();
        
      });
  }

}
