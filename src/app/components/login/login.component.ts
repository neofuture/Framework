import { Component, OnInit } from '@angular/core';
import {LanguageModel} from '../../models/language-model';
import {Subscription} from 'rxjs';
import {LanguageService} from '../../services/language.service';
import {ProfileService} from '../../services/profile.service';

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
  error: string;

  constructor(
    private languageService: LanguageService,
    private profileService: ProfileService
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
          this.error = profile.error;
          setTimeout(() => {
            document.getElementById('error').classList.add('on');
          });
        }
        const tools = document.getElementById('tools');
        document.getElementById('tabs').style.width = String(window.innerWidth - tools.offsetWidth - 10) + 'px';
      });
    });
  }
}
