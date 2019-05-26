import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ConsoleLogger } from './app/services/logger/logger';

if (environment.production) {
  enableProdMode();
}

const logger = new ConsoleLogger('MAIN');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => logger.log(err));
