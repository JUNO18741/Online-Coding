import style from './codespace.module.css';

import store from '@/store';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';

const Codespace = () => {
  const [codeState, codeDispatchers] = store.useModel('code');
  const onchange = (code) => {
    codeDispatchers.update({ code });
  };
  return (
    <div className={style.pre}>
      <CodeMirror
        // ref={editRef}
        // inputMode=''
        value={codeState.code}
        // height={this.state.editorHeight + 'px'}
        height="500px"
        width="100%"
        theme={'dark'}
        extensions={[python()]}
        onChange={onchange}
      />
      {/* {codeState.filePath ? (

      ) : (
        <div className={style.back}>请选择文件</div>
        // <img src="/back.jpg" />
      )} */}

      {/* <AceEditor
        // ref="editor"
        mode="python"
        theme="github"
        onChange={onchange}
        onBlur={onCodeBlur}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        enableBasicAutocompletion
        enableLiveAutocompletion
        enableSnippets
        style={{ width: '100%', height: '100%', fontSize: '25px' }}
        // onLoad={complete.bind(codeEditorAllList)}
      /> */}
    </div>
  );
};

export default Codespace;
