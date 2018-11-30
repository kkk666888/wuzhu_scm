<template>
    <div class="wait-shipments">
        <!--查询-->
        <div  class="common-search">
            <div class="item">
                <label>商品品类：</label>
                <el-input v-model="searchModel.commodityCategory" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
            </div>
            <div class="item" style="float:right">
                <el-button type="primary" @click="deliver()">确认发货</el-button>
            </div>
        </div>

        <!--表格-->
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

        <!--确认发货弹窗-->
        <my-dialog 
            :title='deliverDialog.title' 
            :visible.sync='deliverDialog.visible'
            @onConfirm="deliverSave()">
            <div class="deliver-dialog">
                <el-select class="logistics-company-select" v-model="deliverDialog.logisticsCompanyValue">
                    <el-option label="请选择物流公司" value=""></el-option>
                    <el-option
                        v-for="item in logisticsCompanyList" 
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </my-dialog>

        <!--修改收货地址弹窗-->
        <my-dialog 
            :title='addressDialog.title' 
            :visible.sync='addressDialog.visible'
            @onConfirm="changeAddrSave()">
            <div class="address-dialog" v-if="addressDialog.item">
                <div class="my-form">
                    <div class="form-item-inline">
                        <div class="form-item">
                            <label>订单编号：</label>
                            <span class="label-span">{{addressDialog.item.orderNo}}</span>
                        </div>
                        <div class="form-item">
                            <label>商品编号：</label>
                            <span class="label-span">{{addressDialog.item.commodityNo}}</span>
                        </div>
                        <div class="form-item">
                            <label>商品类型：</label>
                            <span class="label-span">{{addressDialog.item.commodityType}}</span>
                        </div>
                        <div class="form-item">
                            <label>商品品牌：</label>
                            <span class="label-span">{{addressDialog.item.brandName}}</span>
                        </div>
                        <div class="form-item">
                            <label>商品品类：</label>
                            <span class="label-span">{{addressDialog.item.commodityCategory}}</span>
                        </div>
                        <div class="form-item">
                            <label>商品属性：</label>
                            <span class="label-span">{{addressDialog.item.commodityAttr}}</span>
                        </div>
                        <div class="form-item">
                            <label>客户姓名：</label>
                            <span class="label-span">{{addressDialog.item.receiveName}}</span>
                        </div>
                        <div class="form-item">
                            <label>客户电话：</label>
                            <span class="label-span">{{addressDialog.item.receiveTel}}</span>
                        </div>
                        <div class="form-item">
                            <label>识别码：</label>
                            <span class="label-span">{{addressDialog.item.stockCode}}</span>
                        </div>
                        <div class="form-item">
                            <label>库存码：</label>
                            <span class="label-span">{{addressDialog.item.stockNo}}</span>
                        </div>
                    </div>
                    <div class="form-item">
                            <label>客户地址：</label>
                            <el-input v-model="addressDialog.customerAddress" class="address-input" type="text" :maxlength="255"></el-input>
                    </div>
                </div>
            </div>
        </my-dialog>

        <!--线下发货弹窗-->
        <my-dialog 
            :title='offlineDeliverDialog.title' 
            :visible.sync='offlineDeliverDialog.visible'
            @onConfirm="offlineDeliverSave()">
            <div class="offline-deliver-dialog">
                <div class="my-form">
                    <div class="form-item">
                        <label>运单号：</label>
                        <el-input v-model="offlineDeliverDialog.deliveryOrderNo" type="text" :maxlength="30"></el-input>
                    </div>
                    <div class="form-item">
                        <label>物流公司：</label>
                        <el-select v-model="offlineDeliverDialog.logisticsCompany">
                            <el-option label="请选择物流公司" value=""></el-option>
                            <el-option
                                v-for="item in logisticsCompanyList" 
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </my-dialog>

        <!--自提弹窗-->
        <my-dialog 
            :title='pickUpDialog.title' 
            :visible.sync='pickUpDialog.visible'
            @onConfirm="pickUpSave()">
            <div class="pickUp-dialog">
                <el-input v-model="pickUpDialog.signUser" placeholder="请输入签收人"></el-input>
            </div>
        </my-dialog>
    </div>
</template>

<script>
    import vueJs from './waitShipments.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .wait-shipments{
        .deliver-dialog{
            padding: 10px;
            .logistics-company-select{
                width: 300px;
            }
        }

        .address-dialog{
            width: 800px;
            .my-form .form-item{margin-bottom: 20px;}
            .label-span{
                display: inline-block;
                width: 250px;
            }
            .address-input{
                width: 600px;
            }
        }

        .offline-deliver-dialog{
            width: 480px;
            padding: 10px;
        }
        
        .pickUp-dialog{
            padding: 20px;
        }
    }
</style>

