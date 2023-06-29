import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../common/component.css']
})
export class ProfileComponent implements OnInit {
  user:Object
  pageTitle     = "User Profile";
  pageTitleEng  = "User Profile";

  constructor(private authService: AuthenticationService, private router: Router,
              private logger: Logger) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      this.logger.error(err);
      return false;
    });
  }

  clear() {
    this.user = null;
  }

}
