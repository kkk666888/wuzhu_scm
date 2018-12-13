<template>
  <div class="outStorageReceipt">
    <!-- 搜索模块 -->
    <div class="common-search">
      <el-form :model="searchModel" :rules="searchRules" ref="searchForm" label-width="120px" class="search-Form">
        <el-form-item v-for="(item,index) in searchFields" :key="index" :prop="item.name" :label="item.label + ' :'">
          <el-input v-if="item.type === 'input'" placeholder="请输入" type="text" v-model="searchModel[item.name]"></el-input>
          <el-select v-if="item.type === 'select'" placeholder="请选择" v-model="searchModel[item.name]">
            <el-option v-for="(opItem,opIndex) in searchOptions[item.list]" :key="opIndex" :label="opItem.text" :value="opItem.value"></el-option>
          </el-select>
          <el-date-picker v-if="item.type === 'daterange'" v-model="searchModel[item.name]" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <div style="text-align: center; width: 100%;">
          <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset()">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="btn-item">
      <el-button type="primary" @click="exportOutReceipt"><i class="el-icon-download el-icon--left"></i>导出</el-button>
      <el-button type="primary" @click="printOutReceipt"><i class="el-icon-printer el-icon--left"></i>打印</el-button>
    </div>
    <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>
  </div>
</template>
<script>
import outStorageReceipt from './outStorageReceipt.js';
export default outStorageReceipt;
</script>
<style lang="scss" scoped>
@import './outStorageReceipt.scss';
</style>

<style lang="css">
.outStorageReceipt .el-range-separator {
  width: 7%;
}
</style>



