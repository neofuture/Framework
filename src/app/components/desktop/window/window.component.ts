import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  HostListener,
  Input, NgZone,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {WindowModel} from '../../../models/window-model';
import {WindowService} from '../../../services/window.service';
import {LanguageService} from '../../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../models/language-model';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit {
  language$: Subscription;
  locale: LanguageModel;

  constructor(
    private windowService: WindowService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private languageService: LanguageService,
    private zone: NgZone
  ) {
  }

  resizeDirection: any;
  innerWidth: number;
  innerHeight: number;

  resizeWindowItem: any = null;
  dragWindowItem: any = null;
  windowList: object;
  loaded = false;

  @Input() titleBarTopHeight: number;
  @Input() toolbarHeight: number;

  @Input() windowItem: WindowModel;
  @Input() desktopWidth: number;
  @Input() desktopHeight: number;

  @Output() closing = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<boolean>();

  @ViewChild('viewContainer', {read: ViewContainerRef}) viewContainer: ViewContainerRef;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event) {
    this.zone.runOutsideAngular(() => {
      if (this.resizeWindowItem !== null) {
        this.resizeGo(event);
      }
      if (this.dragWindowItem !== null) {
        this.moveGo(event);
      }
    });
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.zone.run(() => {
      if (this.resizeWindowItem !== null) {
        this.resizeStop();
      }
      if (this.dragWindowItem !== null) {
        this.moveStop();
      }
    });
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event) {
    this.zone.runOutsideAngular(() => {
      if (this.resizeWindowItem !== null) {
        this.resizeGo(event);
      }
      if (this.dragWindowItem !== null) {
        this.moveGo(event);
      }
    });
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    this.zone.run(() => {
      if (this.resizeWindowItem !== null) {
        this.resizeStop();
      }
      if (this.dragWindowItem !== null) {
        this.moveStop();
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  ngOnInit() {

    this.resize();
    this.windowList = this.windowService.windowList;
    this.loadComponent();

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });

  }

  async loadComponent() {

    if (this.windowItem.bodyComponent === 'demo') {
      const {DemoComponent} = await import('../../demo/demo.component');
      const componentRef = this.viewContainer.createComponent(
        this.componentFactoryResolver.resolveComponentFactory(DemoComponent)
      );
      componentRef.instance.windowItem = this.windowItem;
    }

    if (this.windowItem.bodyComponent === 'contact-manager') {
      const {ContactManagerComponent} = await import('../../../modules/contact-manager/contact-manager.component');
      const componentRef = this.viewContainer.createComponent(
        this.componentFactoryResolver.resolveComponentFactory(ContactManagerComponent)
      );
      componentRef.instance.windowItem = this.windowItem;
    }

    if (this.windowItem.bodyComponent === 'quotes') {
      const {QuotesComponent} = await import('../../../modules/quotes/quotes.component');
      const componentRef = this.viewContainer.createComponent(
        this.componentFactoryResolver.resolveComponentFactory(QuotesComponent)
      );
      componentRef.instance.data = this.windowItem.data;
    }

    if (this.windowItem.bodyComponent === 'welcome') {
      const {WelcomeComponent} = await import('../../welcome/welcome.component');
      const componentRef = this.viewContainer.createComponent(
        this.componentFactoryResolver.resolveComponentFactory(WelcomeComponent)
      );
      componentRef.instance.windowItem = this.windowItem;
    }

    if (this.windowItem.bodyComponent === 'about') {
      const {AboutComponent} = await import('../../about/about.component');
      const componentRef = this.viewContainer.createComponent(
        this.componentFactoryResolver.resolveComponentFactory(AboutComponent)
      );
      componentRef.instance.windowItem = this.windowItem;
    }

    this.loaded = true;
  }

  resize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  closeWindow(event, windowItem) {
    event.stopPropagation();
    windowItem.closing = true;
    this.closing.emit(windowItem);
  }

  closedWindow(windowItem) {
    if (windowItem.class === 'closed') {
      this.closed.emit(windowItem);
    }
  }

  resizeCursorSet(event, windowItem) {
    if (!event.target.classList.contains('windowItem') || windowItem.resizable === false) {
      return false;
    }

    if (
      this.resizeWindowItem === null
    ) {
      const xOff = event.offsetX;
      const yOff = event.offsetY;
      const resizeCornerSize = 15;
      this.resizeDirection = '';

      if (yOff <= resizeCornerSize) {
        this.resizeDirection += 'n';
      } else {
        if (yOff >= event.target.offsetHeight - resizeCornerSize) {
          this.resizeDirection += 's';
        }
      }

      if (xOff <= resizeCornerSize) {
        this.resizeDirection += 'w';
      } else {
        if (xOff >= event.target.offsetWidth - resizeCornerSize) {
          this.resizeDirection += 'e';
        }
      }

      document.body.style.cursor = this.resizeDirection + '-resize';
    } else {
      this.resizeCursorRestore();
    }
  }

  resizeCursorRestore() {
    document.body.style.cursor = '';
  }

  resizeTouchStart(event, windowItem: WindowModel) {
    const xOff = event.layerX;
    const yOff = event.layerY;

    const resizeCornerSize = 15;
    this.resizeDirection = '';

    if (yOff <= resizeCornerSize) {
      this.resizeDirection += 'n';
    } else {
      if (yOff >= event.target.offsetHeight - resizeCornerSize) {
        this.resizeDirection += 's';
      }
    }

    if (xOff <= resizeCornerSize) {
      this.resizeDirection += 'w';
    } else {
      if (xOff >= event.target.offsetWidth - resizeCornerSize) {
        this.resizeDirection += 'e';
      }
    }
    this.resizeStart(event, windowItem);
  }

  resizeStart(event, windowItem: WindowModel) {
    if (event.target.classList.contains('windowItem')) {
      this.resizeWindowItem = windowItem;
      this.makeWindowActive(this.resizeWindowItem);

      this.resizeWindowItem.entities.xPosition = event.x || event.pageX;
      this.resizeWindowItem.entities.yPosition = event.y || event.pageY;

      this.resizeWindowItem.entities.left = parseInt(this.resizeWindowItem.left, 10);
      this.resizeWindowItem.entities.top = parseInt(this.resizeWindowItem.top, 10);
      this.resizeWindowItem.entities.width = parseInt(this.resizeWindowItem.width, 10);
      this.resizeWindowItem.entities.height = parseInt(this.resizeWindowItem.height, 10);
    }
  }

  resizeGo(event) {
    if (this.resizeWindowItem !== null) {

      let north = false;
      let south = false;
      let east = false;
      let west = false;
      if (this.resizeDirection.charAt(0) === 'n') {
        north = true;
      }
      if (this.resizeDirection.charAt(0) === 's') {
        south = true;
      }
      if (this.resizeDirection.charAt(0) === 'e' || this.resizeDirection.charAt(1) === 'e') {
        east = true;
      }
      if (this.resizeDirection.charAt(0) === 'w' || this.resizeDirection.charAt(1) === 'w') {
        west = true;
      }

      let x = event.pageX;
      let y = event.pageY;

      if (x <= 5) {
        x = 5;
      }

      if (x >= this.innerWidth - 5) {
        x = this.innerWidth - 5;
      }

      if (y <= this.titleBarTopHeight) {
        y = this.titleBarTopHeight;
      }

      if (y >= this.innerHeight - this.toolbarHeight - 6) {
        y = this.innerHeight - this.toolbarHeight - 6;
      }

      let dx = x - this.resizeWindowItem.entities.xPosition;
      let dy = y - this.resizeWindowItem.entities.yPosition;

      if (west) {
        dx = -dx;
      }
      if (north) {
        dy = -dy;
      }

      let w = this.resizeWindowItem.entities.width + dx;
      let h = this.resizeWindowItem.entities.height + dy;
      if (w <= this.resizeWindowItem.minimumWidth) {
        w = this.resizeWindowItem.minimumWidth;
        dx = w - this.resizeWindowItem.entities.width;
      }
      if (h <= this.resizeWindowItem.minimumHeight) {
        h = this.resizeWindowItem.minimumHeight;
        dy = h - this.resizeWindowItem.entities.height;
      }

      if (north || east || south || west) {
        this.resizeWindowItem.class = 'open active noTransition' +
          (this.resizeWindowItem.state.isMaximised ? ' maximised' : '') +
          (this.resizeWindowItem.state.isMinimised ? ' minimised' : '');
      }

      if (east || west) {
        this.resizeWindowItem.width = w;
      }
      if (north || south) {
        this.resizeWindowItem.height = h;
      }

      if (west) {
        this.resizeWindowItem.left = (this.resizeWindowItem.entities.left - dx);
      }
      if (north) {
        this.resizeWindowItem.top = (this.resizeWindowItem.entities.top - dy);
      }
    }
  }

  resizeStop() {
    if (this.resizeWindowItem !== null) {
      this.resizeWindowItem.entities = {};
      this.resizeWindowItem = null;
    }
    document.body.style.cursor = '';
  }

  moveStart(event, windowItem: WindowModel) {
    if (windowItem.state.isMaximised) {
      return false;
    }
    this.dragWindowItem = windowItem;
    this.makeWindowActive(this.dragWindowItem);

    const x = event.pageX;
    const y = event.pageY;

    let element = event.target;
    while (!element.classList.contains('titleBar')) {
      element = element.parentNode;
    }

    this.dragWindowItem.entities.xOffset = element.parentNode.offsetLeft - x;
    this.dragWindowItem.entities.yOffset = element.parentNode.offsetTop - y;
    this.dragWindowItem.class = 'open active noTransition' +
      (this.dragWindowItem.state.isMaximised ? ' maximised' : '') +
      (this.dragWindowItem.state.isMinimised ? ' minimised' : '');

  }

  moveGo(event) {
    if (this.dragWindowItem !== null) {
      this.dragWindowItem.centered = false;

      let padding = 0;
      if (document.body.classList.contains('blocky')) {
        padding = 10;
      }
      const x = event.pageX;
      const y = event.pageY;

      let xOff = (x + this.dragWindowItem.entities.xOffset);
      let yOff = (y + this.dragWindowItem.entities.yOffset);

      if (yOff <= 1 - padding) {
        yOff = 1 - padding;
      }

      if (yOff > this.innerHeight - ((this.toolbarHeight * 2) + this.titleBarTopHeight)) {
        yOff = this.innerHeight - ((this.toolbarHeight * 2) + this.titleBarTopHeight);
      }

      if (xOff + this.dragWindowItem.width - 60 < 0) {
        xOff = 0 - this.dragWindowItem.width + 60;
      }

      if (xOff + 35 > this.innerWidth) {
        xOff = this.innerWidth - 35;
      }

      this.dragWindowItem.left = xOff;
      this.dragWindowItem.top = yOff;

    }
  }

  moveStop() {
    if (this.dragWindowItem !== null) {
      this.dragWindowItem.entities = {};
      this.dragWindowItem = null;
    }
  }

  makeWindowActive(windowItem: WindowModel) {
    this.windowService.active(windowItem);
  }

  maximiseWindow($event: MouseEvent, windowItem: WindowModel) {
    this.windowService.maximise(windowItem);
  }

  minimiseWindow(event: MouseEvent, windowItem: WindowModel) {
    this.windowService.minimise(event, windowItem);
  }

  centreWindow(event: MouseEvent, windowItem: WindowModel) {
    this.windowService.centre(event, windowItem, this.desktopWidth, this.desktopHeight);
  }
}
