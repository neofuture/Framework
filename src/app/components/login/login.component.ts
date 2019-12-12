import { Component, OnInit } from '@angular/core';
import {LanguageModel} from '../../models/language-model';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {ProfileService} from '../../services/profile.service';
import {NotificationService} from '../../services/notification.service';
import { VERSION } from '../../../environments/version';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  language$: Subscription;
  locale: LanguageModel;
  username = '';
  password = '';
  version = VERSION;
  language: any;

  constructor(
    private languageService: LanguageService,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
      this.language = this.locale.language;
    });
  }

  login() {
    this.profileService.login(this.username, this.password, (profile) => {
      setTimeout(() => {
        if (profile.error) {
          this.notificationService.new(this.locale[profile.error], 'ow-lock_closed', 'error', 5);
        } else {
          setTimeout(() => {
            this.notificationService.new(this.locale.loginSuccessful, 'ow-lock_open', 'success', 5);
          }, 200);
        }
      }, 50);
    });
  }

  languageChange(lang) {
    this.languageService.getLanguage(lang);
  }
}
