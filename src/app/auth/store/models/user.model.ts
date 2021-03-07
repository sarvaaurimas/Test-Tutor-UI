export interface Authenticate {
  email: string;
  password: string;
  returnUrl: string;
}

interface AuthenticatePrivate {
  token: string;
}

interface AuthenticatePublic {
  id: string;
}

export interface AuthenticateApiResponse {
  data: {
    private: AuthenticatePrivate;
    public: AuthenticatePublic;
  };
}

export interface UserApiResponse {
  data: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  curriculum: string;
  role: string
}

export enum Curriculum {
  AASL = 'AA SL',
  AAHL = 'AA HL'
}

export enum Roles {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ADMIN = 'Admin'
}