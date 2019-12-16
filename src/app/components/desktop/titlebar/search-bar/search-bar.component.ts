import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../../../services/language.service';
import {Subscription} from 'rxjs';
import {LanguageModel} from '../../../../models/language-model';
import {WindowService} from '../../../../services/window.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchTerm = '';
  objectKeys = Object.keys;
  int = parseInt;
  searchTerms: object;
  searchHits: object = [];
  searchHitIndex = -1;

  language$: Subscription;
  locale: LanguageModel;
  searchResults: boolean;

  consolelog = console.log;

  constructor(
    private languageService: LanguageService,
    private windowService: WindowService
  ) {
  }

  ngOnInit() {

    this.language$ = this.languageService.object.subscribe(locale => {
      this.locale = locale;
    });
  }

  checkKeys(event) {
    this.searchTerms = [
      {label: 'demo string'},
      {label: 'test string'},
      {label: 'test demo string'},
      {icon: 'ow-contacts_over', label: this.locale.contactManager},
      {icon: 'ow-quotations_over', label: this.locale.quotes},
      {label: 'testing'},
      {label: 'oven'},
      {label: 'housing'},
      {label: 'a long test string to break the search'},
      {label: 'testing is fun'},
      {label: 'demo demo demo'}
    ];

    if (event.target.value.length > 1) {
      this.searchHits = this.searchTerms;
      this.searchResults = true;
    } else {
      this.closeSearch();
      return false;
    }

    for (const item of Object.keys(this.searchHits)) {
      this.searchHits[item].highlighted = this.highlight(this.searchHits[item].label, this.searchTerm);
    }

    if (event.key === 'Escape') {
      this.closeSearch();
    }

    if (event.key === 'ArrowUp' && this.searchHitIndex > -1) {
      this.searchHitIndex--;
      this.scrollIntoView();
    }

    if (event.key === 'ArrowDown' && this.searchHitIndex < Object.keys(this.searchHits).length - 1) {
      this.searchHitIndex++;
      this.scrollIntoView();
    }

    if (event.key === 'Enter') {
      this.search(event, this.searchHitIndex);
    }
  }

  scrollIntoView() {
    setTimeout(() => {
      const elms = document.getElementsByClassName('selectedItem');
      const searchResults = document.getElementsByClassName('searchResults');
      if (typeof elms[0] !== 'undefined') {
        elms[0].scrollIntoView({behavior: 'auto', block: 'end', inline: 'end'});
        if (this.searchHitIndex > 4) {
          searchResults[0].scrollTop += 4;
        }
      }
    });
  }

  search(event, item) {
    if (item === -1) {
      this.searchTerm = event.target.value;
    } else {
      this.searchTerm = this.locale[this.searchHits[item].label] || this.searchHits[item].label;
    }
    this.closeSearch();
    event.target.blur();

    this.windowService.new(
      'search',
      'search_over',
      true,
      'search',
      this.searchTerm,
      true,
      true,
      false,
      null,
      {body: 'Search Results For: ' + this.searchTerm},
      200,
      400);
  }

  preventCursor(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      return false;
    }
  }

  closeSearch() {
    setTimeout(() => {
      this.searchHits = [];
    }, 200);

    this.searchHitIndex = -1;
    this.searchResults = false;

  }

  closeSearchDebounce() {
    setTimeout(() => {
      this.closeSearch();
    }, 200);
  }

  highlight(str, term) {
    return str.replace(new RegExp(term, 'gi'), (rep) => {
      return `<span class="highlight">${rep}</span>`;
    });
  }
}
