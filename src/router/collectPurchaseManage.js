//集采-采购管理
import _import from './importFile.js';

const collectPurchaseRoutes = [
    {
        path: 'collectProductSearch', //集采商品信息查询
        name: 'collectProductSearch',
        component: () => _import('auth/collectPurchaseManage/collectProductSearch/collectProductSearch'),
        meta: { authority: true, routeTab: true, code: 'collectProductSearch' }
    },
    {
        path: 'placePurchaseOrder', //下采购单
        name: 'placePurchaseOrder',
        component: () => _import('auth/collectPurchaseManage/placePurchaseOrder/placePurchaseOrder'),
        meta: { authority: true, routeTab: true, code: 'placePurchaseOrder' }
    },
    {
        path: 'purchaseTraining', //采购单跟踪
        name: 'purchaseTraining',
        component: () => _import('auth/collectPurchaseManage/purchaseTraining/purchaseTraining'),
        meta: { authority: true, routeTab: true, code: 'purchaseTraining' }
    },
]

export default collectPurchaseRoutes;