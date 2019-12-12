import {Injectable} from '@angular/core';
import {DialogModel} from '../models/dialog-model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  dialogList = {};

  constructor() {
  }

  new(
    icon,
    title,
    body,
    buttons
  ) {
    let id = parseInt(Object.keys(this.dialogList)[Object.keys(this.dialogList).length - 1], 10) || 0;
    id++;

    let dialogItem: DialogModel;
    dialogItem = {
      id,
      icon,
      title,
      body,
      buttons,
      left: 0,
      top: 0
    };

    this.dialogList[id] = dialogItem;
    setTimeout(() => {
      this.dialogList[id].class = 'on';
      this.resize();
      let buttonFocus = 0;
      for (const item of Object.keys(buttons)) {
        if (buttons[item].focused) {
          buttonFocus = parseInt(item, 10);
        }
      }
      const buttonList = document.getElementById('dialog-' + id).querySelectorAll('button');

      for (const item of Object.keys(buttonList)) {
        if (parseInt(item, 10) === buttonFocus) {
          buttonList[item].focus();
          buttonList[item].classList.add('focused');
        }
      }
    });
  }

  close(dialogItem: DialogModel) {
    dialogItem.class = '';
  }


  destroy(dialogItem: DialogModel) {
    if (dialogItem.class === 'on') {
      return false;
    }
    for (const key of Object.keys(this.dialogList)) {
      if (dialogItem === this.dialogList[key]) {
        delete this.dialogList[key];
      }
    }
  }

  resize() {
    for (const key of Object.keys(this.dialogList)) {
      this.resizeItem(this.dialogList[key]);
    }
  }

  resizeItem(dialogItem: DialogModel) {
    const elm = document.getElementById('dialog-' + dialogItem.id);
    dialogItem.left = (window.innerWidth / 2) - (elm.offsetWidth / 2);
    dialogItem.top = (window.innerHeight / 2) - (elm.offsetHeight / 2);
  }
}
