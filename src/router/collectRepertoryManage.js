//集采-库存管理
import _import from './importFile.js';

const collectRepertoryRoutes = [
    {
        path: 'repertorySearch', //集采-库存管理
        name: 'repertorySearch',
        component: () => _import('auth/collectRepertoryManage/repertorySearch/repertorySearch'),
        meta: { authority: true, routeTab: true, code: 'repertorySearch' }
    },
]

export default collectRepertoryRoutes;