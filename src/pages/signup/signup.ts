import { HomePage } from './../home/home';
import { FirebaseAuthState } from 'angularfire2';
import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { UserService } from './../../providers/user/user.service';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {

    let loading: Loading = this.showLoading();
    let userForm = this.signupForm.value;
    let username: string = userForm.username;

    this.userService.userExist(username)
      .first()
      .subscribe((userExists: boolean) => {
        if (!userExists) {
          this.authService.createAuthUser({
            email: userForm.email,
            password: userForm.password
          }).then((authState: FirebaseAuthState) => {

            delete userForm.password;
            let uuid: string = authState.auth.uid;

            this.userService.create(userForm, uuid)
              .then(() => {
                console.log('Usuario cadastrado!');
                this.navCtrl.setRoot(HomePage);
                loading.dismiss();
              }).catch((error: any) => {
                console.log(error);
                loading.dismiss();
                this.showAlert(error);
              });
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });
        } else {
          loading.dismiss();
          this.showAlert(`O username ${username} já está sendo usado.`);
        }
      });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    return loading;
  }

  private showAlert(msg: string): void {
    this.alertCtrl.create({
      message: msg,
      buttons: ['OK']
    }).present();
  }
}
