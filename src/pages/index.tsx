import Login from '@/components/Login';
import Email from '@/components/Login/email';
import Register from '@/components/Register';
import EmailRegister from '@/components/Register/email';
import { Card, Tabs } from 'antd';
import PubSub from 'pubsub-js';
import React, { useEffect, useState } from 'react';
import style from './index.module.css';
const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isEmail, setIsisEmail] = useState(true);

  const item = [
    {
      label: '通过邮箱',
      key: '1',
      children: <Card>{isEmail ? <Email /> : <EmailRegister />}</Card>,
    },
    {
      label: '通过账户密码',
      key: '2',
      children: <Card>{isLogin ? <Login /> : <Register />}</Card>,
    },
  ];
  useEffect(() => {
    PubSub.subscribe('register/email', () => {
      setIsisEmail(false);
    });
    PubSub.subscribe('login/email', () => {
      setIsisEmail(true);
    });
    PubSub.subscribe('register', () => {
      setIsLogin(false);
    });
    PubSub.subscribe('login', () => {
      setIsLogin(true);
    });
    return () => {
      PubSub.unsubscribe('register');
      PubSub.unsubscribe('login');
      PubSub.unsubscribe('register/email');
      PubSub.unsubscribe('login/email');
    };
  }, []);
  return (
    <div className={style.container}>
      <Tabs defaultActiveKey="1" centered items={item} />
    </div>
  );
};
export default Home;
