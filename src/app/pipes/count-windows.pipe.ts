import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countWindows',
  pure: false
})
export class CountWindowsPipe implements PipeTransform {

  transform(windowList: any, ...args: any[]): any {
    let c = 0;
    for (const windowItem of Object.keys(windowList)) {
      if (windowList[windowItem].desktopId === args[0] && windowList[windowItem].hasTab) {
        c++;
      }
    }
    return c;
  }

}
