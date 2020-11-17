import {Component, OnInit} from '@angular/core';
import {NotificationService} from './notification.service';
import {Notif} from './Notif';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notification: Notif;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {

  }

  getNotification() {
    return this.notificationService.getNotification();
  }

  closeMessage() {
    this.notificationService.clearNotification();
  }
}
