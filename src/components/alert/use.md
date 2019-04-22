##全局提示信息弹窗组件
##使用
this.alert.toast('msg',option)
this.alert.info('msg',option)
this.alert.success('msg',option)
this.alert.error('msg',option)
this.alert.confirm('msg',option)

## option 对象配置说明
option = {
    headerTxt:'' 头部标题 
    bodyTxt:'' 提示信息
    isAutoHide:false 是否自动关闭 对confirm无效
    autoHideTimeout:3000 
    onConfirm:Function 针对confirm确认弹窗确认事件
}