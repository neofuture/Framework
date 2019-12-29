import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'countDesktops',
  pure: false
})
export class CountDesktopsPipe implements PipeTransform {

  transform(desktopList: any, ...args: any[]): any {
    let c = 0;
    for (const desktopItem of Object.keys(desktopList)) {
      if (desktopList[desktopItem].status === 'open') {
        c++;
      }
    }
    return c;
  }

}
