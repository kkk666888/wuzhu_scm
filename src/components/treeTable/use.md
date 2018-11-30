## 树table
<my-tree-table :data="tableData" :option="tableOption"></my-tree-table>
##属性
data = [] 数据源
isShowCheckAll:true 是否显示全选
option = {
    idField:'',树结构对应的id字段
    diaplayField:'',树结构对应的名称字段
    childField:'',树结构对应的子级字段
    leafField:''树结构对应的是否子节点字段
    showAllChild:false 是否显示所有子级
    showCheck:false,是否显示复选框
    height:200 表格body高度
    autoHeight:false 自动计算高度至底部,height的优先级高
    columns:[
        {
            prop:'',
            label:'',
            width:100,
            render:function(h, params),render模板
        }
    ],
    afterAddProperty(row) 每一行添加自定义属性后触发
}
##事件
getCurrentSelectedRow() 返回当前选中的行-单行
getCheckedIds() 获取选中的id集合-复选框
selectedRow(id) 设置某行选中

##每一行添加的属性
_showChild 是不显示子级
_level
_fatherId
_rootId
_check
_checkDisabled 
_idChain 层级链