//商品管理
import _import from './importFile.js';
const productManageRoutes = [
  {
    //待发货管理
    path: 'waitShipments',
    name: 'waitShipments',
    component: () => _import('auth/product/waitShipments/waitShipments'),
    meta: { authority: true, routeTab: true, code: 'waitShipments' }
  },
  {
    //入库管理
    path: 'inStorage',
    name: 'inStorage',
    component: () => _import('auth/product/inStorage/inStorage'),
    meta: { authority: true, routeTab: true, code: 'inStorage' }
  },
  {
    //已发货管理
    path: 'hadShipments',
    name: 'hadShipments',
    component: () => _import('auth/product/hadShipments/hadShipments'),
    meta: { authority: true, routeTab: true, code: 'hadShipments' }
  },
  {
    //库存管理
    path: 'stockManage',
    name: 'stockManage',
    component: () => _import('auth/product/stockManage/stockManage'),
    meta: { authority: true, routeTab: true, code: 'stockManage' }
  },
  {
    //入库单管理
    path: 'InStorageReceipt',
    name: 'InStorageReceipt',
    component: () => _import('auth/product/InStorageReceipt/InStorageReceipt'),
    meta: { authority: true, routeTab: true, code: 'InStorageReceipt' }
  }
];

export default productManageRoutes;
