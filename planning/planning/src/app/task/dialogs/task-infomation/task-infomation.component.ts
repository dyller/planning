import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TaskModel} from "../../../shared/entities/task-model";
import {FormControl, FormGroup} from "@angular/forms";
import {BoardServiceService} from "../../../shared/service/board-service.service";

@Component({
  selector: 'app-task-infomation',
  templateUrl: './task-infomation.component.html',
  styleUrls: ['./task-infomation.component.scss']
})
export class TaskInfomationComponent implements OnInit {
  taskFormGroup: FormGroup;
  changed = false;
  constructor(
    public dialogRef: MatDialogRef<TaskInfomationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskModel,
    public boardServiceService: BoardServiceService) {

    this.taskFormGroup = new FormGroup({
      title: new FormControl(data.title)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  saveTaskInformation() {
    if ( this.changed) {
      const task: TaskModel = this.taskFormGroup.value;
      task.taskId = this.data.taskId;
      this.boardServiceService.updateTask(task);
    }
  }

  changeDone() {
    this.changed = true;
  }
}
