//全局js错误捕获服务
import Vue from 'vue'

const errorHandler = (error, vm)=>{
    vm.alert.error(error.message);
    console.error(error);
}

Vue.config.errorHandler = errorHandler;