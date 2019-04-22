<template>
    <div class="wait-shipments">
        <!--查询-->
        <div  class="common-search">
            <div class="item">
                <label>订单来源：</label>
                <el-select v-model="searchModel.orderSource" clearable placeholder="请选择">
                    <el-option
                        v-for="item in searchModel.orderSources"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="item">
                <label>订单编号：</label>
                <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>客户姓名：</label>
                <el-input v-model="searchModel.customerName" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>商品品类：</label>
                <el-input v-model="searchModel.commodityCategory" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>商品编号：</label>
                <el-input v-model="searchModel.commodityNo" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>下单日期：</label>
                <el-date-picker v-model="searchModel.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
            
            <div style="text-align: center; width: 100%;">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button type="primary" icon="el-icon-download" @click="exportExcel()">导出</el-button>
            </div>
            <div class="item" style="float:right">
                <el-button type="primary" @click="deliver()">下物流单</el-button>
                <el-button type="primary" @click="print()">打印运单</el-button>
                <el-button type="primary" @click="confirmSended()">确认发货</el-button>
            </div>
        </div>

        <!--表格-->
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

        <!--确认发货弹窗-->
        <my-dialog :title='deliverDialog.title' :visible.sync='deliverDialog.visible' @onConfirm="deliverSave()">
            <div class="deliver-dialog">
                <el-select class="logistics-company-select" v-model="deliverDialog.logisticsCompanyValue">
                    <el-option label="请选择物流公司" value=""></el-option>
                    <el-option v-for="item in logisticsCompanyList" :key="item.value" :label="item.text" :value="item.value">
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
                                v-for="item in logisticsCompanyListOffLine" 
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="form-item">
                        <label>发货时间：</label>
                        <el-date-picker v-model="offlineDeliverDialog.deliverDate" style="width:150px" value-format="yyyy-MM-dd" type="date" placeholder="选择发货日期"></el-date-picker>
                        <el-time-picker v-model="offlineDeliverDialog.deliverTime" style="width:146px" value-format="HH:mm:ss" placeholder="选择发货时间"></el-time-picker>
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
        
        <!--上传附件-->
        <my-dialog :title='qcVedioFlagTitle' :visible.sync='qcVedioFlag' @onConfirm="confirmQCVedioFiles">
            <div class="invalid-dialog" style="width:100%">
                <el-upload
                    class="upload-demo"
                    :auto-upload="false"
                    :action="importUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :on-change="addFile"
                    >
                <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <el-progress style="width:100%" :percentage="uploadPercent" color="#8e71c7"></el-progress>
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
    
  .invalid-dialog {
    padding: 10px 10px;
  }
  .el-upload {
    width: 90%;
    float: left;
    text-align: left;
  }
</style>

