import {Component, Input, OnInit} from '@angular/core';
import {WindowService} from '../../services/window.service';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @Input() windowItem: any;
  id: number;
  language$: Subscription;
  locale: object;

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    const min = 10000;
    const max = 99999;
    this.id = Math.floor(Math.random() * (max - min + 1)) + min;

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  addWindow() {
    this.windowService.new(
      'orders',
      true,
      'Orders - ' + this.id,
      true,
      true,
      'quotes',
    {id: this.id}
    );
  }

  closeWindow() {
    this.windowService.close(this.windowItem);
  }

  maximiseWindow() {
    this.windowService.maximise(this.windowItem);
  }
}
