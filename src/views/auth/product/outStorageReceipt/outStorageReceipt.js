// 入库单管理
import ExportFile from '@/utils/export';
import fileSaver from 'file-saver';
export default {
  name: 'outStorageReceipt',
  data() {
    return {
      tableData: [], // table数据
      tableOption: this.getTableOption(), // table配置
      searchRules: {}, // 搜索校验
      searchModel: {
        number: '',
        saleOrderNo: '',
        warehouseName: '',
        customerName: '',
        commoditName: ''
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      selectedRow: null
    };
  },
  component: {},
  computed: {},
  methods: {
    // 搜索选择框列表
    getSearchOptions() {
      let option = {
        warehouseNameMap: [
          {
            text: '全新商品仓',
            value: '001'
          },
          {
            text: '二手商品仓',
            value: '002'
          },
          {
            text: '供应商商品仓',
            value: '003'
          },
          {
            text: '供应商二手商品仓',
            value: '004'
          },
          {
            text: '维修仓',
            value: '005'
          },
          {
            text: '待处理仓',
            value: '006'
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
          label: '出库单号',
          name: 'number'
        },
        {
          type: 'input',
          label: '订单编号',
          name: 'saleOrderNo'
        },
        {
          type: 'select',
          label: '仓库',
          name: 'warehouseName',
          list: 'warehouseNameMap'
        },
        {
          type: 'input',
          label: '客户姓名',
          name: 'customerName'
        },
        {
          type: 'input',
          label: '商品名称',
          name: 'commodityName'
        },
        {
          type: 'daterange',
          label: '出库时间',
          name: 'outstorageDate'
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
          { prop: 'number', label: '出库单号', width:140 },
          { prop: 'outTimeStr', label: '出库日期', width:150 },
          { prop: 'saleOrderNo', label: '订单编号', width:200 },
          { prop: 'intoChannel', label: '进件渠道' },
          { prop: 'commodityNo', label: '商品编号' , width:120},
          { prop: 'commodityType', label: '商品类型' },
          { prop: 'commodityBrand', label: '商品品牌' },
          { prop: 'commodityName', label: '商品名称',width:160 },
          { prop: 'qty', label: '数量' },
          { prop: 'goodsId', label: '货品识别码', width:150},
          { prop: 'warehouseName', label: '仓库' },
          { prop: 'customerName', label: '客户姓名' },
          { prop: 'customerPhone', label: '电话' , width:120},
          { prop: 'expressCompanyName', label: '物流公司' },
          { prop: 'deliveryOrderNo', label: '物流单号', width:110 },
          { prop: 'consigneeAddr', label: '地址' , width:200},
          { prop: 'printPerson', label: '打印次数' },
          { prop: 'printCount', label: '打印人' }
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
      if(this.searchModel.outstorageDate){
        param['outTimeStart'] = this.searchModel.outstorageDate[0];
        param['outTimeEnd'] = this.searchModel.outstorageDate[1];
      }
      this.$api.outstorageReceipt.getOutBillPage.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.tableData = res.data.list || [];
          callback(res.data.total);
        }
      });
    },
    // 打印
    async printOutReceipt() {
      let row = this.$refs.table.getSelectedRows();
      let param = {}
      try {
        console.log(row.length)
        if(row.length === 0){
          this.$alert.toast('请选择一条记录');
          return 
        } else{
          param['number'] = row[0].number
        }
        const res = await this.$api.outstorageReceipt.outBillPrint.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('打印成功');
          ExportFile(res.data, `出库单${row[0].number}`);
          this.$refs.table.refreshPaging();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 导出
    async exportOutReceipt() {
      let param = { ...this.searchModel };
      if(this.searchModel.outstorageDate){
        param['outTimeStart'] = this.searchModel.outstorageDate[0];
        param['outTimeEnd'] = this.searchModel.outstorageDate[1];
      }
      try {
        const res = await this.$api.outstorageReceipt.outBillExcelImport.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('导出中', { autoHideTimeout: 2000 });
          let date = new Date().toLocaleDateString();

          ExportFile(res.data, `出库单${date}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {},
  mounted() {}
};
