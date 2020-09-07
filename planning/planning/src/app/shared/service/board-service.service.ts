import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {RowModel} from '../entities/row-model';
import {environment} from '../../../environments/environment';
import {from, Observable, throwError} from 'rxjs';
import {first, map, switchMap, tap} from 'rxjs/operators';
import {TaskModel} from '../entities/task-model';
import {forEachComment} from 'tslint';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {BoardModel} from '../entities/board-model';
import {ImageMetadata} from '../entities/image-metadata';
import {FileMetadata} from '../entities/file-metadata';
import {AngularFireStorage} from '@angular/fire/storage';
const rowModelPath = environment.rowModelPath;
const taskModelPath = environment.taskModelPath;
const boardModelPath = environment.boardModelPath;
const fileModelPath  = environment.fileModelPath;
@Injectable({
  providedIn: 'root'
})
export class BoardServiceService {

  constructor(private firestore: AngularFirestore,
              private fireStorage: AngularFireStorage) { }



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
      const taskId = [];
      rowModel.task.forEach(task => {
        taskId.push({taskId: task.taskId});
      });
      this.firestore.collection(rowModelPath).doc(rowModel.rowId).update(
        {
          task: taskId
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
            if (action && action.payload) {
              const data = action.payload.doc.data() as TaskModel;
              data.taskId = action.payload.doc.id;
              return data;
            } else {
              return null;
            }

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
// create new board in firebase collection it returb boardmodel with id.
  createNewBoard(board: BoardModel): Observable<BoardModel> {
    return from(this.firestore.collection<BoardModel>(boardModelPath).add(board))
      .pipe(
        first(),
        tap(() => {
        }),
        switchMap(productDocument => {
          return from(
            this.firestore.doc<BoardModel>(boardModelPath + '/' + productDocument.id)
              .get()
          ).pipe(
            map(documentData => {
              const data = documentData.data() as BoardModel;
              data.boardId = productDocument.id;
              return data;
            })
          );
        })
      );
  }
// Return all board from database.
  readBoards(): Observable<BoardModel[]> {
    return this.firestore
      .collection<BoardModel>(boardModelPath)
      // This will return an Observable
      .snapshotChanges()
      .pipe(
        map(actions => {
          // actions is an array of DocumentChangeAction
          return actions.map(action => {
            const data = action.payload.doc.data() as BoardModel;
            data.boardId = action.payload.doc.id;
            return data;
          });
        })
      );
  }

  deleteBoard(boardId: string): Observable<BoardModel> {
    return this.firestore.doc<BoardModel>(boardModelPath + '/' + boardId)
      .get()
      .pipe(
        first(),
        switchMap(productDocument => {
          if (!productDocument || !productDocument.data()) {
            throw new Error('Board is not found');
          } else {
            return from(
              this.firestore.doc<RowModel>(boardModelPath + '/' + boardId)
                .delete()
            ).pipe(
              map(() => {
                const data = productDocument.data() as BoardModel;
                data.row.forEach( row => {
                  this.deleteRow(row.rowId).subscribe();
                });
                data.boardId = productDocument.id;
                return data;
              })
            );
          }
        })
      );
  }

  updateBoard(boardData: BoardModel, imageMeta: ImageMetadata): Observable<any> {
    if (imageMeta && imageMeta.fileMeta
      && imageMeta.fileMeta.name && imageMeta.fileMeta.type &&
      (imageMeta.imageBlob || imageMeta.base64Image)) {
      return from(this.firestore.collection<FileMetadata>(fileModelPath).add(imageMeta.fileMeta).then( file => {
        const base64EncodedImageString = imageMeta.base64Image.replace(/^data:image\/\w+;base64,/, '');
        this.fireStorage.ref('image/' + file.id).put(imageMeta.imageBlob).then( image => {
          boardData.imageId = file.id;
          this.firestore.collection(boardModelPath).doc(boardData.boardId).update(
            boardData
          ).then(r => {});
        });
      }));
    } else {
      return throwError('You need better metadata');
    }
  }

  imageFile(imageId: string): Observable<any> {
    return this.fireStorage.ref('image/' + imageId)
      .getDownloadURL();
  }
}
