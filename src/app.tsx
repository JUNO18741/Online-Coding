import { message } from 'antd';
import 'antd/dist/antd.css';
import { config, IAppConfig, runApp } from 'ice';
import { storage } from './config';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    type: 'browser',
  },
  request: {
    baseURL: config.baseURL,
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          const token = localStorage.getItem(storage.token) || '';
          if (token) {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
          }
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
      response: {
        onConfig: (response) => {
          // if (!response.data.success) {
          //   message.warning(response.data.message);
          //   return Promise.reject(response.data.message);
          // }
          return { ...response, data: response.data };
        },
        onError: (error) => {
          if (error.response?.data.message) {
            console.error(error.response);
            message.error(error.response.data.message);
          }
          if (error.response?.status === 401) {
            const { baseURI } = document;
            window.location.href = `${baseURI}login`;
          }
          // 请求出错：服务端返回错误状态码
          return Promise.reject(error);
        },
      },
    },
  },
};

runApp(appConfig);
