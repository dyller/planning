import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersComponent } from './customers.component';
import {CreateUserComponent} from "./create-user/create-user.component";

const routes: Routes = [{ path: '', component: CustomersComponent }
, { path: 'new', component: CreateUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
