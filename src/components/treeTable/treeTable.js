import rowItem from './rowItem.vue';
import treeTableUtils from './treeTableUtils.js';

export default {
  props: {
    option: {
      type: Object
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    isShowCheckAll: {
      type: Boolean,
      default: true
    }
  },
  components: {
    rowItem
  },
  data() {
    return {
      rows: [],
      showScollTd: false,
      bodyDivStyle: {
        height: null
      },
      selectSingleRowId: 0,
      checkAll: false
    };
  },
  methods: {
    //树icon单击事件s
    myTreeIConClick(row) {
      this.nodeShowModel[row[this.option.idField]] = row._showChild;
      this.calculateHeigth();
    },
    //行单击事件
    myRowClick(row) {
      this.selectSingleRowId = row[this.option.idField];
      this.currentSelectedRow = row;
    },
    //计算高度
    calculateHeigth() {
      this.$nextTick(() => {
        let height = 0;

        if (this.option.height) {
          height = this.option.height;
        } else if (this.option.autoHeight) {
          let rect = this.tableBodyDiv.getBoundingClientRect();
          height = window.innerHeight - rect.top - 10;
        }

        if (height > 0) {
          this.bodyDivStyle.height = height + 'px';

          if (this.tableBody.offsetHeight > height) {
            this.showScollTd = true;
          } else {
            this.showScollTd = false;
          }
        }
      });
    },
    //全选事件
    checkAllChange() {
      this.treeTableUtils.checkAll(this.rows, this.checkAll);
    },
    //复选框事件
    myCheckboxChange(row) {
      this.treeTableUtils.checkboxChange(this.rows, row);
    },

    //外部调用方法
    getCurrentSelectedRow() {
      return this.currentSelectedRow;
    },
    //获取选择中的id集合
    getCheckedIds() {
      let ids = this.treeTableUtils.getCheckedIds(this.rows);
      return ids;
    },
    //设置某行选中
    selectedRow(id) {
      let row = this.treeTableUtils.getDataById(this.rows, id);
      if (row) {
        this.selectSingleRowId = id;
        this.currentSelectedRow = row;
      }
    }
  },
  created() {
    this.treeTableUtils = new treeTableUtils(this.option);
    this.rows = this.treeTableUtils.initData(this.data);
  },
  mounted() {
    let thisObj = this;
    thisObj.currentSelectedRow = null;
    thisObj.nodeShowModel = {}; //保存树节点的显示与隐藏，用在刷新时可以保持原节点的显示与隐藏
    thisObj.tableBody = this.$el.getElementsByClassName('tree-table-body')[0];
    thisObj.tableBodyDiv = this.$el.getElementsByClassName('tree-table-dbody-div')[0];
    thisObj.calculateHeigth();

    window.onresize = function() {
      thisObj.common.throttle(() => {
        thisObj.calculateHeigth();
      }, null);
    };
  },
  watch: {
    data(val) {
      this.rows = this.treeTableUtils.initData(val, this.nodeShowModel);
      this.calculateHeigth();
    }
  }
};
