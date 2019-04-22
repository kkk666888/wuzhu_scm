import _import from './importFile.js';
const authorityManageRoutes = [
  {
    path: 'userManager', // 用户管理
    name: 'UserManager',
    component: () => _import('m-systemManager/UserManager/UserManager'),
    meta: { authority: true, routeTab: true, code: 'userManager' }
  },
  {
    path: 'characterManager', // 角色管理
    name: 'CharacterManager',
    component: () => _import('m-systemManager/CharacterManager/CharacterManager'),
    meta: { authority: true, routeTab: true, code: 'characterManager' }
  },
  {
    path: 'resourceManager', // 资源管理
    name: 'ResourceManager',
    component: () => _import('m-systemManager/ResourceManager/ResourceManager'),
    meta: { authority: true, routeTab: true, code: 'resourceManager' }
  }
  // {
  //     path: 'areaManager', // 区域管理
  //     name: 'AreaManager',
  //     component: () => _import('m-systemManager/AreaManager/AreaManager'),
  //     meta: { authority: true, routeTab: true, code: 'areaManager' }
  // },
  // {
  //     path: 'departmentManager', // 部门管理
  //     name: 'DepartmentManager',
  //     component: () => _import('m-systemManager/DepartmentManager/DepartmentManager'),
  //     meta: { authority: true, routeTab: true, code: 'departmentManager' }
  // },
];
export default authorityManageRoutes;
