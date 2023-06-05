import axios from 'axios';
import jsCookie from 'js-cookie';
// import { ElMessage } from 'element-plus'

axios.defaults.withCredentials = true;

const defaultInstance = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use((request) => {
    const token = jsCookie.get('token');
    request.headers.set('Authorization', token);
    return request;
  });

  instance.interceptors.response.use((response) => {
    // const { code, message } = response.data || {};
    // if (!code) return response;
    // const action = {
    //   // '0000': '',
    //   // '9997': '',
    //   '9998': '系统异常',
    //   '9999': '身份验证失败'
    // };
    // if (action[code]) {
    //   ElMessage.error(message || action[code]);
    // }
    return response;
  }, (error) => {
    const status = error.request ? error.request.status : 0;
    const action = {
      405: '登录信息获取失败', // 这里没token返回的是405
      404: '找不到请求地址',
      500: '系统异常',
      504: '请求超时，请检查网络环境并重试',
      401: '登录认证过期或失败，请重新登录'
    };
    console.log({ message: `ERROR: ${status} - ${action[status] || '系统异常'} >_<` });
    console.error(`接口:${error.config.url}  异常 --- ${error.message}`);
    ElMessage.error(`ERROR: ${status} - ${action[status] || '系统异常'} >_<`);
    if (status === 401) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
    return error;
  });
  return instance;
};

export default defaultInstance;
