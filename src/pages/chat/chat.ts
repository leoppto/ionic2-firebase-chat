import { ChatProvider } from './../../providers/chat/chat';
import { Chat } from './../../models/chat.model';
import { MessageProvider } from './../../providers/message/message';
import { Message } from './../../models/message.model';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UserService } from './../../providers/user/user.service';
import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth/auth.service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import firebase from 'firebase'
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  messages: FirebaseListObservable<Message[]>
  pageTitle: string;
  sender: User;
  recipient: User;
  private chat1: FirebaseObjectObservable<Chat>;
  private chat2: FirebaseObjectObservable<Chat>;

  constructor(
    public authService: AuthService,
    public chatProvider: ChatProvider,
    public messageProvider: MessageProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.sender = currentUser;

        this.chat1 = this.chatProvider.getDeepChat(this.sender.$key, this.recipient.$key);
        this.chat2 = this.chatProvider.getDeepChat(this.recipient.$key, this.sender.$key);

        if (this.recipient.photo) {
          this.chat1
            .first()
            .subscribe((chat: Chat) => {
              console.log(chat)
              this.chatProvider.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
            });
        }



        let doSubscription = () => {
          this.messages
            .subscribe((messages: Message[]) => {
              this.scrollToBottom();
            });
        };

        this.messages = this.messageProvider.getMessages(this.sender.$key, this.recipient.$key);

        this.messages
          .first()
          .subscribe((messages: Message[]) => {
            if (messages.length === 0) {

              this.messages = this.messageProvider
                .getMessages(this.recipient.$key, this.sender.$key);

              doSubscription();
            } else {
              doSubscription();
            }
          });

      });

  }

  sendMessage(newMessage: string): void {
    if (newMessage) {

      let timestampcurrent: Object = firebase.database.ServerValue.TIMESTAMP;

      this.messageProvider.create(
        new Message(
          this.sender.$key,
          newMessage,
          timestampcurrent
        ),
        this.messages
      ).then(() => {
        this.chat1
          .update({
            lastMessage: newMessage,
            timpestamp: timestampcurrent
          });

        this.chat2
          .update({
            lastMessage: newMessage,
            timpestamp: timestampcurrent
          });

      });

    }
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);

  }

}
