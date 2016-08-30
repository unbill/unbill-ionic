import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Unbill } from '../../providers/unbill/unbill';
import { AuthModal } from '../../providers/auth-modal/auth-modal';
import { CompanyDetail } from '../../components/company-detail/company-detail';
import { BillCategoryPage } from '../bill-category/bill-category';

@Component({
  templateUrl: 'build/pages/add-bill/add-bill.html',
  providers: [ AuthModal ],
  directives: [ CompanyDetail ]
})
export class AddBillPage {

  public categories: any = [];
  public companies: any = [];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private authModal: AuthModal,
    private unbill: Unbill
  ) {}

  ionViewLoaded() {
    this.unbill
      .getCompanyCategories()
      .then(categories => {
        this.categories = categories;
      })
  }

  searchCompanies(ev: any) {
    let val = ev.target.value;

    if (!val) {
      this.companies = [];
      return;
    }

    this.unbill
      .searchCompanies({ query: val })
      .then(companies => {
        this.companies = companies;
      })
  }

  goToCategory(category) {
    this.navCtrl.push(BillCategoryPage, { category: category });
  }

  authenticate(company) {
    this.authModal.present(company);
  }

}
