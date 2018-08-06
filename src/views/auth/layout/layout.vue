<template>
    <div class="index-main">
        <div class="index-header">
            <div class="index-header-logo">
                <!-- <img :src="favicon"/> -->
                物主后台供应链管理系统
                <span class="index-s-z" @click="setZhankuai()">
                    <i v-show="isZhankuai" class="iconfont icon-shouqi-test"></i>
                    <i v-show="!isZhankuai" class="iconfont icon-zhankai-test"></i>
                </span>
            </div>
            <div class="index-header-right">
                <div>
                    <span class="index-header-welcome">欢迎您，{{userInfo.realname}}</span>
                    <div class="login-out-btn" @click="loginOut()">退出登录</div>
                </div>
            </div>
        </div>
        <div class="index-body">
            <div class="index-left" :class="{'index-left-shouqi':!isZhankuai}">
                <div class="index-menu">
                    <my-tree ref="tree" :data="get_permission_menus" :option="treeOption" @treeClick="menuClick"></my-tree>
                </div>
            </div>
            <div class="index-right">
                <div id="indexTabs" class="index-tabs">
                    <div id="tabContainer" class="tab-container">
                        <span class="tab-item" :class="{'tab-item-active':routeTabs.active === item.name}" v-for="item in routeTabs.data" :key="item.id" @click="tabClick(item)">
                            {{item.label}}
                            <span v-if="item.name!='index'" class="span-close" @click="tabRemove($event,item)">
                                <i class="el-icon-close"></i>
                            </span>
                        </span>
                    </div>
                </div>
                <transition name="fade" mode="out-in">
                    <keep-alive :include="include">
                        <router-view class="router-view" />
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>

</template>

<script>
import layoutJs from './layout.js';
export default layoutJs;
</script>

<style lang="scss" scoped>
@import './layout.scss';
</style>
