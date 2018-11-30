import treeUtils from './treeUtils.js'
import treeItem from './treeItem.vue'
export default {
    name:'gzTree',
    props:{
        option:{
            type:Object,
            default(){
                return {}
            }
        },
        data:{
            type:Array,
            default(){
                return []
            }
        }
    },
    components:{
        treeItem
    },
    data(){
        return {
            treeData:[],
            treeOption:null,
            currentTreeId:0
        }
    },
    methods:{
        setCurrentTreeId(id){
            this.currentTreeId = id;
            let item = this.treeUtils.getItemById(this.treeData,id);
            if(item){
                let result = this.treeUtils.getRootDataByRootId(this.treeData,item._rootId);
                if(result){
                    result.item._showChild = true;
                }
            }
        }
    },
    created(){
        this.treeUtils = new treeUtils(this.option);
        this.treeData = this.treeUtils.initData(this.data);
        this.treeOption = this.treeUtils.option;
    },
    watch:{
        data(val){
            this.treeData = this.treeUtils.initData(this.data);
        }
    }
}