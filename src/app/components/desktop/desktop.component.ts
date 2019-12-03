import {Component, HostListener, OnInit} from '@angular/core';
import {WindowModel} from '../../models/window-model';
import {WindowService} from '../../services/window.service';
import {ModuleService} from '../../services/module.service';
import {Subscription} from 'rxjs';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {ProfileService} from '../../services/profile.service';
import {ProfileModel} from '../../models/profile-model';
import {LanguageService} from '../../services/language.service';
import {LanguageModel} from '../../models/language-model';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})

export class DesktopComponent implements OnInit {

  windowList = {};
  objectKeys = Object.keys;

  innerWidth: number;
  innerHeight: number;
  titleBarTopHeight: any;
  toolbarHeight: any;

  desktopHeight: number;
  desktopWidth: number;

  dataSub$: Subscription;
  data: any;
  params: Params;
  profile: ProfileModel;
  profileSub$: Subscription;

  private language$: Subscription;
  private locale: LanguageModel;
  loaded: boolean;

  // * file uploads
  selectedFile: any;
  imgURL: string | ArrayBuffer;

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  constructor(
    private windowService: WindowService,
    private moduleService: ModuleService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private api: ApiService,
    private profileService: ProfileService,
    private languageService: LanguageService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.params = params;
    });

    this.resize();
    this.resizeToolBar();

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.dataSub$ = this.dataService.object.subscribe(object => {
      this.data = object || {};
    });

    this.moduleService.welcome(this.desktopWidth, this.desktopHeight);

    this.profileSub$ = this.profileService.object.subscribe(profile => {
      this.profile = profile;
    });

    setTimeout(() => {
      this.loaded = true;
    }, 300);

    this.api.call(
      '/system/settings',
      'post',
      {},
      ''
    ).subscribe((object: any) => {
      document.documentElement.style.setProperty('--hue', object.hue);
    });
  }

  newNotificationSuccess(title, icon) {
    this.notificationService.new(title, icon, 'success', 5, () => {
      alert('clicked');
    });
  }

  newNotificationWarning(title, icon) {
    this.notificationService.new(title, icon, 'warning', 5);
  }

  newNotificationError(title, icon) {
    this.notificationService.new(title, icon, 'error', 5);
  }

  resize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.titleBarTopHeight = document.getElementById('titleBarTop').offsetHeight;
    this.toolbarHeight = document.getElementById('toolbar').offsetHeight;
    this.desktopHeight = this.innerHeight - this.titleBarTopHeight - this.toolbarHeight;
    this.desktopWidth = this.innerWidth;

    this.windowList = this.windowService.windowList;

    for (const windowItem of Object.keys(this.windowList)) {
      if (this.windowList[windowItem].centered && this.windowList[windowItem].state.isMaximised === false) {
        let classes = '';
        if (this.windowList[windowItem].class.indexOf('open') !== -1) {
          classes += ' open';
        }
        if (this.windowList[windowItem].class.indexOf('active') !== -1) {
          classes += ' active';
        }
        this.windowList[windowItem].class = classes + ' noTransition';

        let top = this.desktopHeight / 2 - this.windowList[windowItem].height / 2;
        if (top < 0) {
          top = 0;
        }
        let left = this.desktopWidth / 2 - this.windowList[windowItem].width / 2;
        if (left < 0) {
          left = 0;
        }
        this.windowList[windowItem].top = top;
        this.windowList[windowItem].left = left;
      }
    }
  }

  onClose(windowItem: WindowModel) {
    this.windowService.onClose(windowItem);
  }

  onClosed(windowItem: WindowModel) {
    this.windowService.onClosed(windowItem);
  }

  makeWindowActive(windowItem: WindowModel) {
    this.windowService.active(windowItem);
  }

  resizeToolBar() {
    setTimeout(() => {
      this.resize();
    }, 60);
  }
}
