import { ErrorHandler } from '@angular/core';
import { Logger } from 'angular2-logger/core';


export class AppErrorHandler implements ErrorHandler {

  logger: Logger = new Logger();

  handleError(error: any): void {
       // if(error. net::ERR_CONNECTION_RESET
        //alert(' Unexpected Application Error!'),
        this.logger.error(error)
    }
}
