import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../models/language-model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchTerm: string;
  objectKeys = Object.keys;
  int = parseInt;
  searchTerms: object;
  searchHits: object = [];
  searchHitIndex = -1;

  private language$: Subscription;
  private locale: LanguageModel;

  constructor(
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.searchTerms = [
      'demo string', 'test string', 'test demo string', 'contact manager',
      'quotes', 'testing', 'oven', 'housing', 'a long test string to break the search',
      'testing is fun', 'demo demo demo'
    ];

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  checkKeys(event) {

    if (event.target.value.length > 1) {
      this.searchHits = this.searchTerms;
    } else {
      this.closeSearch();
      return false;
    }

    if (event.key === 'Escape') {
      this.closeSearch();
    }

    if (event.key === 'ArrowUp' && this.searchHitIndex > -1) {
      this.searchHitIndex--;
      this.scrollIntoView('start');
    }

    if (event.key === 'ArrowDown' && this.searchHitIndex < Object.keys(this.searchHits).length - 1) {
      this.searchHitIndex++;
      this.scrollIntoView('end');
    }

    if (event.key === 'Enter') {
      this.search(event, this.searchHitIndex);
    }
  }

  scrollIntoView(block) {
    setTimeout(() => {
      const elms = document.getElementsByClassName('highlight');
      const searchResults = document.getElementsByClassName('searchResults');
      if (typeof elms[0] !== 'undefined') {
        elms[0].scrollIntoView({behavior: 'smooth', block: 'end', inline: 'end'});
        if(this.searchHitIndex > 4) {
          searchResults[0].scrollTop += 4;
        }
      }
    });
  }

  search(event, item) {
    if (item === -1) {
      console.log('SEARCH', event.target.value);
    } else {
      console.log('SEARCH', this.searchHits[item]);
      this.searchTerm = this.searchHits[item];
      this.closeSearch();
    }
  }

  preventCursor(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      return false;
    }
  }

  closeSearch() {
    this.searchHits = [];
    this.searchHitIndex = -1;
  }

  clearSearch() {
    this.closeSearch();
    this.searchTerm = '';
  }

}
