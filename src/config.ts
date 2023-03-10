export default {
  // 默认配置
  default: {
    appId: '1',
    env: 'dev',
    baseURL: '',
  },
  development: {
    appId: '2',
    env: 'dev',
    baseURL: '',
  },
  production: {
    appId: '3',
    env: 'prod',
    baseURL: '',
  },
};
export const baseConfig = {
  service: {
    protocol: 'http',
    ip: '101.42.19.243',
    port: '8080',
  },
  ssh: {
    hostname: '127.0.0.1',
    port: '22',
    username: 'root',
    password: 'root',
  },
  containerDeadTime: 250000, // ms
  storage: {
    sshInfo: 'sshInfo',
    containerIp: 'containerIp',
    containerId: 'containerId',
    containerPort: 'containerPort',
    token: 'token',
  },
};
export const { storage } = baseConfig;
