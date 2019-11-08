import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';
import {WindowService} from '../../services/window.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @Input() windowItem: any;
  hasTitleBar = true;
  title = 'Test Window';
  title2 = 'New Title 2';
  hasTab = true;
  resizable = true;
  icon = 'locationPin';
  bodyComponent = 'contact-manager';

  primary = '#337799';
  primaryLight = '#b8d6e7';
  primaryMid = '#438eb5';
  primaryDark = '#2e5671';
  text = '#c1c1c1';
  backgroundColor = '#1d1d1d';
  backgroundGrey = '#282828';
  backgroundMidGrey = '#6c6c6c';
  backgroundDarkerGrey = '#353535';
  backgroundDarkestGrey = '#484848';
  boxShadow = 'none';
  theme = 'CS Theme';
  language$: Subscription;
  locale: LanguageModel;

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  getLanguage(lang) {
    this.languageService.getLanguage(lang);
  }

  toggleCompusoft() {
    if (document.body.classList.contains('compusoft')) {
      this.theme = 'CS Theme';
      document.body.classList.remove('compusoft');
    } else {
      this.theme = 'Standard';
      document.body.classList.add('compusoft');
    }
  }

  addWindow() {
    this.windowService.new(
      this.icon,
      JSON.parse(String(this.hasTitleBar)),
      this.title,
      null,
      JSON.parse(String(this.hasTab)),
      JSON.parse(String(this.resizable)),
      this.bodyComponent
    );
  }

  closeAllWindows() {
    this.windowService.closeAll();
  }

  setTheme() {
    document.documentElement.style.setProperty('--primary', this.primary);
    document.documentElement.style.setProperty('--primary-light', this.primaryLight);
    document.documentElement.style.setProperty('--primary-mid', this.primaryMid);
    document.documentElement.style.setProperty('--primary-dark', this.primaryDark);
    document.documentElement.style.setProperty('--text', this.text);
    document.documentElement.style.setProperty('--background-color', this.backgroundColor);
    document.documentElement.style.setProperty('--background-grey', this.backgroundGrey);
    document.documentElement.style.setProperty('--background-mid-grey', this.backgroundMidGrey);
    document.documentElement.style.setProperty('--background-darker-grey', this.backgroundDarkerGrey);
    document.documentElement.style.setProperty('--background-darkest-grey', this.backgroundDarkestGrey);
    document.documentElement.style.setProperty('--box-shadow', this.boxShadow);
  }

  revertTheme() {
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--primary-light');
    document.documentElement.style.removeProperty('--primary-mid');
    document.documentElement.style.removeProperty('--primary-dark');
    document.documentElement.style.removeProperty('--text');
    document.documentElement.style.removeProperty('--background-color');
    document.documentElement.style.removeProperty('--background-grey');
    document.documentElement.style.removeProperty('--background-mid-grey');
    document.documentElement.style.removeProperty('--background-darker-grey');
    document.documentElement.style.removeProperty('--background-darkest-grey');
    document.documentElement.style.removeProperty('--box-shadow');
  }

  setTitle() {
    this.windowService.setTitle(this.windowItem, this.title);
  }

  setTitle2() {
    this.windowService.setTitle2(this.windowItem, this.title2);
  }
}
