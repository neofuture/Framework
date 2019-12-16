import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../../models/language-model';
import {WindowModel} from '../../../../models/window-model';
import {RibbonButtonModel} from '../../../../models/ribbon-button-model';
import {RibbonService} from '../../../../services/ribbon.service';
import {WindowService} from '../../../../services/window.service';

@Component({
  selector: 'app-ribbon-button',
  templateUrl: './ribbon-button.component.html',
  styleUrls: ['./ribbon-button.component.css']
})
export class RibbonButtonComponent implements OnInit {
  windowList: {};

  constructor(
    private languageService: LanguageService,
    public ribbonService: RibbonService,
    private windowService: WindowService
  ) {
  }

  @Input() ribbonItem: RibbonButtonModel;
  @Input() size: boolean;
  @Input() desktopWidth: number;
  @Input() desktopHeight: number;

  language$: Subscription;
  locale: LanguageModel;
  hover = false;
  WindowModel: WindowModel;

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
    this.windowList = this.windowService.windowList;
  }
}
