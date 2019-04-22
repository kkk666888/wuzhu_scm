//采购订单跟踪
export default {
    name:'purchaseTraining',
    data(){
        return {
            tableData:[],
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),
            logisticsDialog:{
                visible:false,
                list:[]
            },
            currentItem:null
        }
    },
    methods:{
        //查询
        search(){
            this.$refs.table.refreshPaging(1);
        },
        //查询实体
        initSearchModel(){
            return {
                orderNo:'',
                customerName:'',
                vopOrderNo:'',
                shortName:''
            }
        },
        //重置
        reset(){
            this.searchModel = this.initSearchModel();
            this.$refs.table.refreshPaging(1);
        },
        //表格配置
        getTableOption(){
            let thisObj = this;
            let option = {
                showPage:true,
                autoHeight:true,
                showSerial:true,
                columns:[
                    { prop:'orderNo',label:'物主订单编号',width:200 },
                    { prop:'vopChannelName',label:'集采商名称',width:100 },
                    { prop:'vopOrderNo',label:'集采商订单编号',width:150 },
                    { prop:'vopOrderStateDesc',label:'状态',width:80},
                    { prop:'commodityNo',label:'物主商品SKU',width:100 },
                    { prop:'typeName',label:'商品类型',width:100 },
                    { prop:'brand',label:'商品品牌',width:100 },
                    { prop:'shorName',label:'商品短名称',width:300 },
                    { prop:'customerName',label:'客户姓名',width:100 },
                    { prop:'receiveAddr',label:'收货人地址',width:300 },
                    { prop:'contactTel',label:'收货人联系方式',width:150 },
                    { prop:'opreate',label:'操作',width:300,fixed:'right', render(h,param){
                        //vopOrderState 0-下单 1-订单已支付 2-订单已取消  10-已确认订单
                        let row = param.row;
                        let payDisabled = row.vopOrderState != 0;
                        let cancelDisabled = row.vopOrderState == 2 || row.vopOrderState == 10;
                        return(
                            <div>
                                <el-button type="primary" disabled={payDisabled} onClick={()=>{thisObj.doPay(row)}}>支付确认</el-button>
                                <el-button type="primary" disabled={cancelDisabled} onClick={()=>{thisObj.orderCancel(row)}}>取消采购单</el-button>
                                <el-button type="primary" onClick={()=>{thisObj.logisticsTracking(row)}}>物流追踪</el-button>
                            </div>
                        )
                    }}
                ]
            }
    
            return option;
        },
        //加载表格数据
        getList(pageInfo,callback){
            let param = {
                pageNum:pageInfo.pageIndex,
                pageSize:pageInfo.pageSize,
                orderNo:this.searchModel.orderNo,
                customerName:this.searchModel.customerName,
                vopOrderNo:this.searchModel.vopOrderNo,
                shortName:this.searchModel.shortName
            }

            this.api.vopOrderBill.getList.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //支付确认
        doPay(item){
            //vopOrderState 0-下单 1-订单已支付 2-订单已取消 10-已确认订单
            if(item.vopOrderState === 1){
                this.alert.toast('此订单已支付');
                return;
            }

            if(item.vopOrderState === 2){
                this.alert.toast('此订单已取消');
                return;
            }

            let thisObj = this;
            thisObj.alert.confirm('确认要支付？',{
                onConfirm(){
                    let param =  {
                        vopOrderNo:item.vopOrderNo,
                        channelType:item.vopChannelType
                    }
                    let promise = null;
                    if(item.vopOrderState === 0){
                        promise = thisObj.api.vopApiAccess.orderConfirm;
                    }
                    else if(item.vopOrderState === 10){
                        promise = thisObj.api.vopApiAccess.doPay;
                    }
                    promise.send(param,{showLoading:true}).then(res=>{
                        if(res.code==='00'){
                            thisObj.$refs.table.refreshPaging();
                        }
                    })
                }
            })
        },
        //订单取消
        orderCancel(item){
            //vopOrderState 0-下单 1-订单已支付 2-订单已取消
            if(item.vopOrderState === 1){
                if(item.vopChannelType === 'JD'){
                    this.alert.info('请电话联系客服取消订单，客户电话4006066866',{isAutoHide:false});
                }
                else{
                    this.alert.toast('已支付的订单不能取消');
                }
                return;
            }

            if(item.vopOrderState === 2){
                this.alert.toast('此订单已取消');
                return;
            }
            let thisObj = this;
            thisObj.alert.confirm('确认要取消订单？',{
                onConfirm(){
                    let param =  {
                        vopOrderNo:item.vopOrderNo,
                        channelType:item.vopChannelType
                    }
                    thisObj.api.vopApiAccess.orderCancel.send(param,{showLoading:true}).then(res=>{
                        if(res.code==='00'){
                            thisObj.$refs.table.refreshPaging();
                        }
                    })
                }
            })
        },
        //物流跟踪
        logisticsTracking(item){
            let param = {
                channelType:item.vopChannelType,
                vopOrderNo:item.vopOrderNo
            }

            this.api.vopApiAccess.orderTrack.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.currentItem = item;
                    this.logisticsDialog.list = (res.data || []).reverse();
                    this.logisticsDialog.visible = true;
                }
            })
        }
    },
    mounted(){
        
    }
}