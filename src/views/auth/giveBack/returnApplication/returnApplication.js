// 归还申请单
export default {
    name:'returnApplication',
    data(){
        return {
            tableData:[],
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),
            confirmReceiptModel:this.initConfirmReceiptModel(),
            cancellationModel:this.initCancellationModel(),
            qualityTestingModel:this.initQualityTestingModel(),
            statusList:[],
            confirmReceiptDialog:{
                visible:false,
                title:'确认收货'
            },
            cancellationDialog:{
                visible:false,
                title:'作废'
            },
            qualityTestingDialog:{
                visible:false,
                title:'发起质检申请'
            }
        }
    },
    methods:{
        search(){
            this.$refs.table.refreshPaging(1);
        },
        initSearchModel(){
            return {
                returnApplyNo:'',
                deliveryOrderNo:'',
                orderNo:'',
                status:''
            }
        }, 
        //确认收货实体
        initConfirmReceiptModel(){
            return {
                status:'',
                returnApplyNo:'',
                signUser:'',
                signTime:'',
                remark:''
            }
        },
        //作废实体
        initCancellationModel(){
            return {
                status:'',
                returnApplyNo:'',
                invalidationReason:'',
                remark:''
            }
        },
        //发起质检实体
        initQualityTestingModel(){
            return {
                returnApplyNo:'',
                inspectionStationOid:'',
                inspecationReason:'',
                inspectionDesc:''
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
                    { prop:'afterRentApplyNo',label:'归还申请号',width:120},
                    { prop:'_returnStyle',label:'归还方式',width:80 },
                    { prop:'_returnReasonStyle',label:'归还原因',width:120 },
                    { prop:'statusName',label:'状态',width:80},
                    { prop:'expressCompanyName',label:'物流公司名称',width:120 },
                    { prop:'deliveryOrderNo',label:'物流单号',width:150 },
                    { prop:'orderNo',label:'租赁订单号',width:200 },
                    { prop:'expireDate',label:'租赁到期日',width:120 },
                    { prop:'typeName',label:'商品类型',width:80 },
                    { prop:'shortName',label:'商品短名称',width:200},
                    { prop:'specContentList',label:'商品规格',width:300},
                    { prop:'vendorName',label:'供应商名称',width:200},
                    { prop:'customerName',label:'客户姓名',width:80},
                    { prop:'totalTerm',label:'租期',width:80},
                    { prop:'operate',label:'操作',width:260,fixed:'right',render(h,param){
                        let confirmReceiptBtnDisable = true;
                        let cancellationBtnDisable = false;

                        if(param.row.status === '0' || param.row.status === '2'){
                            confirmReceiptBtnDisable = false;
                        }

                        if(param.row.status === '10' || param.row.status === '-1' || param.row.status === '1'){
                            cancellationBtnDisable = true;
                        }
                        
                        return(
                            <div>
                                {
                                    <el-button type="primary" disabled={confirmReceiptBtnDisable} onClick={()=>{thisObj.confirmReceiptOpen(param.row)}}>确认收货</el-button>
                                }
                                
                                {
                                    <el-button type="primary" disabled={cancellationBtnDisable} onClick={()=>{thisObj.cancellationOpen(param.row)}}>作废</el-button>
                                }

                                {/* <el-button type="primary" onClick={()=>{thisObj.qualityTestingOpen(param.row)}}>发起质检</el-button> */}
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
                returnApplyNo:this.searchModel.returnApplyNo,
                deliveryOrderNo:this.searchModel.deliveryOrderNo,
                orderNo:this.searchModel.orderNo,
                status:this.searchModel.status
            }

            this.api.returnApplyNote.getList.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.handleData(res.data.list);
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //处理数据
        handleData(data){
            if(data && data.length > 0){
                data.forEach(item=>{
                    item._returnStyle = '';
                    item._returnReasonStyle = '';

                    switch(item.returnStyle){
                        case '0':
                            item._returnStyle = '自寄';
                            break;
                        case '1':
                            item._returnStyle = '逆向物流';
                            break;
                        case '2':
                            item._returnStyle = '上门归还';
                            break;
                        case '3':
                            item._returnStyle = '上门维修';
                            break;
                    }

                    switch(item.returnReasonStyle){
                        case '0':
                            item._returnReasonStyle = '完结归还';
                            break;
                        case '1':
                            item._returnReasonStyle = '维修归还';
                            break;
                        case '2':
                            item._returnReasonStyle = '退货归还';
                            break;
                    }
                })
            }
        },
        //确认收货
        confirmReceiptOpen(item){
            this.confirmReceiptModel = this.initConfirmReceiptModel();
            this.confirmReceiptModel.returnApplyNo = item.returnApplyNo;
            this.confirmReceiptModel.status = '1';
            this.confirmReceiptDialog.visible = true;
        },
        //确认收货保存
        confirmReceiptSave(){
            if(!this.confirmReceiptModel.signUser){
                this.alert.toast('收货人不能为空');
                return;
            }

            if(!this.confirmReceiptModel.signTime){
                this.alert.toast('收货时间不能为空');
                return;
            }

            this.api.returnApplyNote.updateReturnApplyNote
            .send(this.confirmReceiptModel,{showLoading:true})
            .then(res=>{
                if(res.code === '00'){
                    this.confirmReceiptDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //作废
        cancellationOpen(item){
            this.cancellationModel = this.initCancellationModel();
            this.cancellationModel.returnApplyNo = item.returnApplyNo;
            this.cancellationModel.status = '-1';
            this.cancellationDialog.visible = true;
        },
        //作废保存
        cancellationSave(){
            if(!this.cancellationModel.invalidationReason){
                this.alert.toast('请选择作废原因');
                return;
            }

            this.api.returnApplyNote.updateReturnApplyNote
            .send(this.cancellationModel,{showLoading:true})
            .then(res=>{
                if(res.code === '00'){
                    this.cancellationDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //发起质检
        qualityTestingOpen(){
            this.qualityTestingDialog.visible = true;
        },
        //发起质检保存
        qualityTestingSave(){

        },
        //获取状态
        getStatus(){
            this.api.returnApplyNote.getStatus.send().then(res=>{
                if(res.code === '00'){
                    this.statusList = res.data || [];
                }
            })
        },
    },
    mounted(){
        this.getStatus();
    }
}