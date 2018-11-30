export default {
    name:'collectProviderAmount',
    data(){
        return {
            channelList:[],
            model:{
                channelType:'',
                amount:''
            }
        }
    },
    methods:{
        getAmount(){
            if(!this.model.channelType){
                this.alert.toast('请选择采集商');
                return;
            }
            let param = {
                channelType:this.model.channelType
            }
            this.api.vopApiAccess.getBalance.send(param,{showLoading:true}).then(res=>{
                if(res.code==='00'){
                    this.model.amount = res.data;
                }
            })
        },
        // 加载集采商
        loadCollectProvider(callback){
            this.api.commdityType.getChannelList.send(null,{showLoading:true}).then(res=>{
                if(res.code === '00'){
                    this.channelList = res.data || [];
                    if(this.channelList.length>0){
                        this.model.channelType = this.channelList[0].value;
                    }
                }
            })
        }
    },
    mounted(){
        this.loadCollectProvider();
    }
}