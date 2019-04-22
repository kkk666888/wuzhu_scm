
import ExportFile from '@/utils/export';
//入库管理
export default {
    name:'inStorage',
    data(){
        return {
            tableData:[],
            tableOption:this.getTableOption(),
            collectTableData:[],
            collectTableOption:this.getCollectTableOption(),
            searchModel:this.initSearchModel(),
            stockStatusList:[],
            collectSearchModel:this.initCollectSearchModel(),
            collectDialog:{
                visible:false
            },
            updateDialog:{
                visible:false,
                item:null,
                commodityNo:'',
                goodsId:''
            },
            // 虚拟库存修改
            updatexnDialog:{
                visible:false,
                item:null,
                commodityNo:'',
                goodsId:''
            },

            importFile: null,
            importUrl: this.$common.getUploadURL('/baskstageManager/import-commodity-goods'),
        }
    },
    methods:{
        search(){
            this.$refs.table.refreshPaging(1);
        },
        reset(){
            this.searchModel = this.initSearchModel();
            this.search();
        },
        //汇总查询
        collectSearch(callback){
            let param = {
                commodityCategory:this.collectSearchModel.commodityCategory,
                commodityNo:this.collectSearchModel.commodityNo
            }
            this.api.baskstageManager.getCommodityAssemble.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.collectTableData = res.data || [];
                    if(callback && callback instanceof Function){
                        callback()
                    }
                }
            })
        },
        initSearchModel(){
            return {
                commodityCategory:'',
                orderNo:'',
                stockNo:'',
                vendorName:'',
                stockStatus:''
            }
        },
        initCollectSearchModel(){
            return {
                commodityCategory:'',
                commodityNo:''
            }
        },
        //表格配置
        getTableOption(){
            let thisObj = this;
            let option = {
                showPage:true,
                autoHeight:true,
                columns:[
                    { prop:'orderNo',label:'订单编号',width:200 },
                    { prop:'stockNo',label:'库存编号',width:200 },
                    { prop:'stockCode',label:'库存码',width:150 },
                    { prop:'goodsId',label:'货物识别码(串码)',width:200 },
                    { prop:'storageBatchNo',label:'入库批次号',width:150 },
                    { prop:'warehoseNo',label:'仓库名称',width:120 },
                    { prop:'vendorName',label:'供应商',width:120 },
                    { prop:'commodityNo',label:'商品编号',width:120 },
                    { prop:'commodityCategory',label:'商品品类',width:200 },
                    { prop:'commodityType',label:'商品类型',width:80 },
                    { prop:'brandName',label:'商品品牌',width:80 },
                    { prop:'commodityAttr',label:'规格属性',width:220 },
                    { prop:'buyPrice',label:'进货价',width:100},
                    { prop:'ratio',label:'税率',width:100},
                    { prop:'stockStatusName',label:'状态',width:120},
                    { prop:'operate',label:'操作', fixed:'right', width:420,render(h,param){
                        return(
                            <div>
                                <el-button type="primary" disabled={param.row.stockStatus!=='0'} onClick={()=>{thisObj.deletStock(param.row)}}>删除</el-button>
                                <el-button type="primary" onClick={()=>{thisObj.collectOpen(param.row)}}>统计</el-button>
                                <el-button type="primary" disabled={param.row.stockType !=='2'} onClick={()=>{thisObj.updatexnOpen(param.row)}}>虚拟库存调整</el-button>
                                <el-button type="primary" onClick={()=>{thisObj.updateOpen(param.row)}}>修改识别码/商品编号</el-button>
                            </div>
                        )
                    }}
                ]
            }
            return option;
        },
        //汇总表格配置
        getCollectTableOption(){
            let option = {
                columns:[
                    { prop:'commodityNo',label:'商品编号',width:120 },
                    { prop:'commodityCategory',label:'商品品类',width:200 },
                    { prop:'commodityAttr',label:'规格属性'},
                    { prop:'stockStatusName',label:'状态',width:120},
                    { prop:'amount',label:'数量',width:80}
                ]
            }
            return option;
        },
        //获取表格数据
        getList(pageInfo,callback){
            let param = {
                pageNum:pageInfo.pageIndex,
                pageSize:pageInfo.pageSize,
                commodityCategory:this.searchModel.commodityCategory,
                orderNo:this.searchModel.orderNo,
                stockNo:this.searchModel.stockNo,
                vendorName:this.searchModel.vendorName,
                stockStatus:this.searchModel.stockStatus,
                goodsId:this.searchModel.goodsId
            }

            this.api.baskstageManager.getBaskStageStockInfoVO.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //删除库存
        deletStock(item){
            let thisObj = this;
            thisObj.alert.confirm('确认要删除库存?',{
                onConfirm(){
                    let param = {
                        stockNo:item.stockNo
                    }
                    thisObj.api.baskstageManager.deletStock.send(param,{showLoading:true}).then(res=>{
                        if(res.code==='00'){
                            thisObj.$refs.table.refreshPaging();
                        }
                    })
                }
            })
        },
        //获取库存状态
        getStockEnum(){
            this.api.baskstageManager.getAllStockEnum.send().then(res=>{
                if(res.code==='00'){
                    this.stockStatusList = res.data || [];
                }
            })
        },
        collectOpen(item){
            this.collectSearchModel = this.initCollectSearchModel();
            this.collectSearchModel.commodityNo = item.commodityNo;
            this.collectSearch(()=>{
                this.collectDialog.visible = true;
            });
        },
        updateOpen(item){
            this.updateDialog.visible = true;
            this.updateDialog.item = item;
            this.updateDialog.commodityNo = item.commodityNo;
            this.updateDialog.goodsId = item.goodsId;
        },
        updatexnOpen(item){
            this.updatexnDialog.visible = true;
            this.updatexnDialog.item = item;

            this.updatexnDialog.commodityNo = item.commodityNo;
            this.updatexnDialog.commodityCategory = item.commodityCategory;
            this.updatexnDialog.buyPrice = item.buyPrice;
            this.updatexnDialog.goodsId = item.goodsId;
            this.updatexnDialog.vendorName = item.vendorName;
            this.updatexnDialog.ratio = item.ratio;
        },
        
        updateSave(){
            if(!this.updateDialog.goodsId){
                this.alert.toast('请输入货物识别码（串码）');
                return;
            }
            if(!this.updateDialog.commodityNo){
                this.alert.toast('请输入商品编号');
                return;
            }
            let param = {
                commodityNo:this.updateDialog.commodityNo,
                goodsId:this.updateDialog.goodsId,
                stockNo:this.updateDialog.item.stockNo
            }
            this.api.baskstageManager.updateStockCommodityNoAndGoodId
            .send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.updateDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        // 更新虚拟入库
        updatexnSave(){
            if(!this.updatexnDialog.goodsId){
                this.alert.toast('请输入货物识别码（串码）');
                return;
            }
            if(!this.updatexnDialog.commodityNo){
                this.alert.toast('请输入商品编号');
                return;
            }
            let param = {
                commodityNo : this.updatexnDialog.commodityNo,
                stockNo:this.updatexnDialog.item.stockNo,
                buyPrice :this.updatexnDialog.buyPrice,
                goodsId : this.updatexnDialog.goodsId,
                vendorName : this.updatexnDialog.vendorName,
                ratio : this.updatexnDialog.ratio
            }
            // 检查数据
            this.api.baskstageManager.updatexnCommodityInfo.send(param,{
                showLoading:true
            }).then(res=>{
                if(res.code==='00'){
                    this.updatexnDialog.visible = false;
                    this.$refs.table.refreshPaging();
                    this.alert.toast("数据更新成功");
                }else{
                    this.alert.toast(res.msg);
                }
            })
        },


        // 导入
        importData(res, file) {
            // console.log(res, file);
            let name = file.name.split('.')[0];
            if (res.code === '00') {
                this.$alert.toast('导入成功');
                this.$refs.table.refreshPaging();
            } else if (res.code === '1000') {
                ExportFile(res.data, `${name}-错误`);
            }
        }
    },
    mounted(){
        this.getStockEnum();
    }
}