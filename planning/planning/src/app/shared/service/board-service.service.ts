import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {RowModel} from '../entities/row-model';
import {environment} from '../../../environments/environment';
import {from, Observable} from 'rxjs';
import {first, map, switchMap, tap} from 'rxjs/operators';
import {TaskModel} from '../entities/task-model';
import {forEachComment} from "tslint";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
const rowModelPath = environment.rowModelPath;
const taskModelPath = environment.taskModelPath;
@Injectable({
  providedIn: 'root'
})
export class BoardServiceService {

  constructor(private firestore: AngularFirestore) { }



  addRow(rowModel: RowModel): Observable<RowModel> {
    return from(this.firestore.collection<RowModel>(rowModelPath).add(rowModel))
      .pipe(
        first(),
        tap(() => {
        }),
        switchMap(productDocument => {
          return from(
              this.firestore.doc<RowModel>(rowModelPath + '/' + productDocument.id)
                .get()
            ).pipe(
              map(documentData => {
                const data = documentData.data() as RowModel;
                data.rowId = productDocument.id;
                return data;
              })
            );
        })
      );
  }

  readRows(): Observable<RowModel[]> {
    return this.firestore
      .collection<RowModel>(rowModelPath)
      // This will return an Observable
      .snapshotChanges()
      .pipe(
        map(actions => {
          // actions is an array of DocumentChangeAction
          return actions.map(action => {
            const data = action.payload.doc.data() as RowModel;
            return {
              name: data.name,
              task: data.task,
              rowId: action.payload.doc.id
            };
          });
        })
      );
  }

  addTask(row: RowModel, task: TaskModel): Observable<TaskModel> {
    return from(this.firestore.collection<TaskModel>(taskModelPath).add(task))
      .pipe(
        first(),
        tap(() => {
        }),
        switchMap(productDocument => {
          return from(
            this.firestore.doc<TaskModel>(taskModelPath + '/' + productDocument.id)
              .get()
          ).pipe(
            map(documentData => {
              const data = documentData.data() as TaskModel;
              data.taskId = productDocument.id;
              if (row.task) {
               row.task[row.task.length] = {taskId: data.taskId};
              } else {
                row.task = [{taskId: data.taskId}];
              }
              this.updateRow(row);
              return data;
            })
          );
        })
      );
  }
  // used to update rows
  updateRow(rowModel: RowModel) {
    try {
      this.firestore.collection(rowModelPath).doc(rowModel.rowId).update(
        {
          task: rowModel.task
        }
      );
    } catch (e) {
    }
  }
  // Get task by id + snapshotchange so you will get update if something change.
  readTaskById(taskId: string): Observable<TaskModel> {
    return this.firestore
      .collection<TaskModel>(taskModelPath)
      // This will return an Observable
      .snapshotChanges()
      .pipe(
        map(actions => {
          // actions is an array of DocumentChangeAction

            const action = actions.find(test => test.payload.doc.id === taskId);
            const data = action.payload.doc.data() as TaskModel;
            data.taskId = action.payload.doc.id;
            return data;
        })
      );
    /*
    return  this.firestore.doc<TaskModel>(taskModelPath + '/' + taskId)
      .get()
      .pipe(
        first(),
        tap(() => {
        }),
        switchMap(productDocument => {
          if (!productDocument || !productDocument.data()) {
            throw new Error('Task not found');
          } else {
            return from(
              this.firestore.doc<TaskModel>(taskModelPath + '/' + taskId)
                .get()
            ).pipe(
              map(() => {
                const data = productDocument.data() as TaskModel;
                data.taskId = productDocument.id;
                return data;
              })
            );
          }
        })
      );*/
  }

  deleteRow(rowModelId: string): Observable<RowModel> {
    return this.firestore.doc<RowModel>(rowModelPath + '/' + rowModelId)
      .get()
      .pipe(
        first(),
        switchMap(productDocument => {
          if (!productDocument || !productDocument.data()) {
            throw new Error('Row is not found');
          } else {
            return from(
              this.firestore.doc<RowModel>(rowModelPath + '/' + rowModelId)
                .delete()
            ).pipe(
              map(() => {
                const data = productDocument.data() as RowModel;
                data.task.forEach( task => {
                  this.deleteTask(task.taskId, null).subscribe();
                });
                data.rowId = productDocument.id;
                return data;
              })
            );
          }
        })
      );
  }
  deleteTask(taskId: string, rowModel: RowModel): Observable<TaskModel> {
    if (rowModel) {
      rowModel.task = rowModel.task.filter(item => item.taskId !== taskId);
      this.updateRow(rowModel);
    }
    return this.firestore.doc<TaskModel>(taskModelPath + '/' + taskId)
      .get()
      .pipe(
        first(),
        switchMap(productDocument => {
          if (!productDocument || !productDocument.data()) {
            throw new Error('task is not found');
          } else {
            return from(
              this.firestore.doc<TaskModel>(taskModelPath + '/' + taskId)
                .delete()
            ).pipe(
              map(() => {
                const data = productDocument.data() as TaskModel;
                data.taskId = productDocument.id;
                return data;
              })
            );
          }
        })
      );
  }

  // update task in database
  updateTask(taskModel: TaskModel): Observable<any> {
    try {
        return from(this.firestore.collection(taskModelPath).doc(taskModel.taskId).update(
        taskModel
      ));
    } catch (e) {
      console.log('Error: ' + e.message);
    }
  }
}
