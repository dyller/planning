import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FrontPageComponent } from './front-page/front-page/front-page.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CreateUserComponent } from './user/create-user/create-user.component';
import {MatSelectModule} from '@angular/material/select';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../environments/environment';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {NgxsModule} from '@ngxs/store';
import {BoardState} from './shared/ngxs-statemanangement/board-state';
import { BoardListComponent } from './board/board-list/board-list.component';
import {MatInputModule} from "@angular/material/input";
import { BoardUpdateComponent } from './board/board-update/board-update.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
    NavbarComponent,
    BoardListComponent,
    BoardUpdateComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSelectModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
        MatMenuModule,
        NgxsModule.forRoot(
            [BoardState]
        ),
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatDialogModule
    ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
