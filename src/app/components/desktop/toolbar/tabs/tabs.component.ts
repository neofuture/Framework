import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
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

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService
  ) {
  }

  windowList: {};

  objectKeys = Object.keys;
  language$: Subscription;
  locale: LanguageModel;
  @Input() desktopId: number;
  @Output() tabWidth = new EventEmitter();

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  ngOnInit() {
    this.windowService.object.subscribe(windowList => {
      this.windowList = windowList;
    });

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
    if (!windowItem.maximised) {
      this.windowService.maximise(windowItem);
    }
  }

  tabCount() {
    let tabs = 0;
    for (const item in this.windowList) {
      if (this.windowList[item].hasTab && this.windowList[item].desktopId === this.desktopId) {
        tabs++;
      }
    }
    return tabs;
  }

  resize() {
    if(this.desktopId===1){
      this.tabWidth.emit(window.innerWidth - 46);

    } else {
      this.tabWidth.emit(window.innerWidth - 4);

    }
  }
}
