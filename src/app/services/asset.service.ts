import { Injectable } from '@angular/core';
import { DatahubService } from './datahub.service';
import { Http } from '@angular/http';
import { AuthenticationService } from './auth.service';


// AssetServce delegates all services to datahubService
@Injectable()
export class AssetService extends DatahubService {

    constructor(http: Http, authService: AuthenticationService) {
        super(null, http, authService, null);
    }

} // class AssetService

