import { Observable } from 'rxjs';
//import { User } from './../../models/user.model';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState, FirebaseApp } from "angularfire2";

import { User } from "../../models/user.model";
import { BaseService } from "../base.service";

@Injectable()
export class UserService extends BaseService {

  users: FirebaseListObservable<User[]>
  currentUser: FirebaseObjectObservable<User>

  constructor(
    public af: AngularFire,
    @Inject(FirebaseApp) public firebaseApp: any,
    public http: Http
  ) {
    super();
    //this.users = this.af.database.list('/users');
    this.listenAuthState();
  }

  private setUsers(uuidOut: string): void {
    this.users = <FirebaseListObservable<User[]>>this.af.database.list(`/users`, {
      query: {
        orderByChild: 'name'
      }
    }).map((users: User[]) => {
      return users.filter((user: User) => user.$key !== uuidOut);
    });
  }

  private listenAuthState(): void {
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {
        if (authState) {
          console.log('AuthState alterado!');
          this.currentUser = this.af.database.object(`/users/${authState.auth.uid}`);
          this.setUsers(authState.auth.uid);
        }
      });
  }

  create(user: User, uuid: string): firebase.Promise<void> {
    return this.af.database.object(`/users/${uuid}`).set(user)
      .catch(this.handlePromiseError);
  }

  edit(user: { name: string, username: string, photo: string }): firebase.Promise<void> {
    return this.currentUser
      .update(user)
      .catch(this.handlePromiseError);
  }

  userExist(username: string): Observable<boolean> {
    return this.af.database.list('/users', {
      query: {
        orderByChild: 'username',
        equalTo: username
      }
    }).map((users: User[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }

  get(userId: string): FirebaseObjectObservable<User> {
    return <FirebaseObjectObservable<User>>this.af.database.object(`users/${userId}`)
      .catch(this.handleObservableError);
  }

  uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/users/${userId}`)
      .put(file);
  }
}
