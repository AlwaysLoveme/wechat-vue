import qs from "qs";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from "axios";
import { toast, hideLoading, showLoading } from "./f7base";

const cancelTokenSources = new Map(); // 定义cancel队列
const request: AxiosInstance = axios.create({
  baseURL: process.env.BASE_HTTP,
  timeout: 20000,
  method: "POST",
});

const handlerRequest = async (config: AxiosRequestConfig) => {
  showLoading();
  if (!(config.data instanceof FormData) && config.method === "POST") {
    config.data = qs.stringify(config.data);
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!config.hasOwnProperty("cancelToken")) {
    // 排除不需要cancel的请求
    const source = axios.CancelToken.source();
    cancelTokenSources.set(source.token, source.cancel); // 加入cancel队列
    config.cancelToken = source.token;
  }
  return config;
};
const handlerResponse = (res: AxiosResponse) => {
  hideLoading();
  const data = res.data;
  if (res.config.cancelToken) {
    cancelTokenSources.delete(res.config.cancelToken);
  }
  return data;
};
const handlerError = (err: AxiosError) => {
  hideLoading();
  if (axios.isCancel(err)) {
    return cancelTokenSources.delete(err.message);
  }
  toast(err.message);
};

request.interceptors.request.use(handlerRequest, handlerError);
request.interceptors.response.use(handlerResponse, handlerError);

export default request;
export { cancelTokenSources };
