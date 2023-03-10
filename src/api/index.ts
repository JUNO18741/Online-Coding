import { request } from 'ice';

interface IRequestData {
  params?: Record<string, any>;
  json?: Record<string, any>;
  form?: Record<string, any>;
}
interface RequestConfig {
  responseType?: string
}
export class RequestIntercept {
  prefix = '';
  url = '';
  data = {};
  constructor({ protocol, ip, port }, pre = '') {
    this.prefix = `${protocol}://${ip}:${port}/${pre}`;
  }
  formData(obj) {
    const formData = new FormData();
    Object.keys(obj).forEach((key) => {
      formData.append(key, obj[key]);
    });
    this.data = formData;
    return formData;
  }
  paramsData(obj) {
    let newUrl = `${this.url}?`;
    Object.keys(obj).forEach((key, i) => {
      newUrl = `${newUrl}${i === 0 ? '' : '&'}${key}=${obj[key]}`;
    });
    this.url = newUrl;
    return newUrl;
  }
  formatData(data: IRequestData) {
    const map = {
      params: (v) => this.paramsData(v),
      form: (v) => this.formData(v),
      json: (v) => {
        this.data = v;
        return v;
      },
    };
    Object.keys(data).forEach((type) => {
      map[type](data[type]);
    });
  }
  get(url: string, data?: IRequestData) {
    this.url = `${this.prefix}${url}`;
    data && this.formatData(data);
    return request.get(this.url, this.data);
  }
  post(url: string, data?: IRequestData, config?: any ) {
    this.url = `${this.prefix}${url}`;
    data && this.formatData(data);
    return request.post(this.url, this.data, config);
  }
}
