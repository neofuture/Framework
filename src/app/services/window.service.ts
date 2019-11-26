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
    iconActive: string,
    hasTitleBar: boolean,
    title: string,
    extendedTitle: any,
    hasTab: boolean,
    resizable: boolean,
    bodyComponent: string,
    data = null,
    height = null,
    width = null,
    centered = false,
    desktopWidth = null,
    desktopHeight = null,
    alwaysOnTop = false,
    label = '',
    alerted = false,
    autoClose = 0
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

    if (data === null) {
      data = {};
      data.body = null;
    }

    if (centered) {

      let top = desktopHeight / 2 - height / 2;
      if (top < 0) {
        top = 0;
      }
      let left = desktopWidth / 2 - width / 2;
      if (left < 0) {
        left = 0;
      }
      position.top = top;
      position.left = left;

    }

    let windowItem: WindowModel;
    windowItem = {
      id,
      icon,
      iconActive,
      title,
      extendedTitle,
      body: data.body,
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
      },
      centered,
      alwaysOnTop,
      label,
      alerted,
      autoClose
    };

    if (data !== null) {
      windowItem.data = data;
    }
    this.windowList[id] = windowItem;

    setTimeout(() => {
      this.windowList[id].class = 'open';
      this.active(windowItem);
    });

    if (this.windowList[id].autoClose > 0) {
      this.windowList[id].intervalTimer = setTimeout(() => {
        this.close(this.windowList[id]);
      }, this.windowList[id].autoClose);
    }
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

  setLabel(windowItem: WindowModel, label) {
    windowItem.label = label;
  }

  setAlerted(windowItem: WindowModel, alerted) {
    windowItem.alerted = alerted;
  }

  close(windowItem: WindowModel) {
    if (window.event) {
      window.event.stopPropagation();
    }
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
    if (windowItem.intervalTimer) {
      clearInterval(windowItem.intervalTimer);
    }

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

  setTitle(windowItem: WindowModel, str: string) {
    windowItem.title = str;
  }

  setExtendedTitle(windowItem: WindowModel, str: string) {
    windowItem.extendedTitle = str;
  }

  centre(event: Event, windowItem: WindowModel, desktopWidth: number, desktopHeight: number) {
    windowItem.centered = true;
    let top = desktopHeight / 2 - windowItem.height / 2;
    if (top < 0) {
      top = 0;
    }
    let left = desktopWidth / 2 - windowItem.width / 2;
    if (left < 0) {
      left = 0;
    }
    windowItem.top = top;
    windowItem.left = left;

  }
}
