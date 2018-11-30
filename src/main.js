// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import "babel-polyfill"

//公用服务
import storageService from './utils/storageService.js'
import commonJs from './utils/common.js'
import enumService from './utils/enum.js'
import permission from './utils/permission.js'
import permissionCode from './utils/permissionCode.js'
import apiSerivce from './api/index.js'
import alertService from './components/alert/alertService.js'

//全局js错误捕获服务
import './utils/globalErrorHandle.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.scss'
import './assets/css/common.scss'

Vue.config.productionTip = false
Vue.use(ElementUI,{size:'small'})

//过滤器
import filters from './filters';
Object.keys(filters).forEach(key => {  
    Vue.filter(key, filters[key])  
})

//指令
import './directives/setTabAutoHeight.js'

//组件
import myTable from './components/table'
import myTree from './components/tree'
import myTreeTable from './components/treeTable'
import myFullWindow from './components/fullWindow'
import myDialog from './components/dialog'
import myRequire from './components/require/require.vue'
import myUpload from './components/upload'

Vue.component('myTable',myTable)
Vue.component('myTree',myTree)
Vue.component('myTreeTable',myTreeTable)
Vue.component('myFullWindow',myFullWindow)
Vue.component('myDialog',myDialog)

Vue.component('myRequire',myRequire)
Vue.component('myUpload',myUpload)

Vue.prototype.storage = storageService
Vue.prototype.common = commonJs
Vue.prototype.api = apiSerivce
Vue.prototype.alert = alertService
Vue.prototype.myFilter = filters
Vue.prototype.enum = enumService
Vue.prototype.permission = permission
Vue.prototype.permissionCode = permissionCode

// 权限管理模块用到
Vue.prototype.$storage = storageService;
Vue.prototype.$common = commonJs;
Vue.prototype.$api = apiSerivce;
Vue.prototype.$alert = alertService;
Vue.prototype.$myFilter = filters;
Vue.prototype.$enum = enumService;
Vue.prototype.$permission = permission;
Vue.prototype.$permissionCode = permissionCode;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
