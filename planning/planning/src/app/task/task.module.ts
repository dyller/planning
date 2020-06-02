import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from "@angular/material/menu";
import { DialogRowDeleteComponent } from './dialogs/dialog-row-delete/dialog-row-delete.component';
import {MatDialogModule} from "@angular/material/dialog";
import { TaskInfomationComponent } from './dialogs/task-infomation/task-infomation.component';


@NgModule({
  declarations: [TaskComponent, DialogRowDeleteComponent, TaskInfomationComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule
  ]
})
export class TaskModule { }
