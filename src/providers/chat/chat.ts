import { FirebaseAuthState } from 'angularfire2';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { AngularFire } from 'angularfire2';
import { Chat } from './../../models/chat.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from "../base.service";

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ChatProvider extends BaseService {

  chats: FirebaseListObservable<Chat[]>;

  constructor(
    public af: AngularFire,
    public http: Http) {
    super()
    this.setChats();
  }

  private setChats(): void {
    this.af.auth
      .subscribe((authState: FirebaseAuthState) => {

        if (authState) {
          this.chats = <FirebaseListObservable<Chat[]>>this.af.database.list(`/chats/${authState.uid}`,
            {
              query: {
                orderByChild: 'timestamp'
              }
            }).map((chats: Chat[]) => {
              return chats.reverse();
            }).catch(this.handleObservableError);



        }

      });
  }

  create(chat: Chat, userId1: string, userId2: string): firebase.Promise<void> {
    return this.af.database.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat> {
    return <FirebaseObjectObservable<Chat>>this.af.database.object(`/chats/${userId1}/${userId2}`)
      .catch(this.handlePromiseError);
  }

  updatePhoto(chat: FirebaseObjectObservable<Chat>, photo: string, photo2: string): firebase.Promise<boolean> {   
    if (photo != photo2) {      
      return chat.update({
        photo: photo2
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }

    return Promise.resolve(false);
  }
}
