<template>
  <div class="order-main">
    <div class="common-search">
      <div class="item">
        <label>订单编号：</label>
        <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>客户姓名：</label>
        <el-input v-model="searchModel.customerName" placeholder="请输入" :maxlength="20"></el-input>
      </div>
      <div class="item">
        <label>订单状态：</label>
        <el-select v-model="searchModel.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in statusList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </div>
      <div class="item">
        <label>配货状态：</label>
        <el-select v-model="searchModel.allocateStatus" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in allocateStatus" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

    <!-- 发起拒收 -->
    <my-dialog title='发起拒收' :visible.sync='rejectApplyVisible' @onConfirm="rejectApplySave()">
      <div class="reject-apply-dialog">
        <el-form :model="rejectApplyModel" :rules="rejectApplyRules" ref="rejectApply" label-width="100px" class="dialog-form">
          <el-form-item label="拒收原因" prop="rejectReason">
            <el-input type="text" v-model="rejectApplyModel.rejectReason"></el-input>
          </el-form-item>
          <!-- <el-form-item label="物流单号" prop="deliveryOrderNo">
            <el-input type="textarea" v-model="rejectApplyModel.deliveryOrderNo"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
    </my-dialog>

    <!--延长租期-->
    <my-dialog title='延长租期' :visible.sync='extendTenancyTermDialog.visible' @onConfirm="extendTenancyTermSave()">
      <div class="extendTenancyTerm-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>天数：</label>
            <el-input v-model="extendTenancyTermDialog.days" placeholder="请输入延长天数" :maxlength="4"></el-input>
          </div>
          <div class="form-item">
            <label>延期原因：</label>
            <el-select v-model="extendTenancyTermDialog.type">
              <el-option label="请选择" value=""></el-option>
              <el-option label="非客户原因产生维修" value="0"></el-option>
              <el-option label="配件漏发" value="2"></el-option>
              <el-option label="系统原因导致客户实际租期缩短" value="3"></el-option>
              <el-option label="其他" value="10"></el-option>
            </el-select>
          </div>
          <div class="form-item form-item-flex">
            <label>说明：</label>
            <el-input v-model="extendTenancyTermDialog.remark" type="textarea" placeholder="请输入说明" :rows="5" :maxlength="300"></el-input>
          </div>
        </div>
      </div>
    </my-dialog>

    <!--确认完结
    <my-dialog title='确认完结' :visible.sync="finishDialog.visible" @onConfirm="finishSave()">
      <div class="finish-dialog">
        <div class="my-form">
          <div class="form-item">
            <label>是否需要额外扣费：</label>
            <el-select v-model="finishDialog.type">
              <el-option label="请选择" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </div>
        </div>
        <div>
          <div class="div-add">
            <div class="display-row">
              <div class="display-col">
                <el-button type="primary" @click="addFeeItem()">添加扣费记录</el-button>
              </div>
              <div class="display-col fee-span">
                费用合计：0
              </div>
            </div>
          </div>
          <my-table ref="feeTable" :height="400" :data="feeTableData" :option="feeTableOption"></my-table>
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
                <i class="el-icon-delete" style="font-size: 16px"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </my-dialog>
    -->

    <!--完结订单弹窗-->
    <my-dialog title="确认完结" :visible.sync="finishDialog.visible" confirmBtnTxt="提交" @onConfirm="finishSave()">
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
                <i class="el-icon-delete" style="font-size: 16px"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import vueJs from './order.js';
export default vueJs;
</script>

<style lang="scss" scoped>
.order-main {
  .extendTenancyTerm-dialog {
    padding: 20px 50px 20px 0;
  }
  .finish-dialog {
    padding: 20px 10px;
    width: 1000px;
    .my-form {
      text-align: center;
    }
    .div-add {
      margin-bottom: 10px;
      margin-top: 20px;
    }
    .fee-span {
      text-align: right;
    }
  }
  .reject-apply-dialog {
    padding: 10px 20px;
  }
  .dialog-content {
    width: 1010px;
    padding: 0 20px 10px;
  }
  .endOrder-head {
    margin-top: 10px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    .form-item {
      .el-input {
        width: 100px;
      }
    }
  }
  .endOrder-dialog {
    padding: 10px 20px;
  }
}
</style>

