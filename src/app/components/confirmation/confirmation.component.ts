import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  success: boolean

 
  ConfirmationSuccess = "Success: Your Password has been changed!"
  ConfirmationFailure = "Sorry: Failed to change your password!"

  constructor(private activatedRoute: ActivatedRoute) {}
  
  
    ngOnInit() {
      this.activatedRoute.params.subscribe(params => {
        this.success = params['paramKey'];
     })
 

 
 
    }
  




}
