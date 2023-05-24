import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { signup } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }
  httpOptions = {
    headers:new HttpHeaders({
      'content-type':'application/json'
    })
    
  }
  doLogin(params:{email:string, password:string}):Observable<any>{
    return this.http.post(environment.baseApiUrl+'/auth/login', params, this.httpOptions)
  }
  doSignup(params:signup):Observable<any>{
    return this.http.post(environment.baseApiUrl+'/auth/signup', params, this.httpOptions)
  }
  fetchUserData():Observable<any>{
    return this.http.get(environment.baseApiUrl+'/userdata', this.httpOptions)
  }
  updateUserProfile(params:any):Observable<any>{
    return this.http.post(environment.baseApiUrl+'/updateUserProfile', params, this.httpOptions)
  }

  uploadAvatar(data:any):Observable<any>{
    let httpOptions = {
      headers:new HttpHeaders({
        'content-type':'multipart/form-data'
      })
    }
    
    return this.http.post(environment.baseApiUrl+'/setAvatar',data, httpOptions)
  }
}
