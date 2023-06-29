import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordValidator } from './password.validator';
import { Logger } from 'angular2-logger/core';


@Component({
  selector: 'changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['../common/component.css']
})
export class ChangepasswordComponent implements OnInit {

username: string
form: FormGroup;
pageTitle = "Change Password";

constructor(fb: FormBuilder, private authService:AuthenticationService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private logger: Logger) {

      this.form = fb.group({
        currentPassword : ['', Validators.required],
        newPassword :     ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword:  ['', Validators.required]
       }, {
          validator:     PasswordValidator.passwordsShouldMatch
        });
    }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.username = params['paramKey'];
   })
  }

  get currentPassword() {
    return this.form.get('currentPassword')
  }

  get newPassword() {
    return this.form.get('newPassword')
  }

  get confirmPassword() {
    return this.form.get('confirmPassword')
  }

  changePassword() {

      let pwds = {
                    username:         this.username,
                    newPassword:      this.newPassword.value
                  }

      this.authService.changePassword(pwds).subscribe((data) => {
        this.logger.info(data)
            this.router.navigate(['/passwordChangeConfirmation', {'paramKey': data.success} ]);
          })
  }

  cancel() {

        this.router.navigate(['/profile']);

  }

}
