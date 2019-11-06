import {Component, OnInit} from '@angular/core';
import {WindowService} from '../../services/window.service';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {LanguageModel} from '../../models/language-model';
import {RibbonButtonModel} from '../../models/ribbon-button-model';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitleBarComponent implements OnInit {
  objectKeys = Object.keys;
  hasTitleBar = true;
  title = 'Test Window';
  hasTab = true;
  resizable = true;
  icon = 'locationPin';
  iconArray = [
    'alarm', 'bin', 'catalogue_over', 'catalogue', 'catalogues_over',
    'catalogues', 'clipboard', 'clock', 'cloud', 'cog_over', 'cog',
    'company_over', 'company', 'computer', 'contacts_over', 'contacts',
    'content_area', 'creditcard', 'dashboard_over', 'dashboard', 'diary_over',
    'diary', 'downArrow', 'download', 'duplicate_page', 'email',
    'exclamation_mark_circle', 'external_link', 'eye', 'fat_close', 'fat_tick',
    'folder', 'forms', 'formsResponses', 'framework', 'funnel_over', 'funnel',
    'ghost_over', 'ghost', 'globe', 'home_over', 'home', 'leftArrow',
    'leftArrowStart', 'link', 'locationPin', 'lock_closed', 'lock_open',
    'media', 'menu_over', 'menu', 'messages_over', 'messages', 'minus',
    'move', 'orders_over', 'orders', 'page_add', 'page_settings', 'page_tags',
    'pages', 'pencil', 'phone_over', 'phone', 'piechart_over', 'piechart',
    'playbutton', 'plus', 'print_over', 'print', 'question_mark_circle',
    'question_mark', 'quotations_over', 'quotations', 'reminder_over',
    'reminder', 'reorder', 'rightArrow', 'rightArrowEnd', 'save', 'search_over',
    'search', 'styles', 'tasks_over', 'tasks', 'templates', 'tree_corner',
    'tree_line_horizontal', 'tree_line', 'tree_t', 'upArrow', 'users_over',
    'users', 'world', 'oceanworks', 'minimise', 'restore', 'maximise', 'close'];
  bodyComponent = 'contact-manager';

  primary = '#337799';
  primaryLight = '#438eb5';
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

  ribbonButtons: ({ icon: string; label: string; iconOver: string } | { icon: string; label: string; iconOver: string })[] = [{
    icon: 'ow-contacts',
    iconOver: 'ow-contacts_over',
    label: 'contactManager'
  }, {
    icon: 'ow-quotations',
    iconOver: 'ow-quotations_over',
    label: 'quotes'
  }, {
    icon: 'ow-cog',
    iconOver: 'ow-cog_over',
    label: 'settings'
  }];

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.windowService.new(this.getIcon(), true, 'contactManager', false, true, 'contact-manager');
    this.windowService.new(this.getIcon(), true, 'contactManager', true, false, 'contact-manager');
    this.windowService.new(this.getIcon(), false, 'contactManager', true, true, 'contact-manager');
    this.windowService.new(this.getIcon(), true, 'contactManager', true, true, 'contact-manager');
    this.windowService.new(this.getIcon(), true, 'contactManager', true, true, 'contact-manager');

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  getLanguage(lang) {
    this.languageService.getLanguage(lang);
  }

  getIcon() {
    return this.iconArray[Math.floor(Math.random() * this.iconArray.length)];
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
    document.documentElement.style.removeProperty('--text');
    document.documentElement.style.removeProperty('--background-color');
    document.documentElement.style.removeProperty('--background-grey');
    document.documentElement.style.removeProperty('--background-mid-grey');
    document.documentElement.style.removeProperty('--background-darker-grey');
    document.documentElement.style.removeProperty('--background-darkest-grey');
    document.documentElement.style.removeProperty('--box-shadow');
  }
}
