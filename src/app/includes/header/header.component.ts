import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  menuToggle=false;
  userData:any = null
  apiBaseUrl = environment.baseApiUrl

  ngOnInit(): void {
    this.storeService.isUserLogged().subscribe((data)=>this.isUserLoggedIn = data)
    this.store.getUserData().subscribe((data)=>{
      this.userData = data.data.userData
    })
    
  }
  constructor(private storeService:StoreService, private store:StoreService) { 
  }
  isUserLoggedIn:boolean = false;
}
