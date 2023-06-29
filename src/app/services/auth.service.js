"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var angular2_jwt_1 = require("angular2-jwt");
var content_config_1 = require("../content.config");
var appConfig_1 = require("../config/appConfig");
var deployConfig_1 = require("../config/deployConfig");
var tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_LOCAL;
var CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_LOCAL;
if (deployConfig_1.DEPLOY_MODE.LOCAL === true) {
    tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_LOCAL;
    CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_LOCAL;
}
else if (deployConfig_1.DEPLOY_MODE.DOCKER === true) {
    tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_DOCKER;
    CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_DOCKER;
}
else if (deployConfig_1.DEPLOY_MODE.AWS === true) {
    tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_AWS;
    CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_AWS;
}
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http) {
        this.http = http;
        // BASE_URL = 'http://localhost:3300/users'
        this.BASE_URL = tempURL + '/users';
        this.isDev = true; // Change to false before deployment
    }
    AuthenticationService.prototype.register = function (user) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', content_config_1.CONTENT_TYPES.APP_JSON);
        return this.http.post(this.BASE_URL + '/register', user, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthenticationService.prototype.login = function (user) {
        if (user.username === 'administrator' || user.username === 'mouradix')
            this.isAdmin = true;
        var headers = new http_1.Headers();
        headers.append('Content-Type', content_config_1.CONTENT_TYPES.APP_JSON);
        return this.http.post(this.BASE_URL + '/authenticate', JSON.stringify(user), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthenticationService.prototype.changePassword = function (pwds) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', content_config_1.CONTENT_TYPES.APP_JSON);
        return this.http.post(this.BASE_URL + '/changepassword', pwds, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthenticationService.prototype.getProfile = function () {
        this.loadToken();
        var headers = new http_1.Headers();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', content_config_1.CONTENT_TYPES.APP_JSON);
        return this.http.get(this.BASE_URL + '/profile', { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthenticationService.prototype.loadToken = function () {
        var token = localStorage.getItem('id_token');
        this.authToken = token;
    };
    AuthenticationService.prototype.loadUser = function () {
        this.user = JSON.parse(localStorage.getItem('user'));
        return this.user;
    };
    AuthenticationService.prototype.storeUserData = function (token, user) {
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    };
    AuthenticationService.prototype.loggedIn = function () {
        return angular2_jwt_1.tokenNotExpired('id_token');
    };
    AuthenticationService.prototype.logout = function () {
        this.clear();
    };
    AuthenticationService.prototype.prepEndpoint = function (ep) {
        if (this.isDev) {
            return ep;
        }
        else {
            return 'http://localhost:8080/' + ep;
        }
    };
    AuthenticationService.prototype.loadUsers = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', content_config_1.CONTENT_TYPES.APP_JSON);
        return this.http.get(this.BASE_URL + '/userlist', { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthenticationService.prototype.isAdministrator = function () {
        return this.isAdmin;
    };
    AuthenticationService.prototype.clear = function () {
        this.authToken = null;
        this.user = {};
        this.isAdmin = false;
        localStorage.clear();
    };
    AuthenticationService.prototype.getUserFullName = function () {
        this.user = JSON.parse(localStorage.getItem('user'));
        return this.user.name;
    };
    AuthenticationService.prototype.update = function (user) {
        // - is reserved as the get params separator
        if (user.activationDate !== undefined) {
            var tempADate = user.activationDate.replace(/-/g, "A");
            user.activationDate = tempADate;
        }
        if (user.deactivationDate !== undefined) {
            var tempDDate = user.deactivationDate.replace(/-/g, "A");
            user.deactivationDate = tempDDate;
        }
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        var PARAM_URL = user._id + '-' + user.name + '-' + user.email + '-' + user.password +
            '-' + user.role + '-' + user.business + '-' + user.activationDate + '-' +
            user.deactivationDate + '-' + user.status + '-' + user.username;
        return this.http.get(this.BASE_URL + '/update/' + PARAM_URL, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthenticationService = __decorate([
        core_1.Injectable()
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
;
