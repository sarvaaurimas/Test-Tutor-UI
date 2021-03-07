import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../login/login.component';
import { ActivatedRoute } from '@angular/router';
import * as fromAuth from '../../store/reducers';
import * as AuthActions from '../../store/actions/auth.actions';
import { select, Store } from '@ngrx/store';
import { Authenticate } from '../../store/models/user.model';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { AuthenticateApiResponse } from './../../store/models/user.model';
import { getLoginPageError } from 'src/app/auth/store/reducers';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public matcher = new MyErrorStateMatcher();
  private subscriptions: Subscription[] = [];
  public error;

  constructor(
    private actions: Actions,
    private store: Store<fromAuth.AuthState>,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.subscriptions.push(
      this.actions.pipe(ofType(AuthActions.AuthActionTypes.LoginSuccess))
        .subscribe((action: { payload: AuthenticateApiResponse }) => {
          if (action.payload) {
            this.dialogRef.close();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }
    const returnUrl: string = this.route.snapshot.queryParams['returnUrl'] || '/home';
    const authenticate: Authenticate = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password.trim(),
      returnUrl: decodeURI(returnUrl)
    };
    this.store.dispatch(new AuthActions.Login(authenticate));
    this.error = this.store.select(getLoginPageError as any);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
