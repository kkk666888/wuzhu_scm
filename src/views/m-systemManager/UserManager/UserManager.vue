<template>
  <div class="UserManager">
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
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button type="primary" @click="editUser">编辑用户</el-button>
      <el-button type="primary" @click="deleteUser">删除用户</el-button>
      <el-button type="primary" @click="modifyPassword">修改密码</el-button>
      <el-button type="primary" @click="resetPassword">重置密码</el-button>
    </div>
    <my-table ref="userTable" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

    <!--添加编辑弹窗-->
    <my-dialog :title='userDialog.title' :visible.sync='userDialog.visible' @onConfirm="confirmReceiptSave()">
      <div class="confirm-receipt-dialog">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px" class="dialog-form">
          <el-form-item label="用户账户" prop="username">
            <el-input v-model="dialogForm.username"></el-input>
          </el-form-item>
          <el-form-item v-if="userDialog.title === '添加用户'" label="密码" prop="password">
            <el-input v-model="dialogForm.password"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="realname">
            <el-input v-model="dialogForm.realname"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleId">
            <el-select placeholder="请选择" multiple v-model="dialogForm.roleId">
              <el-option v-for="item in roleOptions" :key="item.roleId" :value="String(item.roleId)" :label="item.role"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态" prop="statu">
            <el-select placeholder="请选择" v-model="dialogForm.statu">
              <el-option :value="1" label="启用"></el-option>
              <el-option :value="0" label="停用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="dialogForm.email"></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="phone">
            <el-input v-model="dialogForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="dptId">
            <el-select v-model="dialogForm.dptId" placeholder="请选择活动区域">
              <my-tree-table :data="treeData" :option="treeOption" @treeClick="myTreeClick(item)"></my-tree-table>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>

    <!-- 选择区域弹窗 -->
    <my-dialog title='选择区域' :visible.sync='chooseRegionVisible' @onConfirm="confirmReceiptSaveRegion()">
      <div class="confirm-receipt-dialog tree-dialog">
        <el-tree ref="tree" :default-checked-keys="treeCheckedKeys" :data="treeData2" show-checkbox node-key="id" highlight-current :props="treeTableOption">
        </el-tree>
      </div>
    </my-dialog>

    <!-- 修改密码弹窗 -->
    <my-dialog :title='modifyDialog.title' :visible.sync='modifyDialog.visible' @onConfirm="confirmModifyPwd()">
      <div class="confirm-receipt-dialog">
        <el-form :model="modifyPasswordForm" :rules="modifyPasswordRules" ref="modifyPasswordForm" label-width="100px" class="dialog-form">
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input type="password" v-model="modifyPasswordForm.oldPwd" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="modifyPasswordForm.newPwd" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input type="password" v-model="modifyPasswordForm.confirmPwd" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
  </div>
</template>
<script>
import UserManager from './UserManager.js';
export default UserManager;
</script>
<style lang="scss" scoped>
.UserManager {
  .confirm-receipt-dialog {
    padding: 30px 100px;
  }
}
</style>



