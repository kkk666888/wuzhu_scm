export default {
  name: 'DepartmentManager',
  data() {
    return {
      tableData: [], // table数据
      tableOption: this.getTableOption(), // table配置
      searchRules: {}, // 搜索校验
      searchModel: {
        departCode: '',
        departName: ''
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      selectedRole: null
    };
  },
  component: {},
  computed: {},
  methods: {
    // 搜索选择框列表
    getSearchOptions() {
      let option = {};
      return option;
    },
    // 搜索配置
    getSearchFields() {
      let option = [
        {
          type: 'input',
          label: '部门编码',
          name: 'departCode'
        },
        {
          type: 'input',
          label: '部门名称',
          name: 'departName'
        }
      ];
      return option;
    },
    //表格配置
    getTableOption() {
      let option = {
        idField: '',
        showPage: true,
        autoHeight: true,
        showSerial: true,
        columns: [
          { prop: 'departCode', label: '部门编码' },
          { prop: 'departName', label: '部门名称' },
          { prop: 'departDescription', label: '备注' },
          { prop: 'orderNo', label: '排序' },
          { prop: 'levelNo', label: '层级' },
          {
            prop: 'status',
            label: '状态',
            render(h, param) {
              let status = '';
              switch (param.row.status) {
                case '0':
                  status = '禁用';
                  break;
                case '1':
                  status = '启用';
                  break;
                default:
                  break;
              }
              return <span>{status}</span>;
            }
          }
        ]
      };

      return option;
    },
    // 搜索
    search() {
      this.$refs.departmentTable.refreshPaging(1);
    },
    // 重置
    reset() {
      this.$refs.searchForm.resetFields();
    },
    //加载表格数据
    getList(pageInfo, callback) {
      let param = {
        pageNum: pageInfo.pageIndex,
        pageSize: pageInfo.pageSize,
        departName: this.searchModel.departName,
        departCode: this.searchModel.departCode
      };

      this.$api.department.query.send(param, { showLoading: true }).then(res => {
        if (res.errCode === 0 || res.code === '00') {
          this.tableData = res.data.list || res.data.rows || [];
          callback(res.data.total || res.data.pageInfo.total);
        }
      });
    }
  },
  mounted() {}
};
