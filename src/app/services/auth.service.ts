import { SearchService } from './search.service';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { TaskService } from './task.service';
import { CONTENT_TYPES } from '../content.config';


import { CONFIGURABLE_URL} from '../config/appConfig';
import { DEPLOY_MODE } from '../config/deployConfig';

let tempURL = CONFIGURABLE_URL.BASE_URL_LOCAL;
let CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_LOCAL;

if (DEPLOY_MODE.LOCAL === true) {
    tempURL = CONFIGURABLE_URL.BASE_URL_LOCAL;
    CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_LOCAL;
} else if (DEPLOY_MODE.DOCKER === true) {
    tempURL = CONFIGURABLE_URL.BASE_URL_DOCKER;
    CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_DOCKER;
} else if (DEPLOY_MODE.AWS === true) {
    tempURL = CONFIGURABLE_URL.BASE_URL_AWS;
    CONFIG_GATEWAY = CONFIGURABLE_URL.URL_GATEWAY_AWS;
}



@Injectable()
export class AuthenticationService {
// BASE_URL = 'http://localhost:3300/users'



BASE_URL = tempURL + '/users';


authToken: any;
user: any;
isDev: boolean;
isAdmin: boolean;

    constructor(private http: Http) {
        this.isDev = true; // Change to false before deployment
    }

    register(user) {
        const headers = new Headers();
        headers.append('Content-Type', CONTENT_TYPES.APP_JSON);
        return this.http.post(this.BASE_URL + '/register', user, {headers: headers})
        .map(res => res.json());
    }

    login(user) {
        if(user.username === 'administrator' || user.username === 'mouradix')
          this.isAdmin = true

        let headers = new Headers()
        headers.append('Content-Type', CONTENT_TYPES.APP_JSON)
        return this.http.post(this.BASE_URL + '/authenticate', JSON.stringify(user), {headers: headers})
        .map(res => res.json())
    }

    changePassword(pwds) {
      let headers = new Headers()
      headers.append('Content-Type', CONTENT_TYPES.APP_JSON)
      return this.http.post(this.BASE_URL + '/changepassword', pwds, {headers: headers})
      .map(res => res.json())
    }


    getProfile() {
        this.loadToken();
        let headers = new Headers();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', CONTENT_TYPES.APP_JSON);
        return this.http.get(this.BASE_URL + '/profile' ,{headers: headers})
        .map(res => res.json());
  }

    loadToken() {
        const token = localStorage.getItem('id_token');
        this.authToken = token;
    }

    loadUser() {
      this.user = JSON.parse(localStorage.getItem('user'));
      return this.user;
    }

    storeUserData(token, user){
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    }


      loggedIn(){
        return tokenNotExpired('id_token');
      }

      logout(){
        this.clear();
      }

      prepEndpoint(ep){
        if(this.isDev){
          return ep;
        } else {
          return 'http://localhost:8080/'+ep;
        }
      }


      loadUsers() {
        let headers = new Headers()
        headers.append('Content-Type', CONTENT_TYPES.APP_JSON)
        return this.http.get(this.BASE_URL + '/userlist', {headers: headers})
        .map(res => res.json());
    }

   isAdministrator() {
     return this.isAdmin
   }

   clear() {
    this.authToken  = null;
    this.user       = {};
    this.isAdmin    = false;
    localStorage.clear();
    }

    getUserFullName () {
      this.user = JSON.parse(localStorage.getItem('user'));
      return this.user.name;
    }


    update(user) {

      // - is reserved as the get params separator
      if (user.activationDate !== undefined) {
          let tempADate         = user.activationDate.replace(/-/g, "A");
          user.activationDate  = tempADate;
      }

      if(user.deactivationDate !== undefined) {
          let tempDDate         = user.deactivationDate.replace(/-/g, "A");
          user.deactivationDate  = tempDDate;
      }

      let headers = new Headers()
      headers.set('Content-Type', CONTENT_TYPES.TEXT_PLAIN);
      var PARAM_URL = user._id + '-' + user.name + '-' + user.email + '-' + user.password +
                     '-' + user.role + '-' + user.business + '-' + user.activationDate + '-' +
                     user.deactivationDate + '-' + user.status + '-' + user.username;

      return this.http.get(this.BASE_URL + '/update/' + PARAM_URL , {headers: headers})
       .map(res => res.json());

    }
};
