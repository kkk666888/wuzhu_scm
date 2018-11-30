<template>
  <div class="return-application-main">
    <div class="common-search">
      <div class="item">
        <label>归还申请单号：</label>
        <el-input v-model="searchModel.returnApplyNo" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>物流单号：</label>
        <el-input v-model="searchModel.deliveryOrderNo" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>订单编号：</label>
        <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>归还单状态：</label>
        <el-select v-model="searchModel.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </div>
    </div>
    <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

    <!--确认收货弹窗-->
    <my-dialog :title='confirmReceiptDialog.title' :visible.sync='confirmReceiptDialog.visible' @onConfirm="confirmReceiptSave()">
      <div class="confirm-receipt-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>收货人
              <my-require/>：</label>
            <el-input v-model="confirmReceiptModel.signUser" type="text" :maxlength="50" placeholder="请输入"></el-input>
          </div>
          <div class="form-item">
            <label>收货时间
              <my-require/>：</label>
            <el-date-picker value-format="yyyy-MM-dd" v-model="confirmReceiptModel.signTime" type="date" placeholder="选择日期"></el-date-picker>
          </div>
          <div class="form-item form-item-flex">
            <label>描述：</label>
            <el-input v-model="confirmReceiptModel.remark" type="textarea" :maxlength="255" :rows="5"></el-input>
          </div>
        </div>
      </div>
    </my-dialog>

    <!--作废弹窗-->
    <my-dialog :title='cancellationDialog.title' :visible.sync='cancellationDialog.visible' @onConfirm="cancellationSave()">
      <div class="confirm-receipt-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>作废原因
              <my-require/>：</label>
            <el-select v-model="cancellationModel.invalidationReason">
              <el-option label="物流信息查询不到" value="物流信息查询不到"></el-option>
              <el-option label="客户要求取消" value="客户要求取消"></el-option>
              <el-option label="一直未收收货" value="一直未收收货"></el-option>
            </el-select>
          </div>
          <div class="form-item form-item-flex">
            <label>描述：</label>
            <el-input v-model="cancellationModel.remark" type="textarea" :maxlength="255" :rows="5"></el-input>
          </div>
        </div>
      </div>
    </my-dialog>

    <!--发起质检弹窗-->
    <my-dialog :title='qualityTestingDialog.title' :visible.sync='qualityTestingDialog.visible' @onConfirm="qualityTestingSave()">
      <div class="confirm-receipt-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>检验站点
              <my-require/>：</label>
            <el-input type="text" :maxlength="50" placeholder="请输入"></el-input>
          </div>
          <div class="form-item">
            <label>检验原因：</label>
            <el-input type="text" :maxlength="50" placeholder="请输入"></el-input>
          </div>
          <div class="form-item form-item-flex">
            <label>描述：</label>
            <el-input type="textarea" :maxlength="255" :rows="5"></el-input>
          </div>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import vueJs from './returnApplication.js';
export default vueJs;
</script>

<style lang="scss" scoped>
.return-application-main {
  .confirm-receipt-dialog {
    padding: 10px 60px;
  }
}
</style>

