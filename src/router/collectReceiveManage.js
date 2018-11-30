//集采-收货管理
import _import from './importFile.js';

const collectReceiveRoutes = [
    {
        path: 'receiveSearch', //集采-收货管理
        name: 'receiveSearch',
        component: () => _import('auth/collectReceiveManage/receiveSearch/receiveSearch'),
        meta: { authority: true, routeTab: true, code: 'receiveSearch' }
    },
]

export default collectReceiveRoutes;