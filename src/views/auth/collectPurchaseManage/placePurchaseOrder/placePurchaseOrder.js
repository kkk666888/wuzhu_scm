import ExportFile from '@/utils/export';

//下采购单
export default {
  name: 'placePurchaseOrder',
  data() {
    return {
      tableData: [],
      tableOption: this.getTableOption(),
      searchModel: this.initSearchModel(),
      channelList: [],
      selectChannelDialog: {
        visible: false,
        data: [],
        option: this.getChannelTableOption()
      },
      placeOrderDialog: {
        visible: false,
        detail: null,
        currentImgSrc: '',
        consigneeAddr: ''
      },
      placeOrderItem: null,
      vopItem: null
    };
  },
  methods: {
    //查询
    search() {
      this.$refs.table.refreshPaging(1);
    },
    //查询实体
    initSearchModel() {
      return {
        orderNo: '',
        commdityNo: '',
        shortName: '',
        customerName: '',
        firstPayTime: []
      };
    },
    //重置
    reset() {
      this.searchModel = this.initSearchModel();
      this.$refs.table.refreshPaging(1);
    },
    // 导出
    async exportWaitPurchaseOrderList() {
      let param = {
        commdityNo: this.searchModel.commdityNo,
        shortName: this.searchModel.shortName,
        orderNo: this.searchModel.orderNo,
        customerName: this.searchModel.customerName
        // firstPayTime: this.searchModel.firstPayTime
      };
      if (this.searchModel.firstPayTime.length) {
        param['startTime'] = this.searchModel.firstPayTime[0];
        param['endTime'] = this.searchModel.firstPayTime[1];
      }
      try {
        const res = await this.api.orderPurchase.exportWaitPurchaseOrderList.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('导出中', { autoHideTimeout: 2000 });
          let date = new Date().toLocaleDateString();
          ExportFile(res.data, `采购下单${date}`);
        }
      } catch (error) {
        console.log(error);
      }
    },
    //表格配置
    getTableOption() {
      let thisObj = this;
      let option = {
        showPage: true,
        autoHeight: true,
        showSerial: true,
        columns: [
          { prop: 'commodityNo', label: '物主商品SKU', width: 130 },
          { prop: 'typeName', label: '商品类型', width: 100 },
          { prop: 'brand', label: '商品品牌', width: 100 },
          { prop: 'shortName', label: '商品短名称', width: 250 },
          { prop: 'specDesc', label: '规格参数', width: 250 },
          { prop: 'orderNo', label: '订单编号', width: 200 },
          { prop: 'firstPayTime', label: '首期支付时间', width: 200 },
          { prop: 'customerName', label: '客户姓名', width: 100 },
          { prop: 'consigneeAddr', label: '收货地址', width: 200 },
          { prop: 'receiverTel', label: '收货人联系方式', width: 120 },
          { prop: 'applyTime', label: '申请日期', width: 120 },
          { prop: 'intoChannelName', label: '进件渠道', width: 120 },
          {
            prop: 'operate',
            label: '操作',
            fixed: 'right',
            width: 100,
            render(h, param) {
              return (
                <div>
                  <el-button
                    type="primary"
                    onClick={() => {
                      thisObj.selectChannelOpen(param.row);
                    }}
                  >
                    下采购单
                  </el-button>
                </div>
              );
            }
          }
        ]
      };

      return option;
    },
    //表格配置
    getChannelTableOption() {
      let thisObj = this;
      return {
        columns: [
          { prop: 'vopChannelName', label: '集采平台', width: 200 },
          { prop: 'price', label: '报价', width: 120 },
          { prop: 'stockNum', label: '库存数量', width: 120 },
          {
            prop: 'operate',
            label: '操作',
            width: 80,
            render(h, param) {
              return (
                <el-button
                  type="primary"
                  onClick={() => {
                    thisObj.placeOrderOpen(param.row);
                  }}
                >
                  确定
                </el-button>
              );
            }
          }
        ]
      };
    },
    //加载表格数据
    getList(pageInfo, callback) {
      let param = {
        pageNum: pageInfo.pageIndex,
        pageSize: pageInfo.pageSize,
        commdityNo: this.searchModel.commdityNo,
        shortName: this.searchModel.shortName,
        orderNo: this.searchModel.orderNo,
        customerName: this.searchModel.customerName
      };
      if (this.searchModel.firstPayTime.length) {
        param['startTime'] = this.searchModel.firstPayTime[0];
        param['endTime'] = this.searchModel.firstPayTime[1];
      }
      this.api.orderPurchase.getList.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.tableData = res.data.list || [];
          callback(res.data.total);
        }
      });
    },
    // 加载集采商
    loadCollectProvider() {
      this.api.commdityType.getChannelList.send(null, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.channelList = res.data || [];
        }
      });
    },
    //选择集采商-打开
    selectChannelOpen(item) {
      let param = {
        commodityNo: item.commodityNo,
        receiveAddress: item.consigneeAddr
      };
      this.api.commdityBind.queryBindedSkuDetail.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          let data = res.data || [];
          if (data.length === 0) {
            this.alert.toast('请先绑定后下单');
            return;
          }
          this.placeOrderItem = item;
          this.selectChannelDialog.data = data;
          this.selectChannelDialog.visible = true;
        }
      });
    },
    //下采购单-打开
    placeOrderOpen(item) {
      this.vopItem = item;
      let param = {
        skuId: item.skuId,
        channelType: item.vopChannelType,
        receiveAddress: this.placeOrderItem.consigneeAddr
      };
      this.api.vopApiAccess.querySkuDetail.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.selectChannelDialog.visible = false;
          this.placeOrderDialog.visible = true;
          this.placeOrderDialog.detail = res.data;
          if (res.data && res.data.images && res.data.images.length > 0) {
            for (var i in res.data.images) {
              if (res.data.images[i].indexOf('http') < 0) {
                res.data.images[i] = 'http://' + res.data.images[i];
              }
            }
            this.placeOrderDialog.currentImgSrc = res.data.images[0];
          }
          this.placeOrderDialog.consigneeAddr = this.placeOrderItem.consigneeAddr;
        }
      });
    },
    //下采购单-保存
    placeOrderSave() {
      if (!this.placeOrderDialog.consigneeAddr) {
        this.alert.toast('请输入收货地址');
        return;
      }

      let param = {
        brand: this.placeOrderItem.brand,
        channelType: this.vopItem.vopChannelType,
        commodityNo: this.placeOrderItem.commodityNo,
        nums: 1,
        orderNo: this.placeOrderItem.orderNo,
        shortName: this.placeOrderItem.shortName,
        skuIds: this.vopItem.skuId,
        specDesc: this.placeOrderItem.specDesc,
        typeName: this.placeOrderItem.typeName,
        vopChannelType: this.vopItem.vopChannelType,
        receiveAddress: this.placeOrderDialog.consigneeAddr
      };

      this.api.vopApiAccess.vopOrderApply.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.placeOrderDialog.visible = false;
          this.$refs.table.refreshPaging();
        }
      });
    },
    imgClick(src) {
      this.placeOrderDialog.currentImgSrc = src;
    }
  },
  mounted() {
    this.loadCollectProvider();
  }
};
