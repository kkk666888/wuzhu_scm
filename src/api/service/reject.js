export default {
  query: {
    url: '/rejectApplyNote/queryPageRejectList'
  },
  feeType: {
    url: '/orders/query/finish/feeItems',
    method: 'get'
  },
  detail: {
    url: '/rejectApplyNote/queryRejectDetail',
    method: 'get'
  },
  confirmDelivery: {
    url: '/rejectApplyNote/confirmRejectDelivery'
  },
  invalid: {
    url: '/rejectApplyNote/cancelReject'
  },
  finish: {
    url: '/orders/finish/route'
  },
  apply: {
    url: '/rejectApplyNote/createRejectApplyNote'
  }
};
