import tableStore from './tableStore.js';
import myRender from './myRender.vue';
export default {
  components: {
    myRender
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    option: {
      type: Object,
      default() {
        return {};
      }
    },
    onPaging: {
      type: Function
    },
    height: {
      type: Number
    },
    reduceHeight: {
      type: Number
    },
    checkWhenRowClick: {
      type: Boolean,
      default: false
    },
    disableRows: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      model: {},
      tHeight: null,
      selectedId: '', //绑定单选框v-model
      currentRaidoCheckedRow: null,
      selectedRows: [],
      selectedIds: []
    };
  },
  methods: {
    handleSizeChange(size) {
      this.model.pageInfo.pageSize = size;
      this.paging();
    },
    handleCurrentPageChange(currentPage) {
      this.model.pageInfo.currentPage = currentPage;
      this.paging();
    },
    paging(callback) {
      if (this.model.showPage) {
        if (this.onPaging && this.onPaging instanceof Function) {
          let pageInfo = {};
          pageInfo.pageSize = this.model.pageInfo.pageSize;
          pageInfo.pageIndex = this.model.pageInfo.currentPage;

          this.onPaging(pageInfo, total => {
            this.model.pageInfo.total = total;

            if (callback && callback instanceof Function) {
              callback();
            }
          });
        }
      }
    },
    setHeight() {
      let rect = this.$el.getBoundingClientRect();
      let height = window.innerHeight - rect.top;

      if (this.model.showPage) {
        height = height - 48;
      } else {
        height = height - 10;
      }

      if (this.reduceHeight) {
        height = height - parseInt(this.reduceHeight);
      }

      this.tHeight = height;
    },
    throttle(method, context) {
      if (!method.tId) {
        method.call(context);
        method.tId = 1;
        setTimeout(() => (method.tId = 0), 100);
      }
    },
    //设置行样式名称
    rowClassName({ row, index }) {},
    isRowDisable(row) {
      if (this.disableRows) {
        return this.disableRows.indexOf(row[this.model.idField]) > -1;
      }

      return false;
    },
    selectable(row, index) {
      return this.isRowDisable(row) ? 0 : 1;
    },
    //行单击事件
    onRowClick(row, event, column) {
      this.setRadioSeleted(row);

      if (this.model.showCheck && this.checkWhenRowClick && !this.isRowDisable(row)) {
        this.$refs.table.toggleRowSelection(row);
      }

      this.$emit('rowClick', row, event, column);
    },
    //设置单选框为选中
    setRadioSeleted(row) {
      if (this.model.showRadio) {
        if (!this.isRowDisable(row)) {
          this.selectedId = row[this.model.idField];
          this.currentRaidoCheckedRow = row;
        }
      }
    },
    //行单选事件
    handleCurrentChange(val) {
      this.setRadioSeleted(val);
    },
    //复制框事件
    onSelectionChange(val) {
      this.selectedRows = val;
      let arr = [];
      val.map(item => {
        arr.push(item[this.model.idField]);
      });
      this.selectedIds = arr;
    },
    //设置第一行为选中状态
    setFirstRowSelected() {
      return;
      if (this.model.data && this.model.data.length > 0) {
        this.$nextTick(() => {
          if (this.model.showRadio && !this.model.showCheck) {
            this.setCurrent(this.model.data[0]);
          }
        });
      }
    },
    //计算行索引
    indexMethod(index) {
      let num = (this.model.pageInfo.currentPage - 1) * this.model.pageInfo.pageSize + index + 1;
      return num;
    },
    //表格方法供外部调用
    //刷新表格数据
    refreshPaging(pageIndex, callback) {
      if (pageIndex) {
        this.model.pageInfo.currentPage = pageIndex;
      }
      this.paging(callback);
    },
    //获取选中的行--针对复选框选择
    getSelectedRows() {
      return this.selectedRows;
    },
    getSelectedIds() {
      return this.selectedIds;
    },
    getRowById(id) {
      let row = null;

      for (var i in this.model.data) {
        if (this.model.data[i][this.model.idField] == id) {
          row = this.model.data[i];
          break;
        }
      }

      return row;
    },
    //设置选中的行--针对复选框选择
    setSelectionById(id, isSelected) {
      let row = this.getRowById(id);

      if (row) {
        this.$refs.table.toggleRowSelection(row, isSelected);
      }
    },
    setSelection(row, isSelected) {
      this.$refs.table.toggleRowSelection(row, isSelected);
    },
    //获取选中的行--针对单选框选择
    getSelectedRow() {
      return this.currentRaidoCheckedRow;
    },
    //设置选中行--针对单选框选择
    setCurrentById(id) {
      let row = this.getRowById(id);

      if (row) {
        this.$refs.table.setCurrentRow(row);
        this.setRadioSeleted(row);
      }
    },
    //设置选中行--针对单选框选择
    setCurrent(row) {
      this.$refs.table.setCurrentRow(row);
      this.setRadioSeleted(row);
    }
  },
  created() {
    this.tableStore = new tableStore(this.data, this.option);
    this.model = this.tableStore.model;
    this.setFirstRowSelected();
  },
  mounted() {
    this.$nextTick(() => {
      if (this.model.autoHeight) {
        this.setHeight();
      } else {
        if (this.height) {
          this.tHeight = this.height;
        }
      }
    });

    if (this.model.showPage && this.model.isMountedPaging) {
      this.paging();
    }

    let thisObj = this;
    window.onresize = function() {
      thisObj.common.throttle(() => {
        if (thisObj.model.autoHeight) {
          thisObj.setHeight();
        }
      }, null);
    };
  },
  watch: {
    data(val) {
      this.tableStore.model.data = val;
      this.selectedId = '';
      this.currentRaidoCheckedRow = null;
      this.selectedRows = [];
      this.setFirstRowSelected();
    },
    height(val) {
      if (!this.model.autoHeight) {
        this.tHeight = val;
      }
    },
    'option.showCheck'(val) {
      this.model.showCheck = val;
    },
    'option.showRadio'(val) {
      this.model.showRadio = val;
    }
  }
};
