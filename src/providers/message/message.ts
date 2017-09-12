import { Message } from './../../models/message.model';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from "../base.service";

@Injectable()
export class MessageProvider extends BaseService {

  constructor(
    public af: AngularFire,
    public http: Http
  ) {
    super();
  }

  create(message: Message, listMessage: FirebaseListObservable<Message[]>): firebase.Promise<void> {
    return listMessage.push(message)
      .catch(this.handlePromiseError);
  }

  getMessages(userid1: string, userid2: string): FirebaseListObservable<Message[]> {
    return <FirebaseListObservable<Message[]>>this.af.database.list(`/messages/${userid1}-${userid2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 30
      }
    }).catch(this.handleObservableError);
  }
}
