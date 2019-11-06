import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';
import {RibbonButtonModel} from '../../models/ribbon-button-model';

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
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

}
