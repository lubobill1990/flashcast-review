import { User } from '@prisma/client';

export interface IUserService {
  getUser(): Promise<User | null>;
}

export interface IApiService {
  queueExtractJob(params: any): Promise<void>;
}
