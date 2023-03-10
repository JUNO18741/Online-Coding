import { createContainer } from '@/api/Container';
import { storage } from '@/config';
import { Button, Form, Input, message, Modal, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import style from './index.module.css';
import PubSub from 'pubsub-js';
import Link from 'antd/lib/typography/Link';
import { login } from '@/api/user';
// import type { FormInstance } from 'antd/es/form';

const { Title } = Typography;

const containerCreateInfo = {
  title: '容器创建中',
  content: <>由于新建容器需要一定的时间，请耐心等待</>,
};

const Login: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (val) => {
    console.log(val, 'val');
    // 登录
    const params = val
    const { code, data } = await login(params)
    console.log(code);
    console.log(data);
    if (code === 200) {
    // 创建容器
      const mo = modal.info(containerCreateInfo);
      setLoading(true);
      const { code, data } = await createContainer();
      setLoading(false);
      localStorage.setItem(storage.containerPort, data.code_port);
      localStorage.setItem(storage.containerIp, data.code_ip);
      if (code === 200) {
        // ice的路由机制是约定式路由然后并行加载路由组件
        // 登录页的时候就会把其他路由文件一起加载完成
        // 使用ice的history方法跳转，不会重新渲染CodePage页面
        // 但是这边CodePage页面就是需要重新渲染才能拿到数据......
        // 所以使用浏览器自带的location api
        location.replace('/CodePage');
        mo.destroy();
      }
      message.success('登录成功')
    }
  };
  // const submit = async (params) => {
  //   const { res } = await login(params)
  //   console.log(res);
  // }
  const hanldeRegister = () => {
    PubSub.publish('register/email');
  };
  return (
    <>
      <div className={style.main}>
        <Title level={2} className={style.title}>
          登录
        </Title>
        <div>
          <Form name="basic" onFinish={handleSubmit} layout="horizontal">
            <Form.Item
              name="user_name"
              label="账号"
              rules={[
                { required: true, message: '账号不能为空' },
                {
                  pattern: /^\w{8,15}$/,
                  message: '账号在8-15位内！',
                },
              ]}
            >
              <Input onChange={console.log} placeholder="请输入账号" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '密码不能为空' },
                {
                  pattern: /^\w{6,16}$/,
                  message: '密码在6-16位内！',
                },
              ]}
            >
              <Input type="password" onChange={console.log} placeholder="请输入密码" />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  登录
                </Button>
                <Link target="_blank" style={{ color: 'black' }} onClick={hanldeRegister}>
                  立即注册
                </Link>{' '}
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
      {contextHolder}
      {/* <Spin tip="Loading...">
        <Alert
          message="Alert message title"
          description="Further details about the context of this alert."
          type="info"
        />
      </Spin> */}
    </>
  );
};
export default Login;
