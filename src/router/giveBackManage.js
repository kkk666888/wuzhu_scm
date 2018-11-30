//归还管理
import _import from './importFile.js';

const giveBackRoutes = [
    {
        path: 'returnApplication', //归还申请单管理
        name: 'returnApplication',
        component: () => _import('auth/giveBack/returnApplication/returnApplication'),
        meta: { authority: true, routeTab: true, code: 'returnApplication' }
    },
    {
        path: 'qualityApplication', //质检申请单管理
        name: 'qualityApplication',
        component: () => _import('auth/giveBack/qualityApplication/qualityApplication'),
        meta: { authority: true, routeTab: true, code: 'qualityApplication' }
    },
    {
        path: 'order', //订单管理
        name: 'order',
        component: () => _import('auth/giveBack/order/order'),
        meta: { authority: true, routeTab: true, code: 'order' }
    },
]

export default giveBackRoutes;