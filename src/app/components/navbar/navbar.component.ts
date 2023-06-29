import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthenticationService, private router: Router) {
  }

  dateTime: Date;
  oujdaTime: Date;
  ngOnInit() {
    this.dateTime = new Date();
    this.oujdaTime = new Date();
    this.oujdaTime.setHours(new Date().getHours() + 6);
  }

  updateTime() {
    this.dateTime = new Date();
    this.oujdaTime = new Date();
    this.oujdaTime.setHours(new Date().getHours() + 6);
  }

  logout() {
    this.authService.logout();       // does nothing..
    sessionStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }

}
