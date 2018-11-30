## 树组件
<my-tree :data="treeData" :option="treeOption" @treeClick="myTreeClick(item)"></my-tree>

##属性 
option = {
    idField:'',树结构对应的id字段
    diaplayField:'',树结构对应的名称字段
    childField:'',树结构对应的子级字段
    leafField:''树结构对应的是否子节点字段
    showAllChild:false 是否显示所有子级
}

data = []

会对data每一项和子项都添加自定义属性
_level 层级
_fatherId 父级ID
_rootId 根ID
_style 样式

##事件
treeClick 参数item 树节点单击事件
setCurrentTreeId(id) 设置当前id为激活节点