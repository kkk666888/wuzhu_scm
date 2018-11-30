##用法
<my-table :data="tableData" :option="tableOption" :onPaging=""></my-table>

##属性
height 表格高度，优先级低于 option.autoHeight
reduceHeight 当 option.autoHeight 为 true 时，计算高度后再减去此值
checkWhenRowClick 默认为 false ,点击行时是否自动选中，当 option.showCheck=true 时生效
disableRows:[] 禁止选择的行

## option 配置说明

option = {
idField:'',主键 id,当 showRadio=true 或 showCheck 时为必须
expandId:'',展开行 id
showSerial:false 显示序号列
serialLabel:'' 序号列标题文本
showCheck:false 显示复选框
showRadio:false 显示单选
showPage:false 显示分页,
isMountedPaging:true,是否组件挂载的时候就触发分页事件
pageInfo:{
pageIndex:1,
pageSize:20,
pageSizes:[10,20,30]
}
autoHeight:false 是否自动计算高度，到尾部
columns:[
{
prop:'',
label:'',
width:100,
fixed:'' 冻结列，默认 null, 可选 left|right
render:function(h, params),render 模板
}
]
}

##事件
onPaging(pageInfo,callback) showPage 为 true 时，此事件为必须
callback(total) 需传回总记录数
rowClick(row, event, column) 行单击事件

##方法
refreshPaging(pageIndex,callback) 当 showPage=true 时有效，刷新当前页数据 pageIndex 可选,不传则刷新当前页

getSelectedRows() 获取选中的行--针对复选框选择
getSelectedIds() 获取选中行的 id(对应 idField)--针对复选框
setSelection(row,isSelected) 设置选中的行--针对复选框选择
setSelectionById(id,isSelected) 设置选中的行--针对复选框选择

getSelectedRow() 获取选中的行--针对单选框选择
setCurrent(row) 设置选中行--针对单选框选择
setCurrentById(id) 设置选中行--针对单选框选择
