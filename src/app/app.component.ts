import {Component, OnInit} from '@angular/core';
import {ApiService} from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private api: ApiService
  ) {
  }

  ngOnInit() {
    this.api.call(
      '/system/settings',
      'post',
      {},
      ''
    ).subscribe((object: any) => {
      document.documentElement.style.setProperty('--hue', object.hue);
    });
  }
}
