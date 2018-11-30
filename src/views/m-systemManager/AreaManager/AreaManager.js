export default {
  name: 'AreaManager',
  data() {
    return {
      searchRules: {}, // 搜索校验
      searchModel: {
        regionalCode: '',
        regionalName: '',
        status: null
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      treeTableData: null,
      treeTableOption: this.getTreeTableOptions(),
      selectedRow: null,
      areaDialog: {
        title: '',
        visible: false
      },
      dialogForm: this.initDialogForm(),
      dialogRules: {
        regionalCode: [{ required: true, message: '请输入区域编号', trigger: 'blur' }],
        regionalName: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        status: [
          {
            required: true,
            message: '请选择区域状态',
            trigger: 'change'
          }
        ],
        employeeNumber: [{ required: true, message: '请选择区域负责人', trigger: 'change' }]
      },
      remoteOptions: null,
      loading: false,
      employeeId: ''
    };
  },
  component: {},
  computed: {},
  methods: {
    initDialogForm() {
      return {
        parentId: '',
        regionalCode: '',
        regionalName: '',
        orderNo: '',
        status: '',
        employeeNumber: '',
        employeeId: '',
        parentName: ''
      };
    },
    // 搜索区域负责人
    remoteMethod(query) {
      let param = {
        condition: ''
      };
      if (query !== '') {
        this.loading = true;
        param.condition = query;
        this.$common.debounce(this.searchRemote(param));
      }
    },
    // 添加区域
    addArea() {
      let row = this.selectedRow;
      if (row) {
        this.dialogForm = this.initDialogForm();
        this.dialogForm.parentName = row.name;
        this.dialogForm.parentId = row.id;
        this.areaDialog.title = '添加区域';
        this.areaDialog.visible = true;
      } else {
        this.$alert.info('请选择区域');
      }
    },
    // 编辑区域
    editArea() {
      let row = this.selectedRow;

      if (row) {
        this.searchAreaDetail();
        this.areaDialog.title = '编辑区域';
        this.areaDialog.visible = true;
      } else {
        this.$alert.info('请选择区域');
      }
    },
    // 删除区域
    deleteArea() {
      let row = this.selectedRow;
      if (row) {
        this.$alert.confirm('确认删除该区域？', {
          onConfirm: () => {
            this.deleteAreaFetch();
          }
        });
      } else {
        this.$alert.info('请选择区域');
      }
    },
    // 搜索选择框列表配置
    getSearchOptions() {
      let option = {
        areaStatusMap: [
          {
            text: '正常',
            value: '0'
          },
          {
            text: '停用',
            value: '1'
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
          label: '区域编号',
          name: 'regionalCode'
        },
        {
          type: 'input',
          label: '区域名称',
          name: 'regionalName'
        },
        {
          type: 'select',
          label: '状态',
          name: 'status',
          list: 'areaStatusMap'
        }
      ];
      return option;
    },
    // treeTable配置
    getTreeTableOptions() {
      let option = {
        idField: 'id', //树结构对应的id字段
        diaplayField: 'name', //树结构对应的名称字段
        childField: 'childList', //树结构对应的子级字段
        leafField: 'leaf', //树结构对应的是否子节点字段
        showAllChild: false, //是否显示所有子级
        autoHeight: true, // 自动计算高度至底部,height的优先级高
        // showCheck: true,
        columns: [
          {
            prop: 'name',
            label: '区域名称'
          },
          {
            prop: 'id',
            label: 'ID',
            width: 100
          },
          {
            prop: 'code',
            label: '区域编号',
            width: 100
          },
          {
            prop: 'level',
            label: '层级',
            width: 100
          },
          {
            prop: 'status',
            label: '状态',
            width: 100,
            render(h, param) {
              let status = '';

              switch (param.row.status) {
                case '0':
                  status = '正常';
                  break;
                case '1':
                  status = '停用';
                  break;
                default:
                  break;
              }

              return <span>{status}</span>;
            }
          }
        ],
        afterAddProperty(row) {
          row.leaf = row.childList && row.childList.length > 0 ? false : true;
        }
      };
      return option;
    },
    // 搜索
    search() {
      this.getList();
    },
    // 重置
    reset() {
      this.$refs.searchForm.resetFields();
    },
    // 弹框确认
    confirmReceiptSave() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          if (this.areaDialog.title === '添加区域') {
            this.createAreaFetch();
          } else {
            this.updateAreaFetch();
          }
        }
      });
    },
    //加载表格数据
    getList() {
      let param = { ...this.searchModel };

      this.$api.area.tree.send(param, { showLoading: true }).then(res => {
        if (res.errCode === 0 || res.code === '00') {
          this.treeTableData = res.data || [];
        }
      });
    },
    // 添加区域请求
    async createAreaFetch() {
      let param = { ...this.dialogForm };
      try {
        let res = await this.$api.area.create.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$refs.dialogForm.resetFields();
          this.areaDialog.visible = false;
          this.$alert.toast('添加成功!');
          this.getList();
        } else {
          this.$alert.info(res.message || res.errMsg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 更新区域请求
    async updateAreaFetch() {
      let param = { ...this.dialogForm };
      param['employeeNumber'] = this.employeeId;
      try {
        let res = await this.$api.area.update.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('更新成功!');
          this.$refs.dialogForm.resetFields();
          this.areaDialog.visible = false;
          this.getList();
        } else {
          this.$alert.info(res.message || res.errMsg);
        }
      } catch (error) {
        this.$alert.info(error.message);
      }
    },
    // 删除区域请求
    async deleteAreaFetch() {
      let param = {
        id: this.selectedRow.id
      };
      try {
        let res = await this.$api.area.delete.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('删除成功');
          this.getList();
        } else {
          this.$alert.info(res.message || res.errMsg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 搜索区域负责人请求
    async searchRemote(data) {
      try {
        let res = await this.$api.area.searchRemote.send(data);
        this.loading = false;
        if (res.code === '00') {
          this.remoteOptions = res.list;
        }
      } catch (error) {
        this.$alert.toast(error.message);
      }
    },
    // 区域详情请求
    async searchAreaDetail() {
      let param = {
        id: this.selectedRow.id
      };
      try {
        let res = await this.$api.area.searchDetail.send(param);
        if (res.code === '00') {
          this.dialogForm = {
            id: res.data.id,
            parentId: res.data.parentId,
            regionalCode: res.data.regionalCode,
            regionalName: res.data.regionalName,
            orderNo: res.data.orderNo,
            status: res.data.status,
            parentName: res.data.parentRegionName,
            employeeNumber: res.data.employeeName
          };
          this.employeeId = res.data.employeeNumber;
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    treeRowClick(item) {
      let aa = this.$refs.treeTable.getCurrentSelectedRow();
      this.selectedRow = item;
    },
    choosePrincipal(value) {
      this.employeeId = value;
    }
  },
  mounted() {
    this.getList();
  }
};
