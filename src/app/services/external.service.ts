import {Injectable, NgZone} from '@angular/core';

declare const dispatchFunction: any;

@Injectable({
  providedIn: 'root'
})

export class ExternalService {

  constructor(private zone: NgZone) {
  }

  callExternal(value: any) {
    this.zone.runOutsideAngular(() => {
      dispatchFunction(...value);
    });
  }

  public callAngular(value) {
    console.log(value);
  }

}
