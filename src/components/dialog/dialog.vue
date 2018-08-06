<template>
    <transition name="fade" mode="out-in">
        <div v-if="visible" class="dialog-main">
            <div class="dialog-layout"></div>
            <div class="dialog-conainer">
                <div class="dialog-header">
                    {{title}}
                    <span @click="close()" class="dialog-close">
                        <i class="el-icon-close"></i>
                    </span>
                </div>
                <div class="dialog-body" :style="{'width':width+'px','height':height+'px'}">
                    <slot></slot>
                </div>
                <div class="dialog-footer" v-if="option.showFooter">
                    <el-button @click="close()">{{cancelBtnTxt}}</el-button>
                    <el-button type="primary" @click="confirm()">{{confirmBtnTxt}}</el-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import dislogJs from './dialog.js'
export default dislogJs
</script>

<style lang="scss" scoped>
    .dialog-main{
        display: flex;top:0;left:0;right: 0;bottom: 0;position:fixed;z-index: 100;
        align-items: center;justify-content:center;

        .dialog-layout{
            position:fixed;top:0;left:0;right: 0;bottom: 0;background-color: #000;opacity: 0.5;
            z-index: 1;
        }

        .dialog-conainer{
            background-color: white;position: relative;z-index: 2;font-size: 14px;
            border-radius: 5px;overflow: hidden;
        }

        .dialog-header{
            height: 40px; line-height: 40px; padding: 0 10px;text-align: left;
            cursor: move;border-bottom: 1px solid #e5e5e5;
            background-color: #2d4057;color: white;
        }

        .dialog-close{
            display: inline-block;
            float: right;width: 40px;
            text-align: center;cursor: pointer;
            margin-right: -10px;
        }

        .dialog-body{
            overflow-y: auto;text-align: left;padding: 10px;
        }

        .dialog-footer{
            height: 50px; line-height: 50px;text-align: center;border-top: 1px solid #e5e5e5;
            .el-button{
                min-width: 100px;
            }
        }
    }
</style>

