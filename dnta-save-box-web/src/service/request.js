import defaultInstance from './interceptors';
import { BASE_URL } from "./api.config";

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
  const setting = { ...BASE_CONFIG, ...config };
  const headers = { ...BASE_CONFIG.headers, ...config.headers };
  setting.headers = headers;
  const { type, url, method } = config;
  if (!url) return { code: '-1' };
  if (method && method.toUpperCase() === 'GET') {
    setting.params = data;
  } else {
    setting.data = data;
  }
  const instance = defaultInstance(setting);
  try {
    const res = await instance(setting);
    return res.data || { code: '-1' };
  } catch (error) {
    // 此处把异常处理掉
    console.error(error);
    return { code: '-1' };
  }
};

export default request;
