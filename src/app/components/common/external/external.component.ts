import {Component, NgZone, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataService} from '../../../services/data.service';
import {ModuleService} from '../../../services/module.service';

@Component({
  selector: 'app-external',
  template: '',
  styles: ['']
})
export class ExternalComponent implements OnInit {
  dataSub: Subscription;
  data: any;

  public constructor(
    private zone: NgZone,
    private dataService: DataService,
    private moduleService: ModuleService
  ) {

    // @ts-ignore
    window.angular = {
      zone: this.zone,
      callAngular: (value) => this.callAngular(value),
      openWindow: (x, y) => this.openWindow(x, y),
      component: this,
    };
  }

  ngOnInit() {
    this.dataSub = this.dataService.object.subscribe(object => {
      this.data = object || {};
    });
  }

  public callAngular(value) {
    this.dataService.updateItem({message: value});
  }

  public openWindow(x, y) {
    this.moduleService.canvasWindow(x, y);
  }
}
