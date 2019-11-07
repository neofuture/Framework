import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {QuotesComponent} from './quotes.component';

@NgModule({
  declarations: [
    QuotesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: []
})
export class QuotesModule { }
