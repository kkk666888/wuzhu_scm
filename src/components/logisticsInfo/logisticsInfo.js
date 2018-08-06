export default {
    name:'myLogisticsInfo',
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        baseItem:{
            type:Object,
            default:null
        },
        trackNumber:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            show:false,
            logistctItem:null
        }
    },
    methods:{
        //查看物流信息
        getLogisticsInfo(){
            if(!this.trackNumber){
                return;
            }
            this.api.logistic.goRouteInfo.send({stockNo:this.trackNumber},{showLoading:true})
            .then(res=>{
                if(res.code==='00'){    
                    this.logistctItem = res.data;
                }
            })
        }
    },
    mounted(){
        this.show = this.visible;
        if(this.visible){
            this.getLogisticsInfo();
        }
    },
    watch:{
        visible(val){
            this.show = val;
            if(val){
                this.getLogisticsInfo();
            }
        },
        show(val){
            this.$emit('update:visible',val);
        }
    }
}