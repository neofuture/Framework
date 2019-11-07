import {Injectable} from '@angular/core';
import {WindowModel} from '../models/window-model';

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  windowList = {};

  constructor() {
  }

  new(
    icon: string,
    hasTitleBar: boolean,
    title: string,
    hasTab: boolean,
    resizable: boolean,
    bodyComponent: string,
    data = null,
    height = null,
    width = null
  ) {
    let id = parseInt(Object.keys(this.windowList)[Object.keys(this.windowList).length - 1], 10) || 0;
    id++;

    if (height === null) {
      height = this.randomIntFromInterval(200, 400);
    }
    if (width === null) {
      width = this.randomIntFromInterval(400, 800);
    }

    const position = this.findXYPosition(height, width);
    let zIndex = 0;

    for (const key in this.windowList) {
      if (this.windowList[key].zIndex > zIndex) {
        zIndex = this.windowList[key].zIndex;
      }
    }

    let windowItem: WindowModel;
    windowItem = {
      id,
      icon,
      title,
      body: 'testing - ' + title,
      bodyComponent,
      class: 'new active',
      zIndex,
      top: position.top,
      left: position.left,
      height,
      width,
      minimumWidth: 200,
      minimumHeight: 120,
      maximizable: true,
      minimizable: true,
      resizable,
      entities: {},
      hasTab,
      hasTitleBar,
      state: {
        active: true,
        isMinimised: false,
        isMaximised: false,
        isMaximisedLeft: false,
        isMaximisedRight: false
      }
    };

    if (data !== null) {
      windowItem.data = data;
    }
    this.windowList[id] = windowItem;
    setTimeout(() => {
      this.windowList[id].class = 'open';
      this.active(windowItem);
    });
  }

  findXYPosition(height, width) {
    const grid = 30;
    let rows = 0;

    for (let left = 8; (left + width) < window.innerWidth; left += grid) {
      for (let top = 10; (top + height) < window.innerHeight; top += grid) {

        if (!this.isAtPosition(top, left)) {
          return {top, left};
        }

        if (left + grid + width > window.innerWidth) {
          left = 0;
          rows++;
          top = 100 + (rows * grid);
        } else {
          left += grid;
        }
      }
    }
    return {left: 100, top: 100};
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  isAtPosition(top, left) {
    for (const item of Object.keys(this.windowList)) {
      if (this.windowList[item].top === top && this.windowList[item].left === left) {
        return true;
      }
    }
    return false;
  }

  close(windowItem: WindowModel) {
    window.event.stopPropagation();
    this.closeById(windowItem.id);
  }

  closeById(id: number) {
    if (typeof this.windowList[id] !== 'undefined') {
      this.windowList[id].class = 'closed';
    }
  }

  closeAll() {
    for (const key of Object.keys(this.windowList)) {
      if (typeof this.windowList[key] !== 'undefined') {
        this.windowList[key].class = 'closed';
      }
    }
  }

  active(windowItem: WindowModel) {
    let zIndex = 0;
    for (const key of Object.keys(this.windowList)) {
      if (this.windowList[key].zIndex > zIndex) {
        zIndex = this.windowList[key].zIndex;
      }
      this.windowList[key].state.active = false;
      this.windowList[key].class = 'open ' +
        (this.windowList[key].state.isMaximised ? ' maximised' : '') +
        (this.windowList[key].state.isMinimised ? ' minimised' : '');
    }
    zIndex++;
    windowItem.zIndex = zIndex;
    windowItem.state.active = true;
    windowItem.state.isMinimised = false;
    windowItem.class = 'open active' +
      (windowItem.state.isMaximised ? ' maximised' : '');
  }

  inactive(windowItem) {
    windowItem.state.active = false;
    windowItem.class = 'open' +
      (windowItem.state.isMaximised ? ' maximised' : '') +
      (windowItem.state.isMinimised ? ' minimised' : '');
  }

  onClose(windowItem: WindowModel) {
    windowItem.class = 'closed';
  }

  onClosed(windowItem: WindowModel) {
    let lastWindow: WindowModel;
    let windowActive = false;
    for (const key in this.windowList) {
      if (this.windowList[key].state.isMinimised === false) {
        if (windowItem === this.windowList[key]) {
          delete this.windowList[key];
        } else {
          lastWindow = this.windowList[key];
          if (lastWindow.state.active) {
            windowActive = true;
          }
        }
      }
    }

    if (typeof lastWindow !== 'undefined') {
      if (lastWindow.class !== 'closed' && !windowActive) {
        this.active(lastWindow);
      }
    }
  }

  maximise(windowItem: WindowModel) {
    if (windowItem.resizable) {
      windowItem.state.isMaximised = !windowItem.state.isMaximised;
      windowItem.class = 'open active' +
        (windowItem.state.isMaximised ? ' maximised' : '');
    }
  }

  minimise(event, windowItem) {
    event.stopPropagation();
    if (windowItem.state.isMinimised === false) {
      windowItem.entities.minimisedTop = windowItem.top;
    } else {
      windowItem.entities = {};
    }
    windowItem.state.isMinimised = !windowItem.state.isMinimised;
    this.inactive(windowItem);
  }
}
