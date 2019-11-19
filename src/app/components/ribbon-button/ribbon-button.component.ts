import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';
import {RibbonButtonModel} from '../../models/ribbon-button-model';
import {ModuleService} from '../../services/module.service';
import {RibbonService} from '../../services/ribbon.service';

@Component({
  selector: 'app-ribbon-button',
  templateUrl: './ribbon-button.component.html',
  styleUrls: ['./ribbon-button.component.css']
})
export class RibbonButtonComponent implements OnInit {

  constructor(
    private languageService: LanguageService,
    public ribbonService: RibbonService
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
}
