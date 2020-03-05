import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import {CreateUserComponent} from "./create-user/create-user.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";


@NgModule({
  declarations: [CustomersComponent,CreateUserComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ]
})
export class CustomersModule { }
