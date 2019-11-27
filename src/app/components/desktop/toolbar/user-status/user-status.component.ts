import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../../models/language-model';
import {ProfileService} from "../../../../services/profile.service";

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {

  @Input() profile;

  language$: Subscription;
  locale: LanguageModel;
  profileSub$: Subscription;

  constructor(
    private languageService: LanguageService,
    private profileService: ProfileService
  ) {
  }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
    this.profileSub$ = this.profileService.object.subscribe(object => {
    });
  }

  setClass(event, classNormal: string, classOver: string) {
    if (event.target.classList.contains('menuIcon')) {
      event.target.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;
    } else {
      event.target.parentNode.className = event.type === 'mouseover' ? '' + classOver : '' + classNormal;

    }
  }

  setActive(event, active: string) {
    this.profileService.update({active});
    
    event.target.parentNode.style.pointerEvents = 'none';
    setTimeout(() => {
      event.target.parentNode.style.pointerEvents = 'initial';
    }, 300);
  }
}
