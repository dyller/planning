import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComponent } from './task.component';
import {TaskInfomationComponent} from "./dialogs/task-infomation/task-infomation.component";

const routes: Routes = [{ path: '', component: TaskComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
