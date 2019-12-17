import {Injectable} from '@angular/core';
import {WindowService} from './window.service';
import {LanguageService} from './language.service';
import {LanguageModel} from '../models/language-model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private locale: LanguageModel;

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService) {
  }

  fullSize(desktopWidth, desktopHeight) {
    this.windowService.new(
      'maximise',
      'maximise',
      false,
      'fullSize',
      '',
      true,
      true,
      true,
      false,
      'fullSize',
      null,
      610,
      600,
      true,
      desktopWidth,
      desktopHeight,
      true,
      '',
      false,
      null,
      'fullSize'
    );
  }

  fullSizeNoTab(desktopWidth, desktopHeight) {
    this.windowService.new(
      'maximise',
      'maximise',
      false,
      'fullSizeNoTab',
      '',
      false,
      true,
      true,
      false,
      'fullSizeNoTab',
      null,
      610,
      600,
      true,
      desktopWidth,
      desktopHeight,
      true,
      '',
      false,
      null,
      'fullSizeNoTab'
    );
  }

  about(desktopWidth, desktopHeight) {
    this.languageService.object.subscribe(locale => this.locale = locale);

    this.windowService.new(
      'oceanworks',
      'oceanworks',
      false,
      'about',
      this.locale.product,
      true,
      false,
      false,
      false,
      'about',
      null,
      610,
      600,
      true,
      desktopWidth,
      desktopHeight,
      true,
      '',
      false,
      null,
      'about'
    );
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
      '',
      false,
      5000,
      'welcome'
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
      false,
      false,
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
      false,
      false,
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
      false,
      false,
      false,
      'demo',
      null,
      726,
      740,
      true,
      desktopWidth,
      desktopHeight,
      false,
      '',
      false,
      null,
      'settings'
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
      false,
      false,
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
      false,
      false,
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
