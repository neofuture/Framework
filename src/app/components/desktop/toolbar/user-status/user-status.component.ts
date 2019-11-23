import { Component, OnInit } from '@angular/core';
import {LanguageService} from "../../../../services/language.service";
import {Subscription} from "rxjs";
import {LanguageModel} from "../../../../models/language-model";

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {
  private language$: Subscription;
  locale: LanguageModel;

  constructor(
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  setClass(event, classNormal: string, classOver: string) {
    if (event.target.classList.contains('menuIcon')) {
      event.target.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;
    } else {
      event.target.parentNode.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;

    }
  }
}
