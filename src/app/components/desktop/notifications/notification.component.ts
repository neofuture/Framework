import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {NotificationModel} from '../../../models/notification-model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notificationList = {};
  objectKeys = Object.keys;

  constructor(
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.notificationList = this.notificationService.notificationList;
  }

  close(notificationItem: NotificationModel) {
    this.notificationService.close(notificationItem);
  }

  closedNotification(notificationItem: NotificationModel) {
    this.notificationService.onClosed(notificationItem);
    if (notificationItem.class === 'closed') {
      console.log('Trans End ', notificationItem.class);
    }
  }

  clickHandler(notificationList: any) {
    if (typeof notificationList.click !== 'undefined') {
      notificationList.click();
    }
  }

  pauseTimer(notificationItem: NotificationModel) {
    notificationItem.pause = true;
  }

  restartTimer(notificationItem: NotificationModel) {
    notificationItem.pause = false;
  }
}
