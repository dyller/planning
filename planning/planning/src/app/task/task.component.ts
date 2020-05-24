import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormControl, FormGroup} from '@angular/forms';
// @ts-ignore
import {TaskModel} from '../shared/entities/task-model';
import {UserModel} from '../shared/entities/user-model';
import {createUrlResolverWithoutPackagePrefix} from '@angular/compiler';
import {RowModel} from '../shared/entities/row-model';
import {BoardServiceService} from '../shared/service/board-service.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  done = true;
 board: RowModel[] ;

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  constructor(private boardServiceService: BoardServiceService) {

  }

  ngOnInit(): void {
    this.getRows();
  }
// create new task
  saveTask(newTask: any, name: string) {
    if (name && newTask && newTask.target.value) {
      const index = this.board.findIndex(t => t.name === name);
      if ( this.board[index].task) {
        const item = this.board[index];
        item.task[item.task.length] = {title: newTask.target.value};
      } else {
        this.board[index].task = [newTask.target.value];
      }
      newTask.target.value = '';
    }
  }
// add new row
  newRow(event: any) {

    if (event && event.target.value && this.done) {
       this.done = false;
       this.boardServiceService.addRow({name: event.target.value,
       task: []}).subscribe( rowData => {
       const index = this.board.length;
       this.board[index] = {rowId: rowData.rowId,
                            name: rowData.name};
       event.target.value = '';
       this.done = true;
     });
    }
  }
  // read Rows.
  getRows() {
    this.boardServiceService.readRows().subscribe(rows => {
      this.board = rows;
    });
  }


}
