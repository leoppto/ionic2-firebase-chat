import { UserProfilePage } from './../../pages/user-profile/user-profile';
import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth/auth.service';
import { MenuController, App, AlertController, NavController } from 'ionic-angular';
import { BaseComponent } from "../base.component";
import { Component, Input } from '@angular/core';

/**
 * Generated class for the UserMenuComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent extends BaseComponent {

  @Input('user') currentUser: User;

  constructor(
    public alertControler: AlertController,
    public authService: AuthService,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertControler,
    authService,
    app,
    menuCtrl);
  }

  onProfile(): void{
    this.navCtrl.push(UserProfilePage);
  }
}
