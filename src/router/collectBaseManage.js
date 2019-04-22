//集采-基础信息管理
import _import from './importFile.js';

const collectBaseRoutes = [
    {
        path: 'collectProductSku', //集采商商品SKU操作
        name: 'collectProductSku',
        component: () => _import('auth/collect/collectProductSku/collectProductSku'),
        meta: { authority: true, routeTab: true, code: 'collectProductSku' }
    },
    {
        path: 'collectProviderAmount', //集采商账户余额查询
        name: 'collectProviderAmount',
        component: () => _import('auth/collect/collectProviderAmount/collectProviderAmount'),
        meta: { authority: true, routeTab: true, code: 'collectProviderAmount' }
    },
]

export default collectBaseRoutes;