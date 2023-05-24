import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  userData:any = null
  formData:any;
  apiBaseUrl = environment.baseApiUrl
  errors:{message:string,id:string}[] = [];
  successMessage:string | null = null
  loading = false;
  imageLoading = true;
  constructor(private store:StoreService, private api:ApiService, private authService:AuthService){
    this.store.getUserData().subscribe((data)=>{
      this.userData = data.data.userData
      this.formData.patchValue({
        firstName: data.data.userData.firstName,
        lastName: data.data.userData.lastName,
        email: data.data.userData.email,
        phone: data.data.userData.phone,
      });
      
    })

    this.formData = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      email: new FormControl(null),
      phone: new FormControl(null),
    })
  }

  resetForm(){
    this.formData.patchValue({
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      phone: this.userData.phone,
    });
  }
  updateUserData(){
    this.loading = true
    this.api.updateUserProfile(this.formData.value).subscribe({error:(err) =>{
        this.loading = false
        if (err.error.message) {
          this.addError(err.error.message)
        }
      },
      next:(value) =>{
        this.loading = false;
        if(value.status=='ok'){
          this.successMessage = value.message;
          this.userData = {...this.userData,...this.formData.value}
          this.store.fetchUserData()
          setTimeout(() => {
            this.successMessage = null
          }, 8000);
        }else{
          this.addError(value.message)
        }
      },
    })
  }

  addError(err:string){
    let id = this.idGenerator()
    this.errors.push({id,message:err});
    setTimeout(() => {
      this.errors=this.errors.filter((Val)=>!(Val.id==id))
    }, 6000);
  }
  closeErr(id:string){
    this.errors=this.errors.filter((Val)=>!(Val.id==id))
  }
  idGenerator():string {
    var S4 = function():string {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
  logout(){
    this.authService.authOut()
  }

  updateAvatar(e:any){
    this.imageLoading = true;
    let thisform = new FormData();
    console.log(e.target.files[0]);
    
    thisform.append('userAvatar', e.target.files[0],e.target.files[0].name) 
    
    this.api.uploadAvatar(thisform).subscribe({next:(data)=>{
      if(data.status=='ok'){
        this.successMessage = data.message;
        this.userData = {...this.userData,...data.data.updated}
        this.imageLoading = false;

        setTimeout(() => {
          this.successMessage = null
        }, 8000);
        this.store.fetchUserData()
      }else{
        this.addError(data.message)
        this.imageLoading = false;
      }
      },error:(er)=>{
        this.addError(er.error.message)
        this.imageLoading = false;
      }
    })
   }
}
