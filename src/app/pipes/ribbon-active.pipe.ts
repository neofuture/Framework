import { Pipe, PipeTransform } from '@angular/core';
import {WindowModel} from '../models/window-model';

@Pipe({
  name: 'ribbonActive',
  pure: false
})
export class RibbonActivePipe implements PipeTransform {

  transform(windowList: any, ...args: any[]): any {
    for (const windowItem of Object.keys(windowList)) {
      if (windowList[windowItem].title === args[0]) {
        return true;
      }
    }
    return false;
  }

}
