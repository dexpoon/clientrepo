import { Injectable } from '@angular/core';
import { DatahubService } from './datahub.service';
import { Http } from '@angular/http';
import { AuthenticationService } from './auth.service';


// TaskServce delegates all services to datahubService
@Injectable()
export class TaskService extends DatahubService {


    constructor(http: Http, authService: AuthenticationService) {
        super(null, http, authService, null);
    }


    //public tasksSubject = this.tasksSubject;


} // class TaskService

