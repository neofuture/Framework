import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private objectSource = new BehaviorSubject(JSON.parse(localStorage.getItem('appState')) || {});
  object = this.objectSource.asObservable();

  constructor() {
  }

  update(message: object) {
    this.objectSource.next(message);
    localStorage.setItem('appState', JSON.stringify(this.objectSource.value));
  }

  updateItem(message: object) {
    this.objectSource.next({...this.objectSource.value, ...message});
    localStorage.setItem('appState', JSON.stringify(this.objectSource.value));
  }

  getItem(item) {
    return this.objectSource.value[item];
  }
}
