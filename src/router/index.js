import Vue from 'vue';
import Router from 'vue-router';
import _import from './importFile.js';

import authorityManageRoutes from './authorityManage.js'; //权限管理

import productManageRoutes from './productManage.js'; //商品管理

import giveBackRoutes from './giveBackManage.js'; //归还管理

import collectBaseRoutes from './collectBaseManage.js'; //集采-基础信息设定

import collectPurchaseRoutes from './collectPurchaseManage.js'; //集采-采购管理

import collectShipmentsRoutes from './collectShipmentsManage.js'; //集采-发货管理

import collectReceiveRoutes from './collectReceiveManage.js'; //集采-收货管理

import collectInStorageRoutes from './collectInStorageManage.js'; //集采-入库管理

import collectRepertoryRoutes from './collectRepertoryManage.js'; //集采-库存管理

import collectOutStorageRoutes from './collectOutStorageManage.js'; //集采-出库管理

import collectDeliveryRoutes from './collectDeliveryManage.js'; //集采-送货管理

import rejectRoutes from './rejectManage.js'; // 拒收管理

import purchaseManage from './purchaseManage.js'; // 采购管理

Vue.use(Router);

let routes = [
  {
    name: 'login',
    path: '/login',
    component: () => _import('normal/login/login'),
    meta: { authority: false, hidden: true }
  },
  {
    name: '401',
    path: '/401',
    component: () => _import('normal/401'),
    meta: { authority: false, hidden: true }
  },
  {
    name: '404',
    path: '/404',
    component: () => _import('normal/404'),
    meta: { authority: false, hidden: true }
  }
];

let authorityRoutes = {
  path: '/',
  name: 'adminSys',
  redirect: '/index',
  component: () => _import('auth/layout/layout'),
  meta: { authority: true },
  children: [
    {
      path: 'index', //首页
      name: 'index',
      component: () => _import('auth/index'),
      meta: { authority: true, routeTab: true, code: 'index' }
    }
  ]
};

authorityRoutes.children = [
  ...authorityRoutes.children,
  ...authorityManageRoutes,
  ...productManageRoutes,
  ...giveBackRoutes,
  ...collectBaseRoutes,
  ...collectPurchaseRoutes,
  ...collectDeliveryRoutes,
  ...collectShipmentsRoutes,
  ...collectReceiveRoutes,
  ...collectInStorageRoutes,
  ...collectOutStorageRoutes,
  ...collectRepertoryRoutes,
  ...rejectRoutes,
  ...purchaseManage
];

routes.push(authorityRoutes);
routes.push({ path: '*', redirect: '/404', meta: { hidden: true } });
const router = new Router({ routes: routes });

router.beforeEach((to, from, next) => {
  // console.log('to', to);
  // console.log('from', from);

  let app = router.app;
  let store = app.$store;
  if (to.meta.authority) {
    let resources = app.storage.session.getObj(app.common.storageKey.resources);
    let token = app.$storage.cookie.get('tokenStr');
    if (resources && token) {
      //页面刷新处理
      if (!store.state.main.isHandleData) {
        store.commit('set_permission_resources', resources);
      }
      //判断用户是否有权限
      let hasPermission = app.permission.hasMenuPermission(to, store.state.main.simpleMenus);
      if (hasPermission) {
        next();
      } else {
        next('/401');
      }
    } else {
      app.alert.toast('登录失效，请重新登录');
      next('/login?redirect=' + to.name);
    }
  } else {
    next();
  }
});

export default router;
