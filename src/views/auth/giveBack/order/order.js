import { mapGetters } from 'vuex';

//订单管理
export default {
  name: 'order',
  data() {
    return {
      tableData: [],
      statusList: [],
      tableOption: this.getTableOption(),
      searchModel: this.initSearchModel(),
      feeTableData: [],
      feeTableOption: this.getFeeTableOption(),
      extendTenancyTermDialog: {
        visible: false,
        item: null,
        days: '',
        type: '',
        remark: ''
      },
      finishDialog: {
        visible: false,
        item: null
      },
      selectedRow: {},
      rejectApplyVisible: false,
      rejectApplyModel: {
        rejectReason: ''
      },
      rejectApplyRules: {
        rejectReason: [{ required: true, message: '请输入拒收原因', trigger: 'blur' }]
      },
      feeTotal: '',
      feeTypeOptions: []
    };
  },
  computed: {
    ...mapGetters(['get_user_info'])
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
        customerName: '',
        status: ''
      };
    },
    //重置
    reset() {
      this.searchModel = this.initSearchModel();
      this.$refs.table.refreshPaging(1);
    },
    //表格配置
    getTableOption() {
      let thisObj = this;
      let option = {
        showPage: true,
        autoHeight: true,
        showSerial: true,
        columns: [
          { prop: 'orderNo', label: '订单编号', width: 220 },
          { prop: 'statusName', label: '订单状态', width: 150 },
          { prop: 'customerName', label: '客户姓名', width: 150 },
          { prop: 'typeName', label: '商品类型', width: 150 },
          { prop: 'shortName', label: '商品短名称', width: 300 },
          { prop: 'specContentList', label: '商品规格' },
          {
            prop: 'opreate',
            label: '操作',
            width: 400,
            render(h, param) {
              let reject = true;
              if (param.row.statusName === '已发货-已发货') {
                reject = false;
              }
              const btn1 = (
                <el-button
                  type="primary"
                  disabled={param.row.status !== '9001'}
                  onClick={() => {
                    // thisObj.confirmFinish(param.row);
                    thisObj.finishOpen(param.row) // modify by zou
                  }}
                >
                  确认完结
                </el-button>
              );
              const btn2 = (
                <el-button
                  type="primary"
                  disabled={param.row.status !== '9001'}
                  onClick={() => {
                    thisObj.buyOut(param.row);
                  }}
                >
                  强制买断
                </el-button>
              );
              const btn3 = (
                <el-button
                  type="primary"
                  disabled={param.row.bizStatus !== '7'}
                  onClick={() => {
                    thisObj.extendTenancyTermOpen(param.row);
                  }}
                >
                  延长租期
                </el-button>
              );
              const btn4 = (
                <el-button
                  type="primary"
                  disabled={reject}
                  onClick={() => {
                    thisObj.rejectApply(param.row);
                  }}
                >
                  发起拒收
                </el-button>
              );
              let arr = [];
              arr.push(btn1, btn2, btn3, btn4);
              return arr;
            }
          }
        ]
      };

      return option;
    },
    //费用表格配置
    getFeeTableOption() {
      let thisObj = this;
      let option = {
        columns: [
          {
            prop: 'a',
            label: '扣费原因类型',
            width: 220,
            render(h, param) {
              return (
                <div>
                  <el-select v-model={param.row.a}>
                    <el-option label="请选择" value="" />
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </div>
              );
            }
          },
          {
            prop: 'b',
            label: '扣费金额',
            width: 150,
            render(h, param) {
              return (
                <div>
                  <el-input v-model={param.row.b} placeholder="请输入" />
                </div>
              );
            }
          },
          {
            prop: 'c',
            label: '详情描述',
            render(h, param) {
              return (
                <div>
                  <el-input v-model={param.row.c} placeholder="请输入" />
                </div>
              );
            }
          },
          {
            prop: 'opreate',
            label: '操作',
            width: 80,
            render(h, param) {
              return (
                <div>
                  <el-button
                    type="primary"
                    onClick={() => {
                      thisObj.removeFeeItem(param.row);
                    }}
                  >
                    删除
                  </el-button>
                </div>
              );
            }
          }
        ]
      };
      return option;
    },
    //加载表格数据
    getList(pageInfo, callback) {
      let param = {
        pageNum: pageInfo.pageIndex,
        pageSize: pageInfo.pageSize,
        orderNo: this.searchModel.orderNo || null,
        customerName: this.searchModel.customerName || null,
        status: this.searchModel.status || null
      };

      this.api.orders.getList.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.tableData = res.data.list || [];
          callback(res.data.total);
        }
      });
    },
    // 发起拒收申请
    rejectApply(row) {
      this.selectedRow = row;
      this.rejectApplyVisible = true;
    },
    rejectApplySave() {
      this.$refs.rejectApply.validate(valid => {
        if (valid) {
          this.rejectApplyFetch();
        }
      });
    },
    async rejectApplyFetch() {
      let param = { ...this.rejectApplyModel };
      param['orderNo'] = this.selectedRow.orderNo;
      param['fromType'] = '3';
      param['operationUser'] = this.get_user_info.id;
      try {
        const res = await this.$api.reject.apply.send(param, { showLoading: true });
        if (res.code === '00') {
          this.rejectApplyVisible = false;
          this.rejectApplyModel.rejectReason = '';
          this.$alert.toast('发起拒收成功');
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        // this.$alert.error(error.message);
        console.log(error);
      }
    },
    //获取状态
    getStatus() {
      this.api.orders.status.send().then(res => {
        if (res.code === '00') {
          this.statusList = res.data || [];
        }
      });
    },
    //强制买断
    buyOut(item) {
      let thisObj = this;
      thisObj.alert.confirm('确认要强制买断', {
        onConfirm() {
          thisObj.api.orders.buyOut.send({ orderNo: item.orderNo }, { showLoading: true }).then(res => {
            if (res.code === '00') {
              thisObj.$refs.table.refreshPaging();
            }
          });
        }
      });
    },
    //延长租期-打开
    extendTenancyTermOpen(item) {
      this.extendTenancyTermDialog.visible = true;
      this.extendTenancyTermDialog.item = item;
      this.extendTenancyTermDialog.days = '';
      this.extendTenancyTermDialog.type = '';
      this.extendTenancyTermDialog.remark = '';
    },
    //延长租期-保存
    extendTenancyTermSave() {
      if (!this.extendTenancyTermDialog.days) {
        this.alert.toast('请输入天数');
        return;
      }
      if (!this.common.valid.isNum(this.extendTenancyTermDialog.days)) {
        this.alert.toast('天数为正整数');
        return;
      }
      if (this.extendTenancyTermDialog.type === '') {
        this.alert.toast('请选择延期原因');
        return;
      }
      let param = {
        orderNo: this.extendTenancyTermDialog.item.orderNo,
        days: this.extendTenancyTermDialog.days,
        type: this.extendTenancyTermDialog.type,
        remark: this.extendTenancyTermDialog.remark
      };
      this.api.orders.delay.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.alert.toast('延长租期成功');
          this.extendTenancyTermDialog.visible = false;
          this.$refs.table.refreshPaging();
        }
      });
    },
    //添加费目
    addFeeItem() {
      let item = {
        id: this.common.generateUniqueValue(),
        a: '',
        b: '',
        c: ''
      };
      this.feeTableData.push(item);
    },
    //移除费目
    removeFeeItem(item) {
      this.common.removeItem(this.feeTableData, 'id', item.id);
    },
    finishSave() {
      console.log(this.feeTableData);
    },
    confirmFinish(item) {
      let thisObj = this;
      thisObj.alert.confirm('确认完结？', {
        onConfirm() {
          thisObj.api.orders.finish.send({ orderNo: item.orderNo }, { showLoading: true }).then(res => {
            if (res.code === '00') {
              thisObj.$refs.table.refreshPaging();
            }
          });
        }
      });
    },
    //确认完结
    finishOpen(item) {
      this.selectedRow = item;
      this.finishDialog.visible = true;
      this.getFeeTypeFetch()
    },
    // 获取费用类型
    async getFeeTypeFetch() {
      let param = {};
      try {
        const res = await this.$api.reject.feeType.send(param, { showLoading: true });
        if (res.code === '00') {
          this.feeTypeOptions = [...res.data];
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 选择费用类型
    changeFeeType(index, row) {
      // console.log(index, row);

      row.feeAmt = this.feeTypeOptions[row.feeType].feeAmt;
      this.getTotalFee();
    },
    // 输入费用金额
    inputFeeAmt() {
      this.getTotalFee();
    },
    // 费用求和
    getTotalFee() {
      let total = 0;
      this.feeTableData.map(item => {
        total += Number(item.feeAmt);
      });
      this.feeTotal = total;
    },
    // 添加费用明细
    addFeeDetail() {
      let row = {
        feeType: null,
        feeAmt: null,
        remark: ''
      };
      this.feeTableData.push(row);
    },
    // 删除行
    deleteRow(index, data) {
      data.splice(index, 1);
      this.getTotalFee();
    },
    // 提交保存费用
    finishSave() {
      if (Number.isNaN(this.feeTotal)) {
        this.$alert.info('请输入正确金额');
        return false;
      }
      let param = {
        orderNo: this.selectedRow.orderNo,
        rentAfterApplyNo: this.selectedRow.rentAfterApplyNo,
        businessType: 'NORMAL_FINISH',
        wzFeeInfoList: []
      };
      let type = this.feeTypeOptions;
      let isPass = true;
      this.feeTableData.map(item => {
        if (item.feeType === null) {
          this.$alert.toast('请选择费用类型');
          isPass = false;
        }
        let feeItem = { ...type[item.feeType] };
        feeItem['feeAmt'] = item['feeAmt'];
        feeItem['remark'] = item['remark'];
        param.wzFeeInfoList.push(feeItem);
      });
      if (isPass) {
        this.endOrderFetch(param);
      }
    },
    async endOrderFetch(param) {
      try {
        const res = await this.$api.reject.finish.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('完结成功');
          this.feeTableData.length = 0;
          this.feeTotal = 0;
          this.finishDialog.visible = false;
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  },
  mounted() {
    this.getStatus();
    this.addFeeItem();
  }
};
