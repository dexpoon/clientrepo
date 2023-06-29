import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { ICrypton } from '../components/dashboard/crypton';
import { logit } from '../components/common/cltlogger';
import { CONTENT_TYPES } from '../content.config';
import { Http, Response, Headers, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CryptoService {

CRYPTO_IDs= 'bitcoin%2Ccardano%2Charmony%2Cdogecoin%2Clitecoin%2Cchainlink%2Ctron%2Cvethor-token%2Cbinancecoin%2Cshiba-inu%2Cpi-network-iou';
 
// CoinGeko, price and market data
CRYPTO_COMPARE_URL= "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids="+this.CRYPTO_IDs+"&price_change_percentage=1h%2C24h&locale=en";
  
cryptosSubject:BehaviorSubject<ICrypton[]> = new BehaviorSubject<ICrypton[]>([]);

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
    
      logit('CryptoService::polling Cryptos' + new Date());
      let headers = new Headers();
      headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
      return this.http.get(this.CRYPTO_COMPARE_URL, {headers: headers})                      
      .map(result => result.json() )                                    // Line 2
      .subscribe(data => {                                                                // Line 3   whenever there is change to data, execute line 4
        this.cryptosSubject.next(data); 
        logit('Data: ' + data);           
      },
        err => logit('CryptoService::poll::FAILURE ' + err),
        () => logit('CryptoService::poll::SUCCESS::EXITING')
      );
 
} // poll()


} // CryptoService