import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {blank} from '../config/languages/blank';
import {LanguageModel} from '../models/language-model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private objectSource = new BehaviorSubject<LanguageModel>(blank);
  object = this.objectSource.asObservable();

  constructor() {
    this.getLanguage(localStorage.getItem('language') || 'en_gb');
  }

  getLanguage(lang) {
    this.loadLanguage(lang).then(result => {
      this.objectSource.next(result);
    });

    localStorage.setItem('language', lang);
  }

  async loadLanguage(lang) {
    const language = await import('../config/languages/locales/' + lang);
    return language[lang];
  }
}
