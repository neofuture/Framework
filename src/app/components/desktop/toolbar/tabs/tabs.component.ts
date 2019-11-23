import {Component, HostListener, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../../models/language-model';
import {WindowService} from '../../../../services/window.service';
import {LanguageService} from '../../../../services/language.service';
import {WindowModel} from '../../../../models/window-model';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  windowList: {};

  objectKeys = Object.keys;
  language$: Subscription;
  locale: LanguageModel;

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.windowList = this.windowService.windowList;

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    setTimeout(() => {
      this.resize();
    }, 100);
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

  resize() {
    const tools = document.getElementById('tools');
    document.getElementById('tabs').style.width = String(window.innerWidth - tools.offsetWidth - 10) + 'px';
  }
}
