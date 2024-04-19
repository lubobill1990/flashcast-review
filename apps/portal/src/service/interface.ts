import { User } from "@flashcast/db";

export interface IUserService {
  getUser(): Promise<User | null>;
}
