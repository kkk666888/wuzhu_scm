//集采-入库管理
export default {
    name:'inStorageSearch',
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
                    { prop:'a',label:'入库单号',width:130 },
                    { prop:'b',label:'采购单号',width:100 },
                    { prop:'c',label:'送货单号',width:100 },
                    { prop:'d',label:'收货单号',width:100 },
                    { prop:'e',label:'入库原因',width:250 },
                    { prop:'f',label:'关联的业务单号',width:300 },
                    { prop:'g',label:'检验单号',width:250 },
                    { prop:'h',label:'入库人',width:150 },
                    { prop:'i',label:'入库时间',width:150 },
                    { prop:'j',label:'入库数量',width:150 },
                    { prop:'k',label:'状态',width:150 },
                    { prop:'l',label:'供应商',width:150 },
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