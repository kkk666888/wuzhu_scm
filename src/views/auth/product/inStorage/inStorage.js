//入库管理
export default {
    name:'inStorage',
    data(){
        let baseUrl = this.common.getBaseUrl(this.api.baskstageManager.getGoodNum.hostName);
        let uploadPath = baseUrl + '/' + this.api.baskstageManager.getGoodNum.url;
        return {
            tableData:[],
            tableOption:this.getTableOption(),
            searchModel:this.initSearchModel(),
            inStorageDialog:{
                visible:false,
                title:'已有商品入库',
                item:null,
                fileId:'',
                count:0,
                uploadPath:uploadPath
            },
            providers:[],
            model:this.initItorageModel()
        }
    },
    methods:{
        search(){
            this.$refs.table.refreshPaging(1);
        },
        initSearchModel(){
            return {
                commodityCategory:''
            }
        },
        initItorageModel(){
            let item = {
                commodityNo:'',
                vendorCode:'',
                price:''
            }
            return item;
        },
        //表格配置
        getTableOption(){
            let thisObj = this;
            let option = {
                showPage:true,
                autoHeight:true,
                columns:[
                    { prop:'commodityNo',label:'商品编号',width:120 },
                    { prop:'commodityType',label:'商品类型',width:80 },
                    { prop:'brandName',label:'商品品牌',width:80 },
                    { prop:'commodityCategory',label:'商品品类',width:200 },
                    { prop:'depreciationRatio',label:'折旧系数',width:80 },
                    { prop:'isLimited',label:'是否限量',width:80 },
                    { prop:'commodityAttr',label:'属性'},
                    { prop:'storageAmount',label:'在库量',width:80 },
                    { prop:'waitSendAmount',label:'待发货',width:80},
                    { prop:'waitConfirmAmount',label:'待确认入库',width:100},
                    { prop:'waitRepairAmount',label:'待配货量',width:80},
                    { prop:'operate',label:'操作',width:220,render(h,param){
                        return(
                            <div>
                                <el-button type="primary" onClick={()=>{thisObj.inStorageOpen(param.row)}}>已有商品入库</el-button>
                                <el-button type="primary" onClick={()=>{thisObj.inStorage(param.row)}}>确认入库</el-button>
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
            this.api.baskstageManager.getList.send(param,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //已有商品入库
        inStorageOpen(item){
            this.model = this.initSearchModel();
            this.loadProviders(()=>{
                this.inStorageDialog.item = item;
                this.inStorageDialog.count = 0;
                this.inStorageDialog.fileId = '';
                this.inStorageDialog.visible = true;
            })
        },
        //已有商品入库保存
        inStorageDialogSave(){
            let uploader = this.$refs.upload.getUploader();

            if(!this.model.vendorCode){
                this.alert.toast('请选择进货商');
                return;
            }
            if(uploader.uploadFiles.length===0){
                this.alert.toast('请选择文件');
                return;
            }
            if(!this.model.price){
                this.alert.toast('请输入进货单价');
                return;
            }
            if(!this.common.valid.isFloat(this.model.price)){
                this.alert.toast('请输入正确的金额格式');
                return;
            }

            let baseUrl = this.common.getBaseUrl(this.api.baskstageManager.upload.hostName);
            let url =  baseUrl + '/' + this.api.baskstageManager.upload.url + '?commodityNo='+ this.inStorageDialog.item.commodityNo +'&vendorCode='+ this.model.vendorCode +'&price=' + this.model.price;
            this.uploadSave(url,uploader.uploadFiles[0].raw);
        },
        uploadSave(url,file){
            let thisObj = this;
            let request = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            request.onreadystatechange = ()=>{
                if(request.readyState===4 && request.status===200){
                    let data = JSON.parse(request.response);
                    if(data.code==='00'){
                        thisObj.inStorageDialog.visible = false;
                        if(data.data){
                            thisObj.alert.toast(data.data);
                        }
                        thisObj.$refs.table.refreshPaging();
                    }else{
                        thisObj.alert.error(data.data);
                    }
                }
            }
            request.open('post',url);
            let formData = new FormData();
            formData.append('file',file);
            request.send(formData);
        },
        //确认入库
        inStorage(item){
            let thisObj = this;
            thisObj.alert.confirm('确认要入库',{
                onConfirm(){
                    let param = {
                        commodityNo:item.commodityNo
                    }
                    thisObj.api.baskstageManager.confirmStorage.send(param,{showLoading:true}).then(res=>{
                        if(res.code==='00'){
                            thisObj.$refs.table.refreshPaging();
                        }
                    })
                }
            })
        },
        //获取供应商
        loadProviders(callback){
            if(this.providers && this.providers.length>0){
                if(callback && callback instanceof Function){
                    callback();
                }
            }
            else{
                this.api.baskstageManager.getAllVendot.send().then(res=>{
                    if(res.code==='00'){
                        this.providers = res.data || [];
                        if(callback && callback instanceof Function){
                            callback();
                        }
                    }
                })
            }
        },
        //上传成功事件
        uploadSuccess(data,file){
            if(file.response.code==='00'){
                this.inStorageDialog.count = file.response.data || 0;
            }
        },
        //移除文件
        onRemove(){
            this.inStorageDialog.count = 0
        }
    },
    mounted(){
        
    }
}