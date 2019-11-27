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
import {Md5} from 'ts-md5/dist/md5';

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
    private profileService: ProfileService
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.params = params;
    });

    this.resize();
    this.resizeToolBar();

    this.dataSub$ = this.dataService.object.subscribe(object => {
      this.data = object || {};
    });

    this.moduleService.welcome(this.desktopWidth, this.desktopHeight);

    this.profileSub$ = this.profileService.object.subscribe(profile => {
      this.profile = profile;
    });
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

  login(id) {

    let body = {};

    if (id === 1) {
      const md5 = new Md5();
      const passMd5 = md5.appendStr('password').end();
      body = {
        username: 'admin',
        password: passMd5
      };
    }

    if (id === 2) {
      const md5 = new Md5();
      const passMd5 = md5.appendStr('test').end();
      body = {
        username: 'test',
        password: passMd5
      };
    }

    if (id === 3) {
      const md5 = new Md5();
      const passMd5 = md5.appendStr('demo').end();
      body = {
        username: 'demo',
        password: passMd5
      };
    }

    if (id === 4) {
      const md5 = new Md5();
      const passMd5 = md5.appendStr('john').end();
      body = {
        username: 'john',
        password: passMd5
      };
    }

    const loginObs = this.api.call(
      'https://api.owuk.co.uk/user/login',
      'post',
      body
    );

    loginObs.subscribe((profile: ProfileModel) => {
      if (profile) {
        this.profileService.set(profile);
      } else {
        this.profileService.nuke();
      }

      setTimeout(() => {
        const tools = document.getElementById('tools');
        document.getElementById('tabs').style.width = String(window.innerWidth - tools.offsetWidth - 10) + 'px';
      });
    });
  }
}
