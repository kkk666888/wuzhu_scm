//设置el-tabs自适应高度
import Vue from 'vue'
import common from '../utils/common.js'

Vue.directive('tab-auto-height', {
    bind(el,binding,vnode,oldVnode){
        window.onresize = function(){
            common.throttle(()=>{
                common.setAutoHeight(el);
            },null)
        }
    },
    inserted(el,binding,vnode,oldVnode) {
        common.setAutoHeight(el);
    }
  })