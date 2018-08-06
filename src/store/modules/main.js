import permissionUtils from '../../utils/permission.js';
export default {
  state: {
    isHandleData: false, //是否处理权限数据
    menus: [], //菜单目录
    menuButtons: [], //所有菜单按扭权限
    simpleMenus: [], //用作判断是否在菜单权限
  },
  getters: {
    get_permission_menus: state => {
      return state.menus;
    },
    get_permission_menuButtons: state => {
      return state.menuButtons;
    }
  },
  mutations: {
    set_permission_resources(state, resources) {
      state.isHandleData = true;
      // state.userInfo.id = resources.id;
      // state.userInfo.loginName = resources.loginName;
      // state.userInfo.realName = resources.realName;
      let result = permissionUtils.getUserPermissionMenus(resources);
      state.menus = result.menus;
      state.menuButtons = result.menuButtons;
      state.simpleMenus = result.simpleMenus;
    }
  }
};
