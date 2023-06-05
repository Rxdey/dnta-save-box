import axios, { type AxiosRequestConfig, type AxiosInstance, type RawAxiosRequestHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { type ResponseType } from './responseTypes';
import { Storage } from "@plasmohq/storage";
import { LOGIN_PAGE } from "./api.config";

axios.defaults.withCredentials = true;
const storage = new Storage();

export type ActionType = {
  [key: string]: string;
}

export interface AxiosCustomConfig<D = any> extends AxiosRequestConfig<D> {
  type?: string
}

const defaultInstance = <D>(config: AxiosCustomConfig<D>) => {
  const instance: AxiosInstance = axios.create(config);
  instance.interceptors.request.use(async (request: InternalAxiosRequestConfig<AxiosCustomConfig<D>>) => {
    const token = await storage.get('token');
    request.headers.set('Authorization', token);
    return request;
  });

  instance.interceptors.response.use((response: AxiosResponse<ResponseType<any>, AxiosCustomConfig<D>>) => {
    return response;
  }, (error) => {
    const status: number = error.request ? error.request.status : 0;
    const action: ActionType = {
      405: '登录信息获取失败', // 这里没token返回的是405
      404: '找不到请求地址',
      500: '系统异常',
      504: '请求超时，请检查网络环境并重试',
      401: '登录认证过期或失败，请重新登录'
    };
    console.log({ message: `ERROR: ${status} - ${action[status] || '系统异常'} >_<` });
    console.error(`接口:${error.config.url}  异常 --- ${error.message}`);
    if (status === 401) {
      window.open(LOGIN_PAGE, '_blank');
    }
    return error;
  });
  return instance;
};

export default defaultInstance;
