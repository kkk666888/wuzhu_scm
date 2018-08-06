<template>
    <div class="order-main">
        <div class="common-search">
            <div class="item">
                <label>订单编号：</label>
                <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>客户姓名：</label>
                <el-input v-model="searchModel.customerName" placeholder="请输入" :maxlength="20"></el-input>
            </div>
            <div class="item">
                <label>订单状态：</label>
                <el-select v-model="searchModel.status"  placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option 
                        v-for="item in statusList" 
                        :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button @click="reset()">重置</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

        <!--延长租期-->
        <my-dialog 
            title='延长租期' 
            :visible.sync='extendTenancyTermDialog.visible'
            @onConfirm="extendTenancyTermSave()">
            <div class="extendTenancyTerm-dialog">
                <div class="my-form">
                    <div class="form-item">
                        <label>天数：</label>
                        <el-input v-model="extendTenancyTermDialog.days" placeholder="请输入延长天数" :maxlength="4"></el-input>
                    </div>
                    <div class="form-item">
                        <label>延期原因：</label>
                        <el-select v-model="extendTenancyTermDialog.type">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="非客户原因产生维修" value="0"></el-option>
                            <el-option label="配件漏发" value="2"></el-option>
                            <el-option label="系统原因导致客户实际租期缩短" value="3"></el-option>
                            <el-option label="其他" value="10"></el-option>
                        </el-select>
                    </div>
                    <div class="form-item form-item-flex">
                        <label>说明：</label>
                        <el-input v-model="extendTenancyTermDialog.remark" type="textarea" placeholder="请输入说明" :rows="5" :maxlength="300"></el-input>
                    </div>
                </div>
            </div>
        </my-dialog>

        <!--确认完结-->
        <my-dialog 
            title='确认完结' 
            :visible.sync="finishDialog.visible"
            @onConfirm="finishSave()">
            <div class="finish-dialog">
                <div class="my-form">
                    <div class="form-item">
                        <label>是否需要额外扣费：</label>
                        <el-select v-model="finishDialog.type">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </div>
                </div>
                <div>
                    <div class="div-add">
                        <div class="display-row">
                            <div class="display-col">
                                <el-button type="primary" @click="addFeeItem()">添加扣费记录</el-button>
                            </div>
                            <div class="display-col fee-span">
                                费用合计：0
                            </div>
                        </div>
                    </div>
                    <my-table ref="feeTable" :height="400" :data="feeTableData" :option="feeTableOption"></my-table>
                </div>
            </div>
        </my-dialog>
    </div>
</template>

<script>
    import vueJs from './order.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .order-main{
        .extendTenancyTerm-dialog{
            padding: 20px 50px 20px 0;
        }
        .finish-dialog{
            padding: 20px 10px;
            width: 1000px;
            .my-form{
                text-align: center;
            }
            .div-add{
                margin-bottom: 10px;
                margin-top: 20px;
            }
            .fee-span{
                text-align: right;
            }
        }
    }
</style>

