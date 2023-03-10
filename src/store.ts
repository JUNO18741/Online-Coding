import { createStore } from 'ice';
import user from '@/models/user';
import socket from '@/models/socket';
import code from '@/models/code';

const store = createStore(
  {
    user,
    socket,
    code,
  },
  {
    // options
  },
);

export default store;
