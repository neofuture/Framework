import {Component, Input, OnInit} from '@angular/core';
import {WindowService} from '../../services/window.service';

@Component({
  selector: 'app-full-size-no-tab',
  templateUrl: './full-size-no-tab.component.html',
  styleUrls: ['./full-size-no-tab.component.css']
})
export class FullSizeNoTabComponent implements OnInit {
  @Input() windowItem: any;
  constructor(public windowService: WindowService) { }

  ngOnInit() {
  }

}
