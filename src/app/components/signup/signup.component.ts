import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { signup } from 'src/app/model/user.interface';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  constructor(private api:ApiService, private authService:AuthService){}
  formData:any;
  errors:{message:string,id:string}[] = [];
  loading = false
  ngOnInit(): void {
    this.formData = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
    })
  }
  signup(){
    if (this.formData.invalid) return this.addError('Invalid input, please check again!');
    this.loading = true
    this.api.doSignup(this.formData.value).subscribe({error:(err) =>{
        this.loading = false
        if (err.error.message) {
          this.addError(err.error.message)
        }
      },
      next:(value) =>{
        this.loading = false;
        if(value.status=='ok'){
          this.authService.setToken({acToken:value.data.token.accessToken,reToken:value.data.token.refreshToken})
        }else{
          this.addError(value.message)
        }
        console.log(value)
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
}
