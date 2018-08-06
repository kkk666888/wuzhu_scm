<template>
    <div v-if="showLoding" class="loading-main">
        <div class="lading-layout"></div>
        <div class="loading-body">
            <div><i class="el-icon-loading"></i></div>
            <div class="loading-txt">{{loadingTxt}}</div>
        </div>
    </div>
</template>

<script>

export default {
    data(){
        return {
            showLoding:false,
            loadingTxt:'loading...'
        }
    },
    methods:{
        show(interval){
            let thisObj = this;
            if(interval){
                thisObj.timer = setTimeout(() => {
                    thisObj.showLoding = true;
                }, interval);
            }
            else{
                thisObj.showLoding = true;
            }
        },
        hide(){
            this.clearTimer();
            this.showLoding = false;
        },
        clearTimer(){
            if(this.timer){
                clearTimeout(this.timer);
            }
        }
    },
    destroyed(){
        this.clearTimer();
        if(this.$el.remove){
            this.$el.remove();
        }
        else{
            this.$el.parentNode.removeChild(this.$el);
        }
    },
    mounted(){
        this.timer = null;
    }
}
</script>

<style lang="scss" scoped>
    .loading-main{display: flex;position: fixed;top:0;left:0;right:0;bottom:0;
       align-items: center;
       justify-content: center; overflow: hidden;z-index: 9990;
       .lading-layout{
           position: absolute;top:0;left:0;right:0;bottom:0;
           background-color: #000;opacity: 0;z-index: 1
       }

       .loading-body{
           flex:0 0 100px;text-align: center;position: relative;z-index: 2;
           background-color: #464646;border-radius: 6px;
           padding: 20px 10px;

           .el-icon-loading{color: white;font-size: 30px;}
           .loading-txt{color: white;font-size: 14px;margin-top: 10px;}
        }
    }
</style>
