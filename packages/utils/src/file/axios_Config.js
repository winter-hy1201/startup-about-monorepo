import { getToken } from '@/utils/auth';
import axios from 'axios';
import { Message } from 'element-ui';

const service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 50000, // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = getToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// response拦截器
service.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    Message({
      message: '网络异常，请稍后重试',
      type: 'error',
      duration: 2000,
    });
    return Promise.reject(error);
  },
);
export const downloadFile = (resOpts = {}) => {
  const { url, type = 'get', data = '' } = resOpts;
  const queryArgs = {
    url,
    method: type,
    data,
    responseType: 'blob',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      withCredentials: true,
    },
  };
  return service(queryArgs);
};

export const uploadFileRequest = (resOpts = {}) => {
  const { url, type = 'post', data = '' } = resOpts;
  const queryArgs = {
    url,
    method: type,
    data,
    headers: {
      'Content-Type': 'multipart/form-data; charset=utf-8',
      withCredentials: true,
    },
  };
  return service(queryArgs);
};
