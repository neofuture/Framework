import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  option = 3;
  language$: Subscription;
  locale: LanguageModel;

  constructor(private languageService: LanguageService) {
  }

  @Input() data: any;

  id = 0;

  ngOnInit() {
    if (typeof this.data === 'undefined') {
      this.data = {};
      this.data.id = 0;
    }

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

}
