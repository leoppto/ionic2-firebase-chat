import { HomePage } from './../home/home';
import { AuthService } from './../../providers/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  signinForm: FormGroup

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }


  onSubmit(): void {

    let loading: Loading = this.showLoading();

    this.authService.signinWithEmail(this.signinForm.value)
      .then((isLoggend: boolean) => {

        if (isLoggend) {
          this.navCtrl.setRoot(HomePage);
          loading.dismiss();
        }
      }).catch((error: any) => {
        console.log(error);

        loading.dismiss();
        this.showAlert(error);
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

  /*
  onHomePage(): void {
    this.navCtrl.push(HomePage)
    .then((access: boolean) => {
      console.log('Autorizado', access);
    }).catch(err => {
      console.log('Não autorizado', err);
    });
  }

  onLogout(): void{
    this.authService.logout();
  }
*/
}
