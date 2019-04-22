#axios 请求封装,后台一个控制器对应前端一个接口文件配置
export default {
login:{
    hostName:'',可空 后台接口接址 默认为供应链系统 不配则为供应链系统地址
        code 为核心系统地址
        portal 为门户系统

    url:'auth/login',必填

    method:'post',可空 默认为post

    isRESTful:false,可空 默认为false,

    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:false,可空 默认为false
        false contentType:application/json
        true contentType:application/x-www-form-urlencoded
    }

}

#send 方法说明
.send(param,option,axiosConfig)
param 可空，请求的参数，为对象
option:{ 可空
showLoading:false,是否显示加载中...
handleError:false 是否自己处理错误信息
},
axiosConfig:{} 可空，axios 的 config 配置，会合并 send 方法里的 config 配置

##发送异步请求
this.api.login.loginVaild.send(param,{showLoading:true}).then(res=>{

},err=>{

})
