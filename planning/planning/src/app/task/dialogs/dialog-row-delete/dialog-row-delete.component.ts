import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RowModel} from "../../../shared/entities/row-model";

@Component({
  selector: 'app-dialog-row-delete',
  templateUrl: './dialog-row-delete.component.html',
  styleUrls: ['./dialog-row-delete.component.scss']
})
export class DialogRowDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogRowDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RowModel) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit(): void {
  }

}
