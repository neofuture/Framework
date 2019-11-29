import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {WindowService} from './window.service';
import {ApiService} from './api.service';
import {Md5} from 'ts-md5/dist/md5';
import {ProfileModel} from '../models/profile-model';
import {HeartbeatModel} from '../models/heartbeat-model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private intervalTimer: any;

  constructor(
    private windowService: WindowService,
    private api: ApiService
  ) {
  }

  serviceName = 'profile';

  public objectSource = new BehaviorSubject(JSON.parse(localStorage.getItem(this.serviceName)) || false);
  object = this.objectSource.asObservable();

  set(message: object) {
    this.objectSource.next(message);
    localStorage.setItem(this.serviceName, JSON.stringify(this.objectSource.value));
  }

  update(message: object) {
    this.objectSource.next({...this.objectSource.value, ...message});
    localStorage.setItem(this.serviceName, JSON.stringify(this.objectSource.value));
  }

  get(item) {
    return this.objectSource.value[item];
  }

  destroy() {
    localStorage.removeItem(this.serviceName);
    this.objectSource.next(false);
    this.windowService.closeAll();
  }

  setActive(active) {
    this.api.call(
      '/user/status',
      'post',
      {active},
      this.objectSource.value.token
    ).subscribe((object: any) => {
      if (typeof object.error !== 'undefined') {
        this.logout();
      }
      this.update({active});
    });
  }

  heartbeat() {
    this.api.call(
      '/user/heartbeat',
      'post',
      {},
      this.objectSource.value.token
    ).subscribe((object: HeartbeatModel) => {
      const heartbeat = object;
      if (heartbeat.error) {
        this.logout();
      }
    });
  }

  logout() {
    this.api.call(
      '/user/logout',
      'post',
      {},
      this.objectSource.value.token
    ).subscribe(() => {
      this.destroy();
    });
  }

  login(username, password, callback) {
    const md5 = new Md5();
    password = md5.appendStr(password).end();
    const body = {
      username,
      password
    };

    this.api.call(
      '/user/login',
      'post',
      body,
      ''
    ).subscribe((profile: ProfileModel) => {
      if (!profile.error) {
        this.set(profile);
      } else {
        this.destroy();
      }
      if (callback) {
        callback(profile);
      }
      return profile;
    });
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeat();
    this.intervalTimer = setInterval(() => {
      this.heartbeat();
    }, 10000);
  }

  stopHeartbeat() {
    clearInterval(this.intervalTimer);
  }
}
