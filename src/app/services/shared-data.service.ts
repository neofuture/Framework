import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  subject = {};
  observable = {};
  desktopId: number;

  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.desktopId = parseInt(urlParams.get('desktopId'), 10) || 1;
  }

  new(name) {
    if (typeof this.subject[name] === 'undefined') {
      this.subject[name] = new BehaviorSubject(JSON.parse(localStorage.getItem(name)) || {});
      this.observable[name] = this.subject[name].asObservable();
    }
  }

  set(name: string, object: object) {
    this.new(name);
    this.subject[name].next(object);
    localStorage.setItem(name, JSON.stringify(object));
  }

  update(name: string, object: object) {
    this.new(name);
    const newObject = {...this.subject[name].value, ...object};
    this.subject[name].next(newObject);
    localStorage.setItem(name, JSON.stringify(newObject));
  }

  delete(name: string) {
    this.subject[name].next(null);
    localStorage.removeItem(name);
  }

  refresh(name: string) {
    const object = JSON.parse(localStorage.getItem(name));
    this.subject[name].next(object);
    return object;
  }
}
