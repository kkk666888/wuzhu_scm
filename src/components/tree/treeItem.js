export default {
    name:'treeItem',
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
        },
        currentTreeId:{
            type:[String,Number]
        }
    },
    data(){
        return {
            tree:null
        }
    },
    methods:{
        showChild(event,item){
            event.preventDefault();
            event.stopPropagation();
            item._showChild = !item._showChild;
        },
        treeClick(item){
            this.tree.currentTreeId = item[this.option.idField];
            this.tree.$emit('treeClick',item);
        }
    },
    created(){
        this.tree = this.$parent.tree ? this.$parent.tree : this.$parent;
    },
    mounted(){
        
    }
}