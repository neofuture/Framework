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

  text = '#c1c1c1';

  language$: Subscription;
  locale: LanguageModel;

  ribbonButtons: RibbonButtonModel[];

  constructor(
    private windowService: WindowService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.ribbonButtons = [{
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
    }, {
      icon: 'ow-messages',
      iconOver: 'ow-messages_over',
      label: 'messages'
    }];
  }



  getIcon() {
    return this.iconArray[Math.floor(Math.random() * this.iconArray.length)];
  }

}
