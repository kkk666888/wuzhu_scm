import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      loginName: '',
      password: ''
    };
  },
  methods: {
    ...mapMutations(['set_permission_resources']),
    devLogin() {
      let data = this.testData();
      this.storage.session.setObj(this.common.storageKey.resources, data);
      this.storage.cookie.set('SCMTK', '1115_f7cf52d07abc40c0b4e8810038f02389');
      this.set_permission_resources(data);
      if (this.$route.query.redirect) {
        this.$router.push({ name: this.$route.query.redirect });
      } else {
        this.$router.push({ path: '/index' });
      }
    },
    login() {
      if (process.env.NODE_ENV === 'development') {
        this.devLogin();
        return;
      }
      if (!this.loginName) {
        this.alert.toast('用户名不能为空');
        return;
      }

      if (!this.password) {
        this.alert.toast('密码不能为空');
        return;
      }

      let model = { username: this.loginName, password: this.password };

      this.api.login.loginVaild.send(model, { showLoading: true }).then(res => {
        if (res.code === '00') {
          let data = this.testData();
          this.storage.session.setObj(this.common.storageKey.resources, data);
          this.storage.cookie.set('SCMTK', res.token);
          this.set_permission_resources(data);
          this.storage.session.setObj(this.common.storageKey.userInfo, res.data);
          if (this.$route.query.redirect) {
            this.$router.push({ name: this.$route.query.redirect });
          } else {
            this.$router.push({ name: 'adminSys' });
          }
        } else {
          this.alert.error(res.message);
        }
      });
    },
    addFolder(code, name) {
      let item = {
        id: this.common.generateUniqueValue(),
        parentId: 0,
        resourceName: name,
        resourceCode: code,
        resourceType: 'DIRT',
        resourceUrl: '',
        resourceIcon: '',
        requestMethod: null,
        orderNum: 1,
        leaf: false,
        children: []
      };
      return item;
    },
    addMenu(farentId, code, name) {
      let item = {
        id: this.common.generateUniqueValue(),
        parentId: farentId,
        resourceName: name,
        resourceCode: code,
        resourceType: 'MENU',
        resourceUrl: '',
        resourceIcon: '',
        requestMethod: null,
        orderNum: 1,
        leaf: true,
        children: []
      };
      return item;
    },
    testData() {
      let data = {
        id: 1,
        loginName: 'admin',
        realName: '管理员',
        menuTree: []
      };

      let homeMenu = this.addMenu(0, 'index', '首页');
      data.menuTree.push(homeMenu);

      //商品管理
      let productModule = this.addFolder('productManage', '商品管理');
      productModule.children.push(this.addMenu(productModule.id, 'waitShipments', '待发货管理'));
      productModule.children.push(this.addMenu(productModule.id, 'inStorage', '入库管理'));
      productModule.children.push(this.addMenu(productModule.id, 'hadShipments', '已发货管理'));
      productModule.children.push(this.addMenu(productModule.id, 'stockManage', '库存管理'));
      data.menuTree.push(productModule);

      //归还管理
      let giveBackModule = this.addFolder('returnManage', '归还管理');
      giveBackModule.children.push(this.addMenu(giveBackModule.id, 'returnApplication', '归还申请单管理'));
      //giveBackModule.children.push(this.addMenu(giveBackModule.parentId,'qualityApplication','质检申请单管理'))
      giveBackModule.children.push(this.addMenu(giveBackModule.id, 'order', '订单管理'));
      data.menuTree.push(giveBackModule);

      //集采-基础数据
      let jiCaiBaseModule = this.addFolder('jiCaiBaseManage', '集采-基础信息设定');
      jiCaiBaseModule.children.push(this.addMenu(jiCaiBaseModule.id, 'collectProductSku', '集采商商品SKU操作'));
      jiCaiBaseModule.children.push(this.addMenu(jiCaiBaseModule.id, 'collectProviderAmount', '集采商账户余额查询'));
      data.menuTree.push(jiCaiBaseModule);

      //集采-采购管理
      let ccModule = this.addFolder('collectPurchaseManage', '集采-采购管理');
      ccModule.children.push(this.addMenu(ccModule.id, 'collectProductSearch', '集采商品信息查询'));
      ccModule.children.push(this.addMenu(ccModule.id, 'placePurchaseOrder', '下采购单'));
      ccModule.children.push(this.addMenu(ccModule.id, 'purchaseTraining', '采购单跟踪'));
      data.menuTree.push(ccModule);

      //集采-送货管理
    //   let deliveryModule = this.addFolder('collectDeliveryManage','集采-送货管理');
    //   deliveryModule.children.push(this.addMenu(deliveryModule.id,'deliverySearch','送货单列表'))
    //   data.menuTree.push(deliveryModule);

      //集采-发货管理
    //   let shipmentsModule = this.addFolder('collectShipmentsManage','集采-发货管理');
    //   shipmentsModule.children.push(this.addMenu(shipmentsModule.id,'shipmentsSearch','发货列表'))
    //   data.menuTree.push(shipmentsModule);

      //集采-收货管理
    //   let receiveModule = this.addFolder('collectReceiveManage','集采-收货管理');
    //   receiveModule.children.push(this.addMenu(receiveModule.id,'receiveSearch','收货列表'))
    //   data.menuTree.push(receiveModule);

      //集采-入库管理
    //   let inStorageModule = this.addFolder('collectInStorageManage','集采-入库管理');
    //   inStorageModule.children.push(this.addMenu(inStorageModule.id,'inStorageSearch','入库列表'))
    //   data.menuTree.push(inStorageModule);

      //集采-库存管理
    //   let repertoryModule = this.addFolder('collectRepertoryManage','集采-库存管理');
    //   repertoryModule.children.push(this.addMenu(repertoryModule.id,'repertorySearch','库存列表'))
    //   data.menuTree.push(repertoryModule);

      //集采-出库管理
    //   let outStorageModule = this.addFolder('collectOutStorageManage','集采-出库管理');
    //   outStorageModule.children.push(this.addMenu(outStorageModule.id,'outStorageSearch','出库列表'))
    //   data.menuTree.push(outStorageModule);

      return data;
    }
  },
  mounted() {}
};
