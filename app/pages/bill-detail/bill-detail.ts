import { Component } from '@angular/core';
import { NavController, ViewController, NavParams} from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';
import { CompanyHeader } from '../../components/company-header/company-header';
import { BillModalHeader } from '../../components/bill-modal-header/bill-modal-header';

@Component({
  templateUrl: 'build/pages/bill-detail/bill-detail.html',
  directives: [ CompanyHeader, BillModalHeader ]
})
export class BillDetailPage {

  public detail: any;
  public viewSettings: boolean = true;

  constructor(
    private viewCtrl: ViewController,
    private unbill: Unbill,
    private params: NavParams
  ) {
    this.detail = this.params.get('detail');
    this.detail.payments = [];
    this.unbill
      .getBillDetail(this.detail.company._id)
      .then(detail => {
        this.detail = detail;
      })
  }

}
