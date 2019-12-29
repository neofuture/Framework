import {Injectable} from '@angular/core';
import {WindowModel} from '../models/window-model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//
// export class DataService {
//   private objectSource = new BehaviorSubject(JSON.parse(localStorage.getItem('state')) || {});
//   object = this.objectSource.asObservable();
//   authToken: any;
//   endpoint: any;
//
//   constructor() {
//   }
//
//   update(message: object) {
//     this.objectSource.next(message);
//     localStorage.setItem('state', JSON.stringify(this.objectSource.value));
//   }
//
//   updateItem(message: object) {
//     this.objectSource.next({...this.objectSource.value, ...message});
//     localStorage.setItem('state', JSON.stringify(this.objectSource.value));
//   }
//
//   getItem(item) {
//     return this.objectSource.value[item];
//   }
// }


export class WindowService {

  private objectSource = new BehaviorSubject({});
  object = this.objectSource.asObservable();

  windowList = {};
  id = 1;
  desktopWidth: any;
  desktopHeight: any;
  desktopId: number;

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.desktopId = parseInt(urlParams.get('desktopId'), 10) || 1;
  }

  update(windowList: object) {
    this.objectSource.next(windowList);
    this.windowList = windowList;
    localStorage.setItem('windowList', JSON.stringify(windowList));
  }

  getDesktopWidthAndHeight() {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const titleBarTopHeight = document.getElementById('titleBarTop').offsetHeight;
    const toolbarHeight = document.getElementById('toolbar').offsetHeight;
    const desktopHeight = innerHeight - titleBarTopHeight - toolbarHeight;
    return [innerWidth, desktopHeight];
  }

  new(
    icon: string,
    iconActive: string,
    hasTitleBar: boolean,
    title: string,
    extendedTitle: any,
    hasTab: boolean,
    resizable: boolean,
    maximised: boolean,
    suppressTransitions,
    bodyComponent: string,
    data = null,
    height = null,
    width = null,
    centered = false,
    x = null,
    y = null,
    alwaysOnTop = false,
    label = '',
    alerted = false,
    autoClose = 0,
    singleInstance = null
  ) {
    [this.desktopWidth, this.desktopHeight] = this.getDesktopWidthAndHeight();
    if (typeof window.event !== 'undefined') {
      window.event.stopPropagation();
    }
    setTimeout(() => {
      for (const key in this.windowList) {
        if (this.windowList[key].singleInstance === singleInstance && singleInstance !== null) {
          this.active(this.windowList[key]);
          return false;
        }
      }

      const id = this.id++;

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

        let top = this.desktopHeight / 2 - height / 2;
        if (top < 0) {
          top = 0;
        }
        let left = this.desktopWidth / 2 - width / 2;
        if (left < 0) {
          left = 0;
        }
        position.top = top;
        position.left = left;

      }

      if (x) {
        position.left = x - (width / 2);
      }
      if (y) {
        position.top = y - (height / 2);
      }

      if (position.top < 0) {
        position.top = 0;
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
        class: 'new active ' + (maximised ? 'maximised' : ''),
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
        maximised,
        suppressTransitions,
        entities: {},
        hasTab,
        hasTitleBar,
        state: {
          active: true,
          isMinimised: false,
          isMaximised: maximised,
          isMaximisedLeft: false,
          isMaximisedRight: false
        },
        centered,
        alwaysOnTop,
        label,
        alerted,
        autoClose,
        singleInstance,
        desktopId: this.desktopId
      };

      if (data !== null) {
        windowItem.data = data;
      }
      this.windowList[id] = windowItem;

      if (suppressTransitions) {
        this.windowList[id].class = 'open noTransition';
      }
      setTimeout(() => {
        this.windowList[id].class = 'open ';
        this.active(windowItem);
      });

      if (this.windowList[id].autoClose > 0) {
        this.windowList[id].intervalTimer = setTimeout(() => {
          this.close(this.windowList[id]);
        }, this.windowList[id].autoClose);
      }

      this.update(this.windowList);
    });
  }

  findXYPosition(height, width, desktopId = this.desktopId) {
    const grid = 30;
    let rows = 0;

    for (let left = 8; (left + width) < window.innerWidth; left += grid) {
      for (let top = 10; (top + height) < window.innerHeight; top += grid) {

        if (!this.isAtPosition(top, left, desktopId)) {
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

  isAtPosition(top, left, desktopId) {
    for (const item of Object.keys(this.windowList)) {
      if (this.windowList[item].top === top && this.windowList[item].left === left && this.windowList[item].desktopId === desktopId) {
        return true;
      }
    }
    return false;
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  setLabel(windowItem: WindowModel, label) {
    windowItem.label = label;

  }

  setAlerted(windowItem: WindowModel, alerted) {
    windowItem.alerted = alerted;

  }

  close(windowItem: WindowModel, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.closeById(windowItem.id);

  }

  closeById(id: number) {
    if (typeof this.windowList[id] !== 'undefined') {
      if (this.windowList[id].suppressTransitions) {
        delete this.windowList[id];
        return;
      }
      this.windowList[id].class = this.windowList[id].class.replace('open', 'closed');
      clearInterval(this.windowList[id].intervalTimer);
      setTimeout(() => {
        this.findLastActive(this.windowList[id]);
        delete this.windowList[id];
        this.update(this.windowList);
      }, 300);

    }
  }

  findLastActive(windowItem: WindowModel) {
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

  closeAll() {
    for (const key of Object.keys(this.windowList)) {
      if (typeof this.windowList[key] !== 'undefined') {
        this.windowList[key].class = this.windowList[key].class.replace('open', 'closed');
        setTimeout(() => {
          delete this.windowList[key];
        }, 300);
      }
    }
    this.update(this.windowList);
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

    this.update(this.windowList);

  }

  inactive(windowItem) {
    windowItem.state.active = false;
    windowItem.class = 'open' +
      (windowItem.state.isMaximised ? ' maximised' : '') +
      (windowItem.state.isMinimised ? ' minimised' : '');

    this.update(this.windowList);

  }

  maximise(windowItem: WindowModel) {
    if (windowItem.resizable) {
      windowItem.state.isMaximised = !windowItem.state.isMaximised;
      windowItem.class = 'open active' +
        (windowItem.state.isMaximised ? ' maximised' : '');
      this.update(this.windowList);
    }
  }

  minimise(event, windowItem) {
    event.stopPropagation();
    if (windowItem.state.isMinimised === false) {
      windowItem.entities.minimisedTop = windowItem.top;
      windowItem.class = 'open minimised';
    } else {
      windowItem.entities = {};
    }
    windowItem.state.isMinimised = !windowItem.state.isMinimised;

    this.update(this.windowList);
  }

  setTitle(windowItem: WindowModel, str: string) {
    windowItem.title = str;
    this.windowList[windowItem.id].title = str;
    this.update(this.windowList);
  }

  setExtendedTitle(windowItem: WindowModel, str: string) {
    windowItem.extendedTitle = str;
    this.windowList[windowItem.id].extendedTitle = str;

    this.update(this.windowList);
  }

  centre(event: Event, windowItem: WindowModel) {
    [this.desktopWidth, this.desktopHeight] = this.getDesktopWidthAndHeight();
    windowItem.centered = true;
    let top = this.desktopHeight / 2 - windowItem.height / 2;
    if (top < 0) {
      top = 0;
    }
    let left = this.desktopWidth / 2 - windowItem.width / 2;
    if (left < 0) {
      left = 0;
    }
    windowItem.top = top;
    windowItem.left = left;

  }

  setDesktopId(windowItem: WindowModel, id) {
    if (id === windowItem.desktopId) {
      return false;
    }
    this.windowList[windowItem.id].desktopId = parseInt(id, 10);
    const position = this.findXYPosition(windowItem.height, windowItem.width, parseInt(id, 10));
    this.windowList[windowItem.id].top = position.top;
    this.windowList[windowItem.id].left = position.left;
    this.update(this.windowList);
  }

  setWindowList(windowList: WindowModel) {
    this.update(windowList);
  }
}
