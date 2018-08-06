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
  vopOrderBill: baseJs.init(vopOrderBill)
};

export default api;
