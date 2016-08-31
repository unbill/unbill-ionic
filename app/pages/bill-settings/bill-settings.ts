import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';
import { BillsPage } from '../bills/bills';

@Component({
  templateUrl: 'build/pages/bill-settings/bill-settings.html',
})
export class BillSettingsPage {

  public autopay: boolean;
  public company: any;

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
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

  promptRemove() {

    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: `You'll no longer be able to track your balance for ${this.company.name}.`,
      buttons: [
        'No',
        {
          text: 'Yes',
          handler: () => {
            this.removeBill();
          }
        }
      ]
    });

    confirm.present();

  }

  removeBill() {
    this.unbill
      .removeBill(this.company._id)
      .then(() => {
        let self = this;
        setTimeout(() => {
          self.navCtrl.setRoot(BillsPage, {}, { animate: true, direction: 'forward' });
        }, 400);
      });
  }

}
