import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';
import {RibbonButtonModel} from '../../models/ribbon-button-model';
import {ModuleService} from '../../services/module.service';

@Component({
  selector: 'app-ribbon-button',
  templateUrl: './ribbon-button.component.html',
  styleUrls: ['./ribbon-button.component.css']
})
export class RibbonButtonComponent implements OnInit {

  constructor(
    private languageService: LanguageService,
    private moduleService: ModuleService
  ) {
  }

  @Input() ribbonItem: RibbonButtonModel;
  @Input() size: boolean;
  @Input() desktopWidth: number;
  @Input() desktopHeight: number;

  language$: Subscription;
  locale: LanguageModel;
  hover = false;

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  clickAction(ribbonItem: RibbonButtonModel) {
    this.moduleService[ribbonItem.label](this.desktopWidth, this.desktopHeight);
  }

}
