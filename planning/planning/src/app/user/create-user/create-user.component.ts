import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {UserModel} from '../../shared/entities/user-model';
import {environment} from '../../../environments/environment';
import {UserService} from '../service/user.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateUserComponent implements OnInit {

  // Account
  accountFormGroup: FormGroup;
  // Username
  usernameMinLength: number = environment.usernameMinLength;
  usernameMaxLength: number = environment.usernameMaxLength;
  // Password
  passwordMinLength: number = environment.passwordMinLength;
  passwordMaxLength: number = environment.passwordMaxLength;
  // Email
  emailMinLength: number = environment.emailMinLength;
  emailMaxLength: number = environment.emailMaxLength;
  user: UserModel;
  constructor(
    private fb: FormBuilder,
    private us: UserService,
    private auth: AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.accountFormGroup = new FormGroup({
      userName: new FormControl(''),
      name: new FormControl(''),
      password: new FormControl(''),
      confrimPassword: new FormControl(''),
      email: new FormControl('')
    });
  }
  // Validate error from errorname and the form controller name, so less code
  public hasError = (controlName: string, errorName: string) => {
    return this.accountFormGroup.controls[controlName].hasError(errorName);
  }
  ngOnInit(): void {
    // different validater for fields
    this.accountFormGroup = this.fb.group({
      userName: ['', ],
      name: ['', ],
      email: ['', Validators.email],
      password: ['',  [ Validators.pattern(/[A-Z]/),     // Check if their is a capital Letter
        Validators.pattern(/\d/),               // Check if their is a number
        Validators.pattern(/[a-z]/) ]],         // Check if their is a lower case letter],
      confrimPassword: ['', [this.passwordValidator() ]]
    });
  }
  /*
  * validate match of password
  * */
  passwordValidator(): ValidatorFn  {
    return (control: AbstractControl): ValidationErrors | null => {
      // Read the password field
      const accountData = this.accountFormGroup.value;
      if (accountData.password !== control.value ) {
        // Return error with errorcode passwordMatch
        return { passwordMatch: true };
      }
      return null;
    };
  }
  // Create user with auth and add user to database
  createAccount() {
    if (this.accountFormGroup.invalid === false) {
      const accountData = this.accountFormGroup.value;
      return this.auth.createUserWithEmailAndPassword(accountData.email, accountData.password).then(user => {
        accountData.password = null;
        accountData.confrimPassword = null;
        accountData.userId = user.user.uid;
        this.us.createAccount(accountData).then( () => {
          this.router.navigate([''],
            {relativeTo: this.activatedRoute});
          console.log(accountData);
        }).catch(error => {
         console.log('Error happen: ' + error); });
    }); }
  }
}
