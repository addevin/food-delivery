import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private api:ApiService) { }
  private isUserLoggedIn = new BehaviorSubject(false);
  private userData = new Subject();
  
  public isUserLogged() : Observable<boolean> {
    this.fetchUserData();
    return this.isUserLoggedIn
  }
  
  public updateUserLoginStatus(v : boolean) {
    this.isUserLoggedIn.next(v);
  }
  
  public fetchUserData(){
    // if(!this.isUserLoggedIn)return;
     this.api.fetchUserData().subscribe((data)=>{
      this.userData.next(data)
     })
  }
  public getUserData():Observable<any>{
    return this.userData;
  }
  
}
