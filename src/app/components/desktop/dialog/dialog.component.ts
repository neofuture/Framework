import {Component, HostListener, Input, OnInit} from '@angular/core';
import {DialogModel} from '../../../models/dialog-model';
import {DialogService} from '../../../services/dialog.service';
import {LanguageService} from '../../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../models/language-model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  objectKeys = Object.keys;
  @Input() dialogItem: DialogModel;
  private language$: Subscription;

  locale: LanguageModel;

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  constructor(
    private dialogService: DialogService,
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  close(dialogItem: DialogModel) {
    this.dialogService.close(dialogItem);
  }

  destroy(dialogItem: DialogModel) {
    this.dialogService.destroy(dialogItem);
  }

  resize() {
    this.dialogService.resize();
  }

  call(callback, dialogItem: DialogModel) {
    if (typeof callback !== 'undefined') {
      setTimeout(() => {
        callback();
      }, 200);
    }

    this.close(dialogItem);
  }

  blur(event) {
    event.target.classList.remove('focused');
  }
}
