import { Component, Input } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { BillSettingsPage } from '../../pages/bill-settings/bill-settings';

@Component({
  selector: 'bill-modal-header',
  templateUrl: 'build/components/bill-modal-header/bill-modal-header.html'
})
export class BillModalHeader {

  @Input() company: any;
  @Input() viewSettings: boolean;
  @Input() showDismiss: boolean;

  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController
  ) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goToSettings() {
    this.navCtrl.push(BillSettingsPage, { company: this.company });
  }

}
