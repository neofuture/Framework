import {Injectable} from '@angular/core';
import {WindowService} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private windowService: WindowService) {
  }

  contactManager(desktopWidth, desktopHeight) {
    this.windowService.new(
      'contacts_over',
      true,
      'contactManager',
      null,
      true,
      true,
      'contact-manager',
      null,
      null,
      null,
      null,
      desktopWidth,
      desktopHeight,
      true
    );
  }

  settings(desktopWidth, desktopHeight) {
    this.windowService.new(
      'cog_over',
      true,
      'settings',
      null,
      true,
      true,
      'demo',
      null,
      400,
      980,
      true,
      desktopWidth,
      desktopHeight,
      false
    );
  }

  quotes(desktopWidth, desktopHeight) {
    this.windowService.new(
      'quotations_over',
      true,
      'quotes',
      null,
      true,
      true,
      'quotes',
      null,
      null,
      null,
      false,
      desktopWidth,
      desktopHeight,
      false
    );
  }

  messages(desktopWidth, desktopHeight) {
    this.windowService.new(
      'messages_over',
      true,
      'messages',
      null,
      true,
      true,
      null,
      {body: 'Testing Messages'},
      null,
      null,
      false,
      desktopWidth,
      desktopHeight,
      false
    );
  }
}
