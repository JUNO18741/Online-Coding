// src/models/user.ts
interface ISocketState {
  socket: WebSocket | null;
  id: string;
}

const socketStore = {
  // 定义 model 的初始 state
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  state: {
    socket: null,
    id: '',
  } as ISocketState,

  // 定义改变该模型状态的纯函数
  reducers: {
    update: (prevState, payload) => {
      return {
        ...prevState,
        ...payload,
      };
    },
  },
};
export default socketStore;
