<template>
  <div class="RejectManager">
    <div class="common-search">
      <el-form :model="searchModel" :rules="searchRules" ref="searchForm" label-width="120px" class="search-Form">
        <el-form-item v-for="(item,index) in searchFields" :key="index" :prop="item.name" :label="item.label + ' :'">
          <el-input v-if="item.type === 'input'" placeholder="请输入" type="text" v-model="searchModel[item.name]"></el-input>
          <el-select v-if="item.type === 'select'" placeholder="请选择" v-model="searchModel[item.name]">
            <el-option v-for="(opItem,opIndex) in searchOptions[item.list]" :key="opIndex" :label="opItem.text" :value="opItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search('searchRules')">查询</el-button>
          <el-button @click="reset('searchRules')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-item">
      <!-- <el-button type="primary" @click="addRole()">导出</el-button> -->
    </div>
    <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList">
    </my-table>

    <!--完结订单弹窗-->
    <my-dialog :title="endOrderDialog.title" :visible.sync="endOrderDialog.visible" confirmBtnTxt="提交" @onConfirm="endOrderSave()">
      <div class="endOrder-head">
        <el-button @click="addFeeDetail">添加扣费明细</el-button>
        <div class="form-item">
          <label>费用合计</label>
          <el-input type="text" readonly v-model="feeTotal" :maxlength="50"></el-input>
        </div>
      </div>
      <div class="endOrder-dialog">
        <el-table :data="feeTableData" style="width: 100%" max-height="250">
          <el-table-column fixed label="扣费原因类型" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.feeType" @change="changeFeeType(scope.$index,scope.row)">
                <el-option v-for="(item,index) in feeTypeOptions" :key="index" :label="item.feeName" :value="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="feeAmt" label="扣费金额" width="120">
            <template slot-scope="scope">
              <el-input type="text" v-model.number="scope.row.feeAmt" @change="inputFeeAmt"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="详细描述" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, feeTableData)" type="text" size="small">
                delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </my-dialog>

    <!--作废弹窗-->
    <my-dialog :title='cancellationDialog.title' :visible.sync='cancellationDialog.visible' @onConfirm="cancellationSave()">
      <div class="confirm-receipt-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>作废原因
              <my-require/>：</label>
            <el-input type="text" v-model.trim="cancellationModel.invalidReason" clearable :maxlength="50" placeholder="请输入"></el-input>
          </div>
          <div class="form-item form-item-flex">
            <label>描述：</label>
            <el-input v-model="cancellationModel.remark" type="textarea" clearable :maxlength="255" :rows="5"></el-input>
          </div>
        </div>
      </div>
    </my-dialog>

    <!--发起质检弹窗-->
    <my-dialog :title='qualityCheckDialog.title' :visible.sync='qualityCheckDialog.visible' @onConfirm="qualityCheckSave()">
      <div class="confirm-receipt-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>质检原因：</label>
            <el-input type="text" v-model="qualityCheckForm.inspectionReasonName" :disabled="true" :maxlength="50" placeholder="请输入"></el-input>
          </div>
          <div class="form-item">
            <label>质检机构
              <my-require/>：</label>
            <el-input type="text" v-model.trim="qualityCheckForm.inspectionStationOid" clearable :maxlength="50" placeholder="请输入"></el-input>
          </div>
          <div class="form-item">
            <label>质检人员：
            </label>
            <el-input type="text" v-model="qualityCheckForm.inspectionUser" clearable :maxlength="50" placeholder="请输入"></el-input>
          </div>
          <div class="form-item form-item-flex">
            <label>描述：</label>
            <el-input type="textarea" v-model="qualityCheckForm.remark" clearable :maxlength="255" :rows="5"></el-input>
          </div>
        </div>
      </div>
    </my-dialog>

    <!-- 确认收货 -->
    <my-dialog title='确认收货' :visible.sync='confirmReceiptVisible' @onConfirm="confirmReceiptSave()">
      <div class="confirm-receipt-dialog">
        <el-form :model="confirmReceiptModel" :rules="confirmReceiptRules" ref="confirmReceipt" label-width="100px" class="dialog-form">
          <el-form-item label="物流公司" prop="expressCompanyName">
            <el-input type="text" v-model="confirmReceiptModel.expressCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="物流单号" prop="deliveryOrderNo">
            <el-input type="text" v-model="confirmReceiptModel.deliveryOrderNo"></el-input>
          </el-form-item>
          <el-form-item label="收货人" prop="signUser">
            <el-input type="text" v-model="confirmReceiptModel.signUser"></el-input>
          </el-form-item>
          <el-form-item label="收货时间" prop="signTime">
            <el-date-picker v-model="confirmReceiptModel.signTime" type="datetime" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>

    <!-- 拒收详情 -->
    <my-dialog title='拒收申请单详情' :visible.sync='rejectDetailVisible' @onConfirm="rejectDetailVisible = false" :option="detailOption">
      <div class="dialog-content">
        <el-form :model="rejectDetail" label-width="120px" class="detail-form">
          <el-tabs value="tab1">
            <el-tab-pane label="订单-基本信息" name="tab1">
              <el-form-item label="订单编号" prop="orderNo">
                <el-input type="input" readonly disabled :title="rejectDetail.orderNo" v-model="rejectDetail.orderNo"></el-input>
              </el-form-item>
              <el-form-item label="下单日期" prop="createTime">
                <el-input type="input" readonly disabled v-model="rejectDetail.createTime"></el-input>
              </el-form-item>
              <el-form-item label="订单状态" prop="orderStatus">
                <el-input type="input" readonly disabled v-model="rejectDetail.orderStatus"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="tab2">
            <el-tab-pane label="订单-商品信息" name="tab2">
              <el-form-item label="IMEI码" prop="goodsId">
                <el-input type="input" readonly disabled v-model="rejectDetail.goodsId"></el-input>
              </el-form-item>
              <el-form-item label="商品编号" prop="commodityNo">
                <el-input type="input" readonly disabled v-model="rejectDetail.commodityNo"></el-input>
              </el-form-item>
              <el-form-item label="商品名称" prop="shortName">
                <el-input type="input" readonly disabled v-model="rejectDetail.shortName"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="tab3">
            <el-tab-pane label="订单-客户信息" name="tab3">
              <el-form-item label="客户姓名" prop="customerName">
                <el-input type="input" readonly disabled v-model="rejectDetail.customerName"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="customerMobile">
                <el-input type="input" readonly disabled v-model="rejectDetail.customerMobile"></el-input>
              </el-form-item>
              <el-form-item label="客户编号" prop="customerId">
                <el-input type="input" readonly disabled v-model="rejectDetail.customerId"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="tab4">
            <el-tab-pane label="订单-发货信息" name="tab4">
              <el-form-item label="物流公司名称" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="rejectDetail.expressCompanyName"></el-input>
              </el-form-item>
              <el-form-item label="发货单号" prop="deliveryOrderNo">
                <el-input type="input" readonly disabled v-model="rejectDetail.deliveryOrderNo"></el-input>
              </el-form-item>
              <el-form-item label="发货时间" prop="deliveryDate">
                <el-input type="input" readonly disabled v-model="rejectDetail.deliveryDate"></el-input>
              </el-form-item>
              <el-form-item label="收件人" prop="receiverName">
                <el-input type="input" readonly disabled v-model="rejectDetail.receiverName"></el-input>
              </el-form-item>
              <el-form-item label="收件人手机号" prop="receiverTel">
                <el-input type="input" readonly disabled v-model="rejectDetail.receiverTel"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="收件地址" prop="consigneeAddr" class="text-block">
                <el-input type="textarea" :row="4" :title="rejectDetail.consigneeAddr" readonly disabled v-model="rejectDetail.consigneeAddr"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="tab5">
            <el-tab-pane label="拒收单信息" name="tab5">
              <el-form-item label="拒收单编号" prop="rejectApplyNo">
                <el-input type="input" readonly disabled v-model="rejectDetail.rejectApplyNo"></el-input>
              </el-form-item>
              <el-form-item label="租后申请单编号" prop="rentAfterApplyNo">
                <el-input type="input" readonly disabled v-model="rejectDetail.rentAfterApplyNo"></el-input>
              </el-form-item>
              <el-form-item label="拒收单状态" prop="status">
                <el-input type="input" readonly disabled v-model="rejectDetail.status"></el-input>
              </el-form-item>
              <el-form-item label="拒收单产生来源" prop="fromType">
                <el-input type="input" readonly disabled v-model="rejectDetail.fromType"></el-input>
              </el-form-item>
              <el-form-item label="收货日期" prop="signTime">
                <el-input type="input" readonly disabled v-model="rejectDetail.signTime"></el-input>
              </el-form-item>
              <el-form-item label="收货人" prop="signUser">
                <el-input type="input" readonly disabled v-model="rejectDetail.signUser"></el-input>
              </el-form-item>
              <el-form-item label="拒收原因" prop="rejectReason" class="text-block">
                <el-input type="textarea" :row="5" readonly disabled v-model="rejectDetail.rejectReason"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </my-dialog>
  </div>
</template>
<script>
import RejectManager from './RejectManager.js';
export default RejectManager;
</script>
<style lang="scss" scoped>
@import './RejectManager.scss';
</style>



