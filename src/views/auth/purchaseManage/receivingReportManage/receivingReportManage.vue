<template>
    <div class="purchaseTraining-main">
        <div class="common-search">
            <div class="item">
                <label>采购单号</label>
                <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>供应商编号</label>
                <el-input v-model="searchModel.customerName" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>供应商名称</label>
                <el-input v-model="searchModel.vopOrderNo" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>付款状态</label>
                <el-input v-model="searchModel.shortName" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>状态</label>
                <el-input v-model="searchModel.vopOrderNo" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>是否盖章</label>
                <el-input v-model="searchModel.shortName" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button @click="reset()">重置</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>
        <!--查看物流信息-->
        <my-dialog
            title='物流信息' 
            :option='{showFooter:false}'
            :visible.sync='logisticsDialog.visible'>
            <div v-if="currentItem" class="logistics-info-dialog">
                <div class="header">
                    <span>客户：{{currentItem.customerName}}</span>
                    <span>收货地址：{{currentItem.receiveAddr}}</span>
                </div>
                <div v-if="logisticsDialog.list" class="content">
                    <div class="item" v-for="(m,$index) in logisticsDialog.list" :key="$index">
                        <span>{{m.msgTime}}</span>
                        <span>{{m.content}}</span>
                        <span>{{m.operator}}</span>
                    </div>
                </div>
                <div v-else class="content">无物流信息</div>
            </div>
        </my-dialog>
    </div>
</template>

<script>
    import vueJs from './receivingReportManage.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .purchaseTraining-main{
        /deep/ .dialog-main {
            .dialog-conainer{
                .dialog-body{
                    padding: 0;
                }
            }
        }
        .logistics-info-dialog{
            max-width: 1000px;
            min-height: 200px;
            .header{
                padding: 20px;
                color: red;
                border-bottom: 1px solid #ddd;
                span{
                    display: inline-block;
                    margin-right: 20px;
                }
            }
            .content{
                padding: 20px;
                max-height: 450px;
                overflow-y: auto;
                .item{
                    &:first-child{color: #ea7f26;}
                    margin-bottom: 10px;
                }
            }
        }
    }
</style>

