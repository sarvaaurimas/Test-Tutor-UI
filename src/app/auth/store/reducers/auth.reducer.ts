import { HttpErrorResponse } from '@angular/common/http';
import { AuthActionsUnion, AuthActionTypes } from './../actions/auth.actions';

export interface State {
  user?: { email: string };
  error?: HttpErrorResponse | { message: string } | any;
}

export const initialState: State = {
  user: null,
  error: null
};

export function reducer(state = initialState, action: AuthActionsUnion): State {
  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        ...initialState,
        user: {
          email: action.payload.email
        }
      };
    }

    case AuthActionTypes.LoginSuccess: {
      return {
        ...state,
        error: null
      };
    }

    case AuthActionTypes.LoginFailure: {
      return {
        ...initialState,
        error: action.payload
      };
    }

    case AuthActionTypes.Logout: {
      return initialState;
    }

    case AuthActionTypes.Register: {
      return {
        ...initialState
      };
    }

    case AuthActionTypes.RegisterSuccess: {
      return {
        ...state,
        error: null
      };
    }

    case AuthActionTypes.RegisterFailure: {
      return {
        ...initialState,
        error: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getUser = (state: State) => state.user;
export const getError = (state: State) => state.error;
