import {Component, Input, OnInit} from '@angular/core';
import {WindowService} from '../../services/window.service';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {LanguageModel} from '../../models/language-model';
import {SliderComponent} from '../../components/common/slider/slider.component';
import {DesktopService} from '../../services/desktop.service';

@Component({
  selector: 'app-contact-manager',
  templateUrl: './contact-manager.component.html',
  styleUrls: ['./contact-manager.component.css']
})
export class ContactManagerComponent implements OnInit {
  @Input() windowItem: any;
  id: number;
  language$: Subscription;
  locale: LanguageModel;
  option = 3;

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService,
    public desktopService: DesktopService
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
      'orders',
      true,
      'quotes',
      this.id,
      true,
      true,
      false,
      false,
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

  setDesktopId(event, id: number) {
    event.preventDefault();
    event.stopPropagation();
    this.windowService.setDesktopId(this.windowItem, id);
    return false;
  }

  dispatchFunctionCall(func, ...data) {
    this.desktopService.dispatchFunction(func, data);
  }

}
