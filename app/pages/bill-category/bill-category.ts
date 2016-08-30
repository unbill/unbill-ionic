import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';
import { CompanyDetail } from '../../components/company-detail/company-detail';
import { AuthModal } from '../../providers/auth-modal/auth-modal';

@Component({
  templateUrl: 'build/pages/bill-category/bill-category.html',
  providers: [ AuthModal ],
  directives: [ CompanyDetail ]
})
export class BillCategoryPage {

  public category: any;
  public companies: any = [];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private params: NavParams,
    private authModal: AuthModal,
    private unbill: Unbill
  ) {
    this.category = this.params.get('category');
  }

  ionViewWillEnter() {
    this.unbill
      .searchCompanies({
        category: this.category.type
      })
      .then(companies => {
        this.companies = companies;
      })
  }

  authenticate(company) {
    this.authModal.present(company);
  }

}
