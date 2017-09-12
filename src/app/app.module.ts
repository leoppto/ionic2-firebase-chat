import { ProgressBarComponent } from './../components/progress-bar/progress-bar';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { UserMenuComponent } from './../components/user-menu/user-menu';
import { UserInfoComponent } from './../components/user-info/user-info';
import { MessageBoxComponent } from './../components/message-box/message-box';
import { ChatPage } from './../pages/chat/chat';
import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { CustomLoggedHeaderComponent } from './../components/custom-logged-header/custom-logged-header';
import { SigninPage } from './../pages/signin/signin';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SignupPage } from './../pages/signup/signup';

import { AuthService } from './../providers/auth/auth.service';
import { UserService } from './../providers/user/user.service';

import { AngularFireModule, FirebaseAppConfig, AuthProviders, AuthMethods } from 'angularfire2';
import { ChatProvider } from '../providers/chat/chat';
import { MessageProvider } from '../providers/message/message';


const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyCJLSx9-5EYsdXLNyevNDw2UXa46l9ZYFU",
  authDomain: "ionic2-firebase-chat-1b4b5.firebaseapp.com",
  databaseURL: "https://ionic2-firebase-chat-1b4b5.firebaseio.com",
  storageBucket: "ionic2-firebase-chat-1b4b5.appspot.com",
  messagingSenderId: "832950923046"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Custom,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    CapitalizePipe,
    ChatPage,
    CustomLoggedHeaderComponent,
    HomePage,
    MyApp,
    MessageBoxComponent,
    ProgressBarComponent,
    SigninPage,
    SignupPage,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig, firebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    HomePage,
    MyApp,
    SigninPage,
    SignupPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    AuthService,
    ChatProvider,
    MessageProvider
  ]
})
export class AppModule {}
