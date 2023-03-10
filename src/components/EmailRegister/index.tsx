import { register } from '@/api/user';
import { Button, Form, Input, Modal, Space, Typography } from 'antd';
import Link from 'antd/lib/typography/Link';
import PubSub from 'pubsub-js';
import React, { useState } from 'react';
import style from './index.module.css';

const { Title } = Typography;

const EmailRegister: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    PubSub.publish('login');
  };
  const handleSubmit = async () => {
    await register();
  };
  return (
    <>
      <div className={style.main}>
        <Title level={2} className={style.title}>
          注册
        </Title>
        <div>
          <Form name="basic" onFinish={handleSubmit} layout="horizontal">
            <Form.Item
              name="stu_number"
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
              name="password"
              label="确认密码"
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
                  注册
                </Button>
                <Link target="_blank" style={{ color: 'black' }} onClick={handleLogin}>
                  立即登录
                </Link>
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
export default EmailRegister;
