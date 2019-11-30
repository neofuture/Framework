export interface NotificationModel {
  class: any;
  icon: string;
  intervalTimer?: any;
  timeRemaining?: number;
  pause: boolean;
  id: number;
  title: string;
  click: object;
}
