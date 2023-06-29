"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var bad_request_1 = require("../components/error/bad-request");
var not_found_error_1 = require("../components/error/not-found-error");
var app_error_1 = require("../components/error/app-error");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/observable/throw");
var content_config_1 = require("../content.config");
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
var DatahubService = /** @class */ (function () {
    function DatahubService(BASE_URL_NOT_USED, http, authService, logger) {
        this.BASE_URL_NOT_USED = BASE_URL_NOT_USED;
        this.http = http;
        this.authService = authService;
        this.logger = logger;
        this.className = "DatahubService";
        this.BASE_URL_TASK = tempURL + '/tasks';
        //*************** ASSETS HANDLING ***************************/
        this.BASE_URL_ASSSET = tempURL + '/assets';
    } // constructor
    // HERE WE USE TEXT-PLAIN and no custom headers to avoid CORS extra preflight request OPTIONS
    DatahubService.prototype.loadAll = function () {
        this.clear();
        this.user = this.authService.loadUser();
        this.username = this.user.username;
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        // headers.set('username', this.username)  CORS
        return this.http.get(this.BASE_URL_TASK + '/tasklist/' + this.username, { headers: headers })
            .map(function (res) { return res.json(); });
        //catch(this.handleError);
    };
    DatahubService.prototype.loadWithOption = function (option) {
        if (option == 'ALL' || option == '' || option == null) {
            return this.loadAll();
        }
        this.clear();
        this.user = this.authService.loadUser();
        this.username = this.user.username;
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        // headers.set('username', this.username)  CORS
        return this.http.get(this.BASE_URL_TASK + '/tasklist/' + this.username + '-' + option, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    DatahubService.prototype.create = function (task) {
        this.user = this.authService.loadUser();
        this.username = this.user.username;
        task.username = this.username;
        //Logger.info('DATAHUB::CREATE: ');
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        var PARAM_URL;
        // - is reserved as the get params separator
        var tempDate = task.ddate.replace(/-/g, "A");
        task.ddate = tempDate;
        PARAM_URL = task.description + '-' + task.status + '-' + task.priority + '-' + task.ddate + '-' + task.category + '-' + task.username + '-' + task.notes;
        return this.http.get(this.BASE_URL_TASK + '/create/' + PARAM_URL, { headers: headers })
            .map(function (res) {
            res.json();
        });
    }; // Adding notes 'Place Holder'
    DatahubService.prototype.exists = function (param) {
        if (param === undefined || param === 'undefined' || param === '' || param === "" || param === null)
            return false;
        return true;
    };
    DatahubService.prototype.update = function (task) {
        if (this.username === 'undefined') {
            this.user = this.authService.loadUser();
            this.username = this.user.username;
        }
        task.username = this.username;
        //task.ddate = new Date();
        // - is reserved as the get params separator
        var tempDate = task.ddate.replace(/-/g, "A");
        task.ddate = tempDate;
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        var PARAM_URL = task.id + '-' + task.description + '-' + task.notes + '-' + task.status + '-' + task.priority + '-' + task.ddate + '-' + task.category + '-' + task.username;
        return this.http.get(this.BASE_URL_TASK + '/update/' + PARAM_URL, { headers: headers })
            .map(function (res) { return res.json(); });
        //catch(this.handleError); // just passing a ref to the handleError function
    };
    DatahubService.prototype["delete"] = function (resource) {
        // For testing only
        // return Observable.throw(new AppError());
        return this.http["delete"](this.BASE_URL_TASK + '/' + resource.id)["catch"](this.handleError);
    }; // delete()
    DatahubService.prototype.handleError = function (error) {
        if (error.status === 404)
            return Observable_1.Observable["throw"](new not_found_error_1.NotFoudError(error));
        else if (error.status === 400)
            return Observable_1.Observable["throw"](new bad_request_1.BadRequest(error));
        else
            return Observable_1.Observable["throw"](new app_error_1.AppError(error));
    };
    DatahubService.prototype.clear = function () {
        this.user = {};
        this.username = "";
    };
    DatahubService.prototype.loadStaticAssetsData = function () {
        this.clear();
        this.user = this.authService.loadUser();
        this.username = this.user.username;
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        // headers.set('username', this.username)  CORS
        return this.http.get(this.BASE_URL_ASSSET + '/assetlist/' + this.username, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    DatahubService.prototype.updateAsset = function (asset) {
        if (this.username == undefined) {
            this.user = this.authService.loadUser();
            this.username = this.user.username;
        }
        asset.username = this.username;
        var headers = new http_1.Headers();
        headers.set('Content-Type', content_config_1.CONTENT_TYPES.TEXT_PLAIN);
        var PARAM_URL = asset.id + '-' + asset.symbol + '-' + this.optionParam(asset.notes)
            + '-' + this.optionParam(asset.wallet)
            + '-' + this.optionParam(asset.count_owned)
            + '-' + this.optionParam(asset.staked)
            + '-' + asset.username;
        return this.http.get(this.BASE_URL_ASSSET + '/update/' + PARAM_URL, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    DatahubService.prototype.optionParam = function (param) {
        if (param == '' || param == null || param == undefined || param == 'undefined' || param == 0)
            return 'XXXXX';
        else
            return param;
    };
    DatahubService = __decorate([
        core_1.Injectable()
    ], DatahubService);
    return DatahubService;
}()); // End Class DatahubService
exports.DatahubService = DatahubService;
