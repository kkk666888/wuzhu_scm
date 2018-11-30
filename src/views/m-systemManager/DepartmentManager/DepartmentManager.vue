<template>
  <div class="DepartmentManager">
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
    <my-table ref="departmentTable" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

  </div>
</template>
<script>
import DepartmentManager from './DepartmentManager.js';
export default DepartmentManager;
</script>
<style lang="scss" scoped>
.DepartmentManager {
}
</style>



