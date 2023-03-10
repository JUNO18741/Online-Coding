// src/models/code.ts

export default {
  // 定义 model 的初始 state
  state: {
    code: '',
    filePath: '/root/main.py',
    filename: 'main.py',
  },

  // 定义改变该模型状态的纯函数
  reducers: {
    update(prevState, payload) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },
};
