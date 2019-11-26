import {Component, HostListener, OnInit} from '@angular/core';
import {WindowModel} from '../../models/window-model';
import {WindowService} from '../../services/window.service';
import {ModuleService} from '../../services/module.service';
import {Subscription} from 'rxjs';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, Params} from '@angular/router';
import {ApiService} from '../../services/api.service';

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

  dataSub: Subscription;
  data: any;
  params: Params;
  profile = {id: 0, image: '/assets/images/profile-empty.jpg'};

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  constructor(
    private windowService: WindowService,
    private moduleService: ModuleService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private api: ApiService
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.params = params;
    });

    this.resize();
    this.resizeToolBar();

    this.dataSub = this.dataService.object.subscribe(object => {
      this.data = object || {};
    });

    this.moduleService.welcome(this.desktopWidth, this.desktopHeight);

    const obs = this.api.call(
      'https://api.owuk.co.uk/',
      'post',
      {
        this: 'that',
        demo: 'yes',
        testing: true,
        stuff: {
          test: '1234'
        }
      }
    );

    obs.subscribe(data => {
      console.log('data', data);
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
      body = {
        username: 'admin',
        password: 'password'
      };
    }
    if (id === 2) {
      body = {
        username: 'test',
        password: 'test'
      };
    }
    const loginObs = this.api.call(
      'https://api.owuk.co.uk/login',
      'post',
      body
    );

    loginObs.subscribe(data => {
      console.log('login data', data);
      // @ts-ignore
      if (data.id) {
        // @ts-ignore
        this.profile = data;
      }
      setTimeout(() => {
        const tools = document.getElementById('tools');
        document.getElementById('tabs').style.width = String(window.innerWidth - tools.offsetWidth - 10) + 'px';
      });
    });
  }

  logout() {
    this.profile = {id: 0, image: '/assets/images/profile-empty.jpg'};
  }
}
