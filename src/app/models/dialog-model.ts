export interface DialogModel {
  id: number;
  icon: string;
  title: string;
  body: string;
  class?: string;
  buttons: [{
    label: string;
    class?: string;
    callback: CallableFunction;
    focused?: boolean;
  }];
}
