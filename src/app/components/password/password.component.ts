import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PasswordValidator } from '../changepassword/password.validator';
import { Logger } from 'angular2-logger/core';


@Component({
  selector: 'passwords',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  passFormGrp;
  constructor(fb: FormBuilder, private logger: Logger) {

    this.passFormGrp = fb.group({
              oldpassword:  ["",
                            Validators.required,
                            PasswordValidator.validOldPassword],
              password :    ["", Validators.required],
              cfPassword:   ["", Validators.required]
              },
               { validator: PasswordValidator.passwordsShouldMatch });
  }

  get oldpassword() { return this.passFormGrp.get('oldpassword'); }
  get password()    { return this.passFormGrp.get('password'); }
  get cfPassword()  { return this.passFormGrp.get('cfPassword'); }

  onSubmit(userFormGroup) {
    this.logger.info("Submitted:\t" + userFormGroup);
  }


}
