import {Component, HostListener, OnInit} from '@angular/core';
import {WindowModel} from '../../models/window-model';
import {WindowService} from '../../services/window.service';
import {ModuleService} from '../../services/module.service';

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

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  constructor(
    private windowService: WindowService,
    private moduleService: ModuleService
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.resize();
      this.moduleService.settings(this.desktopWidth, this.desktopHeight);
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
    }, 200);
  }
}
