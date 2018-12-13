// 入库单管理
import ExportFile from '@/utils/export';
import fileSaver from 'file-saver';
export default {
  name: 'InStorageReceipt',
  data() {
    return {
      tableData: [], // table数据
      tableOption: this.getTableOption(), // table配置
      detailTableOption: this.getDetailTableOption(),
      detailTableData: [],
      receiptDetail: {
        title: '入库单明细',
        visible: false
      },
      receiptDetailForm: {
        number: '',
        bizTypeName: '',
        supplierName: '',
        inTime: '',
        inPersonName: '',
        auditorPersonName: '',
        statusName: '',
        reason: ''
      },
      detailDailogOption: {
        showFooter: false
      },
      searchRules: {}, // 搜索校验
      searchModel: {
        number: '',
        status: null,
        instorageDate: [],
        bizType: '',
        supplierName: '',
        inPersonName: '',
        auditorPersonName: ''
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      importUrl: this.$common.getUploadURL('/commodityBill/import-commodity-bill'),
      importFile: null,
      selectedRow: null
    };
  },
  component: {},
  computed: {},
  methods: {
    // 明细table配置
    getDetailTableOption() {
      let option = {
        idField: 'id',
        showPage: false,
        autoHeight: false,
        showSerial: true,
        // showCheck: true,
        columns: [
          { prop: 'typeName', label: '商品类型' },
          { prop: 'commodityCategory', label: '商品类别' },
          { prop: 'brandName', label: '品牌' },
          { prop: 'shortName', label: '商品名称' },
          { prop: 'qty', label: '数量' },
          { prop: 'nonTaxPrice', label: '未含税单价' },
          { prop: 'ratio', label: '税率' },
          { prop: 'sumNonTaxPrice', label: '未含税总金额' },
          { prop: 'sumPrice', label: '含税总金额' },
          { prop: 'commodityNo', label: '商品编号' },
          { prop: 'associatedBillNo', label: '关联单号' },
          { prop: 'warehouseName', label: '仓库名称' }
        ]
      };
      return option;
    },
    // 搜索选择框列表
    getSearchOptions() {
      let option = {
        statusMap: [
          {
            text: '已提交',
            value: '2001'
          },
          {
            text: '已审核',
            value: '3001'
          }
        ],
        bizTypeMap: [
          {
            text: '采购入库',
            value: 'CGRK'
          },
          {
            text: '拒收入库',
            value: 'JSRK'
          },
          {
            text: '归还入库',
            value: 'GHRK'
          },
          {
            text: '退货入库',
            value: 'THRK'
          },
          {
            text: '门店入库',
            value: 'MDRK'
          },
          {
            text: '其它入库',
            value: 'QTRK'
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
          label: '入库单号',
          name: 'number'
        },
        {
          type: 'select',
          label: '入库类别',
          name: 'bizType',
          list: 'bizTypeMap'
        },
        {
          type: 'input',
          label: '供应商名称',
          name: 'supplierName'
        },
        {
          type: 'input',
          label: '入库人',
          name: 'inPersonName'
        },
        {
          type: 'input',
          label: '审核人',
          name: 'auditorPersonName'
        },
        {
          type: 'select',
          label: '入库单状态',
          name: 'status',
          list: 'statusMap'
        },
        {
          type: 'daterange',
          label: '入库时间',
          name: 'instorageDate'
        }
      ];
      return option;
    },
    //表格配置
    getTableOption() {
      const _this = this;

      let option = {
        idField: 'number',
        showPage: true,
        autoHeight: true,
        showSerial: true,
        showCheck: true,
        columns: [
          { prop: 'number', label: '入库单号' },
          {
            prop: 'bizType',
            label: '入库类别',
            render(h, param) {
              let type = '';
              switch (param.row.bizType) {
                case 'CGRK':
                  type = '采购入库';
                  break;
                case 'JSRK':
                  type = '拒收入库';
                  break;
                case 'GHRK':
                  type = '归还入库';
                  break;
                  case 'THRK':
                    type = '退货入库';
                    break;
                  case 'MDRK':
                    type = '门店入库';
                    break;
                case 'QTRK':
                  type = '其它入库';
                  break;
                default:
                  break;
              }
              return <span>{type}</span>;
            }
          },
          {
            prop: 'inTime',
            label: '入库时间'
          },
          { prop: 'supplierNo', label: '供应商编码' },
          { prop: 'supplierName', label: '供应商名称' },
          { prop: 'reason', label: '备注' },
          {
            prop: 'status',
            label: '入库单状态',
            render(h, param) {
              let status = '';

              switch (param.row.status) {
                case '2001':
                  status = '已提交';
                  break;
                case '3001':
                  status = '已审核';
                  break;
                case 'disabled':
                  status = '已失效';
                  break;
                default:
                  break;
              }

              return <span>{status}</span>;
            }
          },
          { prop: 'inPersonName', label: '入库人' },
          { prop: 'auditorPersonName', label: '审核人' },
          {
            prop: 'operate',
            label: '操作',
            fixed: 'right',
            width: '180',
            render(h, param) {
              return (
                <div>
                  <el-button
                    type="primary"
                    onClick={() => {
                      _this.viewReceiptDetail(param.row);
                    }}
                  >
                    查看明细
                  </el-button>
                  <el-button
                    type="primary"
                    onClick={() => {
                      _this.printReceipt(param.row);
                    }}
                  >
                    打印
                  </el-button>
                </div>
              );
            }
          }
        ]
      };

      return option;
    },
    // 搜索
    search() {
      this.$refs.table.refreshPaging(1);
    },
    // 重置
    reset() {
      this.$refs.searchForm.resetFields();
    },
    //加载表格数据
    getList(pageInfo, callback) {
      let param = { ...this.searchModel };
      param['pageNum'] = pageInfo.pageIndex;
      param['pageSize'] = pageInfo.pageSize;
      param['inTimeStart'] = this.searchModel.instorageDate[0];
      param['inTimeEnd'] = this.searchModel.instorageDate[1];
      this.$api.receipt.query.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.tableData = res.data.list || [];
          callback(res.data.total);
        }
      });
    },
    // 打印
    async printReceipt(row) {
      let param = { ...row };
      try {
        const res = await this.$api.receipt.print.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('打印成功');
          ExportFile(res.data, `入库单${row.number}`);
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 确认入库
    confirmInStorage() {
      const rows = this.$refs.table.getSelectedRows();
      if (rows.length) {
        this.confirmInStorageFetch(rows);
      } else {
        this.$alert.info('请选择入库单');
      }
    },
    async confirmInStorageFetch(rows) {
      let param = rows;
      try {
        const res = await this.$api.receipt.confirm.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('入库成功');
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 查看明细
    viewReceiptDetail(row) {
      this.receiptDetail.visible = true;
      this.getReceiptDetailFetch(row);
    },
    async getReceiptDetailFetch(row) {
      let param = row;
      try {
        const res = await this.$api.receipt.detail.send(param, { showLoading: true });

        if (res.code === '00') {
          this.receiptDetailForm = { ...res.data };
          this.detailTableData = res.data.commodityInBillDetailsList;
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    // 删除
    deleteReceipt() {
      const rows = this.$refs.table.getSelectedRows();

      if (rows.length) {
        this.deleteReceiptFetch(rows);
      } else {
        this.$alert.info('请选择入库单');
      }
    },
    async deleteReceiptFetch(rows) {
      let param = rows;
      try {
        const res = await this.$api.receipt.delete.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('删除成功');
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 导出
    async exportReceipt() {
      let param = {};
      try {
        const res = await this.$api.receipt.export.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('导出中', { autoHideTimeout: 2000 });
          let date = new Date().toLocaleDateString();

          ExportFile(res.data, `入库单${date}`);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 导入
    uploadSuccess(res, file) {
      // console.log(res, file);
      let name = file.name.split('.')[0];
      if (res.code === '00') {
        this.$alert.toast('导入成功');
        this.$refs.table.refreshPaging();
      } else if (res.code === '1000') {
        ExportFile(res.data, `${name}-错误`);
      }
    }
  },
  created() {},
  mounted() {}
};
