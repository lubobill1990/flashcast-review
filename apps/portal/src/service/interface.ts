import { User } from "@flashcast/db";

export interface IUserService {
  getUser(): Promise<User | null>;
}

export interface IApiService {
  queueExtractJob(params: any): Promise<void>;
}
