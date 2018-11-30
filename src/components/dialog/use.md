## 模态窗口  option = {showFooter:true}

##使用
<my-dialog :title='' :visible.sync='' @onConfirm="" :option=""></my-dialog>

##属性说明
title 标题
visible 是否显示
confirmBtnTxt:'确定'
cancelBtnTxt:'取消
option = { 可选
    showFooter:true 是否显示页脚
}

##事件
onConfirm 点击确认时事件
onClose 关闭后触发事件