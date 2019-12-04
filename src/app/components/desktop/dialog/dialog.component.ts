import {Component, HostListener, Input, OnInit} from '@angular/core';
import {DialogModel} from '../../../models/dialog-model';
import {DialogService} from '../../../services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @Input() dialogItem: DialogModel;
  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  constructor(private dialogService: DialogService) { }

  ngOnInit() {
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
}
