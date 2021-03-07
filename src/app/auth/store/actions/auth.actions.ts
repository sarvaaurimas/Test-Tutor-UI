import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Authenticate, UserApiResponse } from '../models/user.model';

export enum AuthActionTypes {
  Login = '[Auth] Login',
  LoginSuccess = '[Auth] Login Success',
  LoginFailure = '[Auth] Login Failure',
  LoginRedirect = '[Auth] Login Redirect',
  Logout = '[Auth] Logout',
  Register = '[Auth] Register',
  RegisterSuccess = '[Auth] Register Success',
  RegisterFailure = '[Auth] Register Failure'
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;
  constructor(public payload: string) {}
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LoginFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;
  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class Register implements Action {
  readonly type = AuthActionTypes.Register;
  constructor(public payload: UserApiResponse) {}
}

export class RegisterSuccess implements Action {
  readonly type = AuthActionTypes.RegisterSuccess;
  constructor(public payload: UserApiResponse) {}
}

export class RegisterFailure implements Action {
  readonly type = AuthActionTypes.RegisterFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type AuthActionsUnion = 
  | Login 
  | LoginSuccess 
  | LoginFailure 
  | LoginRedirect 
  | Logout 
  | Register
  | RegisterSuccess
  | RegisterFailure;
