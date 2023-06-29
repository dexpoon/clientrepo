import { Role } from '../common/containers';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../user/iuser';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { UserRoles, UserActivations } from '../common/containers';
import { CHILL, CHILL_TIME_OUT } from '../common/config';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['../common/component.css']
})
export class UserEditComponent implements OnInit {
  pageTitle = 'User Editing Console';
  userFullname:string;
  user: IUser;

  userEditForm = new FormGroup ({
    _id:              new FormControl('', Validators.required),
    name:             new FormControl('', Validators.required),  
    activationDate:   new FormControl('', Validators.required),
    deactivationDate: new FormControl('', Validators.required),
    username:         new FormControl('', Validators.required),
    email:            new FormControl('', Validators.required),
    role:             new FormControl('', Validators.required),     // IRole.name 
    business:         new FormControl('', Validators.required),   // IBusiness.name
    password:         new FormControl('', Validators.required),
    status:           new FormControl('', Validators.required)
    });
  

    constructor(private router: Router,
                private authService: AuthenticationService,
                private activatedRoute: ActivatedRoute) {
    }

  ngOnInit() {
    this.userFullname = this.authService.getUserFullName();
    this.activatedRoute.params.subscribe(params => {
        this.user                 = new IUser();
        this.user._id             = params['userKey'];
        this.user.name            = params['nameKey'];  
        this.user.email           = params['emailKey'];          
        this.user.username        = params['usernameKey'];
        this.user.password        = params['passwordKey'];
        this.user.activationDate  = params['activationDateKey'];
        this.user.deactivationDate= params['deactivationDateKey'];
        this.user.role            = params['roleKey'];
        this.user.business        = params['businesKey'];
        this.user.status          = params['status'];      // UserActivations
    });
  }

// ======================================= USER ROLES =================================================//
userRoles = UserRoles;
selectedRole = this.userRoles[0].name;
onSelectRole(roleId) {

  for(var i = 0; i < this.userRoles.length; i++) {
    if(roleId === this.userRoles[i].id) {
        this.selectedRole = this.userRoles[i].name;
        break;
    }  
  }
}

// ======================================= ACTIVATION TYPES =================================================//
userActivations = UserActivations;
selectedActivation = this.userActivations[0].name;
onSelectActivation(activationId) {

  for(var i = 0; i < this.userActivations.length; i++) {
    if(activationId === this.userActivations[i].id) {
        this.selectedActivation = this.userActivations[i].name;
        break;
    }  
  }
}

update() {
  var user = this.userEditForm.value;

  user.status    = this.selectedActivation;
  user.role      = this.selectedRole;

  this.authService.update(user).subscribe(data => {
        if (data.success) {
        this.userEditForm.setErrors({ failedUpdate: false , msg: data.msg });
        this.router.navigate(['/userlist']);
    }else {
        this.userEditForm.setErrors({ failedUpdate: true , msg: data.msg});
        this.router.navigate(['/userEdit']);
    }
  });

  CHILL(CHILL_TIME_OUT);  // block for 500 ms to allow the update to be avialble before
                         // the loadAll on th enext screen
  this.router.navigate(['/userlist']); 


} // update()

cancel() {
  this.router.navigate(['/userlist']);
}



_id() {
  return this.userEditForm.get('_id');
}

name() {
  return this.userEditForm.get('name');
}

activationDate() {
  return this.userEditForm.get('activationDate');
}

deactivationDate(){
  return this.userEditForm.get('deactivationDate');
}

username(){
  return this.userEditForm.get('username');
}

email(){
  return this.userEditForm.get('email');
}

role(){
  
  return this.userEditForm.get('role');
} 

business(){
  return this.userEditForm.get('business');
}

password(){
  return this.userEditForm.get('password');
}

status() {
  return this.userEditForm.get('status');
}


} // UserEditComponent
