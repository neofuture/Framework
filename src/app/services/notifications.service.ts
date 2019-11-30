import {Injectable} from '@angular/core';
import {NotificationModel} from '../models/notification-model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationList = {};

  constructor() {
  }

  new(
    title: string,
    icon: string,
    type: string,
    click?: object
  ) {
    let id = parseInt(Object.keys(this.notificationList)[Object.keys(this.notificationList).length - 1], 10) || 0;
    id++;

    let notificationItem: NotificationModel;
    notificationItem = {
      id,
      title,
      class: 'notification',
      icon,
      click
    };

    this.notificationList[id] = notificationItem;

    setTimeout(() => {
      this.notificationList[id].class = 'open ' + type;
    });

    this.notificationList[id].intervalTimer = setTimeout(() => {
      this.close(this.notificationList[id]);
    }, 5000);
  }

  close(notificationItem: NotificationModel) {
    if (window.event) {
      window.event.stopPropagation();
    }
    notificationItem.class = notificationItem.class.replace('open', 'closed');
    this.closeById(notificationItem.id);
  }

  closeById(id: number) {
    if (typeof this.notificationList[id] !== 'undefined') {
      this.notificationList[id].class = this.notificationList[id].class.replace('open', 'closed');
    }
  }


  onClosed(notificationItem: NotificationModel) {
    if (notificationItem.class === 'closed') {
      if (notificationItem.intervalTimer) {
        clearInterval(notificationItem.intervalTimer);
      }
      for (const key in this.notificationList) {
        if (notificationItem === this.notificationList[key]) {
          delete this.notificationList[key];
        }
      }
    }
  }
}
