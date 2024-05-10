export interface IUser {
  id?: number;
  uuid?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface ISession {
  user?: IUser;
}
