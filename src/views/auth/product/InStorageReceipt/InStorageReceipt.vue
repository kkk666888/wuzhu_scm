<template>
  <div class="InStorageReceipt">
    <!-- 搜索模块 -->
    <div class="common-search">
      <el-form :model="searchModel" :rules="searchRules" ref="searchForm" label-width="120px" class="search-Form">
        <el-form-item v-for="(item,index) in searchFields" :key="index" :prop="item.name" :label="item.label + ' :'">
          <el-input v-if="item.type === 'input'" placeholder="请输入" type="text" v-model="searchModel[item.name]"></el-input>
          <el-select v-if="item.type === 'select'" placeholder="请选择" v-model="searchModel[item.name]">
            <el-option v-for="(opItem,opIndex) in searchOptions[item.list]" :key="opIndex" :label="opItem.text" :value="opItem.value"></el-option>
          </el-select>
          <el-date-picker v-if="item.type === 'daterange'" v-model="searchModel[item.name]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-item">
      <el-button type="primary" @click="exportReceipt">导出</el-button>
      <my-upload v-model="importFile" class="ml10" :path="importUrl" btnText="批量导入"  @uploadSuccess="uploadSuccess" :showFilelist="false" :acceptType="2"></my-upload>
      <el-button type="primary" @click="deleteReceipt">删除</el-button>
      <el-button type="primary" @click="confirmInStorage">确认入库</el-button>
    </div>
    <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

    <!--入库单明细弹窗-->
    <my-dialog :title="receiptDetail.title" :visible.sync="receiptDetail.visible" :option="detailDailogOption">
      <div class="detail-content">
        <el-form :model="receiptDetailForm" label-width="120px" class="dialog-form">
          <el-tabs value="tab">
            <el-tab-pane label="入库单信息" name="tab">
              <el-form-item label="入库单号" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="receiptDetailForm.number"></el-input>
              </el-form-item>
              <el-form-item label="入库类别" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="receiptDetailForm.bizTypeName"></el-input>
              </el-form-item>
              <el-form-item label="供应商名称" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="receiptDetailForm.supplierName"></el-input>
              </el-form-item>
              <el-form-item label="入库时间" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="receiptDetailForm.inTime"></el-input>
              </el-form-item>
              <el-form-item label="入库人" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="receiptDetailForm.inPersonName"></el-input>
              </el-form-item>
              <el-form-item label="审核人" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="receiptDetailForm.auditorPersonName"></el-input>
              </el-form-item>
              <el-form-item label="入库状态" prop="expressCompanyName">
                <el-input type="input" readonly disabled v-model="receiptDetailForm.statusName"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="备注" prop="expressCompanyName">
                <el-input type="textarea" class="textarea" :rows="5" readonly disabled v-model="receiptDetailForm.reason"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <my-table ref="detailTable" :data="detailTableData" :option="detailTableOption"></my-table>
      </div>
    </my-dialog>

  </div>
</template>
<script>
import InStorageReceipt from './InStorageReceipt.js';
export default InStorageReceipt;
</script>
<style lang="scss" scoped>
@import './InStorageReceipt.scss';
</style>

<style lang="css">
.InStorageReceipt .el-range-separator {
  width: 7%;
}
</style>



