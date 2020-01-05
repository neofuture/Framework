import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';
import {SharedDataService} from '../../services/shared-data.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  option = 3;
  language$: Subscription;
  locale: LanguageModel;
  items;

  constructor(
    private languageService: LanguageService,
    private sharedDataService: SharedDataService
  ) {
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

    this.sharedDataService.new('quotes');
    // @ts-ignore
    this.sharedDataService.observable.quotes.subscribe(data => {
      this.items = data;
    });

    window.addEventListener('storage', (e) => {
      if (e.storageArea === localStorage) {
        this.sharedDataService.refresh('quotes');
      }
    });
  }

  addItem() {
    const things = ['Rock', 'Paper', 'Scissor', 'ToothPick', 'Orange', 'Apple', 'Banana'];
    const thing = things[Math.floor(Math.random() * things.length)];
    this.sharedDataService.update('quotes', {date: new Date(), item: thing});
  }
}
