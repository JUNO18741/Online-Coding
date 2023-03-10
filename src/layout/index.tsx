import React, { FC } from 'react';
import { Provider } from 'react-redux';

const Entry: FC<any> = ({ children }) => {
  return (
    <React.StrictMode>
      {/* TODO 判断登录状态 */}
      <div>{children}</div>
    </React.StrictMode>
  );
};

export default Entry;
