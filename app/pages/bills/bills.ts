import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { AddBillPage } from '../add-bill/add-bill';
import { BillDetailPage } from '../bill-detail/bill-detail';
import { AddPaymentPage } from '../add-payment/add-payment';
import { Unbill } from '../../providers/unbill/unbill';
import { AuthModal } from '../../providers/auth-modal/auth-modal';

@Component({
  templateUrl: 'build/pages/bills/bills.html',
  providers: [ AuthModal ]
})
export class BillsPage {

  public overview: any = [];
  public payment: any = {};
  public loaded: boolean = false;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private unbill: Unbill,
    private authModal: AuthModal
  ) {}

  ionViewWillEnter() {
    Promise.all([
      this.getOverview(),
      this.getPayment()
    ]).then(() => {
      this.loaded = true;
    });
  }

  addBill() {
    this.navCtrl.push(AddBillPage);
  }

  getOverview() {
    return this.unbill
      .getBillOverview()
      .then(overview => {
        this.overview = overview;
      })
  }

  getPayment() {
    return this.unbill
      .getPaymentMethod()
      .then(payment => {
        this.payment = payment;
      })
      .catch(error => {
        // Ignore error
      });
  }

  addPayment() {
    let paymentModal = this.modalCtrl.create(AddPaymentPage);
    paymentModal.onDidDismiss(() => {
      this.getPayment();
    });
    paymentModal.present();
  }

  retryPaymentMethod() {
    this.unbill
      .retryPaymentMethod()
      .then(payment => {
        this.payment = payment;
      });
  }

  viewDetail(detail) {

    let status = detail.bill.status.type;
		let companyId = detail.company._id;

		if (status === 'authenticate') {
      this.unbill
        .getCompany(companyId)
        .then(company => {
          this.authModal.present(company);
        });
		}
		else if (status === 'hold') {
			this.handleHold(detail);
		}
		else {
      let detailModal = this.modalCtrl.create(BillDetailPage, { detail: detail });
      detailModal.present();
		}

  }

  handleHold(detail) {

    let confirm = this.alertCtrl.create({
      title: detail.company.name,
      message: detail.bill.reason,
      buttons: [
        {
          text: 'I\'ve fixed it',
          handler: () => {
            this.billHoldFixed(detail.company);
          }
        },
        {
          text: 'Login now',
          handler: () => {
            this.loginToBiller(detail.company);
          }
        }
      ]
    });

    confirm.present();

	}

	billHoldFixed(company) {
		this.unbill
			.fixBillHold(company._id)
			.then(() => {
				this.getOverview();
			});
	}

	loginToBiller(company) {

		this.unbill
			.getBillDetail(company._id)
			.then(detail => {

				let link = detail.company.auth.urls.login;
				InAppBrowser.open(link, '_system');

				this.askIfFixed(company);

			});

	}

	askIfFixed(company) {
		setTimeout(() => {

      let confirm = this.alertCtrl.create({
        title: 'Did you get it fixed?',
        message: 'If so, we will re-attempt to sync with your ' + company.name + ' account.',
        buttons: [
          {
            text: 'I\'ll do this later'
          },
          {
            text: 'Yes, try again',
            handler: () => {
              this.billHoldFixed(company);
            }
          }
        ]
      });

      confirm.present();

		}, 1000);
	}

}
