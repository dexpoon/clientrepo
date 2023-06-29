import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { ICrypton } from '../components/dashboard/crypton';
import { logit } from '../components/common/cltlogger';
import { CONTENT_TYPES } from '../content.config';
import { Http, Response, Headers, HttpModule } from '@angular/http';
import { IStockton } from '../components/dashboard/IStockton';
import { CONFIGURABLE_URL } from '../config/appConfig';

@Injectable()
export class StockService {


  stockSubject:BehaviorSubject<IStockton[]> = new BehaviorSubject<IStockton[]>([]);

  constructor(private http:Http) { 
  }



/*
- Line 1: this.http.get(this.CRYPTO_COMPARE_URL)  : Get data from source.

- Line 2: map(result => result.json())            : Map that result to JSON.

- Line 3: subscribe(data =>                       : Subscribe to that JSON and call it data, by subscribing to this JSON data,
                                                    we are saying “Hey, any time there is a change in this data, I want to know
                                                    about it.” And when that change occurs, then the function you see passed to 
                                                    the subscribe method is executed (Line 4).

- Line 4: this.cryptos.next(data)                 : This function will receive the updated JSON data as its first argument.
                                                    this.cryptos.next(data). What’s happening here is: the cryptos array 
                                                    has a “next” method with argument any. In our case, it is the JSON data. 
                                                    All subscribers to our cryptos property will receive a notification that there is
                                                    new data and will be passed that data.                                                  
*/

poll() {
  logit('StockService::polling Stocks' + new Date());
  let headers = new Headers();
  headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
  return this.http.get(CONFIGURABLE_URL.TESLA_URL, {headers: headers})      // Line 1
  .map(result => result.json())                                 // Line 2
  .subscribe(data => {                                          // Line 3   whenever there is change to data, execute line 4
    this.stockSubject.next(data);                             // Line 4   All Observers (subscribed to cryptoSubject will receive an update)   
    logit('Data: ' + data);           
  },
    err => logit('StockService::poll::FAILURE ' + err),
    () => logit('StockService::poll::SUCCESS::EXITING')
  );
}


} // StockService