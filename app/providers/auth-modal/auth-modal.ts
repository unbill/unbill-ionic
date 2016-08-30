import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ModalController, NavController } from 'ionic-angular';
import { AuthenticatePage } from '../../pages/authenticate/authenticate';
import { BillsPage } from '../../pages/bills/bills';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthModal provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthModal {

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  present(company) {

    let authModal = this.modalCtrl.create(AuthenticatePage, { company: company });

    authModal.onDidDismiss(data => {
      if (data && data.authenticated) {
        this.navCtrl.setRoot(BillsPage, {}, { animate: true, direction: 'forward' });
      }
    });

    authModal.present();

  }

}
