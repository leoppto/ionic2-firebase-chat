import { AlertController, App, MenuController } from 'ionic-angular';
import { AuthService } from './../../providers/auth/auth.service';
import { BaseComponent } from "../base.component";
import { User } from './../../models/user.model';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-logged-header',
  templateUrl: 'custom-logged-header.html'
})

export class CustomLoggedHeaderComponent extends BaseComponent {
  
  @Input() title: string;
  @Input() user: User;

  constructor(
    public alertControler: AlertController,
    public authService: AuthService,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertControler, authService, app, menuCtrl);
    console.log(this.title);
    
  }

}
