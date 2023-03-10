import { baseConfig } from '@/config';
import { RequestIntercept } from '.';

const http = new RequestIntercept(baseConfig.service, 'user_service/');

/**
 * @description: 邮箱注册时用户获取验证码时调用该接口
 * @param {*} params
 * @return {*}
 */
export async function sendEmailAuthCode(params) {
  return http.get('send_email_authcode', { params });
}

/**
 * @description: 注册
 * @param {*} body:{
 * {
    "user_name": "cxy666666",  // 用户名
    "password": "as2esd9a7d9sdhi",   // 加密后的密码
    "is_email_register": true,  // 是否为邮箱注册, 若是则user_name为邮箱
    "email_authcode": "123456"  // 若为邮箱注册则这里是用户填写的邮箱验证码,若是普通注册则该字段置空
}}
 * @return {*}
 */
export async function register(body) {
  return http.post('user_register', { form: body });
}

/**
 * @description:登录
 * @param {*} body:{
    "user_name": "cxy666666",  // 用户名
    "password": "as2esd9a7d9sdhi"   // 加密后的密码
}
 * @return {*}
 */
export async function login(body) {
  return http.post('user_login', { form: body });
}
