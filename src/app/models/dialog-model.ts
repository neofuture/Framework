export interface DialogModel {
  id: number;
  icon: string;
  class: string;
  title: string;
  body: string;
  type: {
    yes?: boolean;
    no?: boolean;
    ok?: boolean;
    cancel?: boolean;
  };
  yesCallBack?: CallableFunction;
  noCallBack?: CallableFunction;
  okCallBack?: CallableFunction;
  yesClass?: string;
  noClass?: string;
  okClass?: string;
  cancelClass?: string;
}
