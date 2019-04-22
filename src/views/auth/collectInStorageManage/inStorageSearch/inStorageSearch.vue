<template>
    <div class="page-main">
        <div class="common-search">
            <div class="item">
                <label>租赁订单编号：</label>
                <el-input placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>客户姓名：</label>
                <el-input placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>发货方式：</label>
                <el-select></el-select>
            </div>
            <div class="item">
                <label>商品编号：</label>
                <el-input placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>采购订单号：</label>
                <el-input placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>物流商：</label>
                <el-input placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button @click="reset()">重置</el-button>
            </div>
            <div class="item float-right">
                <el-button type="primary" @click="search()">新增入库单</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>
    </div>
</template>

<script>
    import vueJs from './inStorageSearch.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .page-main{
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

