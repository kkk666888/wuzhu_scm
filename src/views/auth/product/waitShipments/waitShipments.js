//待发货管理
export default {
    name:'waitShipments',
    data(){
        return {
            searchModel:this.initSearchModel(),
            tableData:[],
            tableOption:this.getTableOption(),
            deliverDialog:{
                title:'发货',
                visible:false,
                logisticsCompanyValue:''
            },
            addressDialog:{
                title:'修改发货地址',
                visible:false,
                item:null,
                customerAddress:''
            },
            offlineDeliverDialog:{
                title:'线下发货',
                visible:false,
                item:null,
                deliveryOrderNo:'',
                logisticsCompany:''
            },
            pickUpDialog:{
                title:'自提',
                visible:false,
                signUser:'',
                item:null
            },
            logisticsCompanyList:this.enum.logisticsCompanyList
        }
    },
    methods:{
        //查询
        search(){
            this.$refs.table.refreshPaging(1);
        },
        initSearchModel(){
            return {
                commodityCategory:''
            }
        },
        //表格配置
        getTableOption(){
            let thisObj = this;
            let option = {
                showPage:true,
                autoHeight:true,
                showCheck:true,
                columns:[
                    { prop:'orderNo',label:'订单编号',width:200 },
                    { prop:'commodityNo',label:'商品编号',width:100 },
                    { prop:'commodityType',label:'商品类型',width:120 },
                    { prop:'brandName',label:'商品品牌',width:120 },
                    { prop:'commodityCategory',label:'商品品类',width:300 },
                    { prop:'commodityAttr',label:'商品属性',width:250 },
                    { prop:'receiveName',label:'客户姓名',width:120 },
                    { prop:'customerAddress',label:'客户地址',width:300 },
                    { prop:'receiveTel',label:'电话',width:120 },
                    { prop:'stockCode',label:'识别码',width:150},
                    { prop:'stockNo',label:'库存码',width:200},
                    { prop:'vendorName',label:'供应商',width:150},
                    { prop:'operate',label:'操作',fixed:'right',width:300,render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.pickUpMyself(param.row)}}>确认自提</el-button>
                                <el-button type="primary" onClick={()=>{thisObj.changeAddr(param.row)}}>修改地址</el-button>
                                <el-button type="primary" onClick={()=>{thisObj.offlineDeliver(param.row)}}>线下发货</el-button>
                            </div>
                        )
                    }}
                ]
            }
    
            return option;
        },
        //获取表格数据
        getList(pageInfo,callback){
            let param = {
                pageNum:pageInfo.pageIndex,
                pageSize:pageInfo.pageSize,
                commodityCategory:this.searchModel.commodityCategory || null
            }

            this.api.logistic.getAllSendingInfo.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //确认发货
        deliver(){
            let rows = this.$refs.table.getSelectedRows();
            if(rows.length==0){
                this.alert.toast('请选择需要发货的订单');
                return;
            }
            this.deliverDialog.visible = true;
            this.deliverDialog.logisticsCompanyValue = '';
        },
        //确认发货保存
        deliverSave(){
            if(!this.deliverDialog.logisticsCompanyValue){
                this.alert.toast('请选择物流公司');
                return;
            }

            let rows = this.$refs.table.getSelectedRows();
            let param = {
                logisticCompany:this.deliverDialog.logisticsCompanyValue,
                stockNos:[]
            }
            rows.forEach(row=>{
                param.stockNos.push(row.stockNo);
            })
            this.api.logistic.confirmSendCommodity.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    let msg = '发货成功 ' + res.data.successNum + ' 个,发货失败 ' + res.data.failNum + ' 个';
                    this.alert.info(msg);
                    this.deliverDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //确认自提
        pickUpMyself(item){
            this.pickUpDialog.visible = true;
            this.pickUpDialog.signUser = '';
            this.pickUpDialog.item = item;
        },
        //确认自提保存
        pickUpSave(){
            if(!this.pickUpDialog.signUser){
                this.alert.toast('请输入签收人');
                return;
            }

            let param = {
                signUser:this.pickUpDialog.signUser,
                stockNo:this.pickUpDialog.item.stockNo
            }

            this.api.logistic.comfirmSelfExtraction.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.pickUpDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //修改收货地址
        changeAddr(item){
            this.addressDialog.visible = true;
            this.addressDialog.item = item;
            this.addressDialog.customerAddress = item.customerAddress
        },
        //修改收货地址保存
        changeAddrSave(){
            if(!this.addressDialog.customerAddress){
                this.alert.toast('请输入客户地址');
                return;
            }
            let param = {
                customerAddress:this.addressDialog.customerAddress,
                orderNo:this.addressDialog.item.orderNo,
                stockNo:this.addressDialog.item.stockNo
            }
            this.api.logistic.editCustomerAddress.send(param,{showLoading:true}).then(res=>{
                if(res.code=='00'){
                    this.addressDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //线下发货
        offlineDeliver(item){
            this.offlineDeliverDialog.visible = true;
            this.offlineDeliverDialog.item = item;
            this.offlineDeliverDialog.deliveryOrderNo = '';
            this.offlineDeliverDialog.logisticsCompany = '';
        },
        //线下发货保存
        offlineDeliverSave(){
            if(!this.offlineDeliverDialog.deliveryOrderNo){
                this.alert.toast('请输入运单号');
                return;
            }
            if(!this.offlineDeliverDialog.logisticsCompany){
                this.alert.toast('请选择物流公司');
                return;
            }
            let param = {
                deliveryOrderNo:this.offlineDeliverDialog.deliveryOrderNo,
                logisticsCompany:this.offlineDeliverDialog.logisticsCompany,
                stockNo:this.offlineDeliverDialog.item.stockNo
            }
            this.api.logistic.gounderline.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.offlineDeliverDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
            
        }
    },
    mounted(){
        
    }
}