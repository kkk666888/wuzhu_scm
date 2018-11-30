//物主-集采商品信息查询
export default {
    name:'collectProductSearch',
    data(){
        return {
            tableData:[],
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),
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
                commodityNo:'',
                shortName:'',
                vopChannelType:''
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
                    { prop:'fullName',label:'商品全名称'},
                    { prop:'specDesc',label:'规格参数',width:250 },
                    { prop:'vopChannelName',label:'集采商名称',width:100 },
                    { prop:'skuId',label:'集采商商品SKU',width:120 },
                    { prop:'skuPrice',label:'报价',width:60 }
                ]
            }
    
            return option;
        },
        //加载表格数据
        getList(pageInfo,callback){
            let param = {
                pageNum:pageInfo.pageIndex,
                pageSize:pageInfo.pageSize,
                commodityNo:this.searchModel.commodityNo,
                shortName:this.searchModel.shortName,
                vopChannelType:this.searchModel.vopChannelType
            }

            this.api.commdityBind.getList.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        // 加载集采商
        loadCollectProvider(){
            this.api.commdityType.getChannelList.send(null,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.channelList = res.data || [];
                }
            })
        }
    },
    mounted(){
        this.loadCollectProvider();
    }
}