import {Component, Input, OnInit} from '@angular/core';
import {WindowService} from '../../services/window.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @Input() windowItem: any;
  id: number;
  constructor(private windowService: WindowService) { }

  ngOnInit() {
    const min = 10000;
    const max = 99999;
    this.id = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addWindow() {
    this.windowService.new(
      'orders',
      true,
      'Orders - ' + this.id,
      true,
      true,
      'quotes',
    {id: this.id}
    );
  }

  closeWindow(event) {
    event.stopPropagation();
    console.log(this.windowItem.id);
    this.windowService.closeById(this.windowItem.id);
  }
}
