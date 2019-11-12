import {Injectable} from '@angular/core';
import {WindowService} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private windowService: WindowService) {
  }

  contactManager() {
    this.windowService.new('contacts_over', true, 'contactManager', null, true, true, 'contact-manager');
  }

  settings() {
    this.windowService.new('cog_over', true, 'settings', null, true, true, 'demo', null, 400, 980, true);
  }

  quotes() {
    this.windowService.new('quotations_over', true, 'quotes', null, true, true, 'quotes');
  }

  messages() {
    this.windowService.new('messages_over', true, 'messages', null, true, true, null, {body: 'Testing Messages'});
  }
}
