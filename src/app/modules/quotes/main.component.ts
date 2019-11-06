import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
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
