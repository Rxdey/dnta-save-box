import defaultInstance from './interceptors';
import { BASE_URL } from "./api.config";
import useDragStore from '@/store/modules/useDragStore';

const BASE_CONFIG = {
  method: 'get',
  url: '/',
  timeout: 100000,
  baseURL: BASE_URL,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 请求封装
 * @param {Object} config 请求配置
 * @param {Object} data 参数
 */
const request = async (config, data) => {
  // 登录状态失效不进行请求

  const setting = { ...BASE_CONFIG, ...config };
  const headers = { ...BASE_CONFIG.headers, ...config.headers };
  setting.headers = headers;
  const { type, url, method } = config;
  if (!url) return { success: false };
  if (method && method.toUpperCase() === 'GET') {
    setting.params = data;
  } else {
    setting.data = data;
  }
  const instance = defaultInstance(setting);
  try {
    const res = await instance(setting);
    return res.data || { success: false, msg: '系统异常' };
  } catch (error) {
    // 此处把异常处理掉
    console.error(error);
    return error;
  }
};

export default request;
