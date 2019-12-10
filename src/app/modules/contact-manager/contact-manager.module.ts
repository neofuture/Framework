import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ContactManagerComponent} from './contact-manager.component';
import {SliderComponent} from '../../components/common/slider/slider.component';

@NgModule({
  declarations: [
    ContactManagerComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  providers: []
})
export class ContactManagerModule { }
