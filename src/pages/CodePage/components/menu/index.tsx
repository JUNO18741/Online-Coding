import { download, download2, listDir, upload } from '@/api/webssh';
import type { UploadProps } from 'antd';
import { getContainerInfo } from '@/utils/index';
import { Col, Menu, Row, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { turnToMenuItemTree } from './const';
import store from '@/store';
import PubSub from 'pubsub-js';
import { useRequest } from 'ice';
import style from './index.module.css';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { storage } from '@/config';

function CodeMenu() {
  const [codeState, codeDispatchers] = store.useModel('code');
  const [socketState] = store.useModel('socket');
  const [count, setCount] = useState(1);
  const [toPath, setToPath] = useState('')
  const [path, setPath] = useState('')
  const props: UploadProps = {
    showUploadList: false,
    name: 'file',
    action: 'http://' + getContainerInfo().ip + ':' + getContainerInfo().port + '/api/v1/upload?id=' + localStorage.getItem(storage.containerId),
    headers: {
      authorization: 'authorization-text',
    },
    data: {
      to: toPath
    },
    beforeUpload(file) {
      setToPath('/root/' + file.name)
    },
    onChange(info) {
      if (info.file.status === 'done') {
        request()
      }
    },
  };
  // 这边返回的答案经过formatResult格式化过，具体逻辑可以进到turnToMenuItemTree这个函数里查看
  const { data, cancel, request } = useRequest(async () => listDir({ dir: '/root' }), {
    manual: false,
    formatResult: ({ data: { children: child } }) => {
      return turnToMenuItemTree(child);
    },
    onSuccess: () => { },
    onError: () => {
      setCount(count + 1);
      count === 3 && cancel(); // 如果出错默认轮询三次停止
    },
  });
  const onClick = async (value) => {
    setPath(value.key.substring(0, value.key.length - 1))
    // 切换文件的时候保存用户代码
    const { code, filePath } = codeState;
    if (filePath) {
      upload({ to: filePath, file: new Blob([code], { type: 'text/python' }) });
    }
    // 如果切换的目标文件是python文件的话，去远程下载文件
    if (value?.key?.includes('.py')) {
      const filename = value.key.slice(0, value.key.length - 1);
      const fullFilePath = value.keyPath
        .reverse()
        .reduce((pre, cur) => `${pre}/${cur.slice(0, cur.length - 1)}`, '/root');
      const codeTemp = await download({ filename: fullFilePath });
      codeDispatchers.update({ code: codeTemp, filePath: fullFilePath, filename });
    }
  };
  const initMainPy = async () => {
    const codeTemp = await download({ filename: '/root/main.py' });
    codeDispatchers.update({ code: codeTemp, filePath: '/root/main.py', fullFilePath: 'main.py' });
  };
  const downClick = () => {
    download2({ filename: '/root/' + path }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', path); 
      document.body.appendChild(link);
      link.click();
    })
  }
  useEffect(() => {
    console.log(123, socketState.socket);
    if (socketState.socket) initMainPy();
    PubSub.subscribe('listdir', () => {
      console.log(456);

      request();
    });
    return () => {
      PubSub.unsubscribe('listdir');
    };
  }, [socketState.socket]);
  return (
    <div>
      <Row className={style.menuHeader}>
        <Col span={5} offset={3}>
          文件
        </Col>
        <Col span={5} offset={3}>
          <Upload {...props}>
            <PlusOutlined style={{ fontSize: '14', color: '#fff' }} />
          </Upload>
        </Col>
        <Col span={4} offset={3}>
          <DownloadOutlined onClick={downClick} style={{ fontSize: '14' }} />
        </Col>
      </Row>
      <Menu
        onClick={onClick}
        style={{ width: 200, height: '95vh' }}
        defaultSelectedKeys={['main.py1']}
        theme="dark"
        mode="inline"
        items={data}
      />
    </div>
  );
}

export default CodeMenu;
