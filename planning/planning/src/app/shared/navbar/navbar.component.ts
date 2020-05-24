import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserModel} from '../entities/user-model';
import * as firebase from 'firebase';
import {UserService} from '../../user/service/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: UserModel;
  constructor( private auth: AngularFireAuth,
               private userService: UserService,
               private router: Router,
               private activatedRoute: ActivatedRoute) {
    firebase.auth().onAuthStateChanged(users => {
      if (users) {
        this.userService.getUser(users.uid).subscribe(couldStoreUser => {
          const user = couldStoreUser.data();
          this.currentUser = {
           email: user.email,
            isAdmin: false,
            lastLogin: undefined,
            name: user.name,
            password: '',
           userName: user.userName
         };
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnInit(): void {

  }

  logout() {
    this.auth.signOut().then( () => {
      this.router.navigate([''],
        {relativeTo: this.activatedRoute}); }
    );
  }
}
