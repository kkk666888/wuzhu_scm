<template>
    <div v-if="visible" class="create-window-main">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    }
}
</script>
<style lang="scss" scoped>
    .create-window-main{
        position: absolute;top:42px;left:0;right:0;bottom:0;
        background: white;z-index: 10;padding: 10px;
    }
</style>

