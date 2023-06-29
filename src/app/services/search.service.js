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
require("rxjs/add/operator/map");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
var content_config_1 = require("../content.config");
// SEARCH =====================================
var appConfig_1 = require("../config/appConfig");
var deployConfig_1 = require("../config/deployConfig");
var tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_LOCAL;
var CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_LOCAL;
if (deployConfig_1.DEPLOY_MODE.LOCAL == true) {
    tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_LOCAL;
    CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_LOCAL;
}
else if (deployConfig_1.DEPLOY_MODE.DOCKER == true) {
    tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_DOCKER;
    CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_DOCKER;
}
else if (deployConfig_1.DEPLOY_MODE.AWS == true) {
    tempURL = appConfig_1.CONFIGURABLE_URL.BASE_URL_AWS;
    CONFIG_GATEWAY = appConfig_1.CONFIGURABLE_URL.URL_GATEWAY_AWS;
}
var SearchService = /** @class */ (function () {
    function SearchService(http, authService) {
        this.http = http;
        this.authService = authService;
        this.BASE_URL_TASKS = tempURL + '/tasks';
        this.isChecked = false; // for notes search opt out selectable on task component
        this.user = this.authService.loadUser();
        this.username = this.user.username;
        console.log('SEARCH::SERVICE CONSTRUCTOR');
        this.isChecked = false;
    }
    SearchService.prototype.updateNotesOptOut = function (val) {
        this.isChecked = val;
    };
    // boolean not_notes, if true no task notes are seached
    SearchService.prototype.search = function (terms, source) {
        var _this = this;
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap(function (term) { return _this.searchEntries(term, _this.isChecked); });
    }; // END search()
    SearchService.prototype.searchEntries = function (term, no_notes) {
        this.clear();
        this.user = this.authService.loadUser();
        this.username = this.user.username;
        var URL_COMPOSED = '';
        if (term == 'Task' || term == 'Bill' || term == 'Aptm' || term == 'Info' || term == 'HowTo'
            || term == 'Critical' || term == 'Completed' || term == 'High') {
            no_notes = true; // means do not search notes when loading per category
        }
        console.log('SEARCH::SERVICE NO_NOTES VALUE: ' + no_notes);
        console.log('SEARCH::SERVICE TERM VALUE: ' + term);
        if (no_notes) {
            console.log('OTP OUT NOTES');
            if (term === '')
                URL_COMPOSED = this.BASE_URL_TASKS + '/tasklist/' + this.username;
            else
                URL_COMPOSED = this.BASE_URL_TASKS + '/search/' + term + '-' + this.username + '-' + 'exclude_notes';
        }
        else {
            console.log('INCLUDE NOTES');
            if (term === '')
                URL_COMPOSED = this.BASE_URL_TASKS + '/tasklist/' + this.username;
            else
                URL_COMPOSED = this.BASE_URL_TASKS + '/search/' + term + '-' + this.username + '-' + 'include_notes';
        } // END if-else no_notes
        console.log(' SEARCH::SERVICE  URL COMPOSED: ' + URL_COMPOSED);
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        return this.http
            .get(URL_COMPOSED, { headers: headers })
            .map(function (res) { return res.json(); });
    }; // END searchEntries()
    SearchService.prototype.clear = function () {
        this.query = '';
        this.user = null;
        this.username = '';
    };
    SearchService = __decorate([
        core_1.Injectable()
    ], SearchService);
    return SearchService;
}()); // SearchService
exports.SearchService = SearchService;
