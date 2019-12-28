import {Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit, Input} from '@angular/core';
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
import {DialogService} from '../../services/dialog.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})

export class DesktopComponent implements OnInit, AfterViewInit {
  @Input() desktopId: number;

  windowList = {};
  dialogList = {};
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
  locale: LanguageModel;
  loaded: boolean;

  @ViewChild('toolbar') toolbar: ElementRef;
  private message: any;
  desktopList = {};

  @HostListener('window:resize') onResize() {
    this.resize();
  }

  constructor(
    private windowService: WindowService,
    private dialogService: DialogService,
    private moduleService: ModuleService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private api: ApiService,
    private profileService: ProfileService,
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.params = params;
    });

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

    this.dataSub$ = this.dataService.object.subscribe(object => {
      this.data = object || {};
    });

    if (this.desktopId === 1) {
      this.moduleService.welcome();
    }

    this.profileSub$ = this.profileService.object.subscribe(profile => {
      this.profile = profile;
      setTimeout(() => {
        this.resize();
      });
    });

    this.windowList = this.windowService.windowList;

    this.windowService.object.subscribe(windowList => {
      this.windowList = windowList;
    });

    this.dialogList = this.dialogService.dialogList;

    window.addEventListener('storage', (e) => {
      if (e.storageArea === localStorage) {
        this.desktopList = JSON.parse(localStorage.getItem('desktopList'));
      }
    });
    this.desktopList = JSON.parse(localStorage.getItem('desktopList')) || {};
    this.desktopList[this.desktopId] = {status: 'open'};
    localStorage.setItem('desktopList', JSON.stringify(this.desktopList));

    window.addEventListener('unload', (event) => {
      this.desktopList[this.desktopId] = {status: 'closed'};
      for (const item of Object.keys(this.windowList)) {
        if (this.windowList[item].desktopId === this.desktopId) {
          this.windowList[item].desktopId = 1;
        }
      }
      localStorage.setItem('windowList', JSON.stringify(this.windowList));
      localStorage.setItem('desktopList', JSON.stringify(this.desktopList));
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loaded = true;
      this.particles();
      this.resize();
    });
  }

  particles() {
    /* ---- particles.js config ---- */

    // @ts-ignore
    pJS('particles-js', {
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#7f7f7f'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 3,
            color: '#7f7f7f'
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: 'img/github.svg',
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#7f7f7f',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });
  }

  resize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.titleBarTopHeight = document.getElementById('titleBarTop').offsetHeight;
    this.toolbarHeight = document.getElementById('toolbar').offsetHeight;
    this.desktopHeight = this.innerHeight - this.titleBarTopHeight - this.toolbarHeight;
    this.desktopWidth = this.innerWidth;

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

  makeWindowActive(windowItem: WindowModel) {
    this.windowService.active(windowItem);
  }

  resizeToolBar() {
    setTimeout(() => {
      this.resize();
    }, 60);
  }

  console(str: string) {
    console.log(str);
  }

  spawnWindow() {
    // @ts-ignore
    window.popupWindow = window.open('/?desktopId=2',
      'popUpWindow2',
      'height=600,' +
      'width=1000,' +
      'left=50,' +
      'top=50,' +
      'resizable=yes,' +
      'scrollbars=yes,' +
      'toolbar=yes,' +
      'menubar=no,' +
      'location=no,' +
      'directories=no,' +
      'status=yes');
    return false;
  }

  sendMessage() {
    localStorage.setItem('message', JSON.stringify({message: this.message, time: new Date()}));
  }

  createScreenShot(id) {
    const elm = document.querySelector('#window--' + id);
    html2canvas(<HTMLElement>elm, {removeContainer: false}).then((canvas) => {
      const dataUrl = canvas.toDataURL();
      console.log(dataUrl);
    });
  }
}

