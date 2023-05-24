import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { Err404Component } from './components/err/err404/err404.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'settings', 
    children:[
      {path:'', redirectTo:'account', pathMatch:'prefix'},
      {path:'account', component:AccountComponent, canActivate:[AuthGuard]}
    ]
  },
  {path:'auth', children:[
    {path:'', redirectTo:'login', pathMatch:'prefix'},
    {path:'login', component:LoginComponent},
    {path:'signup', component:SignupComponent}
  ]},
  {path:'**', component: Err404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
