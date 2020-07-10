import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignUp(form:NgForm){
    if(form.invalid){
      return;
    }
   this.authService.signUp(form.value.email, form.value.password)
  }
}
