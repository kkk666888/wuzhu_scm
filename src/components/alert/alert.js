export default {
    data(){
        return {
            showAlert:false,
            headerTxt:'',
            bodyTxt:'',
            type:1,//0-toast 1-成功 2-错误 9-确认
            isAutoHide:false, //是否自动关闭
            autoHideTimeout:3000,
        }
    },
    methods:{
        show(){
            this.showAlert = true;
            if(this.type!=9){
                this.setAutoHide();
            }
        },
        hide(){
            this.showAlert = false;
            this.clearTimer();
        },
        confirm(){
            this.hide();
  
            if(this.onConfirm && this.onConfirm instanceof Function){
                this.onConfirm();
            }
        },
        containerClick(){
            if(this.type==0){
                this.hide();
            }
        },
        //自动关闭
        setAutoHide(){
            let thisObj = this;
            thisObj.clearTimer();
  
            if(thisObj.isAutoHide){
                thisObj.timer = setTimeout(() => {
                    thisObj.hide();
                }, thisObj.autoHideTimeout);
            }
        },
        clearTimer(){
            if(this.timer){
                clearTimeout(this.timer);
                this.timer = null;
            }
        },
        bindDrag(){
            if(this.type==0){
                return;
            }
            this.container = this.$el.getElementsByClassName('alert-container')[0];
            let header =  this.$el.getElementsByClassName('alert-header')[0];
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
    created(){
        this.timer = null;
    },
    mounted(){
      this.startX = 0;
      this.startY = 0;
      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;
      this.container = null;
    },
    destroyed(){
        if(this.$el.remove){
           this.$el.remove();
        }
        else{
           this.$el.parentNode.removeChild(this.$el);
        }
    },
    watch:{
        showAlert(val){
              if(val){
                  this.$nextTick(()=>{
                      this.bindDrag();
                  })
              }
          }
    }
  }