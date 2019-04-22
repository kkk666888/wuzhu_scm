<template>
  <div class="ResourceManager">
    <div class="common-search">
      <!-- <el-form :model="searchModel" :rules="searchRules" ref="searchForm" label-width="100px" class="search-Form">
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
      </el-form> -->
    </div>
    <div class="btn-item">
      <el-button type="primary" @click="addSource">添加资源</el-button>
      <el-button type="primary" @click="editSource">编辑资源</el-button>
      <el-button type="primary" @click="deleteSource">删除资源</el-button>
    </div>
    <my-tree-table ref="treeTable" :data="treeTableData" :option="treeTableOption" @rowClick="treeRowClick"></my-tree-table>

    <!--添加编辑弹窗-->
    <my-dialog :title='sourceDialog.title' :visible.sync='sourceDialog.visible' @onConfirm="confirmReceiptSave()" @onClose="closeDialog">
      <div class="confirm-receipt-dialog">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="120px" class="dialog-form">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model.trim="dialogForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-select v-model="dialogForm.type">
              <el-option value="dirt" label="目录"></el-option>
              <el-option value="menu" label="菜单"></el-option>
              <el-option value="button" label="按钮"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="父级资源">
            <el-input v-model="parentName" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="available">
            <el-select v-model="dialogForm.available">
              <el-option value="true" label="启用"></el-option>
              <el-option value="false" label="停用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="前端访问路径" prop="classPath">
            <el-input v-model="dialogForm.classPath"></el-input>
          </el-form-item>
          <el-form-item label="后端访问路径" prop="url">
            <el-input v-model="dialogForm.url"></el-input>
          </el-form-item>
          <el-form-item label="权限字符串" prop="permission">
            <el-input v-model="dialogForm.permission"></el-input>
          </el-form-item>
          <el-form-item label="菜单优先级" prop="priority">
            <el-input v-model="dialogForm.priority"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
  </div>
</template>
<script>
import ResourceManager from './ResourceManager.js';
export default ResourceManager;
</script>
<style lang="scss" scoped>
.ResourceManager {
  .confirm-receipt-dialog {
    padding: 30px 100px;
  }
}
</style>



