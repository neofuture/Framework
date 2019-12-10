import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';

import {ServiceWorkerModule} from '@angular/service-worker';
import {AboutComponent} from './components/about/about.component';

import {DemoComponent} from './components/demo/demo.component';
import {DesktopComponent} from './components/desktop/desktop.component';
import {DialogComponent} from './components/desktop/dialog/dialog.component';
import {ExternalComponent} from './components/external/external.component';
import {LoginComponent} from './components/login/login.component';
import {NotificationComponent} from './components/desktop/notifications/notification.component';
import {RibbonButtonComponent} from './components/desktop/titlebar/ribbon-button/ribbon-button.component';
import {SearchBarComponent} from './components/desktop/titlebar/search-bar/search-bar.component';
import {TabsComponent} from './components/desktop/toolbar/tabs/tabs.component';
import {TitleBarComponent} from './components/desktop/titlebar/titlebar.component';
import {ToolbarComponent} from './components/desktop/toolbar/toolbar.component';
import {UserStatusComponent} from './components/desktop/toolbar/user-status/user-status.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {WindowComponent} from './components/desktop/window/window.component';

import {ApiService} from './services/api.service';
import {HttpClientModule} from '@angular/common/http';
import {WindowService} from './services/window.service';

import {ContactManagerModule} from './modules/contact-manager/contact-manager.module';
import {QuotesModule} from './modules/quotes/quotes.module';

import {JsonPipe} from './pipes/json.pipe';
import {PrettyPrintPipe} from './pipes/pretty-print.pipe';
import {SafeHtmlPipe} from './pipes/safe-html.pipe';

import {environment} from '../environments/environment';
import { SliderComponent } from './components/common/slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    WindowComponent,
    DesktopComponent,
    ToolbarComponent,
    TitleBarComponent,
    PrettyPrintPipe,
    JsonPipe,
    RibbonButtonComponent,
    SearchBarComponent,
    DemoComponent,
    ExternalComponent,
    WelcomeComponent,
    UserStatusComponent,
    TabsComponent,
    SafeHtmlPipe,
    SafeHtmlPipe,
    LoginComponent,
    NotificationComponent,
    DialogComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    QuotesModule,
    ContactManagerModule,
    RouterModule.forRoot([]),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    HttpClientModule
  ],
  providers: [WindowService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
