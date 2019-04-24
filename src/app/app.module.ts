import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { JwtHttpInterceptor } from './services/interceptors/jwt-http.interceptor';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { ModalModule } from './modal/modal.module';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Contacts } from '@ionic-native/contacts';

/**
 * Get the JWT Options factory.
 * @param storage
 * @returns {{tokenGetter: () => any; whitelistedDomains: string[]}}
 */
export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('token_access');
    },
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ModalModule,
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      },
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Diagnostic,
    Contacts,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
/**
 * Class AppModule
 */
export class AppModule {
}
