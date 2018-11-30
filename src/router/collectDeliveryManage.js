//集采-送货管理
import _import from './importFile.js';

const collectDeliveryRoutes = [
    {
        path: 'deliverySearch', //集采-送货单列表
        name: 'deliverySearch',
        component: () => _import('auth/collectDeliveryManage/deliverySearch/deliverySearch'),
        meta: { authority: true, routeTab: true, code: 'deliverySearch' }
    },
]

export default collectDeliveryRoutes;