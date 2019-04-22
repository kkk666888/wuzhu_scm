<template>
    <div class="collectProductSearch-main">
        <div class="common-search">
            <div class="item">
                <label>物主商品SKU：</label>
                <el-input v-model="searchModel.commodityNo" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>商品短名称：</label>
                <el-input  v-model="searchModel.shortName" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>集采商名称：</label>
                <el-select v-model="searchModel.vopChannelType">
                    <el-option label="请选择" value=""></el-option>
                    <el-option 
                        v-for="item in channelList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.text"></el-option>
                </el-select>
            </div>
            <!-- <div class="item">
                <label>是否匹配SKU：</label>
                <el-select>
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="已匹配" value="已匹配"></el-option>
                    <el-option label="未匹配" value="未匹配"></el-option>
                </el-select>
            </div> -->
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button @click="reset()">重置</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>
    </div>
</template>

<script>
    import vueJs from './collectProductSearch.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .collectProductSearch-main{
        .select-provider{
            padding: 20px;
            .el-select{
                width: 200px;
            }
        }
        .bind-sku{
            width: 1000px;
            .item-div{
                margin-bottom: 20px;
                .header{
                    font-size: 14px;
                    font-weight: bold;
                    color: #111;
                    margin-bottom: 10px;
                }
                .my-form{
                    border:1px solid #ddd;
                    border-radius: 4px;
                    padding: 20px 20px 5px 20px;
                    .el-select{
                        width: 200px
                    }
                }
            }
        }
        .unbind-sku{
            padding: 10px;
        }
    }
</style>

