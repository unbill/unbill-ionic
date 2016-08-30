import { Component } from '@angular/core';
import { NavController, AlertController, Storage, LocalStorage } from 'ionic-angular';
import { Validators } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Unbill } from '../../providers/unbill/unbill';
import { TabsPage } from '../../pages/tabs/tabs';

@Component({
  templateUrl: 'build/pages/signup/signup.html'
})
export class SignUpPage {

  public signupForm: FormGroup;
  public storage: Storage;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private unbill: Unbill
  ) {
    this.storage = new Storage(LocalStorage);
    this.signupForm = this.fb.group({
      name: this.fb.group({
        first: ['', [<any>Validators.required]],
        last: ['', [<any>Validators.required]]
      }),
      email: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]],
    });
  }

  signup(user, isValid) {

    if (!isValid) {
      return;
    }

    this.unbill
      .createUser(user)
      .then(
        data => {
          Promise.all([
            this.storage.set('unbillUserId', data.userId),
            this.storage.set('unbillUserName', `${user.name.first} ${user.name.last}`)
          ]).then(() => {
            this.navCtrl.setRoot(TabsPage, {}, { animate: true, direction: 'forward' });
          });
        },
        error => {
          let alert = this.alertCtrl.create({
            title: 'Signup Error',
            subTitle: error,
            buttons: ['OK']
          });
          alert.present();
        }
      )
  }

}
