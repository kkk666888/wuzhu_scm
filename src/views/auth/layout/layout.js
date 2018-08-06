import { mapGetters } from 'vuex';
import favicon from '@/assets/images/favicon.png';
export default {
  name: 'App',
  data() {
    return {
      //favicon,
      activeDate: new Date().getTime(),
      treeOption: {
        idField: 'id',
        diaplayField: 'resourceName',
        childField: 'children',
        leafField: 'leaf',
        showAllChild: false
      },
      routeTabs: {
        data: [],
        active: ''
      },
      isZhankuai: true,
      userInfo:{}
    };
  },
  computed: {
    ...mapGetters(['get_permission_menus']),
    include() {
      let value = '';

      this.routeTabs.data.forEach(item => {
        value += item.name + ',';
      });

      if (value) {
        value = value.substring(0, value.length - 1);
      }

      return value;
    }
  },
  methods: {
    setCurrentMenuWhenRefresh() {
      let code = this.$route.meta.code;
      let currentMenu = this.permission.getMenuByCode(this.get_permission_menus, code);
      if (currentMenu) {
        this.$refs.tree.setCurrentTreeId(currentMenu.id);
        this.addRouteTab(this.$route, currentMenu);
        this.routeTabs.active = this.$route.name;
      }
    },
    //退出登录
    loginOut() {
      this.common.logonOut();
      this.$router.push({ name: 'login' });
    },
    //菜单单击事件
    menuClick(item) {
      if (item.resourceType == 'MENU') {
        let route = this.permission.getRouteByCode(this.$router.options.routes, item.resourceCode);
        if (route) {
          this.$router.push({ name: route.name });
          this.addRouteTab(route, item);
          this.routeTabs.active = route.name;
          document.title = item.resourceName;
        }
      } else {
        item._showChild = !item._showChild;
      }
    },
    //---------------------tab方法-------------------
    //添加tab
    addRouteTab(route, menuItem) {
      if (route.meta.routeTab) {
        if (this.existRouteTab(route.name)) {
        } else {
          this.routeTabs.data.push({
            id: menuItem.id,
            name: route.name,
            label: menuItem.resourceName
          });
          let thisObj = this;
          setTimeout(() => {
            let left = thisObj.tabContainer.offsetWidth - thisObj.indexTabs.offsetWidth;
            if (left > 0) {
              thisObj.tabContainer.style.left = -left + 'px';
            }
          }, 20);
        }
      }
    },
    //是否存在tab
    existRouteTab(name) {
      let result = false;
      for (var i in this.routeTabs.data) {
        if (this.routeTabs.data[i].name == name) {
          result = true;
          break;
        }
      }
      return result;
    },
    //tab单击
    tabClick(item) {
      this.routeTabs.active = item.name;
      this.$refs.tree.setCurrentTreeId(item.id);
      this.$router.push({ name: item.name });
    },
    //移除
    tabRemove(event, item) {
      event.stopPropagation();
      let removeIndex = this.common.removeItem(this.routeTabs.data, 'name', item.name);

      if (this.routeTabs.data.length === 0) {
        this.routeTabs.data = [];
      }

      if (item.name === this.routeTabs.active) {
        if (this.routeTabs.data.length === 0) {
          let thisObj = this;
          thisObj.$router.push({ name: 'index' });
          setTimeout(() => {
            thisObj.setCurrentMenuWhenRefresh();
          }, 300);
        } else {
          let activeIndex = 0;
          if (removeIndex > 0) {
            activeIndex = removeIndex - 1;
          }
          this.tabClick(this.routeTabs.data[activeIndex]);
        }
      }
    },
    //鼠标滚动事件
    scrollFunc(event) {
      event = event || window.event;
      let value = null;

      if (event.wheelDelta) {
        //IE/Opera/Chrome
        value = event.wheelDelta;
      } else if (event.detail) {
        //Firefox
        value = event.detail;
      }

      let left = this.tabContainer.offsetLeft;

      if (value > 0) {
        //往左移
        left = left + 50;
      } else {
        //往右移
        left = left - 50;
      }

      if (left > 0) {
        left = 0;
      } else {
        if (this.tabContainer.offsetWidth < this.indexTabs.offsetWidth) {
          left = 0;
        } else {
          let maxWidth = this.tabContainer.offsetWidth - this.indexTabs.offsetWidth;

          if (-left > maxWidth) {
            left = -maxWidth - 10;
          }
        }
      }

      this.tabContainer.style.left = left + 'px';
    },
    bindTabScroll() {
      if (document.addEventListener) {
        this.indexTabs.addEventListener('DOMMouseScroll', this.scrollFunc, false);
      }

      this.indexTabs.onmousewheel = this.indexTabs.onmousewheel = this.scrollFunc; //IE/Opera/Chrome/Safari
    },
    //---------------------tab方法结束-------------------
    setZhankuai() {
      this.isZhankuai = !this.isZhankuai;
    }
  },
  created() {},
  mounted() {
    this.indexTabs = document.getElementById('indexTabs');
    this.tabContainer = document.getElementById('tabContainer');
    this.setCurrentMenuWhenRefresh();
    this.bindTabScroll();
    this.userInfo = this.storage.session.getObj(this.common.storageKey.userInfo) || {};
  },
  watch: {}
};
