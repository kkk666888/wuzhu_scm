<template>
    <div>
        <div v-for="item in this.data" :key="item[option.idField]">
            <div class="tree-item" 
                :class="{'tree-item-child-active':tree.currentTreeId==item[option.idField]}"
                :style="item._style" 
                @click="treeClick(item)">
                <template v-if="!item[option.leafField]">
                    <span @click="showChild($event,item)" class="tree-icon" v-if="item._showChild">
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <span @click="showChild($event,item)" class="tree-icon" v-if="!item._showChild">
                        <i class="el-icon-caret-right"></i>
                    </span>
                </template>
                <template v-else>
                    <span class="tree-icon"></span>
                </template>

                {{item[option.diaplayField]}}
            </div>
            <template v-if="item[option.childField] && item[option.childField].length > 0 && item._showChild">
                <tree-item :data="item[option.childField]" :option="option"></tree-item>
            </template>
        </div>
    </div>
</template>

<script>
import treeItemJs from './treeItem.js';
export default treeItemJs
</script>
