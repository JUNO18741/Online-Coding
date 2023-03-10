import { defineConfig } from '@ice/app';
import store from '@ice/plugin-store';
import request from '@ice/plugin-request';

export default defineConfig(() => ({
  plugins: [store(), request()],
  routes: {
    defineRoutes: (route) => {
      // 将 /about-me 路由访问内容指定为 about.tsx
      // 第一个参数是路由地址
      // 第二个参数是页面组件的相对地址（前面不能带 `/`），相对于 `src/pages` 目录
      route('/', 'Home.tsx');
      // // 嵌套路由的场景需要使用第三个 callback 参数来定义嵌套路由
      // route('/', 'layout.tsx', () => {
      //   route('/product', 'products.tsx');
      // });
    },
  },
  // proxy: {
  //   '/apiv': {
  //     target: 'http://101.42.19.243:8080',
  //     changeOrigin: true,
  //     pathRewrite: { '^/apiv': '' },
  //   },
  // },
}));
