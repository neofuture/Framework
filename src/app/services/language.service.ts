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
  serviceName = 'language';

  constructor() {
    this.getLanguage(localStorage.getItem(this.serviceName) || 'lang_en');
  }

  getLanguage(lang) {
    this.loadLanguage(lang).then(result => {
      this.objectSource.next(result);
    });

    localStorage.setItem(this.serviceName, lang);
  }

  async loadLanguage(lang) {
    const language = await import('../config/languages/locales/' + lang);
    return language[lang];
  }
}
