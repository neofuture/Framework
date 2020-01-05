import {Injectable} from '@angular/core';
import {WindowService} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class DesktopService {
  desktopList;
  desktopId: number;
  private windowList: {};

  constructor(private windowService: WindowService) {
    const urlParams = new URLSearchParams(window.location.search);
    this.desktopId = parseInt(urlParams.get('desktopId'), 10) || 1;
  }

  storageListener(e) {
    if (e.storageArea === localStorage) {
      this.desktopList = JSON.parse(localStorage.getItem('desktopList'));
      if (this.desktopId === 1) {
        const command = localStorage.getItem('desktopCommand') || false;
        if (command) {
          localStorage.removeItem('desktopCommand');
          this.receiveFunctionCall(command);
        }
      }
    }

    return this.desktopList;
  }

  get(desktopId) {
    this.desktopList = JSON.parse(localStorage.getItem('desktopList')) || {};
    this.desktopList[desktopId] = {status: 'open'};
    localStorage.setItem('desktopList', JSON.stringify(this.desktopList));

    return this.desktopList;
  }

  endListener(desktopId) {
    this.desktopList[desktopId] = {status: 'closed'};
    this.windowList = this.windowService.windowList;
    for (const item of Object.keys(this.windowList)) {
      if (this.windowList[item].desktopId === desktopId) {
        this.windowList[item].desktopId = 1;
      }
    }
    if (desktopId !== 1) {
      localStorage.setItem('windowList', JSON.stringify(this.windowList));
      localStorage.setItem('desktopList', JSON.stringify(this.desktopList));
    } else {
      localStorage.removeItem('desktopList');
      localStorage.removeItem('windowList');
      this.closePopUps();
    }
    window['popupWindow' + desktopId].close();
  }

  spawnDesktop(id) {
    // @ts-ignore
    window['popupWindow' + id] = window.open('/?desktopId=' + id,
      'popupWindow' + id,
      'height=' + window.innerHeight + ',' +
      'width=' + (window.innerWidth) + ',' +
      'left=' + (window.innerWidth) + ',' +
      'top=' + (window.screenY) + ',' +
      'resizable=yes,' +
      'scrollbars=yes,' +
      'toolbar=yes,' +
      'menubar=no,' +
      'location=no,' +
      'directories=no,' +
      'status=yes');
  }

  closePopUps() {
    // Todo this may not close windows that might become orphans,
    //  need to test,
    //  in such cases we need to send a command to these windows to close
    //  through and internal API... the internal API has not yet been
    //  defined... this shouldn't happen but could
    //  points to check from work in progress, it would seem when you do a
    //  close() on a popup the unload is not triggered, so we may need to handle
    //  moving windows back into desktopId 1 but this shouldnt happen really as the
    //  call to close all popups in this way is only from desktop 1 being closed
    //  (or later from a logout maybe)

    for (const item of Object.keys(this.desktopList)) {
      if (parseInt(item, 10) > 1) {
        window['popupWindow' + item].close();
      }
    }
  }

  // desktopCount() {
  //   let c = 0;
  //   for (const item of this.desktopList) {
  //     if (item.status.open) {
  //       c++;
  //     }
  //   }
  //   return c;
  // }

  dispatchFunction(functionCall, args) {
    const command = {
      func: functionCall,
      args
    };
    if (this.desktopId === 1) {
      this.receiveFunctionCall(JSON.stringify(command));
    } else {
      localStorage.setItem('desktopCommand', JSON.stringify(command));
    }
  }

  receiveFunctionCall(data) {
    const object = JSON.parse(data);

    if (object.func === 'sayHi') {
      console.log(object.args);
    }
    if (object.func === 'alertDemo') {
      this[object.func](object.args);
    }
  }

  alertDemo(args) {
    alert('demo' + JSON.stringify(args));
  }
}
