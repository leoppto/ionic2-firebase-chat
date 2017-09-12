import { ChatProvider } from './../../providers/chat/chat';
import { ChatPage } from './../chat/chat';
import { AuthService } from './../../providers/auth/auth.service';
import { UserService } from './../../providers/user/user.service';
import { Chat } from './../../models/chat.model';
import { User } from './../../models/user.model';
import { FirebaseListObservable } from 'angularfire2';
import { Component } from '@angular/core';
import { SignupPage } from './../signup/signup';
import { NavController, MenuController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: FirebaseListObservable<User[]>;
  chats: FirebaseListObservable<Chat[]>;
  view: string = 'chats';

  constructor(
    public authService: AuthService,
    public chatProvider: ChatProvider,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public userService: UserService
  ) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.chats = this.chatProvider.chats;
    this.users = this.userService.users;

    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any): void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatProvider.chats;
    this.users = this.userService.users;

    if (searchTerm) {
      switch (this.view) {
        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>>this.chats
            .map((chats: Chat[]) => {
              return chats.filter((chat: Chat) => {
                return (chat.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
              });
            });
          break;

        case 'users':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => {
              return users.filter((user: User) => {
                return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
              });
            });

          break;
      }
    }
    //console.log('Busca', searchTerm);
  }

  openSignUp(): void {
    this.navCtrl.push(SignupPage);
  }

  onChatCreate(user: User): void {
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.chatProvider.getDeepChat(currentUser.$key, user.$key)
          .first()
          .subscribe((chat: Chat) => {

            if (chat.hasOwnProperty('$value')) {

              let timeStamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1 = new Chat('', timeStamp, user.name, '');
              this.chatProvider.create(chat1, currentUser.$key, user.$key);

              let chat2 = new Chat('', timeStamp, currentUser.name, '');
              this.chatProvider.create(chat2, user.$key, currentUser.$key);

            }
          });
      });

    this.navCtrl.push(ChatPage, {
      recipientUser: user
    });
  }

  onChatOpen(chat: Chat): void {
    let recipientId: string = chat.$key
    this.userService.get(recipientId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });
      });
  }
}
