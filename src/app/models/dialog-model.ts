export interface DialogModel {
  id: number;
  icon: string;
  class: string;
  title?: string;
  body?: string;
  yesCallBack?: CallableFunction;
  noCallBack?: CallableFunction;
  okCallBack?: CallableFunction;
  yesClass?: string;
  noClass?: string;
  okClass?: string;
  cancelClass?: string;
}
