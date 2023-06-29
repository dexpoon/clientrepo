import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService:AuthenticationService,
              private router: Router, private logger: Logger) {}

  form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  get name() {
    return this.form.get('name')
  }

  get email() {
    return this.form.get('email')
  }

  get username() {
    return this.form.get('username')
  }

  get password() {
    return this.form.get('password')
  }

  register() {
   let user = JSON.stringify(this.form.value)

    this.authService.register(user).subscribe(
      data => {
          if(data.success) {
            this.logger.info('Registration successfull, now you can login')
            this.form.setErrors({ validRegistration: true, msg: 'Registration successfull, now you can login'})
            this.router.navigate(['/login'])
          }else {
            this.logger.error('Failed Registration, verify entries and try again')
            this.form.setErrors({ invalidRegistration: true, msg: 'Failed Registration, verify entries and try again'})
            this.router.navigate(['/register'])
          }
      })

      this.logger.info('New Registration for User:' + this.name);
  }

  cancel() {
    this.router.navigate(['/login']);
  }

}
