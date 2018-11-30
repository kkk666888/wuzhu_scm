<template>
    <div class="page-main">
        <div class="my-form">
            <div class="form-item">
                <label>采集商：</label>
                <el-select v-model="model.channelType">
                    <el-option label="请选择" value=""></el-option>
                    <el-option 
                        v-for="item in channelList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.text"></el-option>
                </el-select>
                <el-button class="search-btn" type="primary" @click="getAmount()">查询</el-button>
            </div>
            <div class="form-item">
                <label>账户余额：</label>
                <el-input v-model="model.amount" :readonly="true"></el-input>
            </div>
        </div>
    </div>
</template>

<script>
import vueJs from './collectProviderAmount.js';
export default vueJs;
</script>

<style lang="scss" scoped>
    .page-main{
        padding: 50px !important;
        .search-btn{
            position: relative;
            top: -2px;
            margin-left: 10px;
        }
    }
</style>
