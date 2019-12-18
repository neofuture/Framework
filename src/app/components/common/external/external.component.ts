import {Component, NgZone, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataService} from '../../../services/data.service';

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
    private dataService: DataService
  ) {

    // @ts-ignore
    window.angular = {
      zone: this.zone,
      test1: (...value) => this.test1(value),
      component: this,
    };
  }

  ngOnInit() {
    this.dataSub = this.dataService.object.subscribe(object => {
      this.data = object || {};
    });
  }

  public test1(...value) {
    this.dataService.updateItem({message: value});
  }

}
