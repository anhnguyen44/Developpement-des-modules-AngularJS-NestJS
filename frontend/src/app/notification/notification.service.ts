import { Injectable } from '@angular/core';
import {Notif} from './Notif';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification: Notif;

  constructor() { }

  setNotification(typeMessage:string, messages:string[]) {
    this.notification = new Notif(typeMessage, messages);
     // console.log(this.notification);
    if (this.notification.typeMessage === 'success') {
      setTimeout(() => {
        this.notification = new Notif(null, null);
      }, 2000);
    }
  }

  getNotification() {
    return this.notification;
  }

  clearNotification() {
    this.notification = new Notif(null, null);
  }
}
