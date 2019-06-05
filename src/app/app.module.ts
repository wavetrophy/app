import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
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
import { CacheInterceptor } from './services/interceptors/cache.interceptor';
import { Network } from '@ionic-native/network/ngx';
import { LoggerInterceptor } from './services/interceptors/logger.interceptor';
import { SentryErrorHandler } from './services/error-handlers/sentry.error-handler';
import * as Sentry from 'sentry-cordova';
import { DirectivesModule } from './directives/directives.module';
import { ImageCacheModule } from './services/image-cache';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { NativeHttpBackend, NativeHttpFallback, NativeHttpModule } from 'ionic-native-http-connection-backend';

if (environment.production) {
  Sentry.init({dsn: 'https://61838ef844d54ef6b50e7a65618473f5@sentry.io/1470302'});
}

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
    BrowserModule,
    NativeHttpModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ModalModule,
    DirectivesModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    PipeModule.forRoot(),
    ImageCacheModule.forRoot(),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    MainOptionsPageModule,
    AnswerOptionsPageModule,
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
    Network,
    LaunchNavigator,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true},
    {provide: ErrorHandler, useClass: environment.production ? SentryErrorHandler : ErrorHandler},
    {provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
  ],
  bootstrap: [AppComponent],
})
/**
 * Class AppModule
 */
export class AppModule {
}
