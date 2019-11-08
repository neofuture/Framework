import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';
import {RibbonButtonModel} from '../../models/ribbon-button-model';
import {WindowService} from '../../services/window.service';

@Component({
  selector: 'app-ribbon-button',
  templateUrl: './ribbon-button.component.html',
  styleUrls: ['./ribbon-button.component.css']
})
export class RibbonButtonComponent implements OnInit {

  @Input() ribbonItem: RibbonButtonModel;

  language$: Subscription;
  locale: LanguageModel;
  hover = false;

  constructor(
    private languageService: LanguageService,
    private windowService: WindowService
  ) {
  }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  clickAction(ribbonItem: RibbonButtonModel) {
    if (ribbonItem.label === 'settings') {
      this.windowService.new('cog_over', true, 'settings', null, true, true, 'demo', null, 300, 1100);
    }
    if (ribbonItem.label === 'contactManager') {
      this.windowService.new('contacts_over', true, 'contactManager',  null, true, true, 'contact-manager');
    }

    if (ribbonItem.label === 'quotes') {
      this.windowService.new('quotations_over', true, 'quotes', null, true, true, 'quotes');
    }

    if (ribbonItem.label === 'messages') {
      this.windowService.new('messages_over', true, 'messages', null, true, true, null, {body: 'Testing Messages'});
    }

  }
}
