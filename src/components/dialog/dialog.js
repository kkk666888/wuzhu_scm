export default {
    props:{
        title:{
            type:String
        },
        visible:{
            type:Boolean,
            default:false
        },
        width:{
            type:[Number,String]
        },
        height:{
            type:[Number,String]
        },
        confirmBtnTxt:{
            type:String,
            default:'确定'
        },
        cancelBtnTxt:{
            type:String,
            default:'取消'
        },
        option:{
            type:Object,
            default(){
                return {
                    showFooter:true
                }
            }
        },
        onConfirm:{
            type:Function
        }
    },
    data(){
        return {

        }
    },
    methods: {
        close(){
            this.$emit('update:visible',false);
            this.$emit('onClose');
        },
        confirm(){
            this.$emit('onConfirm');
        },
        setMaxHeight(){
            let maxHeight = window.innerHeight - 80;
            if(this.option.showFooter){
                maxHeight = maxHeight - 50;
            }
            if(maxHeight<200){
                maxHeight = 200;
            }
            let bodyEle = document.getElementsByClassName('dialog-body')[0];
            bodyEle.style.maxHeight = maxHeight + 'px';
        },
        bindDrag(){
            this.container = this.$el.getElementsByClassName('dialog-conainer')[0];
            let header =  this.$el.getElementsByClassName('dialog-header')[0];
            header.addEventListener('mousedown',this.mouseDown);
        },
        mouseDown(event){
            event = event || window.event;
            event.preventDefault();
            
            let rect = this.container.getBoundingClientRect();
            this.w = rect.width;
            this.h = rect.height;

            this.x = rect.left;
            this.y = rect.top;

            this.startX = event.screenX - rect.left;
            this.startY = event.screenY - rect.top;

            
            this.container.style.position = 'absolute';
            this.container.style.left = rect.left + 'px';
            this.container.style.top = rect.top + 'px';

            document.addEventListener('mousemove',this.mousemove);
            document.addEventListener('mouseup',this.mouseup);
        },
        mousemove(event){
            event = event || window.event;
            this.x = event.screenX - this.startX;
            this.y = event.screenY - this.startY;
            
            if(this.y <= 0){
                this.y = 0;
            }

            if(this.y + this.h > window.innerHeight){
                this.y = window.innerHeight - this.h;
            }

            if(this.x <= 0){
                this.x = 0;
            }

            if(this.x + this.w > window.innerWidth){
                this.x = window.innerWidth - this.w;
            }

            this.container.style.left = this.x + 'px';
            this.container.style.top = this.y + 'px';
        },
        mouseup(event){
            document.removeEventListener('mousemove',this.mousemove);
            document.removeEventListener('mouseup',this.mouseup);
        }
    },
    mounted() {
        this.startX = 0;
        this.startY = 0;
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.container = null;
        if(this.visible){
            this.$nextTick(()=>{
                this.setMaxHeight();
                this.bindDrag();
            })
        }
    },
    watch:{
        visible(val){
            if(val){
                this.$nextTick(()=>{
                    this.bindDrag();
                })
            }
        }
    }
}