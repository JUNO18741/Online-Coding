import { initTerminal, initWs } from '@/api/webssh';
import { storage } from '@/config';
import store from '@/store';
import PubSub from 'pubsub-js';
import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import style from './index.module.css';

interface terminalClass {
  rendererType?: string;
  disableStdin?: boolean;
  cursorStyle?: string;
  convertEol?: boolean;
  cursorBlink?: boolean;
  theme?: {
    foreground: string;
    cursor: string;
  };
  windowsMode?: boolean;
  _core?: any;
  write: (e: string) => void;
  onKey: (e: any) => void;
  resize: (n1: number, n2: number) => void;
  loadAddon: (e: any) => void;
  open: (e: any) => void;
}

const Webterminal = () => {
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const [_, socketDispatchers] = store.useModel('socket');
  // const [, setId] = useState('');
  // const [ready, setReady] = useState(false);
  const Blob = async (blob, type) => {
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => {
        resolve(r.result);
      };
      try {
        r[`readAs${type || 'Text'}`](blob);
      } catch (e) {
        console.log(e);
      }
    });
  };
  const throttle = (fn, delay) => {
    let timer: NodeJS.Timeout | null = null;
    return function (this: any, ...rest) {
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        fn.call(this, ...rest);
        timer = null;
      }, delay);
    };
  };
  const initTerm = async (wsId: string) => {
    const socket = initWs(wsId);
    socketDispatchers.update({
      socket,
      id: wsId,
    });
    const term: terminalClass = new Terminal({
      rendererType: 'canvas',
      disableStdin: false,
      cursorStyle: 'block',
      convertEol: true,
      cursorBlink: true,
      theme: {
        foreground: '#ffffff',
        cursor: 'gray',
      },
      windowsMode: true,
    });
    window?.addEventListener(
      'resize',
      throttle((e) => {
        const width: any = terminalContainerRef.current?.clientWidth;
        const height: any = terminalContainerRef.current?.clientHeight;
        const cols =
          (width - term._core.viewport.scrollBarWidth - 15) /
          term._core._renderService._renderer.dimensions.actualCellWidth;
        const rows = height / term._core._renderService._renderer.dimensions.actualCellHeight - 1;
        socket.send(JSON.stringify({ resize: [parseInt(cols.toString(), 10), parseInt(rows.toString(), 10) + 1] }));
        term.resize(parseInt(cols.toString(), 10), parseInt(rows.toString(), 10) + 1);
      }, 50),
    );
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalContainerRef.current as HTMLElement);
    fitAddon.fit();
    term.onKey((e) => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
      if (ev.keyCode === 13) {
        socket.send(JSON.stringify({ data: `${e.key}` }));
        // term.prompt();
      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        term.write('\x7F');
        socket.send(JSON.stringify({ data: `${e.key}` }));
        if (term._core.buffer.x > 21) {
          // term.write('\b \b');
        }
      } else if (printable) {
        // term.write(e.key);
        socket.send(JSON.stringify({ data: `${e.key}` }));
      }
    });

    socket.onmessage = async (evt) => {
      const data: any = await Blob(evt.data, 'Text');
      // console.log('====================================');
      // console.log(data);
      // console.log('====================================');
      if (/^[\{].*[\}]$/.test(data)) {
        const res = JSON.parse(data);
        if (['delete', 'modify', 'create'].includes(res.event)) {
          PubSub.publish('listdir');
        }
        // if (res.event === 'modify' || res.event === 'create') {
        //   PubSub.publish('listdir');
        // }
      } else {
        term.write(data);
      }
    };
  };
  const getTermInfo = async () => {
    const data = await initTerminal();
    if (data?.id) {
      localStorage.setItem('containerId', data.id);
      await initTerm(data.id);
    }
  };
  useEffect(() => {
    if (localStorage.getItem(storage.containerIp)) getTermInfo();
  }, [localStorage.getItem(storage.containerIp)]);

  return <div ref={terminalContainerRef} className={style.terminal} />;
};

export default Webterminal;
