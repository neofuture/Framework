import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  tabWidth: any;
  @Input() desktopId: number;
  constructor() {
  }

  ngOnInit() {

  }

  setTabWidth(tabWidth) {
    this.tabWidth = tabWidth;
  }
}
