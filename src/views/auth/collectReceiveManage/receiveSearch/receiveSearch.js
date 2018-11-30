//集采-收货管理
export default {
    name:'receiveSearch',
    data(){
        return {
            tableData:this.common.testData(),
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),
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
                    { prop:'a',label:'送货单号',width:130 },
                    { prop:'b',label:'订货单号',width:100 },
                    { prop:'c',label:'租赁订单号',width:100 },
                    { prop:'d',label:'商品类型',width:100 },
                    { prop:'e',label:'商品编号',width:250 },
                    { prop:'f',label:'商品名称',width:300 },
                    { prop:'g',label:'数量',width:250 },
                    { prop:'h',label:'单位',width:150 },
                    { prop:'i',label:'单价',width:150 },
                    { prop:'j',label:'总金额',width:150 },
                    { prop:'k',label:'送货日期',width:150 },
                    { prop:'l',label:'送货方式',width:150 },
                    { prop:'l',label:'状态',width:150 },
                    { prop:'l',label:'送货人',width:150 },
                    { prop:'l',label:'物流方式',width:150 },
                    { prop:'opreate',label:'操作',width:100,fixed:'right', render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.bindSkuOpen(param.row)}}>查看详情</el-button>
                            </div>
                        )
                    }}
                ]
            }
    
            return option;
        },
        //加载表格数据
        getList(pageInfo,callback){
            callback(50);
            return;
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
        }
    },
    mounted(){
        
    }
}