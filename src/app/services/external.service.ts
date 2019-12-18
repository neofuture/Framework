import {Injectable, NgZone} from '@angular/core';

declare const dispatchFunction: any;

@Injectable({
  providedIn: 'root'
})

export class ExternalService {

  constructor(private zone: NgZone) {
    // @ts-ignore
    window.angular = {
      zone: this.zone,
      callAngular: (...value) => this.callAngular(value),
      component: this,
    };
  }

  callExternal(value: any) {
    dispatchFunction(...value);
  }

  public callAngular(value) {
    console.log(value);
  }

}
