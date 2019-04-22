//已发货管理
import ExportFile from '@/utils/export';
import myLogisticsInfo from '@/components/logisticsInfo/logisticsInfo.vue';
export default {
    name:'hadShipments',
    components:{
        myLogisticsInfo
    },
    data(){
        return {
            tableData:[],
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),
            logisticsDialog:{
                visible:false,
                orderItem:null,
                trackNumber:''
            },
            deliverDialog: {
                visible: false,
                confirmDate: '',
                confirmTime: ''
            },
            selectRow: {

            }
        }
    },
    methods:{
        search(){
            this.$refs.table.refreshPaging(1);
        },
        initSearchModel(){
            return {
                commodityCategory:'',
                orderNo:'',
                customerName:'',
                identifiCode: '',
                deliverTime: ''
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
                    { prop:'stockNo',label:'库存id',width:190 },
                    { prop:'orderNo',label:'订单编号',width:200 },
                    { prop:'commodityNo',label:'商品编号',width:100 },
                    { prop:'commodityType',label:'商品类型',width:100 },
                    { prop:'brandName',label:'商品品牌',width:100 },
                    { prop:'commodityCategory',label:'商品品类',width:350 },
                    { prop:'commodityAttr',label:'商品属性',width:250 },
                    { prop:'receiveName',label:'客户姓名',width:100 },
                    { prop:'customerAddress',label:'客户地址',width:300 },
                    { prop:'receiveTel',label:'电话',width:100 },
                    { prop:'identifiCode',label:'识别码',width:300},
                    { prop:'stockCode',label:'库存码',width:180},
                    { prop:'printerNum',label:'打印次数',width:100},
                    { prop:'expressCompanyName',label:'物流公司',width:100},
                    { prop:'stockStatusName',label:'物流状态',width:100},
                    { prop:'deliveryOrderNo',label:'运单号',width:150},
                    { prop:'deliverTime',label:'发货时间',width:150},
                    { prop:'operate',label:'操作',fixed:'right',width:220,render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.logisticsTracking(param.row)}}>查看物流信息</el-button>
                                <el-button type="primary" disabled={param.row.stockStatusName==='已签收'} onClick={()=>{thisObj.confirmDelivery(param.row)}}>确认收货</el-button>
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
                commodityCategory:this.searchModel.commodityCategory,
                orderNo:this.searchModel.orderNo,
                customerName:this.searchModel.customerName,
                identifiCode:this.searchModel.identifiCode
            }
            if (this.searchModel.deliverTime){
                param['deliverTimeStart'] = this.searchModel.deliverTime[0]
                param['deliverTimeEnd'] = this.searchModel.deliverTime[1]
            }

            this.api.logistic.getAllSendedInfo.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //查看物流信息
        logisticsTracking(row){
            this.logisticsDialog.orderItem = row;
            this.logisticsDialog.visible = true;
            this.logisticsDialog.trackNumber = row.stockNo
        },
        // 确认收货
        confirmDelivery(row){
            this.deliverDialog.visible = true;
            this.deliverDialog.confirmDate = '';
            this.deliverDialog.confirmTime = '';
            this.selectRow = row

            // thisObj.alert.confirm('确认已收货？',{
            //     onConfirm(){
            //         let param = {
            //             stockNo:row.stockNo
            //         }
            //         thisObj.api.logistic.confirmCollectgoods.send(param,{showLoading:true}).then(res=>{
            //             if(res.code==='00'){
            //                 thisObj.$refs.table.refreshPaging();
            //             }
            //         })
            //     }
            // })
        },
        // 确认保存
        confirmSave(){
            let thisObj = this;
            if(this.deliverDialog.confirmDate){
                let param = {
                    stockNo:this.selectRow.stockNo,
                    confirmDate:this.deliverDialog.confirmDate,
                    confirmTime:this.deliverDialog.confirmTime
                }
                thisObj.api.logistic.confirmCollectgoods.send(param,{showLoading:true}).then(res=>{
                    if(res.code==='00'){
                        thisObj.$refs.table.refreshPaging();
                        this.deliverDialog.visible = false;
                        this.selectRow = {}
                    }
                })
            }else{
                this.$message({
                    message: '请输入确认收货日期！',
                    type: 'warning'
                  });
            }
            
        },
        // 取消保存
        cancelSave(){
            this.deliverDialog.visible = false;
            this.selectRow = {}
        },
        // 打印
        print(){
            let rows = this.$refs.table.getSelectedRows();
            if(rows.length===0){
                this.alert.toast('请至少选择一条订单操作');
                return;
            }
            let stockNos = []
            rows.forEach(item=>{
                stockNos.push(item.stockNo);
            })
            this.api.logistic.printerWayBill.send(stockNos,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    let msg = '打印成功 ' + res.data.successNum + ' 个,打印失败 ' + res.data.failNum + ' 个.\n' ;
                    let htmlMsg = '';
                    res.data.messages.forEach(item =>{
                        if(item.printStatus === 'SUCCESS'){
                            htmlMsg = htmlMsg + "<img style='width:48%' src='data:image/jpeg;base64," + item.printMessage + "'/>";
                        }

                        else if(item.printStatus === 'FAIL'){
                            htmlMsg = htmlMsg + item.printMessage + "<br>";
                        }
                    })

                    this.$confirm(htmlMsg, msg, {
                        dangerouslyUseHTMLString: true,
                        center: true,
                        lockScroll: true
                      });
                }
            })
        },
        async exportExcel(){
            let param = {
                commodityCategory:this.searchModel.commodityCategory,
                orderNo:this.searchModel.orderNo,
                customerName:this.searchModel.customerName,
                identifiCode:this.searchModel.identifiCode
            }
            if (this.searchModel.deliverTime){
                param['deliverTimeStart'] = this.searchModel.deliverTime[0]
                param['deliverTimeEnd'] = this.searchModel.deliverTime[1]
            }
            try {
              const res = await this.$api.logistic.exportAllSendedInfo.send(param, { showLoading: true });
              if (res.code === '00') {
                this.$alert.toast('导出中', { autoHideTimeout: 2000 });
                let date = new Date().toLocaleDateString();
                ExportFile(res.data, `已发货清单${date}`);
              }
            } catch (error) {
              console.log(error);
            }

        }
    },
    mounted(){

    }
}