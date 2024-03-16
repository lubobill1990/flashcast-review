import { Axios } from "axios";
import { IApiService } from "./interface";

export class ApiService implements IApiService {
  constructor(private axios: Axios) {}

  async queueExtractJob(params: any) {
    this.axios.post("/api/process-video", params);
  }
}
