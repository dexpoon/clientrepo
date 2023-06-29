import { AuthenticationService } from './auth.service';
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';

// SEARCH =====================================
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { CONTENT_TYPES } from '../content.config';
import { SOURCE } from '../components/common/classifier';
// SEARCH =====================================

import { CONFIGURABLE_URL} from '../config/appConfig';
import { DEPLOY_MODE } from '../config/deployConfig';

let tempURL = CONFIGURABLE_URL.BASE_URL_LOCAL;
let CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_LOCAL;

if(DEPLOY_MODE.LOCAL == true) {
    tempURL = CONFIGURABLE_URL.BASE_URL_LOCAL;
    CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_LOCAL;
}else if(DEPLOY_MODE.DOCKER == true) {
    tempURL = CONFIGURABLE_URL.BASE_URL_DOCKER;
    CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_DOCKER;
}else if(DEPLOY_MODE.AWS == true) {
    tempURL = CONFIGURABLE_URL.BASE_URL_AWS;
    CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_AWS;
}


@Injectable()
export class SearchService {


BASE_URL_TASKS    =  tempURL + '/tasks';

query: string;
user: any;
username: string;
isChecked = false; // for notes search opt out selectable on task component

    constructor(private http:Http, private authService: AuthenticationService) {
      this.user = this.authService.loadUser();
      this.username = this.user.username;
      console.log('SEARCH::SERVICE CONSTRUCTOR');
      this.isChecked = false;
    }

    updateNotesOptOut(val) {
      this.isChecked = val;
    }

    // boolean not_notes, if true no task notes are seached
    // Following fields are seached, the search is case incensitive
    // description, notes, status, priority, category, credos
    // docuName and address (url) 
    search(terms: Observable<string>, source) { // source not used
        return terms.debounceTime(400)
        .distinctUntilChanged()
        .switchMap(term => this.searchEntries(term, this.isChecked));
    } // END search()


    searchEntries(term, no_notes) {
      this.clear();
      this.user = this.authService.loadUser();
      this.username = this.user.username;
      let URL_COMPOSED = '';

      if(term == 'Task' || term == 'Bill' || term == 'Aptm' || term == 'Info' || term == 'HowTo'
                        || term == 'Critical' || term == 'Completed' || term == 'High') {
        no_notes = true; // means do not search notes when loading per category
      }
      console.log('SEARCH::SERVICE NO_NOTES VALUE: ' + no_notes);
      console.log('SEARCH::SERVICE TERM VALUE: ' + term);

      if(no_notes) {
        console.log('OTP OUT NOTES');
        if(term === '')
          URL_COMPOSED = this.BASE_URL_TASKS + '/tasklist/' + this.username;
        else
          URL_COMPOSED = this.BASE_URL_TASKS + '/search/' + term + '-' + this.username + '-' + 'exclude_notes';
      }else{
        console.log('INCLUDE NOTES');
        if(term === '')
          URL_COMPOSED = this.BASE_URL_TASKS + '/tasklist/' + this.username;
        else
          URL_COMPOSED = this.BASE_URL_TASKS + '/search/' + term + '-' + this.username + '-' + 'include_notes';
      } // END if-else no_notes

      console.log(' SEARCH::SERVICE  URL COMPOSED: ' + URL_COMPOSED);
      let headers = new Headers()
      headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
      return this.http
          .get( URL_COMPOSED, {headers: headers})
          .map(res => res.json());
    } // END searchEntries()

clear() {
  this.query = '';
  this.user  = null;
  this.username= '';
}

} // SearchService
