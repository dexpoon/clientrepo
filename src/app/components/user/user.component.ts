import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';
import { IUser } from './iuser';
import { Role, UserRoles } from '../common/containers';
import { FormGroup } from '@angular/forms/src/model';
import { Router } from '@angular/router';


@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['../common/component.css']
})
export class UserComponent implements OnInit {

userFullname;
pageTitleEng  = 'List of registered users';
pageTitle     = 'Users Management.. Requires Admin Rights';
todos         = '';

public ngOnDestroy(): void {
//  if (this.postsSubscription) {
//      this.postsSubscription.unsubscribe();
//  }
//  if (this.timerSubscription) {
//      this.timerSubscription.unsubscribe();
//  }
}

users: IUser[] = []
userRoles = UserRoles;

//public selectedRole: Role = UserRoles[1];
onSelectRole(user, roleId) {
  // First find the user that is selected on the template
  for(var i = 0; i < this.users.length; i++) {
    if(this.users[i].username === user.username) // username is unique
      break;
  }
  this.users[i].role = null;

  for(let j = 0; j < this.userRoles.length; j++) {
      if(this.userRoles[j].id === roleId)
        this.users[i].role = this.userRoles[j].name;
  }
}

roleName(user) {

    if(user.role === undefined) {
      user.role = this.userRoles[0];
    }
    return user.role;  // IRole.name
}

constructor(private router: Router, private authService: AuthenticationService) {

}

ngOnInit() {
  this.userFullname = this.authService.getUserFullName();
    this.authService.loadUsers().
                  subscribe( usersData => {
                      this.users = usersData
                      console.log(this.users)
    });

    this.sort('name');
} // ngOnInit()

// ============================ USER COUNT DISPLAY =====================================================//

deactivatedUserCount() {
  return 3;
}

deficientUserCount() {
  return 7;
}

liveUserCount() {
  return 18;
}

totalUserCount() {
  return this.users.length;
}

//======================================================================================================//



showUser(user) {

    this.router.navigate(['/userEdit',
      {
            'userKey':                user._id,
            'nameKey':                user.name,
            'emailKey':               user.email,
            'usernameKey':            user.username,
            'passwordKey':            user.password,
            'activationDateKey':      user.activationDate,
            'deactivationDateKey':    user.deactivationDate,
            'roleKey':                user.role,
            'businessKey':            user.business,
            'statusKey':              user.status
        }
    ]);
} // showUser()


 // SORTING HOOK ==================================
 path: string[] = ['user'];
 order: number = 1; // 1 asc, -1 desc;

 sort(prop: string) {
   this.path = prop.split('.')
   this.order = this.order * (-1); // change order
   return false; // do not reload
 }
//===========================================

clear() {
  this.users = [];
}

} //UserComponent
