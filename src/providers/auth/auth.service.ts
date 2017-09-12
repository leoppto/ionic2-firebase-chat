import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth, FirebaseAuthState } from "angularfire2";
import { BaseService } from "../base.service";

import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthService extends BaseService {

  constructor(

    public auth: AngularFireAuth,
    public http: Http
  ) {
    super();
    console.log('Hello AuthProvider Provider');
  }

  createAuthUser(user: { email: string, password: string }): firebase.Promise<FirebaseAuthState> {
    return this.auth.createUser(user)
      .catch(this.handlePromiseError);
  }

  signinWithEmail(user: { email: string, password: string }): firebase.Promise<boolean> {
    return this.auth.login(user)
      .then((authState: FirebaseAuthState) => {
        return authState != null;
      }).catch(this.handlePromiseError);
  }

  logout(): Promise<void> {
    return this.auth.logout();
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth
        .subscribe((authState: FirebaseAuthState) => {
          (authState) ? resolve(true) : reject(false);
        });
    });
  }
}
