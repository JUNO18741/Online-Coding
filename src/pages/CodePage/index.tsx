import { checkContainer, createContainer } from '@/api/Container';
import { baseConfig, storage } from '@/config';
import Codespace from '@/pages/CodePage/components/codespace';
import CodeHeader from '@/pages/CodePage/components/header';
import CodeMenu from '@/pages/CodePage/components/menu';
import Webterminal from '@/pages/CodePage/components/xterm';
import store from '@/store';
import { clearContainerStorage } from '@/utils';
import Modal from 'antd/lib/modal';
import { useEffect, useState } from 'react';
import style from './index.module.css';

export default function CodePage() {
  const [socketState] = store.useModel('socket');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    const {
      code,
      data: { alive },
    } = await checkContainer();
    if (code !== 200 || !alive || alive === 'false') {
      setVisible(true);
      clearContainerStorage();
    }
  };
  const handleSubmit = async () => {
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
    }
  };
  useEffect(() => {
    const timerTemp = setInterval(() => {
      socketState.socket?.send(JSON.stringify({ data: 'ping' }));
    }, baseConfig.containerDeadTime);
    return () => {
      clearInterval(timerTemp);
    };
  }, [socketState.socket]);

  useEffect(() => {
    handleCheck();
  }, []);
  return (
    <div className={style.wrapper}>
      <div className={style.left}>
        <CodeMenu />
      </div>
      <div className={style.right}>
        <CodeHeader />
        <Codespace />
        <Webterminal />
      </div>
      <Modal
        visible={visible}
        cancelButtonProps={{ disabled: true }}
        cancelText="取消"
        okText="创建容器"
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <p>容器已经失活，请重新创建容器</p>
      </Modal>
    </div>
  );
}
