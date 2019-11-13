import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WindowService} from '../../services/window.service';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {LanguageModel} from '../../models/language-model';
import {RibbonButtonModel} from '../../models/ribbon-button-model';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitleBarComponent implements OnInit {

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService,
    private el: ElementRef
  ) {
  }

  objectKeys = Object.keys;

  @Input() desktopWidth: number;
  @Input() desktopHeight: number;
  @Output() changedSize = new EventEmitter<boolean>();

  icon = 'locationPin';
  language$: Subscription;
  locale: LanguageModel;

  ribbonButtons: RibbonButtonModel[];
  size = true;
  barWidth = 'toolChange ow-upArrow';

  ngOnInit() {

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.ribbonButtons = [{
      icon: 'ow-contacts',
      iconOver: 'ow-contacts_over',
      label: 'contactManager',
      module: 'contactManager'
    }, {
      icon: 'ow-quotations',
      iconOver: 'ow-quotations_over',
      label: 'quotes',
      module: 'quotes'
    }, {
      icon: 'ow-cog',
      iconOver: 'ow-cog_over',
      label: 'settings',
      module: 'settings'
    }, {
      icon: 'ow-messages',
      iconOver: 'ow-messages_over',
      label: 'messages',
      module: 'messages'
    }, {
      icon: 'ow-contacts',
      iconOver: 'ow-contacts_over',
      label: 'contactManager',
      module: 'contactManager'
    }, {
      icon: 'ow-quotations',
      iconOver: 'ow-quotations_over',
      label: 'quotes',
      module: 'quotes'
    }, {
      icon: 'ow-cog',
      iconOver: 'ow-cog_over',
      label: 'settings',
      module: 'settings'
    }, {
      icon: 'ow-messages',
      iconOver: 'ow-messages_over',
      label: 'messages',
      module: 'messages'
    }, {
      icon: 'ow-contacts',
      iconOver: 'ow-contacts_over',
      label: 'contactManager',
      module: 'contactManager'
    }, {
      icon: 'ow-quotations',
      iconOver: 'ow-quotations_over',
      label: 'quotes',
      module: 'quotes'
    }, {
      icon: 'ow-cog',
      iconOver: 'ow-cog_over',
      label: 'settings',
      module: 'settings'
    }, {
      icon: 'ow-messages',
      iconOver: 'ow-messages_over',
      label: 'messages',
      module: 'messages'
    }, {
      icon: 'ow-contacts',
      iconOver: 'ow-contacts_over',
      label: 'contactManager',
      module: 'contactManager'
    }, {
      icon: 'ow-quotations',
      iconOver: 'ow-quotations_over',
      label: 'quotes',
      module: 'quotes'
    }, {
      icon: 'ow-cog',
      iconOver: 'ow-cog_over',
      label: 'settings',
      module: 'settings'
    }, {
      icon: 'ow-messages',
      iconOver: 'ow-messages_over',
      label: 'messages',
      module: 'messages'
    }, {
      icon: 'ow-contacts',
      iconOver: 'ow-contacts_over',
      label: 'contactManager',
      module: 'contactManager'
    }, {
      icon: 'ow-quotations',
      iconOver: 'ow-quotations_over',
      label: 'quotes',
      module: 'quotes'
    }, {
      icon: 'ow-cog',
      iconOver: 'ow-cog_over',
      label: 'settings',
      module: 'settings'
    }, {
      icon: 'ow-messages',
      iconOver: 'ow-messages_over',
      label: 'messages',
      module: 'messages'
    }, {
      icon: 'ow-contacts',
      iconOver: 'ow-contacts_over',
      label: 'contactManager',
      module: 'contactManager'
    }, {
      icon: 'ow-quotations',
      iconOver: 'ow-quotations_over',
      label: 'quotes',
      module: 'quotes'
    }, {
      icon: 'ow-cog',
      iconOver: 'ow-cog_over',
      label: 'settings',
      module: 'settings'
    }, {
      icon: 'ow-messages',
      iconOver: 'ow-messages_over',
      label: 'messages',
      module: 'messages'
    }];
  }

  toggleSize() {
    this.size = !this.size;
    this.barWidth = 'toolChange';
    this.barWidth += this.size ? ' ow-upArrow' : ' ow-downArrow';
    this.changedSize.emit(this.size);
  }

  changeStyle(event: MouseEvent) {
    this.barWidth = event.type === 'mouseover' ? 'toolChange toolChangeWide' : 'toolChange';
    this.barWidth += this.size ? ' ow-upArrow' : ' ow-downArrow';
  }

}
