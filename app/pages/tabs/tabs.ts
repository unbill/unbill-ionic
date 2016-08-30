import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BillsPage } from '../../pages/bills/bills';
import { ProfilePage } from '../../pages/profile/profile';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html',
})
export class TabsPage {

  public billsRoot: any;
  public profileRoot: any;

  constructor(private navCtrl: NavController) {
    this.billsRoot = BillsPage;
    this.profileRoot = ProfilePage;
  }

}
