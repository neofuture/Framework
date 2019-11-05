import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {language} from '../config/languages/languages';
import {LanguageModel} from '../models/language-model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private objectSource = new BehaviorSubject<LanguageModel>(language[localStorage.getItem('language') || 'en_gb']);
  object = this.objectSource.asObservable();

  constructor() {
  }

  getLanguage(lang) {
    this.objectSource.next(language[lang]);
    localStorage.setItem('language', lang);

    this.loadLanguage('en_gb');
  }

  async loadLanguage(lang) {
    const {en_gb} = await import('../config/languages/locales/' + lang);
    return en_gb;
  }
}
