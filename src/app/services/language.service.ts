import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {language} from '../config/languages/languages';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private objectSource = new BehaviorSubject<object>(language[localStorage.getItem('language') || 'en_gb']);
  object = this.objectSource.asObservable();

  constructor() {
  }

  getLanguage(lang) {
    this.objectSource.next(language[lang]);
    localStorage.setItem('language', lang);
  }

}
