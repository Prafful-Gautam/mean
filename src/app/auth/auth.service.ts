import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Auth} from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token:string;
 userAuthenticated = new Subject<boolean>();
 isUserAuth = false;
 private userId: string;
 tokenTimeout:any;
  constructor(private http: HttpClient) { }

  getToken(){
    return this.token;
  }
  getIsUserAuth(){
    return this.isUserAuth;
  }
  getUserId(){
    return this.userId;
  }
  userAuthStatus(){
    return this.userAuthenticated.asObservable();
  }
  signUp(email:string, password:string){
    const post:Auth = {email: email, password: password}
    return this.http.post('http://localhost:3000/app/user/signup',post)
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      })
  }

  login(email:string, password:string){
    const post:Auth = {email: email, password: password}
    return this.http.post<{token:string, expireIn:number, userId: string}>('http://localhost:3000/app/user/login',post)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
     
        if(token){
          const expireIn = res.expireIn
          this.tokenTimeout = setTimeout(() => {
            this.logout();
          }, expireIn * 1000)
          this.isUserAuth = true;
          this.userId = res.userId;
          this.userAuthenticated.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expireIn * 1000);

          this.saveAuthData(token, expirationDate, this.userId);
        }
      }, err => {
        console.log(err);
      })
  }
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
      return
    }
    const now = new Date();
    const expireIn = authInformation.expiration.getTime() - now.getTime();
    console.log('expires in=> '+expireIn);
    if(expireIn > 0){
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isUserAuth = true;
      setTimeout(()=> {
        this.logout()
      }, expireIn);
      this.userAuthenticated.next(true);
    }
  }
  logout(){
    this.token = null;
    this.userId = null;
    this.isUserAuth = false;
    this.userAuthenticated.next(false);
    clearTimeout(this.tokenTimeout);
    this.clearAuthData();
  }

  private saveAuthData(token:string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData(){
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expiration){
      return
    }
    return {
      token: token,
      expiration: new Date(expiration),
      userId: userId
    }
  }
}
