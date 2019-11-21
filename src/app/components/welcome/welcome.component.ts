import {Component, Input, OnInit} from '@angular/core';
import {WindowService} from '../../services/window.service';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {LanguageModel} from '../../models/language-model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  @Input() windowItem: any;
  private language$: Subscription;
  locale: LanguageModel;

  constructor(
    public windowService: WindowService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

}
