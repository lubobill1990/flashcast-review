export interface User {
  id?: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Session {
  user?: User;
}
