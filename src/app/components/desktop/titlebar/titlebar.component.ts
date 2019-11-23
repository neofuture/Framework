import {AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {WindowService} from '../../../services/window.service';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../../services/language.service';
import {LanguageModel} from '../../../models/language-model';
import {RibbonButtonModel} from '../../../models/ribbon-button-model';
import {ModuleService} from '../../../services/module.service';
import {RibbonService} from '../../../services/ribbon.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitleBarComponent implements OnInit, OnDestroy, AfterViewInit {
  ribbonButtons$: Subscription;
  menuButtons$: Subscription;

  constructor(
    private windowService: WindowService,
    public ribbonService: RibbonService,
    private languageService: LanguageService,
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
  menuButtons: RibbonButtonModel[];

  size = true;
  barWidth = 'toolChange ow-upArrow';
  danger = false;
  activeTab: number;

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  ngOnInit() {

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.ribbonButtons$ = this.ribbonService.ribbonButtons.subscribe(buttons => {
      this.ribbonButtons = buttons;
    });
    this.menuButtons$ = this.ribbonService.menuButtons.subscribe(buttons => {
      this.menuButtons = buttons;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setOpt1();
    });
  }

  setOpt1() {
    this.activeTab = 1;
    this.ribbonService.clearRibbon();

    this.ribbonService.add('contactManager');
    this.ribbonService.add('quotes');
    this.ribbonService.add('settings');
    this.ribbonService.add('messages');
    this.ribbonService.add('contactManager');
    this.ribbonService.add('quotes');
    this.ribbonService.add('settings');
    this.ribbonService.add('messages');
    this.ribbonService.add('contactManager');
    this.ribbonService.add('quotes');
    this.ribbonService.add('settings');
    this.ribbonService.add('messages');
    this.ribbonService.add('contactManager');
    this.ribbonService.add('quotes');
    this.ribbonService.add('settings');
    this.ribbonService.add('messages');
    this.ribbonService.add('contactManager');
    this.ribbonService.add('quotes');
    this.ribbonService.add('settings');
    this.ribbonService.add('messages');

    this.ribbonService.setRibbonButtons(this.size, this.desktopWidth, this.desktopHeight);
  }

  setOpt2() {
    this.activeTab = 2;
    this.ribbonService.clearRibbon();

    this.ribbonService.add('quotes');
    this.ribbonService.add('settings');
    this.ribbonService.add('messages');
    this.ribbonService.add('contactManager');

    this.ribbonService.setRibbonButtons(this.size, this.desktopWidth, this.desktopHeight);
  }

  ngOnDestroy() {
    this.ribbonButtons$.unsubscribe();
    this.menuButtons$.unsubscribe();
  }

  toggleSize() {
    this.size = !this.size;
    this.barWidth = 'toolChange';
    this.barWidth += this.size ? ' ow-upArrow' : ' ow-downArrow';
    this.ribbonService.setRibbonButtons(this.size, this.desktopWidth, this.desktopHeight);
    this.changedSize.emit(this.size);
  }

  changeStyle(event: MouseEvent) {
    this.barWidth = event.type === 'mouseover' ? 'toolChange toolChangeWide' : 'toolChange';
    this.barWidth += this.size ? ' ow-upArrow' : ' ow-downArrow';
  }

  resize() {
    this.ribbonService.setRibbonButtons(this.size, this.desktopWidth, this.desktopHeight);
    if (this.desktopWidth < 600 && this.size === true) {
      this.size = false;
    }
  }

  setClass(event, classNormal: string, classOver: string) {
    if (!event.target.classList.contains('titleBarQuickLink')) {
      return false;
    }
    event.target.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;
  }
}
