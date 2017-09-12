import { AuthService } from './../providers/auth/auth.service';
import { NavController, AlertController, App, MenuController } from 'ionic-angular';
import { OnInit } from "@angular/core";
import { SigninPage } from './../pages/signin/signin';

export abstract class BaseComponent implements OnInit {

    protected navCtrl: NavController

    constructor(
        public alertControler: AlertController,
        public authService: AuthService,
        public app: App,
        public menuCtrl: MenuController
    ){}

    ngOnInit(): void{
        this.navCtrl = this.app.getActiveNav();
    }

    onLogout(): void{
        this.alertControler.create({
            message: 'Do you want to quit?',
            buttons: [
                {
                    text: 'yes',
                    handler: () => {
                        this.authService.logout()
                        .then(() => {
                            this.navCtrl.setRoot(SigninPage);
                            this.menuCtrl.enable(false, 'user-menu');
                        });        
                    }
                },
                {
                    text: 'no'
                }
            ]
        }).present();
    }

}