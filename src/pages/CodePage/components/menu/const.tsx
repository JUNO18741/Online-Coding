import { ProfileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import React from 'react';

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

// export const menuItems: MenuProps['items'] = [
//   getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
// ];

// data后端返回的目录数据,level递归层级
export const turnToMenuItemTree = function (data, level = 1) {
  // 递归跳出条件
  if (!data) return [];
  // isFile为true代表是文件
  // (!v.isFile && !/^\./.test(v.name)) 意思是过滤掉以.开头的.cache等目录文件
  // /\.py$/.test(v.name) 代表那些非目录文件，只留下.py结尾的文件
  const pythonFileOrDir = data
    .filter((v) => (!v.isFile && !/^\./.test(v.name)) || /\.py$/.test(v.name))
    .map((v) => {
      if (v.isFile) {
        return getItem(
          v.name,
          `${v.name}${level}`,
          <img src="./python.png" style={{ width: '14px', height: '14px' }} />,
        );
      } else if (v?.children.length === 0) {
        // 因为担心key值重复,所以使用 文件名+文件层级 作为key值
        // 因为通过递归的方式，map的key值也会重复，所以不能用key值
        return getItem(v.name, `${v.name}${level}`, <ProfileOutlined />);
      } else {
        return getItem(v.name, `${v.name}${level}`, <ProfileOutlined />, turnToMenuItemTree(v?.children, level + 1));
      }
    });
  return pythonFileOrDir;
};
