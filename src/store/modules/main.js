import permissionUtils from '../../utils/permission.js';
export default {
  state: {
    isHandleData: false, //是否处理权限数据
    menus: [], //菜单目录
    menuButtons: [], //所有菜单按扭权限
    simpleMenus: [], //用作判断是否在菜单权限
    userInfo: {
      id: '',
      loginName: '', // 账号
      realName: '' // 真实姓名
    }
  },
  getters: {
    get_permission_menus: state => {
      return state.menus;
    },
    get_permission_menuButtons: state => {
      return state.menuButtons;
    },
    get_user_info: state => {
      return state.userInfo;
    }
  },
  mutations: {
    set_permission_resources(state, resources) {
      state.isHandleData = true;
      let result = permissionUtils.getUserPermissionMenus(resources);
      state.menus = result.menus;
      state.menuButtons = result.menuButtons;
      state.simpleMenus = result.simpleMenus;
    },
    setUserInfo(state, data) {
      state.userInfo.id = data.userId || '';
      state.userInfo.loginName = data.username || '';
      state.userInfo.realName = data.realname || '';
    }
  }
};
