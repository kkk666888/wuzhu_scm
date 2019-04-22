//采集商品sku
export default {
    name:'collectProductSku',
    data(){
        return {
            tableData:[],
            statusList:[],
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),

            skuTableData:[],
            skuTableOption:this.getSkuTableOption(),
            collectDialog:{
                bindSkuVisible:false,
                channelType:'',
                keyword:'',
                currentItem:null
            },
            unbindDialog:{
                visible:false,
                needRefreshMainTable:false,
                data:[],
                option:this.getUnbindOption()
            },
            channelList:[]
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
                commdityNo:'',
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
                    { prop:'commodityNo',label:'物主商品SKU',width:130 },
                    { prop:'typeName',label:'商品类型',width:100 },
                    { prop:'brand',label:'商品品牌',width:100 },
                    { prop:'shortName',label:'商品短名称',width:250 },
                    { prop:'fullName',label:'商品全名称',width:300 },
                    { prop:'specDesc',label:'商品规格',width:250 },
                    { prop:'vopChannelNames',label:'已绑定SKU的集采商',width:150 },
                    { prop:'vopSkuIds',label:'已绑定的SKU',width:150 },
                    { prop:'opreate',label:'操作',width:270,fixed:'right', render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.bindSkuOpen(param.row)}}>绑定集采商SKU</el-button>
                                <el-button type="primary" onClick={()=>{thisObj.unbindOpen(param.row)}}>解绑集采商SKU</el-button>
                            </div>
                        )
                    }}
                ]
            }
    
            return option;
        },
        //解绑-表格配置
        getUnbindOption(){
            let thisObj = this;
            return {
                showPage:false,
                showSerial:true,
                columns:[
                    { prop:'typeName',label:'商品类型',width:120},
                    { prop:'brand',label:'商品品牌',width:120},
                    { prop:'shortName',label:'商品短名称',width:300},
                    { prop:'vopChannelName',label:'采集商',width:130 },
                    { prop:'skuId',label:'商品SKU',width:130 },
                    { prop:'operate',label:'操作',width:80,render(h,param){
                        return (
                            <el-button type="primary" onClick={()=>{thisObj.unbindVopSku(param.row)}}>解绑</el-button>
                        )
                    } }
                ]
            }
        },
        //加载表格数据
        getList(pageInfo,callback){
            let param = {
                pageNum:pageInfo.pageIndex,
                pageSize:pageInfo.pageSize,
                commdityNo:this.searchModel.commdityNo || null,
                shortName:this.searchModel.shortName || null
            }

            this.api.commdityType.getList.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //sku表格配置
        getSkuTableOption(){
            let thisObj = this;
            let option = {
                showPage:false,
                showSerial:true,
                columns:[
                    { prop:'skuId',label:'sku',width:220 },
                    { prop:'wareName',label:'商品名称'},
                    { prop:'opreate',label:'操作',width:80,fixed:'right', render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.bindSku(param.row)}}>绑定</el-button>
                            </div>
                        )
                    }}
                ]
            }
    
            return option;
        },
        //绑定-打开
        bindSkuOpen(item){
            this.loadCollectProvider(()=>{
                this.collectDialog.bindSkuVisible = true;
                this.collectDialog.currentItem = item;
                this.collectDialog.keyword = item.shortName;
                this.skuTableData = [];
            })
        },
        //绑定-保存
        bindSku(item){
            let thisObj = this;
            thisObj.alert.confirm('确认要绑定',{
                onConfirm(){
                    let param = {
                        brand:thisObj.collectDialog.currentItem.brand,
                        commodityNo:thisObj.collectDialog.currentItem.commodityNo,
                        shortName:thisObj.collectDialog.currentItem.shortName,
                        typeName:thisObj.collectDialog.currentItem.typeName,
                        channelType:thisObj.collectDialog.channelType,
                        vopChannelType:thisObj.collectDialog.channelType,
                        skuId:item.skuId,
                        fullName:thisObj.collectDialog.currentItem.fullName,
                        specDesc:thisObj.collectDialog.currentItem.specDesc
                    }
                    this.api.commdityBind.bindVopSku.send(param,{showLoading:true}).then(res=>{
                        if(res.code==='00'){
                            thisObj.collectDialog.bindSkuVisible = false;
                            thisObj.$refs.table.refreshPaging();
                        }
                    })
                }
            })
        },
        // 加载集采商
        loadCollectProvider(callback){
            if(this.channelList.length > 0){
                if(callback && callback instanceof Function){
                    callback();
                }
            }
            else{
                this.api.commdityType.getChannelList.send(null,{showLoading:true}).then(res=>{
                    if(res.code === '00'){
                        this.channelList = res.data || [];
                        if(this.channelList.length>0){
                            this.collectDialog.channelType = this.channelList[0].value;
                        }
                        if(callback && callback instanceof Function){
                            callback();
                        }
                    }
                })
            }
        },
        // 搜索
        bindSkuSearch(){
            if(!this.collectDialog.channelType){
                this.alert.toast('请选择采集商');
                return;
            }
            if(!this.collectDialog.keyword){
                this.alert.toast('商品短名称不能为空,建议英文逗号隔开');
                return;
            }

            let param = {
                channelType:this.collectDialog.channelType,
                keyword:this.collectDialog.keyword
            }
            this.api.vopApiAccess.skuSearch.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.skuTableData = res.data || [];
                }
            })
        },
        //解绑-打开
        unbindOpen(item){
            this.api.commdityBind.queryCommdityBindList.send({commodityNo:item.commodityNo},{
                showLoading:true
            }).then(res=>{
                if(res.code==='00'){
                    this.unbindDialog.data = res.data || [];
                    this.unbindDialog.visible = true;
                    this.unbindDialog.needRefreshMainTable = false;
                }
            })
        },
        //解绑-保存
        unbindVopSku(item){
            let thisObj = this;
            thisObj.alert.confirm('确定要解绑?',{
                onConfirm(){
                    let param = {
                        bindId:item.bindId
                    }
                    thisObj.api.commdityBind.unbindVopSku.send(param,{showLoading:true}).then(res=>{
                        if(res.code === '00'){
                            thisObj.unbindDialog.needRefreshMainTable = true;
                            thisObj.common.removeItem(thisObj.unbindDialog.data,'bindId',item.bindId)
                        }
                    })
                }
            })
        },
        onUnbindClose(){
            if(this.unbindDialog.needRefreshMainTable){
                this.$refs.table.refreshPaging();
            }
        }
    },
    mounted(){
        
    }
}