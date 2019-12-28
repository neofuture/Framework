import {Component, OnInit} from '@angular/core';
import {ApiService} from './services/api.service';
import {WindowService} from './services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  desktopId = 1;

  constructor(
    private api: ApiService,
    private windowService: WindowService
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    this.desktopId = parseInt(urlParams.get('desktopId'), 10) || 1;
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

    window.addEventListener('storage', (e) => {
      if (e.storageArea === localStorage) {

        const windowList = JSON.parse(localStorage.getItem('windowList'));
        console.log(windowList);
        this.windowService.update(windowList);
      }
    });
  }
}
