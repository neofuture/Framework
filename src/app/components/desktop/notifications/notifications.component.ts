import {Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../services/notifications.service';
import {NotificationModel} from '../../../models/notification-model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notificationList = {};
  objectKeys = Object.keys;

  constructor(
    private notificationService: NotificationsService
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
}
