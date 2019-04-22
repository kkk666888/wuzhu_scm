<template>
  <div class="QCManager">
    <div class="common-search">
      <el-form
        :model="searchModel"
        :rules="searchRules"
        ref="searchForm"
        label-width="120px"
        class="search-Form"
      >
        <el-form-item
          v-for="(item,index) in searchFields"
          :key="index"
          :prop="item.name"
          :label="item.label + ' :'"
        >
          <el-input
            v-if="item.type === 'input'"
            placeholder="请输入"
            type="text"
            v-model="searchModel[item.name]"
          ></el-input>
          <el-select
            v-if="item.type === 'select'"
            placeholder="请选择"
            v-model="searchModel[item.name]"
          >
            <el-option
              v-for="(opItem,opIndex) in searchOptions[item.list]"
              :key="opIndex"
              :label="opItem.text"
              :value="opItem.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search('searchRules')">查询</el-button>
          <el-button @click="reset('searchRules')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-item">
      <el-button type="primary" @click="exportExcel()">导出</el-button>
    </div>
    <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

    <!--质检结果弹窗-->
    <my-dialog
      :title="qcDetail.title"
      :visible.sync="qcDetail.visible"
      @onConfirm="confirmQCDetail"
      :option="detailOption"
    >
      <div class="dialog-content">
        <el-form :model="qcDetailForm" label-width="100px" class="dialog-form">
          <el-tabs value="tab3">
            <el-tab-pane label="订单基本信息" name="tab3">
              <el-form-item label="订单编号" prop="orderNo">
                <el-input
                  type="input"
                  readonly
                  disabled
                  :title="qcDetailForm.orderNo"
                  v-model="qcDetailForm.orderNo"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品名称" prop="commodityName">
                <el-input type="input" readonly disabled v-model="qcDetailForm.commodityName"></el-input>
              </el-form-item>
              <el-form-item label="规格属性" prop="specContentList">
                <el-input type="input" readonly disabled v-model="qcDetailForm.specContentList"></el-input>
              </el-form-item>
              <el-form-item label="客户姓名" prop="customerName">
                <el-input type="input" readonly disabled v-model="qcDetailForm.customerName"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="tab4">
            <el-tab-pane label="关联的业务单据信息" name="tab4">
              <el-form-item label="租后申请单号" prop="afterRentApplyNo">
                <el-input type="input" readonly disabled v-model="qcDetailForm.afterRentApplyNo"></el-input>
              </el-form-item>
              <el-form-item label="单据类型" prop="rentAfterApplyType">
                <el-input type="input" readonly disabled v-model="qcDetailForm.rentAfterApplyType"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-tabs value="tab5">
            <el-tab-pane label="质检申请单信息" name="tab5">
              <el-form-item label="质检申请单号" prop="inspectionApplyNo">
                <el-input type="input" readonly disabled v-model="qcDetailForm.inspectionApplyNo"></el-input>
              </el-form-item>
              <el-form-item label="质检原因" prop="inspectionReasonName">
                <el-input
                  type="input"
                  readonly
                  disabled
                  v-model="qcDetailForm.inspectionReasonName"
                ></el-input>
              </el-form-item>
              <el-form-item label="申请人" prop="applyUser">
                <el-input type="input" readonly disabled v-model="qcDetailForm.applyUser"></el-input>
              </el-form-item>
              <el-form-item label="申请时间" prop="applyTime">
                <el-input type="input" readonly disabled v-model="qcDetailForm.applyTime"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="statusName">
                <el-select v-model="qcDetailForm.status" v-if="qcDetail.title === '更新质检结果'">
                  <el-option label="质检完成" value="1"></el-option>
                </el-select>
                <el-input type="input" readonly disabled v-else v-model="qcDetailForm.statusName"></el-input>
              </el-form-item>
              <el-form-item label="质检结论" prop="inspectionResult">
                <el-select
                  v-model="qcDetailForm.inspectionResult"
                  v-if="qcDetail.title === '更新质检结果'"
                >
                  <el-option
                    v-for="(item,index) in resultOptions"
                    :key="index"
                    :label="item.itemName"
                    :value="item.itemNo"
                  ></el-option>
                </el-select>
                <el-input
                  type="input"
                  readonly
                  disabled
                  v-else
                  v-model="qcDetailForm.inspectionResultName"
                ></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </my-dialog>

    <!--作废弹窗-->
    <my-dialog
      :title="cancellationDialog.title"
      :visible.sync="cancellationDialog.visible"
      @onConfirm="cancellationSave"
    >
      <div class="invalid-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>
              作废原因
              <my-require/>：
            </label>
            <el-input
              type="text"
              v-model.trim="cancellationModel.invalidReason"
              :maxlength="50"
              placeholder="请输入"
            ></el-input>
          </div>
          <div class="form-item form-item-flex">
            <label>描述：</label>
            <el-input
              v-model="cancellationModel.invalidRemark"
              type="textarea"
              :maxlength="255"
              :rows="5"
            ></el-input>
          </div>
        </div>
      </div>
    </my-dialog>

    <!--上传附件-->
    <my-dialog
      :title="qcVedioFlagTitle"
      :visible.sync="qcVedioFlag"
      @onConfirm="confirmQCVedioFiles"
    >
      <div class="invalid-dialog">
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
import QCManager from "./QCManager.js";
export default QCManager;
</script>
<style lang="scss" scoped>
@import "./QCManager.scss";
.QCManager {
  .el-form-item {
    display: inline-block;
  }
  .dialog-content {
    width: 1000px;
    padding: 10px 20px;
    .el-select {
      width: 200px;
    }
  }
  .invalid-dialog {
    padding: 10px 10px;
  }
}
</style>



