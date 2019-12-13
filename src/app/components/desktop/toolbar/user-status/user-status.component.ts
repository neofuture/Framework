import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LanguageService} from '../../../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../../models/language-model';
import {ProfileService} from '../../../../services/profile.service';
import {ProfileModel} from '../../../../models/profile-model';
import {NotificationService} from '../../../../services/notification.service';
import {ModuleService} from '../../../../services/module.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent implements OnInit {
  @Input() desktopWidth: number;
  @Input() desktopHeight: number;

  profile: ProfileModel;
  locale: LanguageModel;
  language$: Subscription;
  profileSub$: Subscription;
  imageChange = false;
  editStatus: boolean;
  status: any;
  uploading = false;
  profileImageShow = true;

  @ViewChild('userMenu') userMenu: ElementRef;
  @ViewChild('profileImage') profileImage: ElementRef;

  constructor(
    private languageService: LanguageService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private moduleService: ModuleService
  ) {
  }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.profileSub$ = this.profileService.object.subscribe(profile => {
      this.profile = profile;
      if (this.profile) {
        this.status = this.profile.status;
        this.uploading = this.profile.uploading || false;
        this.profileService.startHeartbeat();
        this.profileImageShow = true;
      } else {
        this.profileService.stopHeartbeat();
      }
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
    this.profileService.setActive(active);
    this.closeMenu();
  }

  logout() {
    setTimeout(() => {
      this.profileService.logout();
    }, 300);
    this.profileImageShow = false;
    this.closeMenu();
  }

  openProfile() {
    this.moduleService.userProfile(this.desktopWidth, this.desktopHeight);
    this.closeMenu();
  }

  closeMenu() {
    const menu = this.profileImage.nativeElement;
    const menu2 = this.userMenu.nativeElement;
    menu.style.pointerEvents = 'none';
    menu2.style.pointerEvents = 'none';
    menu2.classList.add('userMenuClosed');
    menu2.addEventListener('mouseout', () => {
      menu.style.pointerEvents = 'initial';
      menu2.style.pointerEvents = 'initial';
      menu2.classList.remove('userMenuClosed');
    });
  }


  changeProfileImage(event: Event) {
    this.profileService.update({uploading: true});
    this.profileService.changeProfileImage(event);
  }

  checkStatusKeys(event) {
    if (event.code === 'Escape') {
      this.editStatus = false;
      event.target.value = this.profile.status;
    }
    if (event.code === 'Enter') {
      this.profile.status = event.target.value.toString().trim();
      this.profileService.updateStatusText(event.target.value.toString().trim());
      event.target.blur();
    }
  }
}
