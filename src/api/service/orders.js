export default {
  getList: {
    url: 'api/scm/orders',
    method: 'get'
  },
  finish: {
    url: 'api/scm/orders/finish',
    method: 'get'
  },
  delay: {
    url: 'api/scm/orders/delay'
  },
  status: {
    url: 'api/scm/orders/status',
    method: 'get'
  },
  buyOut: {
    hostName: 'core',
    url: 'wuzhu/order/buyOut/managementBuyout',
    method:'get'
  }
};
