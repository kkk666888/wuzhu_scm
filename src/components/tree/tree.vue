<template>
    <div class="my-tree-main">
        <tree-item :data="treeData" :option="treeOption"></tree-item>
    </div>
</template>

<script>
import treeJs from './tree.js';
export default treeJs
</script>

<style lang="scss">
    @import './tree.scss';
</style>
