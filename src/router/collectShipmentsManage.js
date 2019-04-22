//集采-发货管理
import _import from './importFile.js';

const collectShipmentsRoutes = [
    {
        path: 'shipmentsSearch', //物主-集采商商品SKU操作
        name: 'shipmentsSearch',
        component: () => _import('auth/collectShipmentsManage/shipmentsSearch/shipmentsSearch'),
        meta: { authority: true, routeTab: true, code: 'shipmentsSearch' }
    },
]

export default collectShipmentsRoutes;