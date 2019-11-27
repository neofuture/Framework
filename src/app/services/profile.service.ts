import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  serviceName = 'profile';

  private objectSource = new BehaviorSubject(JSON.parse(localStorage.getItem(this.serviceName)) || false);
  object = this.objectSource.asObservable();

  constructor() {
  }

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

  delete(itemIdent) {
    const object = [];
    for (const item of this.objectSource.value) {
      if (item !== itemIdent) {
        object.push(item);
      }
    }
    console.log(object);
  }

  nuke() {
    localStorage.removeItem(this.serviceName);
    this.objectSource.next(false);
  }
}
