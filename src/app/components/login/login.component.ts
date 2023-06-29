import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = "Login Comp Title"
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(private authService: AuthenticationService, private router: Router) { }
  get username() { return this.form.get('username') }
  get password() { return this.form.get('password') }

  login() {
    let user = this.form.value
    this.authService.login(user).subscribe(data => {
        if(data.success) {
          this.authService.storeUserData(data.token, data.user);
          this.form.setErrors({ invalidLogin: false , msg: data.msg })
          this.router.navigate(['/tasklist'])
        }else {
          this.form.setErrors({ invalidLogin: true , msg: data.msg})
          this.router.navigate(['/login'])
        }
    })
  }
}