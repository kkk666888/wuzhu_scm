import vue from 'vue';
import loadingVue from './index.js';
export default {
    create(option){
         const loadingConstructor = vue.extend(loadingVue);
         loadingConstructor.prototype.destroy = function(){
             this.$destroy();
         }

         let instance = new loadingConstructor({
             el:document.createElement('div'),
             data:{
                 loadingTxt:option.loadingTxt,
                 showLoading:false
             }
         })

         document.body.appendChild(instance.$el);

         return instance;
    }
}