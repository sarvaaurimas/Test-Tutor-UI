import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Curriculum, Roles, User } from 'src/app/auth/store/models/user.model';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import * as fromAuth from '../../store/reducers';
import * as AuthActions from '../../store/actions/auth.actions';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { AlertModalComponent } from 'src/app/core/components/alert-modal/alert-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  public matcher = new MyErrorStateMatcher();

  public curriculum = [Curriculum.AASL, Curriculum.AAHL];
  public roles = [Roles.STUDENT, Roles.TEACHER];

  private subscriptions: Subscription[] = [];

  constructor(
    private actions: Actions,
    private store: Store<fromAuth.AuthState>,
    private fb: FormBuilder, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      curriculum: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.subscriptions.push(
      this.actions.pipe(ofType(
        AuthActions.AuthActionTypes.RegisterSuccess,
        AuthActions.AuthActionTypes.RegisterFailure
      )).subscribe((action: { payload: User | HttpErrorResponse }) => {
        const data = action.payload.hasOwnProperty('data');
        const dialogRef = this.dialog.open(AlertModalComponent, { 
          disableClose: false,
          data: {
            title: data ? 'Success!' : 'Failed!',
            message: data ? 'Please check your email and complete registration' : action.payload
          }
        });
    
        dialogRef.afterOpened().subscribe(_ => {
          setTimeout(() => {
             dialogRef.close();
          }, 5000)
        })
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  login(): void {
    this.dialog.open(LoginModalComponent, { disableClose: true });
  }

  register(): void {
    this.store.dispatch(new AuthActions.Register({ data: this.registerForm.value }))
  }
}