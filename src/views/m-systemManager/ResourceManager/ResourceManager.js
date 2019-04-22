export default {
  name: 'ResourceManager',
  data() {
    return {
      searchRules: {}, // 搜索校验
      searchModel: {
        name: '',
        available: null
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      treeTableData: null,
      treeTableOption: this.getTreeTableOptions(),
      selectedRow: null,
      sourceDialog: {
        title: '',
        visible: false
      },
      dialogForm: this.initDialoForm(),
      dialogRules: {
        type: [{ required: true, message: '请输入资源类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        available: [
          {
            required: true,
            message: '请选择资源状态',
            trigger: 'change'
          }
        ],
        employeeNumber: [{ required: true, message: '请选择资源负责人', trigger: 'change' }],
        classPath: [{ required: true, message: '请输入前端访问路径', trigger: 'blur' }],
        url: [{ required: true, message: '请输入后端访问路径', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入权限字符串', trigger: 'blur' }]
      },
      remoteOptions: null,
      loading: false,
      parentName: ''
    };
  },
  component: {},
  computed: {},
  methods: {
    initDialoForm() {
      return {
        name: '',
        type: '',
        leaf: '',
        parentId: '',
        parentIds: '',
        available: '',
        permission: '',
        classPath: '',
        url: '',
        priority: '',
        resourceId: ''
      };
    },
    // 搜索父级资源名称
    searchNameById(id, data) {
      if (!data || !data.length) {
        return;
      }
      data.forEach(element => {
        if (element.id === id || element.resourceId === id) {
          this.parentName = element.name;
          return;
        }
        if (element.children) {
          this.searchNameById(id, element.children);
        }
      });
    },
    addSource() {
      let row = this.selectedRow;

      if (row) {
        this.dialogForm = this.initDialoForm();
        this.sourceDialog.visible = true;
        this.dialogForm.parentId = row.id;
        this.dialogForm.leaf = row.leaf;
        this.dialogForm.parentIds = row.parentIds || '0/';
        this.parentName = row.name;
        this.sourceDialog.title = '添加资源';
      } else {
        this.$alert.info('请选择资源');
      }
    },
    closeDialog() {
      this.$refs.dialogForm.resetFields();
    },
    editSource() {
      let row = this.selectedRow;
      if (row) {
        this.searchNameById(String(row.parentId), this.treeTableData);
        this.dialogForm.resourceId = row.resourceId;
        this.dialogForm.leaf = row.leaf;
        this.dialogForm.parentId = row.parentId;
        this.dialogForm.parentIds = row.parentIds;
        this.dialogForm.name = row.name;
        this.dialogForm.type = row.type;
        this.dialogForm.permission = row.permission;
        this.dialogForm.classPath = row.classPath;
        this.dialogForm.url = row.url;
        this.dialogForm.priority = row.priority;
        this.dialogForm.available = String(row.available);

        this.sourceDialog.title = '编辑资源';
        this.sourceDialog.visible = true;
      } else {
        this.$alert.info('请选择资源');
      }
    },
    deleteSource() {
      let row = this.selectedRow;
      if (row) {
        this.$alert.confirm('确认删除该资源？', {
          onConfirm: () => {
            this.deleteSourceFetch();
          }
        });
      } else {
        this.$alert.info('请选择资源');
      }
    },
    // 搜索选择框列表
    getSearchOptions() {
      let option = {};
      return option;
    },
    // 搜索配置
    getSearchFields() {
      let option = [];
      return option;
    },
    getTreeTableOptions() {
      let option = {
        idField: 'id', //树结构对应的id字段
        diaplayField: 'name', //树结构对应的名称字段
        childField: 'children', //树结构对应的子级字段
        leafField: 'leaf', //树结构对应的是否子节点字段
        showAllChild: false, //是否显示所有子级
        autoHeight: true, // 自动计算高度至底部,height的优先级高
        //showCheck: true,
        columns: [
          {
            prop: 'name',
            label: '资源名称',
            width: 200
          },
          {
            prop: 'type',
            label: '资源类型',
            width: 100
          },
          {
            prop: 'classPath',
            label: '前端访问路径',
            width: 150
          },
          {
            prop: 'url',
            label: '后端访问路径',
            width: 250
          },
          {
            prop: 'permission',
            label: '权限字符',
            width: 150
          },
          {
            prop: 'available',
            label: '状态',
            width: 100,
            render(h, param) {
              let status = '';
              switch (Number(param.row.available)) {
                case 1:
                  status = '启用';
                  break;
                case 0:
                  status = '停用';
                  break;
                default:
                  break;
              }
              return <span>{status}</span>;
            }
          },
          {
            prop: 'priority',
            label: '菜单优先级',
            width: 100
          }
        ],
        afterAddProperty(row) {
          row.leaf = row.children && row.children.length > 0 ? false : true;
        }
      };
      return option;
    },
    confirmReceiptSave() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          if (this.sourceDialog.title === '添加资源') {
            this.createSourceFetch();
          } else {
            this.updateSourceFetch();
          }
        }
      });
    },
    //加载表格数据
    getList() {
      let param = { ...this.searchModel };

      // 本地数据
      // this.treeTableData = resource.data;

      this.$api.source.query.send(param, { showLoading: true }).then(res => {
        if (res.errCode === 0 || res.code === '00') {
          this.treeTableData = res.data || [];
        }
      });
    },
    async createSourceFetch() {
      let param = { ...this.dialogForm };
      try {
        let res = await this.$api.source.create.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('创建成功');
          this.$refs.dialogForm.resetFields();
          this.sourceDialog.visible = false;
          this.getList();
          this.selectedRow = null;
        }
      } catch (error) {
        console.log(error);

        // this.$alert.error(error.message);
      }
    },
    async updateSourceFetch() {
      let param = { ...this.dialogForm };
      try {
        let res = await this.$api.source.update.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('更新成功');
          this.$refs.dialogForm.resetFields();
          this.sourceDialog.visible = false;
          this.getList();
          this.selectedRow = null;
        }
      } catch (error) {
        console.log(error);

        // this.$alert.error(error.message);
      }
    },
    async deleteSourceFetch() {
      let param = {
        resourceId: this.selectedRow.resourceId
      };
      try {
        let res = await this.$api.source.delete.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('删除成功！');
          this.getList();
          this.selectedRow = null;
        }
      } catch (error) {
        console.log(error);

        // this.$alert.error(error.message);
      }
    },
    treeRowClick(item) {
      // console.log(item);
      let aa = this.$refs.treeTable.getCurrentSelectedRow();
      this.selectedRow = item;
    }
  },
  mounted() {
    this.getList();
  }
};
