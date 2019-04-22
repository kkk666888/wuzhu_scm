<template>
  <div class="placePurchaseOrder-main">
    <div class="common-search">
      <div class="item">
        <label>订单编号：</label>
        <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>客户姓名：</label>
        <el-input v-model="searchModel.customerName" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>商品编号：</label>
        <el-input v-model="searchModel.commdityNo" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>商品短名称：</label>
        <el-input v-model="searchModel.shortName" placeholder="请输入" :maxlength="30"></el-input>
      </div>
      <div class="item">
        <label>首期支付时间：</label>
        <el-date-picker
          v-model="searchModel.firstPayTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div class="item">
        <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
        <el-button @click="exportWaitPurchaseOrderList()">导出</el-button>
      </div>
    </div>

    <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

    <!--选择集采平台-->
    <my-dialog
      title="选择集采平台"
      :visible.sync="selectChannelDialog.visible"
      :option="{showFooter:false}"
    >
      <div class="select-channel-dialog">
        <my-table
          :height="200"
          :data="selectChannelDialog.data"
          :option="selectChannelDialog.option"
        ></my-table>
      </div>
    </my-dialog>

    <!--按订单下采购单-->
    <my-dialog
      title="按订单下采购单"
      :visible.sync="placeOrderDialog.visible"
      @onConfirm="placeOrderSave()"
      confirmBtnTxt="确认下单"
    >
      <div v-if="placeOrderItem" class="place-order-dialog">
        <div class="header">租赁订单信息</div>
        <div class="order-info">
          <div class="common-search">
            <div class="item">
              <label>商品品牌：{{placeOrderItem.brand}}</label>
              <span class="span-value"></span>
            </div>
            <div class="item">
              <label>商品名称：{{placeOrderItem.shortName}}</label>
              <span class="span-value"></span>
            </div>
            <div class="item">
              <label>规格参数：{{placeOrderItem.specDesc}}</label>
              <span class="span-value"></span>
            </div>
            <div class="item">
              <label>客户姓名：{{placeOrderItem.customerName}}</label>
              <span class="span-value"></span>
            </div>
            <div class="item">
              <label>收货人联系方式：{{placeOrderItem.receiverTel}}</label>
              <span class="span-value"></span>
            </div>
          </div>
          <div class="common-search">
            <div class="item">
              <label>收货人地址：</label>
              <span>{{placeOrderItem.consigneeAddr}}</span>
            </div>
          </div>
        </div>
        <div class="header">集采商商品信息</div>
        <div v-if="placeOrderDialog.detail" class="place-order-info">
          <div class="display-row">
            <div class="display-col display-col-400">
              <div class="div-img">
                <div class="largeDiv">
                  <img :src="placeOrderDialog.currentImgSrc">
                </div>
                <div class="div-img-list">
                  <div
                    class="item"
                    v-for="(item,index) in placeOrderDialog.detail.images"
                    :key="index"
                    @click="imgClick(item)"
                  >
                    <img :src="item">
                  </div>
                </div>
              </div>
            </div>
            <div class="display-col">
              <div class="content">
                <div class="lable-1">{{placeOrderDialog.detail.name}}</div>
                <div class="section">
                  <div>
                    采购价
                    <span class="lable-2">￥{{placeOrderDialog.detail.price}}</span>
                  </div>
                </div>
                <div class="section">
                  <div>{{placeOrderDialog.detail.stockDesc}}</div>
                  <div>重量：{{placeOrderDialog.detail.weight}}KG</div>
                  <div>
                    配送至：
                    <el-input
                      v-model="placeOrderDialog.consigneeAddr"
                      class="address-input"
                      placeholder="请输入"
                      :maxlength="200"
                    ></el-input>
                  </div>
                </div>
                <div class="section">
                  <div>数量：1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import vueJs from "./placePurchaseOrder.js";
export default vueJs;
</script>

<style lang="scss" scoped>
@import "./placePurchaseOrder.scss";
</style>

