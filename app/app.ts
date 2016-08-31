import { Component } from '@angular/core';
import { Platform, ionicBootstrap, Storage, LocalStorage } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { SignUpPage } from './pages/signup/signup';
import { TabsPage } from './pages/tabs/tabs';
import { Unbill } from './providers/unbill/unbill';

@Component({
  template: `
    <ion-nav [root]="rootPage"></ion-nav>
  `
})
export class MyApp {

  storage: Storage;
  rootPage: any;

  constructor(platform: Platform) {
    this.storage = new Storage(LocalStorage);

    this.storage.get('unbillUserId').then(userId => {
      if (userId) {
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = SignUpPage;
      }
    });

    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp, [ Unbill ], {
  backButtonText: ''
});
