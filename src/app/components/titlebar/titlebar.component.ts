import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {WindowService} from '../../services/window.service';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {LanguageModel} from '../../models/language-model';
import {RibbonButtonModel} from '../../models/ribbon-button-model';
import {ModuleService} from '../../services/module.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitleBarComponent implements OnInit {

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService,
    private moduleService: ModuleService
  ) {
  }

  objectKeys = Object.keys;

  @Input() desktopWidth: number;
  @Input() desktopHeight: number;
  @Output() changedSize = new EventEmitter<boolean>();

  icon = 'locationPin';
  language$: Subscription;
  locale: LanguageModel;

  buttons: RibbonButtonModel[];
  ribbonButtons: RibbonButtonModel[];
  menuButtons: RibbonButtonModel[];

  size = true;
  barWidth = 'toolChange ow-upArrow';
  ribbonBar = false;
  danger =  false;

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  ngOnInit() {

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.buttons = [{
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

    setTimeout(() => {this.setRibbonButtons(); });
  }

  toggleSize() {
    this.size = !this.size;
    this.barWidth = 'toolChange';
    this.barWidth += this.size ? ' ow-upArrow' : ' ow-downArrow';
    this.setRibbonButtons();
    this.changedSize.emit(this.size);
  }

  changeStyle(event: MouseEvent) {
    this.barWidth = event.type === 'mouseover' ? 'toolChange toolChangeWide' : 'toolChange';
    this.barWidth += this.size ? ' ow-upArrow' : ' ow-downArrow';
  }

  resize() {
    this.setRibbonButtons();
    if (this.desktopWidth < 600 && this.size === true) {
      this.size = false;
    }
  }

  setRibbonButtons() {
    let icons = 0;
    if (this.size) {
      icons = (this.desktopWidth - 160) / 90;
    } else {
      icons = (this.desktopWidth - 102) / 34 ;
    }
    if (icons > this.buttons.length) {
      icons = this.buttons.length;
    }

    this.ribbonButtons = [];
    this.menuButtons = [];
    let index = 0;
    for (let i = 0; i < icons; i++) {
      this.ribbonButtons.push(this.buttons[i]);
      index = i;
    }
    index++;
    for (let i = index; i < this.buttons.length; i++) {
      this.menuButtons.push(this.buttons[i]);
    }
    this.ribbonBar = true;
  }

  clickAction(ribbonItem: RibbonButtonModel) {
    this.moduleService[ribbonItem.label](this.desktopWidth, this.desktopHeight);
  }

  setClass(event, classNormal: string, classOver: string) {
    if (!event.target.classList.contains('titleBarQuickLink')) {
      return false;
    }
    event.target.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;

  }
}
