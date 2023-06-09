import axios from 'axios';
import jsCookie from 'js-cookie';


axios.defaults.withCredentials = true;

const defaultInstance = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use((request) => {
    const token = jsCookie.get('token');
    request.headers.set('Authorization', token);
    return request;
  });

  instance.interceptors.response.use((response) => response, (error) => {
    const status = error.request ? error.request.status : 0;
    const action = {
      405: '登录信息获取失败', // 这里没token返回的是405
      404: '找不到请求地址',
      500: '系统异常',
      504: '请求超时，请检查网络环境并重试',
      401: '登录认证过期或失败，请重新登录'
    };
    // console.log({ msg: `ERROR: ${status} - ${action[status] || '系统异常'} >_<` });
    // console.error(`接口:${error.config.url}  异常 --- ${error.message}`);
    // ElMessage.error(`ERROR: ${status} - ${action[status] || '系统异常'} >_<`);
    // 封装一层错误消息返回
    const errResponse = { data: { msg: `ERROR: ${status} - ${action[status] || '系统异常'} >_<`, success: false } };
    if (status === 401) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
    return errResponse;
  });
  return instance;
};

export default defaultInstance;
