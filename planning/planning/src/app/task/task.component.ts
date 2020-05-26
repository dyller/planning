import {Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormControl, FormGroup} from '@angular/forms';
// @ts-ignore
import {TaskModel} from '../shared/entities/task-model';
import {UserModel} from '../shared/entities/user-model';
import {createUrlResolverWithoutPackagePrefix} from '@angular/compiler';
import {RowModel} from '../shared/entities/row-model';
import {BoardServiceService} from '../shared/service/board-service.service';
import {MatMenuTrigger} from "@angular/material/menu";
import {stringify} from "querystring";
import {MatDialog} from "@angular/material/dialog";
import {DialogRowDeleteComponent} from "./dialogs/dialog-row-delete/dialog-row-delete.component";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  // Used for controlling so it only post one time.
  done = true;
  board: RowModel[] ;

  @ViewChild(MatMenuTrigger)
  contextMenuRow: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  constructor(private boardServiceService: BoardServiceService,
              public dialog: MatDialog) {

  }
  onContextMenuRow(event: MouseEvent, item: RowModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuRow.menuData ={'row': item};
    this.contextMenuRow.menu.focusFirstItem('mouse');
    this.contextMenuRow.openMenu();
  }

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


  ngOnInit(): void {
    this.getRows();
  }
// create new task
  saveTask(newTask: any, name: string) {
    if (name && newTask && newTask.target.value && this.done) {
      this.done = false;
      const index = this.board.findIndex(t => t.rowId === name);
      this.boardServiceService.addTask(this.board[index],
                                  {title: newTask.target.value}).subscribe(task => {

          if ( this.board[index].task) {
          const item = this.board[index];
          item.task[item.task.length] = task;
        } else {
          this.board[index].task = [task];
        }
          this.done = true;
      });
      newTask.target.value = '';
    }
  }
// add new row
  newRow(event: any) {

    if (event && event.target.value && this.done) {
       this.done = false;
       this.boardServiceService.addRow({name: event.target.value,
       task: []}).subscribe( rowData => {
         // does not look like i need this because it subscribe.
         /* const index = this.board.length;
            console.log('so');
          this.board[index] = {rowId: rowData.rowId,
                               name: rowData.name};*/
       event.target.value = '';
       this.done = true;
     });
    }
  }
  // read Rows.
  getRows() {
    this.boardServiceService.readRows().subscribe(rows => {
      for (let i = 0; i < rows.length ; i++) {
        for (let j = 0; j < rows[i].task.length; j++) {
          this.boardServiceService.readTaskById(rows[i].task[j].taskId).subscribe(taskResponse => {
            rows[i].task[j] = taskResponse;
          });
        }
      }

      this.board = rows;
    });
  }


  onRightClickRow(rowModel: RowModel) {
    if (rowModel) {
      const dialogRef = this.dialog.open(DialogRowDeleteComponent, {
        data: {name: rowModel.name}
      });
      dialogRef.afterClosed().subscribe(result => {
       if (result) {
         this.boardServiceService.deleteRow(rowModel.rowId).subscribe(rowModelResponse => {
           alert(`row "${rowModelResponse.name}" is deleted`);
         });
       }
      });
    } else {
      alert('Error happen contact support pls.');
    }
  }
}
