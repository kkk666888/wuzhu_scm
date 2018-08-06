//订单管理
export default {
    name:'order',
    data(){
        return {
            tableData:[],
            statusList:[],
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),
            feeTableData:[],
            feeTableOption:this.getFeeTableOption(),
            extendTenancyTermDialog:{
                visible:false,
                item:null,
                days:'',
                type:'',
                remark:''
            },
            finishDialog:{
                visible:false,
                item:null
            }
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
                status:''
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
                    { prop:'orderNo',label:'订单编号',width:220 },
                    { prop:'statusName',label:'订单状态',width:150 },
                    { prop:'customerName',label:'客户姓名',width:150 },
                    { prop:'typeName',label:'商品类型',width:150 },
                    { prop:'shortName',label:'商品短名称',width:300 },
                    { prop:'specContentList',label:'商品规格'},
                    { prop:'opreate',label:'操作',width:300,render(h,param){
                        return(
                            <div>
                                <el-button type="primary" disabled={param.row.status !== '9001'} onClick={()=>{thisObj.confirmFinish(param.row)}}>确认完结</el-button>
                                <el-button type="primary" disabled={param.row.status !== '9001'} onClick={()=>{thisObj.buyOut(param.row)}}>强制买断</el-button>
                                <el-button type="primary" disabled={param.row.bizStatus !== '7'} onClick={()=>{thisObj.extendTenancyTermOpen(param.row)}}>延长租期</el-button>
                            </div>
                        )
                    }}
                ]
            }
    
            return option;
        },
        //费用表格配置
        getFeeTableOption(){
            let thisObj = this;
            let option = {
                columns:[
                    { prop:'a',label:'扣费原因类型',width:220,render(h,param){
                        return(
                            <div>
                                <el-select v-model={param.row.a}>
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </div>
                        )
                    } },
                    { prop:'b',label:'扣费金额',width:150,render(h,param){
                        return(
                            <div>
                                <el-input v-model={param.row.b} placeholder="请输入"></el-input>
                            </div>
                        )
                    } },
                    { prop:'c',label:'详情描述',render(h,param){
                        return(
                            <div>
                                <el-input v-model={param.row.c} placeholder="请输入"></el-input>
                            </div>
                        )
                    }},
                    { prop:'opreate',label:'操作',width:80,render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.removeFeeItem(param.row)}}>删除</el-button>
                            </div>
                        )
                    }}
                ]
            }
            return option
        },
        //加载表格数据
        getList(pageInfo,callback){
            let param = {
                pageNum:pageInfo.pageIndex,
                pageSize:pageInfo.pageSize,
                orderNo:this.searchModel.orderNo || null,
                customerName:this.searchModel.customerName || null,
                status:this.searchModel.status || null
            }

            this.api.orders.getList.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //获取状态
        getStatus(){
            this.api.orders.status.send().then(res=>{
                if(res.code === '00'){
                    this.statusList = res.data || [];
                }
            })
        },
        //强制买断
        buyOut(item){
            let thisObj = this;
            thisObj.alert.confirm('确认要强制买断',{
                onConfirm(){
                    thisObj.api.orders.buyOut.send({orderNo:item.orderNo},{showLoading:true})
                    .then(res=>{
                        if(res.code === '00'){
                            thisObj.$refs.table.refreshPaging();
                        }
                    })
                }
            })
        },
        //延长租期-打开
        extendTenancyTermOpen(item){
            this.extendTenancyTermDialog.visible = true;
            this.extendTenancyTermDialog.item = item;
            this.extendTenancyTermDialog.days = '';
            this.extendTenancyTermDialog.type = '';
            this.extendTenancyTermDialog.remark = '';
        },
        //延长租期-保存
        extendTenancyTermSave(){
            if(!this.extendTenancyTermDialog.days){
                this.alert.toast('请输入天数');
                return;
            }
            if(!this.common.valid.isNum(this.extendTenancyTermDialog.days)){
                this.alert.toast('天数为正整数');
                return;
            }
            if(this.extendTenancyTermDialog.type === ''){
                this.alert.toast('请选择延期原因');
                return;
            }
            let param = {
                orderNo:this.extendTenancyTermDialog.item.orderNo,
                days:this.extendTenancyTermDialog.days,
                type:this.extendTenancyTermDialog.type,
                remark:this.extendTenancyTermDialog.remark
            }
            this.api.orders.delay.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.alert.toast('延长租期成功');
                    this.extendTenancyTermDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //添加费目
        addFeeItem(){
            let item = {
                id:this.common.generateUniqueValue(),
                a:'',
                b:'',
                c:''
            }
            this.feeTableData.push(item);
        },
        //移除费目
        removeFeeItem(item){
            this.common.removeItem(this.feeTableData,'id',item.id);
        },
        finishSave(){
            console.log(this.feeTableData);
        },
        confirmFinish(item){
            let thisObj = this;
            thisObj.alert.confirm('确认完结？',{
                onConfirm(){
                    thisObj.api.orders.finish.send({orderNo:item.orderNo},{showLoading:true})
                    .then(res=>{
                        if(res.code === '00'){
                            thisObj.$refs.table.refreshPaging();
                        }
                    })
                }
            })
        },
        //确认完结
        finishOpen(item){
            this.finishDialog.visible = true;
            this.finishDialog.item = item;
        },
    },
    mounted(){
        this.getStatus();
        this.addFeeItem();
    }
}