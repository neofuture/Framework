import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WindowComponent } from './components/window/window.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TitleBarComponent } from './components/titlebar/titlebar.component';
import { PrettyPrintPipe } from './pipes/pretty-print.pipe';
import { JsonPipe } from './pipes/json.pipe';
import { WindowService } from './services/window.service';
import { FormsModule } from '@angular/forms';
import { RibbonButtonComponent } from './components/ribbon-button/ribbon-button.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    WindowComponent,
    DesktopComponent,
    ToolbarComponent,
    TitleBarComponent,
    PrettyPrintPipe,
    JsonPipe,
    RibbonButtonComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [WindowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
