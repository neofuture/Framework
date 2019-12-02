import { Component, OnInit } from '@angular/core';
import {LanguageModel} from '../../models/language-model';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {ProfileService} from '../../services/profile.service';
import {NotificationService} from '../../services/notification.service';

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

  constructor(
    private languageService: LanguageService,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  login() {
    if (document.getElementById('error')) {
      document.getElementById('error').classList.remove('on');
    }
    this.profileService.login(this.username, this.password, (profile) => {
      setTimeout(() => {
        console.log(profile);
        if (profile.error) {
          this.notificationService.new(this.locale[profile.error], 'ow-lock_closed', 'error', 5);
        } else {
          setTimeout(() => {
            this.notificationService.new(this.locale.loginSuccessful, 'ow-lock_open', 'success', 5);
          }, 200);
        }
        const tools = document.getElementById('tools');
        document.getElementById('tabs').style.width = String(window.innerWidth - tools.offsetWidth - 10) + 'px';
      }, 50);
    });
  }
}
