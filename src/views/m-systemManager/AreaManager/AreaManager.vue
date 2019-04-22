<template>
  <div class="AreaManager">
    <div class="common-search">
      <el-form :model="searchModel" :rules="searchRules" ref="searchForm" label-width="100px" class="search-Form">
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
      <el-button type="primary" @click="addArea">添加区域</el-button>
      <el-button type="primary" @click="editArea">编辑区域</el-button>
      <el-button type="primary" @click="deleteArea">删除区域</el-button>
    </div>
    <my-tree-table ref="treeTable" :data="treeTableData" :option="treeTableOption" @rowClick="treeRowClick"></my-tree-table>

    <!--添加编辑弹窗-->
    <my-dialog :title='areaDialog.title' :visible.sync='areaDialog.visible' @onConfirm="confirmReceiptSave()">
      <div class="confirm-receipt-dialog">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px" class="dialog-form">
          <el-form-item label="上级区域">
            <el-input v-model="dialogForm.parentName" disabled></el-input>
          </el-form-item>
          <el-form-item label="区域编码" prop="regionalCode">
            <el-input v-model="dialogForm.regionalCode"></el-input>
          </el-form-item>
          <el-form-item label="区域名称" prop="regionalName">
            <el-input v-model="dialogForm.regionalName"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderNo">
            <el-input v-model="dialogForm.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="dialogForm.status" placeholder="请选择">
              <el-option label="正常" value="0"></el-option>
              <el-option label="停用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域负责人" prop="employeeNumber">
            <el-select v-model="dialogForm.employeeNumber" @change="choosePrincipal" filterable remote reserve-keyword placeholder="请输入搜索" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in remoteOptions" :key="item.id" :label="item.valueParam" :value="item.keyParam">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
  </div>
</template>
<script>
import AreaManager from './AreaManager.js';
export default AreaManager;
</script>
<style lang="scss" scoped>
.AreaManager {
  .confirm-receipt-dialog {
    padding: 30px 100px;
  }
}
</style>



