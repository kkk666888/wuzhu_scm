//集采-出库管理
import _import from './importFile.js';

const collectOutStorageRoutes = [
    {
        path: 'outStorageSearch', //集采-收货管理
        name: 'outStorageSearch',
        component: () => _import('auth/collectOutStorageManage/outStorageSearch/outStorageSearch'),
        meta: { authority: true, routeTab: true, code: 'outStorageSearch' }
    },
]

export default collectOutStorageRoutes;