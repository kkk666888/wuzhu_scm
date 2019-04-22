import { mapGetters } from 'vuex';
// 拒收管理
export default {
  name: 'RejectManager',
  data() {
    return {
      // tableData: this.testData(),
      tableData: [], // table数据
      tableOption: this.getTableOption(), // table配置
      searchRules: {}, // 搜索校验
      searchModel: {
        orderNo: '',
        rentAfterStatus: null,
        goodsId: '',
        customerName: '',
        rejectReason: '',
        shortName: ''
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      confirmReceiptModel: this.initConfirmReceiptModel(), // 确认收货表单
      confirmReceiptRules: {
        expressCompanyName: [{ required: true, message: '请输入物流公司', trigger: 'blur' }],
        deliveryOrderNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
        signUser: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        signTime: [{ required: true, message: '请输入收货时间', trigger: 'change' }]
      }, // 确认收货验证
      confirmReceiptVisible: false,
      qualityCheckForm: this.initQualityCheckForm(), // 发起质检表单
      qualityCheckDialog: {
        visible: false,
        title: '发起质检申请'
      },
      cancellationModel: this.initCancellationModel(), // 作废表单
      cancellationDialog: {
        visible: false,
        title: '作废'
      },
      endOrderDialog: {
        title: '完结订单',
        visible: false
      },
      rejectDetailVisible: false, // 订单详情
      rejectDetail: this.initRejectDetail(),
      feeTableData: [
        {
          feeType: null,
          feeAmt: null,
          remark: ''
        }
      ],
      feeTotal: '',
      feeTypeOptions: [],
      selectedRow: {},
      detailOption: {
        showFooter: false
      }
    };
  },
  component: {},
  computed: {
    ...mapGetters(['get_user_info'])
  },
  methods: {
    testData() {
      return [
        {
          rejectApplyNo: '123456'
        }
      ];
    },
    // 详情表单
    initRejectDetail() {
      return {
        orderNo: '',
        createTime: '',
        orderStatus: '',
        goodsId: '',
        commodityNo: '',
        shortName: '',
        customerName: '',
        customerMobile: '',
        customerId: '',
        expressCompanyName: '',
        deliveryOrderNo: '',
        deliveryDate: '',
        receiverName: '',
        consigneeAddr: '',
        receiverTel: '',
        rejectApplyNo: '',
        rentAfterApplyNo: '',
        status: '',
        rejectReason: '',
        remark: '',
        fromType: '',
        signTime: '',
        signUser: ''
      };
    },
    // 作废表单
    initCancellationModel() {
      return {
        id: '',
        userId: '',
        invalidReason: '',
        remark: ''
      };
    },
    // 发起质检表单
    initQualityCheckForm() {
      return {
        inspectionReasonName: '拒收质检',
        inspectionReason: '1',
        inspectionStationOid: '',
        inspectionUser: '',
        orderNo: '',
        applyUserId: '',
        applyUserName: '',
        remark: ''
      };
    },
    // 确认收货表单
    initConfirmReceiptModel() {
      return {
        expressCompanyName: '',
        deliveryOrderNo: '',
        signUser: '',
        signTime: '',
        id: '',
        userId: ''
      };
    },
    // 搜索选择框列表
    getSearchOptions() {
      let option = {
        statusMap: [
          {
            text: '待客服确认',
            value: '00001'
          },
          {
            text: '进行中-待收货',
            value: '00002'
          },
          {
            text: '进行中-已收货',
            value: '00003'
          },
          {
            text: '进行中-扣款中',
            value: '00004'
          },
          {
            text: '进行中-质检处理中',
            value: '00005'
          },
          {
            text: '进行中-已完成',
            value: '00006'
          },
          {
            text: '作废',
            value: '-1'
          }
        ]
      };
      return option;
    },
    // 搜索配置
    getSearchFields() {
      let option = [
        {
          type: 'input',
          label: '订单号',
          name: 'orderNo'
        },
        {
          type: 'input',
          label: 'IMEI码',
          name: 'goodsId'
        },
        {
          type: 'input',
          label: '客户姓名',
          name: 'customerName'
        },
        {
          type: 'input',
          label: '拒收原因',
          name: 'rejectReason'
        },
        {
          type: 'input',
          label: '商品名称',
          name: 'shortName'
        },
        {
          type: 'select',
          label: '状态',
          name: 'rentAfterStatus',
          list: 'statusMap'
        }
      ];
      return option;
    },
    //表格配置
    getTableOption() {
      let _this = this;
      let option = {
        idField: '',
        showPage: true,
        autoHeight: true,
        showSerial: true,
        // showRadio: true,
        columns: [
          { prop: 'rejectApplyNo', label: '拒收申请单号' },
          {
            prop: 'createTime',
            label: '拒收时间',
            render(h, param) {
              let date = _this.$common.formatDate(param.row.createTime);
              return <span>{date}</span>;
            }
          },
          { prop: 'rejectReason', label: '拒收原因' },
          { prop: 'orderNo', label: '订单号' },
          { prop: 'commodityNo', label: '商品编号' },
          { prop: 'shortName', label: '商品名称' },
          { prop: 'goodsId', label: 'IMEI码' },
          { prop: 'customerName', label: '客户姓名' },
          { prop: 'customerMobile', label: '联系方式' },
          { prop: 'certId', label: '身份证号' },
          {
            prop: 'rentAfterStatus',
            label: '状态',
            render(h, param) {
              let text = '';
              switch (param.row.rentAfterStatus) {
                case '00001':
                  text = '待客服确认';
                  break;
                case '00002':
                  text = '进行中-待收货';
                  break;
                case '00003':
                  text = '进行中-已收货';
                  break;
                case '00004':
                  text = '进行中-扣款中';
                  break;
                case '00005':
                  text = '进行中-质检处理中';
                  break;
                case '00006':
                  text = '进行中-已完成';
                  break;
                case '-1':
                  text = '作废';
                  break;
                case '10':
                  text = '已完成';
                  break;
                default:
                  break;
              }

              return <span>{text}</span>;
            }
          },
          {
            prop: 'operate',
            label: '操作',
            fixed: 'right',
            width: '480',
            render(h, param) {
              return _this.renderBtn(param);
            }
          }
        ]
      };

      return option;
    },
    renderBtn(param) {
      const _this = this;
      const rows = param.row;
      let isShow1 = true;
      let isShow2 = true;
      let isShow3 = true;
      let isShow4 = true;
      if (rows.rentAfterStatus === '00002' && rows.applyStatus === '0') {
        isShow1 = false;
      }
      if (rows.rentAfterStatus === '00002' && rows.applyStatus === '0') {
        isShow2 = false;
      }
      if (rows.rentAfterStatus === '00003' && rows.applyStatus === '0') {
        isShow3 = false;
      }
      if (rows.applyStatus === '0' && (rows.rentAfterStatus === '00003' || rows.rentAfterStatus === '00006')) {
        isShow4 = false;
      }

      const btn1 = (
        <el-button
          type="primary"
          disabled={isShow1}
          onClick={() => {
            _this.confirmReceiptOpen(param.row);
          }}
        >
          确认收货
        </el-button>
      );
      const btn2 = (
        <el-button
          type="primary"
          disabled={isShow2}
          onClick={() => {
            _this.cancellationOpen(param.row);
          }}
        >
          作废单据
        </el-button>
      );
      const btn3 = (
        <el-button
          type="primary"
          disabled={isShow3}
          onClick={() => {
            _this.qualityCheckOpen(param.row);
          }}
        >
          发起质检
        </el-button>
      );
      const btn4 = (
        <el-button
          type="primary"
          disabled={isShow4}
          onClick={() => {
            _this.endOrderOpen(param.row);
          }}
        >
          完结订单
        </el-button>
      );
      const btn5 = (
        <el-button
          type="primary"
          onClick={() => {
            _this.viewRejectDetail(param.row);
          }}
        >
          查看详情
        </el-button>
      );
      let arr = [];
      arr.push(btn1, btn3, btn2, btn4, btn5);
      return arr;
    },
    // 搜索
    search() {
      this.$refs.table.refreshPaging(1);
    },
    // 重置
    reset() {
      this.$refs.searchForm.resetFields();
    },
    // 加载表格数据
    getList(pageInfo, callback) {
      let param = { ...this.searchModel };
      param['pageNum'] = pageInfo.pageIndex;
      param['pageSize'] = pageInfo.pageSize;

      this.$api.reject.query.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.tableData = res.data.list || [];
          callback(res.data.total);
        }
      });
    },
    // 查看详情
    viewRejectDetail(row) {
      this.rejectDetailVisible = true;
      this.getDetailFetch(row);
    },
    async getDetailFetch(row) {
      let param = {
        id: Number(row.id)
      };
      try {
        const res = await this.$api.reject.detail.send(param, { showLoading: true });

        if (res.code === '00') {
          this.rejectDetail = res.data.reject;
          this.rejectDetail['orderStatus'] = res.data.orderStatus;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    // 发起质检
    qualityCheckOpen(row) {
      this.qualityCheckDialog.visible = true;
      this.selectedRow = row;
    },
    qualityCheckSave() {
      if (!this.qualityCheckForm.inspectionStationOid) {
        this.$alert.toast('质检机构不能为空');
        return;
      }
      this.qualityCheckFetch();
    },
    async qualityCheckFetch() {
      let param = { ...this.qualityCheckForm };
      param['applyUserId'] = this.get_user_info.id;
      param['applyUserName'] = this.get_user_info.realName;
      param['orderNo'] = this.selectedRow.orderNo;
      param['afterRentApplyNo'] = this.selectedRow.rentAfterApplyNo;
      try {
        const res = await this.$api.qc.apply.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('发起质检成功');
          this.initQualityCheckForm();
          this.qualityCheckDialog.visible = false;
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        // this.$alert.error(error.message);
        console.log(error.message);
      }
    },
    // 作废
    cancellationOpen(item) {
      this.cancellationModel.id = item.id;
      this.cancellationModel.userId = this.get_user_info.id;
      this.cancellationDialog.visible = true;
    },
    cancellationSave() {
      if (!this.cancellationModel.invalidReason) {
        this.alert.toast('请输入作废原因');
        return;
      }

      this.cancellationFetch();
    },
    async cancellationFetch() {
      let param = { ...this.cancellationModel };
      try {
        const res = await this.$api.reject.invalid.send(param, { showLoading: false });
        if (res.code === '00') {
          this.$alert.toast('作废成功');
          this.initCancellationModel();
          this.$refs.table.refreshPaging();
          this.cancellationDialog.visible = false;
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 确认收货
    confirmReceiptOpen(row) {
      this.confirmReceiptVisible = true;
      this.selectedRow = row;
      this.confirmReceiptModel.userId = this.get_user_info.id;
      this.confirmReceiptModel.id = this.selectedRow.id;
    },
    confirmReceiptSave() {
      this.$refs.confirmReceipt.validate(valid => {
        if (valid) {
          this.confirmReceiptFetch();
        }
      });
    },
    async confirmReceiptFetch() {
      let param = { ...this.confirmReceiptModel };
      try {
        const res = await this.$api.reject.confirmDelivery.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('确认收货成功');
          this.initConfirmReceiptModel();
          this.confirmReceiptVisible = false;
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
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
    deleteRow(index, data) {
      data.splice(index, 1);
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
    endOrderOpen(row) {
      this.selectedRow = row;
      this.endOrderDialog.visible = true;
      this.getFeeTypeFetch();
    },
    endOrderSave() {
      if (Number.isNaN(this.feeTotal)) {
        this.$alert.info('请输入正确金额');
        return false;
      }

      let param = {
        orderNo: this.selectedRow.orderNo,
        rentAfterApplyNo: this.selectedRow.rentAfterApplyNo,
        businessType: 'REJECT_FINISH',
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
          this.endOrderDialog.visible = false;
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        console.error(error.message);
      }
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
    }
  },
  created() { },
  mounted() { }
};
