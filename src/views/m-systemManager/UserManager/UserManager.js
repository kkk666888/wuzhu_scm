export default {
  name: 'UserManager',
  data() {
    const oldPwdValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else {
        if (this.modifyPasswordForm.newPwd !== '') {
          this.$refs.modifyPasswordForm.validateField('newPwd');
        }
        callback();
      }
    };
    const newPwdValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.modifyPasswordForm.confirmPwd !== '') {
          this.$refs.modifyPasswordForm.validateField('confirmPwd');
        }
        callback();
      }
    };
    const confirmPwdValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.modifyPasswordForm.newPwd) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      tableData: [], // table数据
      tableOption: this.getTableOption(), // table配置
      searchRules: {}, // 搜索校验
      searchModel: {
        username: '',
        phone: '',
        realname: '',
        statu: ''
      },
      searchFields: this.getSearchFields(), // 搜索配置
      searchOptions: this.getSearchOptions(), // 搜索列表
      userDialog: {
        title: '',
        visible: false
      },
      dialogForm: this.initDialogForm(),
      treeOption: {
        idField: 'id', // id
        displayField: 'name', // 显示名称
        childField: 'children', // 子节点
        leafField: 'leaf', // 是否子节点
        showAllChild: true, // 是否显示所有子级
        showCheck: true
      },
      treeData: [], // tree数据
      dialogRules: this.getDialogRules(),
      selectedRow: null,
      roleAll: null,
      chooseRegionVisible: false,
      treeData2: null,
      treeTableOption: this.getTreeTableOption(),
      roleOptions: null,
      treeCheckedKeys: [],
      modifyDialog: {
        title: '修改密码',
        visible: false
      },
      modifyPasswordForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      modifyPasswordRules: {
        oldPwd: [{ validator: oldPwdValidate, trigger: 'blur' }],
        newPwd: [{ validator: newPwdValidate, trigger: 'blur' }],
        confirmPwd: [{ validator: confirmPwdValidate, trigger: 'blur' }]
      }
    };
  },
  component: {},
  computed: {},
  methods: {
    initDialogForm() {
      let form = {
        userId: '',
        username: '', // 账号
        password: '',
        email: '',
        statu: '',
        phone: '',
        realname: '',
        roleId: '', // 角色id
        dptId: '' // 部门id
      };
      return form;
    },
    // 用户资源树配置
    getTreeTableOption() {
      let option = {
        label: 'name',
        id: 'id',
        children: 'childList'
      };
      return option;
    },
    // 弹框表单验证
    getDialogRules() {
      let rules = {
        username: [
          { required: true, message: '请输入用户账户', trigger: 'blur' },
          { max: 20, message: '长度不超过20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { max: 20, message: '长度不超过20字符', trigger: 'blur' }
        ],
        realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
      };
      return rules;
    },
    // 搜索选择框列表
    getSearchOptions() {
      let option = {
        userStatusMap: [
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
          label: '用户账号',
          name: 'username'
        },
        {
          type: 'input',
          label: '电话',
          name: 'phone'
        },
        {
          type: 'input',
          label: '用户姓名',
          name: 'realname'
        },
        {
          type: 'select',
          label: '状态',
          name: 'statu',
          list: 'userStatusMap'
        }
      ];
      return option;
    },
    //表格配置
    getTableOption() {
      const _this = this;
      let option = {
        idField: 'userId',
        showPage: true,
        autoHeight: true,
        showSerial: true,
        showRadio: true,
        columns: [
          { prop: 'username', label: '用户账号' },
          { prop: 'email', label: '邮箱' },
          { prop: 'phone', label: '电话' },
          { prop: 'realname', label: '用户姓名' },
          {
            prop: 'roleName',
            label: '所属角色',
            render(h, param) {
              let name = param.row.roleName.join(' ');
              return <span>{name}</span>;
            }
          },
          {
            prop: 'updateTime',
            label: '最后修改时间',
            render(h, param) {
              let date = _this.$common.formatDate(param.row.updateTime);

              return <span>{date}</span>;
            }
          },
          {
            prop: 'statu',
            label: '状态',
            render(h, param) {
              let status = '';
              switch (param.row.statu) {
                case false:
                  status = '停用';
                  break;
                case true:
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
    // 修改密码
    modifyPassword() {
      let row = this.$refs.userTable.getSelectedRow();
      if (row) {
        this.modifyDialog.visible = true;
      } else {
        this.$alert.info('请选择用户');
      }
    },
    confirmModifyPwd() {
      this.$refs.modifyPasswordForm.validate(valid => {
        if (valid) {
          this.updatePasswordFetch();
        }
      });
    },
    // 修改密码请求
    async updatePasswordFetch() {
      let param = { ...this.modifyPasswordForm };

      let res = await this.$api.user.changePwd.send(param, { showLoading: true });
      if (res.code === '00') {
        this.$alert.toast('修改成功!');
        this.$refs.modifyPasswordForm.resetFields();
        this.modifyDialog.visible = false;
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
    confirmReceiptSaveRegion() {
      if (!this.$refs.tree.getCheckedKeys().length) {
        this.$alert.toast('请选择区域');
      } else {
        this.saveUserChoosedRegion();
      }
    },
    addUser() {
      this.getDepartmentAndRoleData();
      this.dialogForm = this.initDialogForm();
      this.userDialog.title = '添加用户';
      this.userDialog.visible = true;
      // console.log(this.dialogForm);
    },
    editUser() {
      let row = this.$refs.userTable.getSelectedRow();
      if (row) {
        this.selectedRow = row;

        this.getDepartmentAndRoleData();
        this.dialogForm = {
          userId: row.userId,
          username: row.username,
          email: row.email,
          phone: row.phone,
          realname: row.realname,
          roleId: row.roleId,
          dptId: row.dptId,
          statu: Number(row.statu)
        };
        this.userDialog.title = '编辑用户';
        this.userDialog.visible = true;
      } else {
        this.$alert.info('请选择用户');
      }
    },
    // 删除用户
    deleteUser() {
      let row = this.$refs.userTable.getSelectedRow();
      if (row) {
        this.$alert.confirm('确认删除该用户？', {
          onConfirm: () => {
            this.selectedRow = row;
            this.deleteUserFetch();
          }
        });
      } else {
        this.$alert.info('请选择用户');
      }
    },
    // 选择区域
    chooseRegion() {
      let row = this.$refs.userTable.getSelectedRow();
      if (row) {
        this.chooseRegionVisible = true;
        this.getRegionData();
      } else {
        this.$alert.info('请选择用户');
      }
    },
    confirmReceiptSave() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          if (this.userDialog.title === '添加用户') {
            this.createUserFetch();
          } else {
            this.updateUserFetch();
          }
        }
      });
    },
    // 重置密码
    resetPassword() {
      let row = this.$refs.userTable.getSelectedRow();
      if (row) {
        this.$alert.confirm('确认重置密码吗？', {
          onConfirm: () => {
            this.resetPasswordFetch();
          }
        });
      } else {
        this.$alert.info('请选择用户');
      }
    },
    async resetPasswordFetch() {
      // let param = { ...this.resetPasswordForm };
      let param = {};
      param['userId'] = this.$refs.userTable.getSelectedRow().userId;
      try {
        let res = await this.$api.user.resetPwd.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.info(`密码重置成功，新密码为${res.data}`, { isAutoHide: false });
        } else {
          this.$alert.info(res.msg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 保存用户选择区域
    async saveUserChoosedRegion() {
      let param = {
        userId: this.$refs.userTable.getSelectedRow().userId,
        regionalIds: this.$refs.tree.getCheckedKeys().join(',')
      };
      try {
        let res = await this.$api.user.chooseRegion.send(param, { showLoading: true });
        if (res.code === '00' || res.errCode === 0) {
          this.$alert.toast('保存区域成功');
          this.chooseRegionVisible = false;
        } else {
          this.$alert.info(res.message || res.msg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    //加载表格数据
    getList(pageInfo, callback) {
      let param = {
        pageNum: pageInfo.pageIndex,
        pageSize: pageInfo.pageSize,
        username: this.searchModel.username,
        phone: this.searchModel.phone,
        realname: this.searchModel.realname,
        statu: this.searchModel.statu
      };
      // this.tableData = user.data.rows; // 模拟数据
      this.$api.user.query.send(param, { showLoading: true }).then(res => {
        if (res.errCode === 0 || res.code === '00') {
          this.tableData = res.data.list || res.data.rows || [];
          callback(res.data.total);
        }
      });
    },
    // 更新角色
    async updateUserFetch() {
      let param = { ...this.dialogForm };

      try {
        let res = await this.$api.user.update.send(param, { showLoading: true });

        if (res.code === '00') {
          this.$alert.toast('修改成功');
          this.$refs.dialogForm.resetFields();
          this.userDialog.visible = false;
          this.$refs.userTable.refreshPaging(1);
        } else {
          this.$alert.info(res.msg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 创建用户
    async createUserFetch() {
      let param = { ...this.dialogForm };

      try {
        let res = await this.$api.user.create.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('创建成功');
          this.$refs.dialogForm.resetFields();
          this.userDialog.visible = false;
          this.$refs.userTable.refreshPaging(1);
        } else {
          this.$alert.error(res.msg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 删除用户
    async deleteUserFetch() {
      let param = {
        userId: this.selectedRow.userId
      };
      try {
        let res = await this.$api.user.delete.send(param, { showLoading: true });
        if (res.code === '00') {
          this.$alert.toast('删除成功');
          this.$refs.userTable.refreshPaging(1);
        } else {
          this.$alert.error(res.msg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 获取用户部门、角色数据
    async getDepartmentAndRoleData() {
      let param = {};
      try {
        let [department, role] = await Promise.all([
          this.$api.department.tree.send(param),
          this.$api.role.all.send(param)
        ]);
        // if (department.errCode === 0 || department.code === '00') {
        //   this.treeData = department.list || department.data;
        // } else {
        //   this.$alert.info(department.message || department.msg);
        // }
        if (role.errCode === 0 || role.code === '00') {
          this.roleOptions = role.data;
        } else {
          this.$alert.info(role.message || role.msg);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    },
    // 获取区域数据
    async getRegionData() {
      let param = {
        employeeNumber: this.$refs.userTable.getSelectedRow().username
      };
      try {
        // 模拟数据
        // this.treeData2 = area.data;
        // area.userRegionList.forEach(element => {
        //   this.treeCheckedKeys.push(element.regionId);
        // });

        let res = await this.$api.area.tree.send(param, { showLoading: true });
        if (res.errCode === 0 || res.code === '00') {
          this.treeData2 = res.data;
          res.userRegionList.forEach(element => {
            this.treeCheckedKeys.push(element.regionId);
          });
        } else {
          this.$alert.info(res.msg || res.message);
        }
      } catch (error) {
        this.$alert.error(error.message);
      }
    }
  },
  mounted() {}
};
