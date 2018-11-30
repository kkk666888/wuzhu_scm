export default {
  name: 'CharacterManager',
  data() {
    return {
      tableData: [], // table数据
      tableOption: this.getTableOption(), // table配置
      searchRules: {}, // 搜索校验
      searchModel: {
        role: '',
        available: null
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      roleDialog: {
        title: '',
        visible: false
      },
      dialogForm: this.initDialogForm(),
      treeOption: {
        label: 'name',
        children: 'children'
      },
      treeData2: [], // tree数据
      dialogRules: {
        role: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { max: 20, message: '长度不超过20字符', trigger: 'blur' }
        ]
      },
      selectedRow: null,
      treeCheckedKeys: null,
      treeVisible: true,
      inputIcon: 'el-icon-arrow-up',
      addArr: [],
      deleteArr: []
    };
  },
  component: {},
  computed: {},
  methods: {
    initDialogForm() {
      return {
        role: '',
        available: '',
        description: '',
        addIds: '',
        deleteIds: ''
        // showTreeName: ''
      };
    },
    // 搜索选择框列表
    getSearchOptions() {
      let option = {
        availableMap: [
          {
            text: '启用',
            value: 1
          },
          {
            text: '停用',
            value: 0
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
          label: '角色名称',
          name: 'role'
        },
        {
          type: 'select',
          label: '角色状态',
          name: 'available',
          list: 'availableMap'
        }
      ];
      return option;
    },
    //表格配置
    getTableOption() {
      const _this = this;
      let option = {
        idField: 'roleId',
        showPage: true,
        autoHeight: true,
        showSerial: true,
        showRadio: true,
        columns: [
          { prop: 'role', label: '角色名称' },
          { prop: 'description', label: '角色描述' },
          {
            prop: 'createTime',
            label: '创建时间',
            render(h, param) {
              let date = _this.$common.formatDate(param.row.createTime);
              return <span>{date}</span>;
            }
          },
          {
            prop: 'available',
            label: '状态',
            render(h, param) {
              let status = '';

              switch (param.row.available) {
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
          }
        ]
      };

      return option;
    },
    addRole() {
      this.dialogForm = this.initDialogForm();
      this.roleDialog.title = '添加角色';
      this.roleDialog.visible = true;
    },
    editRole() {
      this.treeCheckedKeys = [];
      let row = this.$refs.userTable.getSelectedRow();
      console.log(row);

      if (row) {
        this.selectedRow = row;
        this.treeCheckedKeys = row.resourceIds;
        this.getResourceTree();
        this.dialogForm.role = row.role;
        this.dialogForm.available = Number(row.available);
        this.dialogForm.description = row.description;
        this.roleDialog.title = '编辑角色';
        this.roleDialog.visible = true;
      } else {
        this.$alert.info('请选择角色');
      }
    },
    showResourceTree() {
      if (this.inputIcon === 'el-icon-arrow-up') {
        this.inputIcon = 'el-icon-arrow-down';
      } else {
        this.inputIcon = 'el-icon-arrow-up';
      }
      this.treeVisible = !this.treeVisible;
    },
    getTreeChecked(item, isChecked, checkedChildren) {
      console.log(item, isChecked, checkedChildren);
      if (isChecked) {
        this.addArr.push(item.id, item.parentId);
      } else {
        this.deleteArr.push(item.id);
      }
    },
    deleteRole() {
      let row = this.$refs.userTable.getSelectedRow();
      if (row) {
        this.$alert.confirm('确认删除该角色？', {
          onConfirm: () => {
            this.selectedRow = row;
            this.deleteRoleFetch();
          }
        });
      } else {
        this.$alert.info('请选择角色');
      }
    },
    // 搜索
    search() {
      this.$refs.userTable.refreshPaging(1);
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
        role: this.searchModel.role,
        available: this.searchModel.available
      };

      this.$api.role.query.send(param, { showLoading: true }).then(res => {
        if (res.code === '00') {
          this.tableData = res.data.list || [];
          callback(res.data.total);
        }
      });
    },
    confirmReceiptSave() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          if (this.roleDialog.title === '添加角色') {
            this.createRoleFetch();
          } else {
            this.updateRoleFetch();
          }
        }
      });
    },
    // 更新角色
    async updateRoleFetch() {
      let arr = [...new Set(this.addArr)];
      let arr2 = [...new Set(this.deleteArr)];

      this.dialogForm.addIds = arr.join(',');
      this.dialogForm.deleteIds = arr2.join(',');
      let param = { ...this.dialogForm };
      param['roleId'] = this.selectedRow.roleId;
      try {
        let res = await this.$api.role.update.send(param, { showLoading: true });

        if (res.code === '00') {
          this.$alert.toast('修改角色成功');
          this.addArr = [];
          this.deleteArr = [];
          this.$refs.dialogForm.resetFields();
          this.roleDialog.visible = false;
          this.$refs.userTable.refreshPaging(1);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 创建角色
    async createRoleFetch() {
      let param = { ...this.dialogForm };
      try {
        let res = await this.$api.role.create.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('创建角色成功');
          this.$refs.dialogForm.resetFields();
          this.roleDialog.visible = false;
          this.$refs.userTable.refreshPaging(1);
        } else {
          this.$alert.error(res.errMsg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 获取角色资源
    async getResourceTree() {
      let param = {
        roleId: this.selectedRow.roleId
      };
      try {
        let res = await this.$api.source.query.send(param, { showLoading: true });
        if (res.code === '00') {
          this.treeData2 = res.data;
        } else {
          this.$alert.info(res.errMsg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 删除角色
    async deleteRoleFetch() {
      let param = {
        roleId: this.selectedRow.roleId
      };
      try {
        let res = await this.$api.role.delete.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('删除角色成功');
          this.$refs.userTable.refreshPaging(1);
        } else {
          this.$alert.error(res.errMsg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    }
  },
  mounted() {}
};
