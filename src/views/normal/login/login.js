import { mapMutations } from 'vuex';
import menuData from '../../../mock/menuData.json';
export default {
  data() {
    return {
      loginName: '',
      password: ''
    };
  },
  methods: {
    ...mapMutations(['set_permission_resources', 'setUserInfo']),
    login() {
      // 本地登陆
      // let menu = { menuTree: [] };
      // this.$storage.cookie.set('tokenStr', '%5Bobject%20Object%5D');
      // menu.menuTree = this.handleData(menuData.data);
      // this.$storage.session.setObj(this.$common.storageKey.resources, menu);
      // this.set_permission_resources(menu);
      // this.$router.push({ name: 'adminSys' });
      // return;

      if (!this.loginName) {
        this.alert.toast('用户名不能为空');
        return;
      }

      if (!this.password) {
        this.alert.toast('密码不能为空');
        return;
      }

      let model = { username: this.loginName, password: this.password };
      this.api.login.ajaxLogin.send(model, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.$alert.toast('登陆成功', { autoHideTimeout: 2000 });
          // 获取菜单数据
          this.getMenuData();
          // 设置token
          this.$storage.cookie.set('tokenStr', res.data);
          // 设置个人信息
          this.setUserInfo(res.data.userInfo);
        }
      });
    },
    async getMenuData() {
      let menu = {
        loginName: '',
        realName: '',
        menuTree: []
      };
      try {
        let res = await this.$api.source.menu.send();
        if (res.code === '00') {
          menu.menuTree = this.handleData(res.data);
          // 缓存菜单数据
          this.$storage.session.setObj(this.$common.storageKey.resources, menu);
          // 设置权限数据
          this.set_permission_resources(menu);

          if (this.$route.query.redirect) {
            this.$router.push({ name: this.$route.query.redirect });
          } else {
            this.$router.push({ name: 'adminSys' });
          }
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    handleData(data) {
      if (!data) return;
      let ret = [];
      data.forEach(element => {
        let item = {
          id: element.id,
          parentId: '',
          resourceName: element.text,
          resourceCode: element.classPath,
          resourceType: element.type.toUpperCase(),
          resourceIcon: '',
          leaf: element.leaf,
          children: this.handleData(element.children)
        };
        ret.push(item);
      });
      return ret;
    }
  },
  mounted() {}
};
