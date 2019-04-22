<script>
export default{
    name:'cellRender',
    functional:true,//表示该组件是纯函数组件，会进行检查，只能用 props 而不能使用组件内部的 state。
    props:{
        row:Object,
        index:Number,
        render:Function
    },
    render:(h,ctx)=>{
        const params = {
            row: ctx.props.row,
            index: ctx.props.index
        };

        return ctx.props.render(h, params);
    }

}
</script>