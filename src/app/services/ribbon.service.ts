import {Injectable} from '@angular/core';
import {RibbonButtonModel} from '../models/ribbon-button-model';
import {ModuleService} from './module.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RibbonService {
  private objectSource1 = new BehaviorSubject([]);
  private objectSource2 = new BehaviorSubject([]);
  ribbonButtons = this.objectSource1.asObservable();
  menuButtons = this.objectSource2.asObservable();

  ribbonButtonList = [];
  // ribbonButtons: RibbonButtonModel[];
  // menuButtons: RibbonButtonModel[];

  constructor(private moduleService: ModuleService) {
  }

  clearRibbon() {
    this.ribbonButtonList = [];
  }

  add(button) {
    let buttonObject: RibbonButtonModel;

    if (button === 'contactManager') {
      buttonObject = {
        icon: 'ow-contacts',
        iconOver: 'ow-contacts_over',
        label: 'contactManager',
        module: 'contactManager'
      };
    }

    if (button === 'quotes') {
      buttonObject = {
        icon: 'ow-quotations',
        iconOver: 'ow-quotations_over',
        label: 'quotes',
        module: 'quotes'
      };
    }

    if (button === 'settings') {
      buttonObject = {
        icon: 'ow-cog',
        iconOver: 'ow-cog_over',
        label: 'settings',
        module: 'settings'
      };
    }

    if (button === 'messages') {
      buttonObject = {
        icon: 'ow-messages',
        iconOver: 'ow-messages_over',
        label: 'messages',
        module: 'messages'
      };
    }

    this.ribbonButtonList.push(buttonObject);
  }

  clickAction(ribbonItem: RibbonButtonModel, desktopWidth, desktopHeight) {
    this.moduleService[ribbonItem.label](desktopWidth, desktopHeight);
  }

  setRibbonButtons(size, desktopWidth, desktopHeight) {
    let icons = 0;
    if (size) {
      icons = (desktopWidth - 160) / 90;
    } else {
      icons = (desktopWidth - 102) / 34;
    }
    if (icons > this.ribbonButtonList.length) {
      icons = this.ribbonButtonList.length;
    }

    const ribbonButtons = [];
    const menuButtons = [];
    let index = 0;
    for (let i = 0; i < icons; i++) {
      ribbonButtons.push(this.ribbonButtonList[i]);
      index = i;
    }
    index++;
    for (let i = index; i < this.ribbonButtonList.length; i++) {
      menuButtons.push(this.ribbonButtonList[i]);
    }
    this.objectSource1.next(ribbonButtons);
    this.objectSource2.next(menuButtons);
    // this.ribbonBar = true;
  }
}
