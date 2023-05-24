import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router, private http:HttpClient, private storeService:StoreService) { }

  authValidate(){
    if( localStorage.getItem('actoken') && localStorage.getItem('retoken') ){
      return true
    }
    // this.router.navigate(['/auth/login']); //can be removed, mostly used in authguard!
    return false
  }
  setToken(tokens:{acToken:string,reToken:string}){
    localStorage.setItem('actoken',tokens.acToken)
    localStorage.setItem('retoken',tokens.reToken)
    this.startSessTimout()
    this.router.navigate(['/']);
  }
  async authOut(){
    localStorage.clear()
    this.storeService.updateUserLoginStatus(false) ;
    this.userSettimeout = null;
    this.router.navigate(['/auth/login']); //auth guard will do this...
  }
  private userSettimeout:any;
  startSessTimout(){
    let actokenName = 'actoken';
    let authValidate = this.authValidate();
    
    if(authValidate){ 
      try {
        this.storeService.updateUserLoginStatus(authValidate) ;
        
        let acToken:any = localStorage.getItem(actokenName)
        let timeoutAC = ((JSON.parse(atob(acToken.split('.')[1]))).exp* 1000)-Date.now() ;
        
        if(timeoutAC>120641){//before 2 min
          this.userSettimeout = setTimeout(() => {
            this.refreshAccessToken();
          }, timeoutAC);
        }else{
          this.refreshAccessToken();
        }
      } catch (error) {
        this.authOut()
      }
    }
  }
  callbackCount=0
  refreshAccessToken(callback?:any){
    let retokenName = 'retoken';
    let actokenName = 'actoken';
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization':'Bearer '+localStorage.getItem(retokenName)
      })
    }
    
    this.http.get(`${environment.baseApiUrl}/auth/generate-token`, httpOptions).subscribe((data:any)=>{
      console.log(data);
      if(data.status=='ok' && data.authorization==true){
        localStorage.setItem(actokenName,data.data.token.accessToken)
        this.startSessTimout()
        if(callback&&(this.callbackCount<=1)){
          this.callbackCount++
          callback()
        }
      }else{
        this.authOut()
      }
    })
  }
}
