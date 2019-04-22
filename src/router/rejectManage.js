// 拒收管理
import importFile from './importFile';

const rejectRoutes = [
  {
    // 拒收管理
    path: 'rejectManager',
    name: 'RejectManager',
    component: () => importFile('m-rejectManager/RejectManager/RejectManager'),
    meta: { authority: true, routeTab: true, code: 'rejectManager' }
  },
  {
    // 质检管理
    path: 'qcManager',
    name: 'QCManager',
    component: () => importFile('m-rejectManager/QCManager/QCManager'),
    meta: { authority: true, routeTab: true, code: 'qcManager' }
  }
];

export default rejectRoutes;
