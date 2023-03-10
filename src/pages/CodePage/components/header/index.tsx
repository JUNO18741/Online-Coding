import { Button, Row, Col } from 'antd';
import style from './index.module.css';
import '~antd/dist/antd.less';
import store from '@/store';
import { upload } from '@/api/webssh';

function CodeHeader() {
  const [socketState] = store.useModel('socket');
  const [codeState] = store.useModel('code');
  const handleRun = async () => {
    const { code, filePath } = codeState;
    await upload({ to: filePath, file: new Blob([code], { type: 'text/python' }) });
    socketState.socket?.send(JSON.stringify({ data: `python3 ${filePath}` }));
    socketState.socket?.send(JSON.stringify({ data: '\r' }));
  };
  return (
    <div>
      <Row className={style.box}>
        <Col span={11} offset={1}>
          {codeState.filename}
        </Col>
        <Col span={3}>{/* <span className={style.projectname}>ProjectName</span> */}</Col>
        <Col span={6} />
        <Col span={3} className={style.middle}>
          <Button type="primary" shape="round" size="small" onClick={handleRun}>
            运行
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default CodeHeader;
