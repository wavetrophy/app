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
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { MainOptionsPageModule } from './popover/main-options/main-options.module';
import { AnswerOptionsPageModule } from './popover/answer-options/answer-options.module';
import { PipeModule } from './services/pipes/pipe.module';

/**
 * Get the JWT Options factory.
 * @param storage
 * @returns {{tokenGetter: () => any; whitelistedDomains: string[]}}
 */
export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get(environment.storage.TOKEN_KEY);
    },
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    MainOptionsPageModule,
    AnswerOptionsPageModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ModalModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    PipeModule.forRoot(),
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
    Firebase,
    LocalNotifications,
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
