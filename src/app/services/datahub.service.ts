import { BadRequest } from '../components/error/bad-request';
import { NotFoudError } from '../components/error/not-found-error';
import { AppError } from '../components/error/app-error';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AuthenticationService } from './auth.service';
import { CONTENT_TYPES } from '../content.config';
import { Logger } from 'angular2-logger/core';

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
}else if(DEPLOY_MODE.AWS == true)                         {
    tempURL = CONFIGURABLE_URL.BASE_URL_AWS;
                    CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_AWS;
}

@Injectable() 
export class DatahubService {
  className="DatahubService";
  user: any
  username: string
  BASE_URL_TASK   =  tempURL + '/tasks';

constructor(private http: Http, 
            private authService: AuthenticationService, 
            private logger: Logger) {}

create(task) {
                this.user = this.authService.loadUser();
                this.username = this.user.username;
                task.username = this.username;
                
                let headers = new Headers()
                //headers.append('Content-Type', 'application/x-www-form-urlencoded');
                headers.append('Content-Type', CONTENT_TYPES.APP_JSON);

                // - is reserved as the get params separator
                let tempDate = task.ddate.replace(/-/g, "A");
                task.ddate   = tempDate;
                let body = {
                  'description': task.description,
                  'status': task.status,
                  'priority': task.priority,
                  'ddate': task.ddate,
                  'category': task.category,
                  'username': task.username,
                  'notes': task.notes
                }

                return this.http.post(this.BASE_URL_TASK + '/create/', body, {headers: headers})
                      .map(res => res.json());
                      /*
                      .catch(error => Observable.throw(error))
                      .subscribe(
                          data => console.log('success'),
                          error => console.log(error)
                      );*/
} // Adding notes 'Place Holder'

update(task) {
  if(this.username === 'undefined') {
    this.user = this.authService.loadUser();
    this.username = this.user.username;
  }
  task.username = this.username;
    // - is reserved as the get params separator not needed for POST
    // let tempDate = task.ddate.replace(/-/g, "A");
    // task.ddate   = tempDate;

  let headers = new Headers()
  headers.set('Content-Type', CONTENT_TYPES.APP_JSON);
  let body = {
    'id': task.id,
    'description': task.description,
    'status': task.status,
    'priority': task.priority,
    'ddate': task.ddate,
    'category': task.category,
    'username': task.username,
    'notes': task.notes,
    'docuName' : task.docuName
  }
  return this.http.put(this.BASE_URL_TASK + '/update/', body, {headers: headers})
        .map(res => res.json());
}

updateAsset(asset) {
  if(this.username == undefined) {
    this.user = this.authService.loadUser();
    this.username = this.user.username;
  }
  asset.username = this.username;

  let headers = new Headers()
  headers.set('Content-Type', CONTENT_TYPES.APP_JSON)
  
  let body = {
    'id'          : asset.id,
    'symbol'      : asset.symbol,
    'notes'       : this.optionParam(asset.notes),
    'wallet'      : this.optionParam(asset.wallet),
    'count_owned' : this.optionParam(asset.count_owned),
    'staked'      : this.optionParam(asset.staked),
    'username'    :  asset.username
  }
  return this.http.put(this.BASE_URL_ASSSET + '/update/', body, {headers: headers})
   .map(res => res.json());
}


loadVersionInfo(pattern) {
  this.clear();
  this.user = this.authService.loadUser();
  this.username = this.user.username;
  let headers = new Headers();
  headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
  // headers.set('username', this.username)  CORS
  return this.http.get(this.BASE_URL_TASK + '/search/' + pattern + '-'+ this.username + '-include_notes', {headers: headers})
  .map(res => res.json());
  //catch(this.handleError);
}


// HERE WE USE TEXT-PLAIN and no custom headers to avoid CORS extra preflight request OPTIONS
loadAll() {
    this.clear();
    this.user = this.authService.loadUser();
    this.username = this.user.username;
    let headers = new Headers();
    headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
    // headers.set('username', this.username)  CORS
    return this.http.get(this.BASE_URL_TASK + '/tasklist/' + this.username, {headers: headers})
    .map(res => res.json());
    //catch(this.handleError);
}


loadWithOption(option) {
  if(option == 'ALL' || option == '' || option == null) {
    return this.loadAll();
  }
  this.clear();
  this.user = this.authService.loadUser();
  this.username = this.user.username;
  let headers = new Headers();
  headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
  // headers.set('username', this.username)  CORS
  return this.http.get(this.BASE_URL_TASK + '/tasklist/' + this.username + '-' + option, {headers: headers})
 .map(res => res.json());

}

exists(param) {
  if(param === undefined || param === 'undefined' || param === '' || param === "" || param === null)
    return false;
  return true;
}

handleError(error) {
  if(error.status === 404)
      return Observable.throw(new NotFoudError(error));
  else
  if(error.status === 400)
      return Observable.throw(new BadRequest(error));
  else
      return Observable.throw(new AppError(error));
}

clear() {
  this.user     = {};
  this.username = "";
}

optionParam(param):string {
  if(param == '' || param == null || param == undefined || param == 'undefined' || param == 0)
    return 'XXXXX';
  else
    return param;
}


//*************** ASSETS HANDLING ***************************/
BASE_URL_ASSSET   =  tempURL + '/assets';

loadStaticAssetsData() {
  this.clear();
  this.user = this.authService.loadUser();
  this.username = this.user.username;
  let headers = new Headers();
  headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
  // headers.set('username', this.username)  CORS
  return this.http.get(this.BASE_URL_ASSSET + '/assetlist/' + this.username, {headers: headers})
  .map(res => res.json());
}


/*===================================== NOT USED SWITCHING TO POST ===================================*/
createGET(task) {
  this.user = this.authService.loadUser();
  this.username = this.user.username;
  task.username = this.username;
  //Logger.info('DATAHUB::CREATE: ');
  let headers = new Headers()
  headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
  var PARAM_URL;

  // - is reserved as the get params separator
  let tempDate = task.ddate.replace(/-/g, "A");
  task.ddate   = tempDate;
  PARAM_URL = task.description + '-' + task.status + '-' + task.priority + '-' + task.ddate + '-' + task.category + '-' + task.username + '-' + task.notes;

  return this.http.get(this.BASE_URL_TASK + '/create/' + PARAM_URL , {headers: headers})
  .map(res =>
              {
                res.json();
              });
} // Adding notes 'Place Holder'

/*===================================== NOT USED SWITCHING TO PUT ===================================*/
updateAssetGET(asset) {
  if(this.username == undefined) {
    this.user = this.authService.loadUser();
    this.username = this.user.username;
  }
  asset.username = this.username;

  let headers = new Headers()
  headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
  var PARAM_URL = asset.id + '-' + asset.symbol + '-' + this.optionParam(asset.notes) 
                                                + '-' + this.optionParam(asset.wallet)
                                                + '-' + this.optionParam(asset.count_owned)
                                                + '-' + this.optionParam(asset.staked)
                                                + '-' + asset.username;
  
  return this.http.get(this.BASE_URL_ASSSET + '/update/' + PARAM_URL , {headers: headers})
   .map(res => res.json());

}

/*===================================== NOT USED SWITCHING TO PUT ===================================*/
updateGET(task) {
  if(this.username === 'undefined') {
    this.user = this.authService.loadUser();
    this.username = this.user.username;
  }
  task.username = this.username;
  //task.ddate = new Date();

     // - is reserved as the get params separator
     let tempDate = task.ddate.replace(/-/g, "A");
     task.ddate   = tempDate;

  let headers = new Headers()
  headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
  var PARAM_URL = task.id + '-' + task.description + '-' + task.notes + '-' + task.status + '-' + task.priority + '-' + task.ddate + '-' + task.category + '-' + task.docuName + '-' + task.username;

  return this.http.get(this.BASE_URL_TASK + '/update/' + PARAM_URL , {headers: headers})
   .map(res => res.json());
  //catch(this.handleError); // just passing a ref to the handleError function
}
delete(resource) {
  // For testing only
  // return Observable.throw(new AppError());
     return this.http.delete(this.BASE_URL_TASK + '/' + resource.id).
     catch(this.handleError);
} // delete()

} // End Class DatahubService
