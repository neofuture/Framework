import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../../models/language-model';
import {ProfileService} from '../../../../services/profile.service';
import {ProfileModel} from '../../../../models/profile-model';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  profile: ProfileModel;
  locale: LanguageModel;

  language$: Subscription;
  profileSub$: Subscription;

  constructor(
    private languageService: LanguageService,
    private profileService: ProfileService,
    private api: ApiService
  ) {
  }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.profileSub$ = this.profileService.object.subscribe(profile => {
      this.profile = profile;
    });
  }

  setClass(event, classNormal: string, classOver: string) {
    if (event.target.classList.contains('menuIcon')) {
      event.target.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;
    } else {
      event.target.parentNode.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;
    }
  }

  setActive(active: string) {
    this.profileService.update({active});

    const body = {
      active
    };
    const statusObs = this.api.call(
      'https://api.owuk.co.uk/user/status',
      'post',
      body,
      this.profile.token
    );

    statusObs.subscribe((status) => {
    });

    this.closeMenu();
  }

  logout() {
    setTimeout(() => {
      const statusObs = this.api.call(
        'https://api.owuk.co.uk/user/logout',
        'post',
        {},
        this.profile.token
      );

      statusObs.subscribe((status) => {
        this.profileService.nuke();
      });
    }, 300);
    document.getElementById('profileImage').classList.add('hidden');
    document.getElementById('profileLabel').classList.add('hidden');
    this.closeMenu();
  }

  openProfile() {
    this.closeMenu();
  }

  closeMenu() {
    const menu = document.getElementById('profileImage');
    const menu2 = document.getElementById('userMenu');
    menu.style.pointerEvents = 'none';
    menu2.style.pointerEvents = 'none';
    menu2.classList.add('userMenuClosed');
    menu2.addEventListener('mouseout', () => {
      menu.style.pointerEvents = 'initial';
      menu2.style.pointerEvents = 'initial';
      menu2.classList.remove('userMenuClosed');
    });
  }
}
