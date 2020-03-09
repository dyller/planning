import { Injectable } from '@angular/core';
import {UserModel} from '../../shared/entities/user-model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';

// tslint:disable-next-line:variable-name
const collection_path = 'user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

// create user auth and user to database.
  createAccount(accountData: UserModel) {
    return this.firestore.collection(collection_path).doc(accountData.userId).set(accountData);
   // return this.firestore.collection(collection_path).add(accountData);
  }

  getUser(id: string) {
    return this.firestore.collection(collection_path).doc(id).get();
  }
}
