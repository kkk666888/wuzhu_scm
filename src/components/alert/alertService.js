import vue from 'vue';
import alertVue from './index.js';
import common from '../../utils/common';

const alertService = {
    create(option){
         const loadingConstructor = vue.extend(alertVue);
         loadingConstructor.prototype.destroy = function(){
             this.$destroy();
         }

         let instance = new loadingConstructor({
             el:document.createElement('div'),
             data:option
         })

         document.body.appendChild(instance.$el);

         return instance;
    },
    infoInstance:null,
    successInstance:null,
    toastInstance:null,
    errorInstance:null,

    toast(msg,option){
        if(this.toastInstance){
            this.toastInstance.hide();
            this.toastInstance.destroy();
            this.toastInstance = null;
        }

        let toastOption = {
            bodyTxt:msg,
            type:0,
            isAutoHide:true,
            autoHideTimeout:3000
        }

        toastOption = common.deepMerge(toastOption,option || {});
        this.toastInstance = this.create(toastOption);

        this.toastInstance.show();
    },

    info(msg,option){
        if(this.infoInstance){
            this.infoInstance.hide();
            this.infoInstance.destroy();
            this.infoInstance = null;
        }

        let alertOption = {
            headerTxt:'提示',
            bodyTxt:msg,
            type:3,
            isAutoHide:true,
            autoHideTimeout:3000
        }

        alertOption = common.deepMerge(alertOption,option || {});
        this.infoInstance = this.create(alertOption);

        this.infoInstance.show();
    },

    success(msg,option){
        if(this.successInstance){
            this.successInstance.hide();
            this.successInstance.destroy();
            this.successInstance = null;
        }

        let alertOption = {
            headerTxt:'提示',
            bodyTxt:msg,
            type:1,
            isAutoHide:true,
            autoHideTimeout:3000
        }

        alertOption = common.deepMerge(alertOption,option || {});
        this.successInstance = this.create(alertOption);

        this.successInstance.show();
    },
    error(msg,option){
        if(this.errorInstance){
            this.errorInstance.hide();
            this.errorInstance.destroy();
            this.errorInstance = null;
        }

        let alertOption = {
            headerTxt:'错误提示',
            bodyTxt:msg,
            type:2,
            isAutoHide:true,
            autoHideTimeout:3000
        }

        alertOption = common.deepMerge(alertOption,option || {});
        this.errorInstance = this.create(alertOption);

        this.errorInstance.show();
    },
    confirm(msg,option){
        let alertOption = {
            headerTxt:'确认提示',
            bodyTxt:msg,
            type:9
        }

        alertOption = common.deepMerge(alertOption,option || {});
        let instance = this.create(alertOption);
        instance.show();
    }
}

export default alertService;