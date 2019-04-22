<template>
    <div v-if="showAlert" class="alert-main" @click="containerClick()">
        <template v-if="type!=0">
            <div class="alert-layout"></div>
                <div class="alert-container"
                :class="{'alert-success':type==1,'alert-error':type==2,'alert-info':type==3,'alert-confirm':type==9}">
                <div class="alert-header">
                    {{headerTxt}}
                    <span class="alert-remove" @click="hide()"><i class="el-icon-close"></i></span>
                </div>
                <div class="alert-body">
                    <div>{{bodyTxt}}</div>
                </div>
                <div v-if="type==9" class="alert-footer">
                    <div>
                        <el-button type="primary" @click="confirm()">确定</el-button>
                        <el-button type="info" @click="hide()">关闭</el-button>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="type==0">
            <div class="alert-toast">
                <div class="toast-body">
                    <div class="toast-layout"></div>
                    <div class="toast-txt">{{bodyTxt}}</div>
                </div>
            </div>
            
        </template>
    </div>
</template>

<script>
import vueJs from './alert.js'
export default vueJs
</script>

<style lang="scss" scoped>
    @import './alert.scss';
</style>
