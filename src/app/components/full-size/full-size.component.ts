import {Component, Input, OnInit} from '@angular/core';
import {WindowService} from '../../services/window.service';

@Component({
  selector: 'app-full-size',
  templateUrl: './full-size.component.html',
  styleUrls: ['./full-size.component.css']
})
export class FullSizeComponent implements OnInit {
  @Input() windowItem: any;
  constructor(public windowService: WindowService) { }

  ngOnInit() {
  }

}
