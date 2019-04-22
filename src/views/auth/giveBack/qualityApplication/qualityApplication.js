//质检申请单管理
export default {
    name:'qualityApplication',
    data(){
        return {
            tableData:this.common.testData(),
            tableOption:this.getTableOption(),
            qualityResultDialog:{
                visible:false,
                title:'填写检验结果'
            }
        }
    },
    methods:{
        search(){

        },
        //表格配置
        getTableOption(){
            let thisObj = this;
            let option = {
                showPage:true,
                autoHeight:true,
                showSerial:true,
                columns:[
                    { prop:'b',label:'质检申请单号',width:120},
                    { prop:'c',label:'检测站名称',width:120 },
                    { prop:'d',label:'申请人',width:120 },
                    { prop:'e',label:'申请时间',width:120 },
                    { prop:'f',label:'状态',width:120 },
                    { prop:'g',label:'检验人',width:120 },
                    { prop:'h',label:'检验完成时间',width:120 },
                    { prop:'i',label:'检验结论',width:120 },
                    { prop:'j',label:'发起质检的原因',width:120},
                    { prop:'k',label:'商品类型',width:120},
                    { prop:'l',label:'商品短名称',width:120},
                    { prop:'m',label:'商品规格',width:120},
                    { prop:'n',label:'检测站点类型',width:120},
                    { prop:'o',label:'操作',width:120,fixed:'right',render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.qualityResultOpen()}}>填写检验结果</el-button>
                            </div>
                        )
                    }},
                ]
            }
    
            return option;
        },
        //填写检验结果
        qualityResultOpen(){
            this.qualityResultDialog.visible = true;
        },
        //填写检验结果保存
        qualityResultSave(){

        }
    },
    mounted(){
        
    }
}