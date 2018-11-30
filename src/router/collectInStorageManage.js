//集采-入库管理
import _import from './importFile.js';

const collectInStorageRoutes = [
    {
        path: 'inStorageSearch', //集采-收货管理
        name: 'inStorageSearch',
        component: () => _import('auth/collectInStorageManage/inStorageSearch/inStorageSearch'),
        meta: { authority: true, routeTab: true, code: 'inStorageSearch' }
    },
]

export default collectInStorageRoutes;