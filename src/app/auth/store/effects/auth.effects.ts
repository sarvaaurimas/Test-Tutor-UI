import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as AuthActions from '../actions/auth.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AuthActionTypes } from '../actions/auth.actions';
import { Authenticate, UserApiResponse } from '../models/user.model';
import { AuthModule } from '../../auth.module';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService, private router: Router) {}

  @Effect()
  login$ = this.actions$.pipe(
    ofType<AuthActions.Login>(AuthActionTypes.Login),
    map(action => action.payload),
    exhaustMap((auth: Authenticate) => {
      return this.authService.login(auth.email, auth.password).pipe(
        map(user => {
          return new AuthActions.LoginSuccess(auth.returnUrl);
        }),
        catchError((error: HttpErrorResponse) => of(new AuthActions.LoginFailure(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType<AuthActions.LoginSuccess>(AuthActionTypes.LoginSuccess),
    map(action => action.payload),
    tap(payload => {
      this.router.navigateByUrl(decodeURI(payload));
    })
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType<AuthActions.LoginRedirect>(AuthActionTypes.LoginRedirect),
    map(action => action.payload),
    tap(returnUrl => this.router.navigate(['/auth/login'], { queryParams: { returnUrl: returnUrl } }))
  );

  @Effect()
  logoutRedirect$ = this.actions$.pipe(
    ofType<AuthActions.Logout>(AuthActionTypes.Logout),
    tap(() => {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    })
  );

  @Effect()
  register$ = this.actions$.pipe(
    ofType<AuthActions.Register>(AuthActionTypes.Register),
    map(action => action.payload),
    exhaustMap((payload: UserApiResponse) => {
      return this.authService.register(payload.data).pipe(
        map(user => {
          return new AuthActions.RegisterSuccess(payload);
        }),
        catchError((error: HttpErrorResponse) => of(new AuthActions.RegisterFailure(error)))
      );
    })
  );

  // @Effect()
  // register$ = this.actions$.pipe(
  //   ofType<AuthActions.Register>(AuthActionTypes.Register),
  //   map(action => action.payload),
  //   switchMap((payload: UserApiResponse) => {
  //     return this.authService.register(payload.data).pipe(
  //       switchMap((response: UserApiResponse) => [new AuthActions.RegisterSuccess(response)]),
  //       catchError((error: HttpErrorResponse) => of(new AuthActions.RegisterFailure(error)))
  //     );
  //   })
  // );
}
