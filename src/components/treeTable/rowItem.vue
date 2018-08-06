<script>
import cellRender from './cellRender.vue';
export default {
    name:'rowItem2',
    props:{
        option:{
            type:Object
        },
        data:{
            type:Array,
            default(){
                return [];
            }
        },
        currentRowId:{
            type:[String,Number]
        }
    },
    components:{
        cellRender
    },
    render(h){
        let trs = [];
        this.getRows(trs,this.data); 
        return <tbody>{trs}</tbody>
    },
    methods:{
        //获取行集合
        getRows(trs,data){
            data.forEach(row => {
                let rowTds = this.getRowTds(row);
                let selectClass = this.currentRowId == row[this.option.idField] ? 'tt-row-selected' : '';

                let tr = <tr class={selectClass} onClick={()=>{this.rowClick(row)}}>{rowTds}</tr>;
                trs.push(tr);

                if(row._showChild){
                    let child = row[this.option.childField];
                    if(child && child.length > 0){
                        this.getRows(trs,child);
                    }
                }
            })
        },
        //获取行td集合
        getRowTds(row){
            let result = [];

            if(this.option.showCheck){
                let checkboxTd = this.getCheckboxTd(row);
                result.push(checkboxTd);
            }

            this.option.columns.forEach(column=>{
                if(column.render){
                    result.push(<td width={column.width}>
                        <div class='tt-cell'>
                            <cell-render row={row} index={1} render={column.render}></cell-render>
                        </div>
                    </td>);
                }
                else{
                    if(this.option.diaplayField == column.prop){
                        //树节点列
                        let style = {paddingLeft:((row._level - 1) * 25 + 10) + 'px'}
                        let iconClass = row._showChild ? "el-icon-caret-bottom" : "el-icon-caret-right"

                        result.push(<td width={column.width}>
                            <div class='tt-cell' style={style}>
                                {
                                    row[this.option.leafField] ? <span class="tree-icon"></span> : 
                                    <span class="tree-icon" onClick={()=>{this.showChild(row)}}>
                                        <i class={iconClass}></i>
                                    </span>
                                }
                                {row[this.option.diaplayField]}
                            </div>
                        </td>);
                    }
                    else{
                        result.push(<td width={column.width}>
                            <div class='tt-cell'>{row[column.prop]}</div>
                        </td>);
                    }
                }
            })

            return result;
        },
        //获取复选框td
        getCheckboxTd(row){
            return (
                <td class="tt-checkbox">
                    <div class="tt-cell">
                        <el-checkbox 
                            v-model={row._check} 
                            disabled={row._checkDisabled}
                            onChange={()=>{ this.checkboxChange(row)}}></el-checkbox>
                    </div>
                </td>
            )
        },
        //显示|隐藏子级
        showChild(row){
            row._showChild = row._showChild ? false : true;
            this.$emit('treeIConClick',row);
        },
        //行单击
        rowClick(row){
            this.$emit('rowClick',row);
        },
        //复选框事件
        checkboxChange(row){
            this.$emit('checkboxChange',row);
        }
    }
}
</script>
