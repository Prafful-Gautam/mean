import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
userAuth:boolean = false;
authSub:Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
   this.userAuth = this.authService.getIsUserAuth()
   this.authSub = this.authService.userAuthStatus().subscribe(res => {
      this.userAuth = res;
      console.log("=======>"+this.userAuth)
    })
  }
  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authSub.unsubscribe();
  }
}
