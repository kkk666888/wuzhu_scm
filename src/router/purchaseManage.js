//集采-采购管理
import _import from './importFile.js';

const purchaseRoutes = [
    {
        path: 'purchaseBillManage', //采购单管理
        name: 'purchaseBillManage',
        component: () => _import('auth/purchaseManage/purchaseBillManage/purchaseBillManage'),
        meta: { authority: true, routeTab: true, code: 'purchaseBillManage' }
    },
    {
        path: 'receivingReportManage', //收货单管理
        name: 'receivingReportManage',
        component: () => _import('auth/purchaseManage/receivingReportManage/receivingReportManage'),
        meta: { authority: true, routeTab: true, code: 'receivingReportManage' }
    },
    {
        path: 'qualityCheckManage', //质检单管理
        name: 'qualityCheckManage',
        component: () => _import('auth/purchaseManage/qualityCheckManage/qualityCheckManage'),
        meta: { authority: true, routeTab: true, code: 'qualityCheckManage' }
    },
]

export default purchaseRoutes;