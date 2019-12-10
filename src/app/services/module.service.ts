import {Injectable} from '@angular/core';
import {WindowService} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private windowService: WindowService) {
  }

  welcome(desktopWidth, desktopHeight) {
    this.windowService.new(
      'oceanworks',
      'oceanworks',
      false,
      'welcome',
      null,
      false,
      false,
      'welcome',
      null,
      400,
      600,
      true,
      desktopWidth,
      desktopHeight,
      true,
      '0',
      false,
      5000
    );
  }

  contactManager(desktopWidth, desktopHeight) {
    this.windowService.new(
      'contacts',
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
      false,
      ''
    );
  }

  userProfile(desktopWidth, desktopHeight) {
    this.windowService.new(
      'user',
      'user_over',
      true,
      'profile',
      null,
      true,
      true,
      null,
      {body: 'Testing Profile'},
      null,
      null,
      null,
      desktopWidth,
      desktopHeight,
      false,
      ''
    );
  }

  settings(desktopWidth, desktopHeight) {
    this.windowService.new(
      'cog',
      'cog_over',
      true,
      'settings',
      null,
      true,
      true,
      'demo',
      null,
      726,
      740,
      true,
      desktopWidth,
      desktopHeight,
      false
    );
  }

  quotes(desktopWidth, desktopHeight) {
    this.windowService.new(
      'quotations',
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
      false,
      ''
    );
  }

  messages(desktopWidth, desktopHeight) {
    this.windowService.new(
      'messages',
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
      false,
      '10',
      true
    );
  }
}
