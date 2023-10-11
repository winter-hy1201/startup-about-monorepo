import { getToken } from '@/utils/auth';
import axios from 'axios';
import { Message } from 'element-ui';
import qs from 'qs';
import { CANCEL_REQUEST_CODE, CANCEL_REQUEST_MSG } from './common_code';
import { REQUEST_CANCEL_MAP } from './enum';
import * as ResCode from './networkStatusCode';

// 创建axios实例
const { SUCCESS_CODE, ERROR_CODE } = ResCode;

// 用于存储pending的请求（处理多条相同请求）
const pendingRequest = new Map();

// 生成request的唯一key
const generateRequestKey = (config = {}) => {
  // 通过url，method，params，data生成唯一key，用于判断是否重复请求
  // params为get请求参数，data为post请求参数
  const { url, method, params, data } = config;
  // console.log('generateRequestKey', url, method, params, data)
  return [url, method, qs.stringify(params), qs.stringify(data)].join('&');
};

// 根据http methods判断 是否需要取消请求
const getRequestMethodIsCancel = (config) => {
  const { method } = config;
  console.log(
    'hy getRequestMethodIsCancel',
    method,
    REQUEST_CANCEL_MAP.find((item) => item.key === method.toLowerCase()).value,
  );
  return REQUEST_CANCEL_MAP.find((item) => item.key === method.toLowerCase())
    .value;
};

// 将重复请求添加到pendingRequest中
const addPendingRequest = (config) => {
  const key = generateRequestKey(config);
  // console.log('hy config', config, getRequestMethodIsCancel(config))
  if (!pendingRequest.has(key) && !getRequestMethodIsCancel(config)) {
    // console.log('addPendingRequest', key)
    config.cancelToken = new axios.CancelToken((cancel) => {
      pendingRequest.set(key, cancel);
    });
  }
};

// 取消重复请求
const removePendingRequest = (config) => {
  const key = generateRequestKey(config);
  console.log('hy key', pendingRequest);
  if (pendingRequest.has(key) && !getRequestMethodIsCancel(config)) {
    // console.log('removePendingRequest', key)
    const cancelToken = pendingRequest.get(key);
    cancelToken(key); // 取消之前发送的请求
    pendingRequest.delete(key); // 请求对象中删除requestKey
  }
};

const service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 30000, // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    if (!getRequestMethodIsCancel(config)) {
      removePendingRequest(config);
      addPendingRequest(config);
    }
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
    if (!getRequestMethodIsCancel(res.config)) {
      removePendingRequest(res.config);
    }

    const { code, msg } = res?.data;
    if (code === ERROR_CODE) {
      Message.error(msg);
    } else {
      console.log('response ', res);
      return res?.data;
    }
  },
  (error) => {
    console.log('error', pendingRequest, error);
    if (!getRequestMethodIsCancel(error.config)) {
      removePendingRequest(error.config || {});
    }

    if (error?.code === CANCEL_REQUEST_CODE) {
      // console.error('Request canceled', pendingRequest.has('/system/dict/data/list&get&dictType=dz_girder_type&pageNum=1&pageSize=99999&'), error)
      // return ''
      return Promise.reject(CANCEL_REQUEST_MSG);
    } else {
      Message({
        message: '网络异常，请稍后重试',
        type: 'error',
        duration: 2000,
      });
      return Promise.reject(error);
    }
  },
);
export default service;
