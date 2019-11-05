import {Component, OnInit} from '@angular/core';
import {WindowModel} from '../../models/window-model';
import {WindowService} from '../../services/window.service';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  windowList: {};

  objectKeys = Object.keys;
  language$: Subscription;
  locale: object;

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.windowList = this.windowService.windowList;

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  makeWindowActive(windowItem: WindowModel) {
    this.windowService.active(windowItem);
  }

  maximiseWindow(event: MouseEvent, windowItem: WindowModel) {
    this.windowService.maximise(windowItem);
  }

  tabCount() {
    let tabs = 0;
    for (const item in this.windowList) {
      if (this.windowList[item].hasTab) {
        tabs++;
      }
    }
    return tabs;
  }
}
