<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        data(){
            return {}
        },
        mounted(){
            // if(process.env.NODE_ENV === 'development'){
            //     let baseEle = document.getElementsByTagName('base')[0];
            //     baseEle.remove();
            // }
        }
    }
</script>
