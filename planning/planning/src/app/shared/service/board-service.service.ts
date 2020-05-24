import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {RowModel} from '../entities/row-model';
import {environment} from '../../../environments/environment';
import {from, Observable} from "rxjs";
import {first, map, switchMap, tap} from "rxjs/operators";
const rowModelPath = environment.rowModelPath;
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
}
