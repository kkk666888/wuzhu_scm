<template>
    <div class="hadShipments-main">
        <div class="common-search">
            <div>
                <div class="item">
                    <label>商品品类：</label>
                    <el-input v-model="searchModel.commodityCategory" placeholder="请输入" :maxlength="50"></el-input>
                </div>
                <div class="item">
                    <label>订单号：</label>
                    <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="50"></el-input>
                </div>
                <div class="item">
                    <label>客户姓名：</label>
                    <el-input v-model="searchModel.customerName" placeholder="请输入" :maxlength="50"></el-input>
                </div>
                <div class="item">
                    <label>识别码：</label>
                    <el-input v-model="searchModel.identifiCode" placeholder="请输入" :maxlength="50"></el-input>
                </div>
                <div class="item">
                    <label>发货时间：</label>
                    <el-date-picker type='daterange' v-model="searchModel.deliverTime" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            
            <div style="text-align: center; width: 100%;">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button type="primary" icon="el-icon-download" @click="exportExcel()">导出</el-button>
            </div>            
            <div class="item" style="float:left">
                <!-- <el-button type="primary" @click="print()">批量打印印单号</el-button> -->
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

        <!-- 确认收货 弹出框 -->
        <my-dialog title='确认收货' :visible.sync='deliverDialog.visible' @onConfirm="confirmSave()" @onClose="cancelSave()">
            <div style="padding:20px 20px 0 20px">
                是否确认收货？确认请选择收货时间：
            </div>
            <div style="padding:20px 20px 20px 20px">
                <el-date-picker v-model="deliverDialog.confirmDate" value-format="yyyy-MM-dd" type="date" placeholder="选择确认收货日期"></el-date-picker>
                <el-time-picker v-model="deliverDialog.confirmTime" value-format="HH:mm:ss" placeholder="选择确认收货时间"></el-time-picker>
            </div>
        </my-dialog>

        <!--查看物流信息-->
        <my-logistics-info :visible.sync="logisticsDialog.visible" :baseItem='logisticsDialog.orderItem' :trackNumber='logisticsDialog.trackNumber'></my-logistics-info>
    </div>
</template>

<script>
import vueJs from './hadShipments.js';
export default vueJs;
</script>

<style lang="scss" scoped>
@import './hadShipments.scss';

</style>

