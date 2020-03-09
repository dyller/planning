import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FrontPageComponent} from "./front-page/front-page/front-page.component";


const routes: Routes = [{
  path: 'home',
  component: FrontPageComponent
},
  { path: 'user', loadChildren: () => import('./user/customers.module').then(m => m.CustomersModule) },
  { path: 'tasks', loadChildren: () => import('./task/task.module').then(m => m.TaskModule) },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
