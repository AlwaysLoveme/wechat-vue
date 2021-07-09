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
  // 此处允许get请求参数传递对象值 eg: const params = { user: {id: 1, name: 1}} axios.get('/api', {params})
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'indices' })
  },
});

const handlerRequest = async (config: AxiosRequestConfig) => {
  showLoading();
  // 默认content-type为formdata提交，所以此处针对post请求做参数序列化, 如果后台是以json方式接受参数，则去除此行代码
  if (!(config.data instanceof FormData) && config.method === "post") {
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
