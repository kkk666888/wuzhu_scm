import baseJs from './base.js';
import login from './service/login.js';
import logistic from './service/logistic.js';
import returnApplyNote from './service/returnApplyNote.js';
import orders from './service/orders.js';
import commdityType from './service/commdityType.js';
import vopApiAccess from './service/vopApiAccess.js';
import commdityBind from './service/commdityBind.js';
import baskstageManager from './service/baskstageManager.js';
import orderPurchase from './service/orderPurchase.js';
import vopOrderBill from './service/vopOrderBill.js';
import reject from './service/reject'; // 拒收管理
import instorageReceipt from './service/instorageReceipt'; // 入库单管理
import outstorageReceipt from './service/outstorageReceipt'; // 出库单管理
import qc from './service/qualityCheck'; // 质检

// 系统管理
import role from './systemManager/characterManager.js';
import source from './systemManager/sourceManager.js';
import department from './systemManager/departmentManager.js';
import user from './systemManager/userManager.js';
import area from './systemManager/areaManager.js';

const api = {
  login: baseJs.init(login),
  logistic: baseJs.init(logistic),
  returnApplyNote: baseJs.init(returnApplyNote),
  orders: baseJs.init(orders),
  commdityType: baseJs.init(commdityType),
  vopApiAccess: baseJs.init(vopApiAccess),
  commdityBind: baseJs.init(commdityBind),
  baskstageManager: baseJs.init(baskstageManager),
  orderPurchase: baseJs.init(orderPurchase),
  vopOrderBill: baseJs.init(vopOrderBill),
  reject: baseJs.init(reject),
  role: baseJs.init(role),
  source: baseJs.init(source),
  department: baseJs.init(department),
  user: baseJs.init(user),
  area: baseJs.init(area),
  receipt: baseJs.init(instorageReceipt),
  outstorageReceipt: baseJs.init(outstorageReceipt),
  qc: baseJs.init(qc)
};

export default api;
