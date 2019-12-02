import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() desktopWidth: number;
  @Input() desktopHeight: number;

  constructor() {
  }

  ngOnInit() {

  }

}
