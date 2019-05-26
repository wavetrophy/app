import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsoleColor, ConsoleLogger } from '../logger/logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import * as color from 'ansicolor';

const logger = new ConsoleLogger('HTTP', ConsoleColor.GRAY);

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isDebug = !environment.production;
    const start = moment();
    if (isDebug) {
      logger.info(`requesting [${request.method.toUpperCase()}] ${request.urlWithParams}`);
      logger.table('headers', request.headers);
      logger.table('body', request.body);
    }
    return next.handle(request).pipe(
      map((response: HttpEvent<any>) => {
        if (response instanceof HttpResponse && isDebug) {
          logger.info(
            `response [${request.method.toString().toUpperCase()}] ${request.urlWithParams}`,
            color.lightGray(`took ${moment().diff(start).toString(10)}ms`),
          );
          logger.table('headers', response.headers);
          logger.table('body', response.body);
        }

        return response;
      }),
    );
  }

}
