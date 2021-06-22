import { AxiosPromise } from "axios";
export interface AxiosResponse extends AxiosPromise<T> {
  data: Record<string, unknown>;
  code: number;
  status: boolean;
}
