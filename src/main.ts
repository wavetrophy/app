import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ConsoleLogger } from './app/services/logger/logger';

if (environment.production) {
  enableProdMode();
}

// @ts-ignore
if (!String.prototype.format) {
  // @ts-ignore
  String.prototype.format = function () {
    const args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

const logger = new ConsoleLogger('MAIN');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => logger.log(err));
