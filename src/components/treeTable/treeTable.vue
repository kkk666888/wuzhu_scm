<template>
    <div class="tree-table">
        <div class="tree-table-header-div">
            <table cellspacing="0" cellpadding="0" border="0" class="tree-table-header">
                <thead>
                    <tr>
                        <td v-if="option.showCheck" class="tt-checkbox">
                            <div class="tt-cell">
                                <el-checkbox v-if="isShowCheckAll" v-model="checkAll" @change="checkAllChange"></el-checkbox>
                            </div>
                        </td>
                        <td v-for="column in option.columns" :key="column.prop" :width="column.width">
                            <div class="tt-cell">{{column.label}}</div>
                        </td>
                        <td v-if="showScollTd" width="17"></td>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="tree-table-dbody-div" :style="bodyDivStyle">
            <table cellspacing="0" cellpadding="0" border="0" class="tree-table-body">
                <rowItem 
                    :data="rows" 
                    :option="option"
                    :currentRowId="selectSingleRowId"
                    @treeIConClick="myTreeIConClick"
                    @rowClick="myRowClick"
                    @checkboxChange="myCheckboxChange"></rowItem>
            </table>
            <div v-if="rows==0" class="no-data">暂无数据</div>
        </div>
    </div>
</template>

<script>
import treeTableJs from './treeTable.js'
export default treeTableJs
</script>

<style lang="scss">
    .tree-table{
        .tree-table-body,.tree-table-header{width: 100%;}
        .tree-table-dbody-div{overflow-y: auto;}
        .tt-cell{
            font-size: 12px;
            position: relative;
            white-space: normal;
            word-break: break-all;
            text-overflow: ellipsis;
            vertical-align: middle;
            width: 100%;
            box-sizing: border-box;
            display: inline-block;
            line-height: 22px;
            padding: 0 10px;
        }

        .tree-table-header{
            thead{
                tr{
                    background-color: white;
                    td{
                        padding: 8px 0;
                        border-left:1px solid #ebeef5;
                        border-top:1px solid #ebeef5;
                        border-bottom:1px solid #ebeef5;

                        box-sizing: border-box;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                        position: relative;

                        &:last-child{
                            border-right:1px solid #ebeef5;
                        }

                        .tt-cell{
                            color: #909399;
                            font-size: 13px;
                            font-weight: bold;
                            color: #676a6c;;
                        }
                    }
                }
            }
        }

        .tree-table-body{
            margin-top: -1px;
            tbody{
                tr{
                    background-color: white;
                    td{
                        padding: 8px 0;
                        border-left:1px solid #ebeef5;
                        border-top:1px solid #ebeef5;

                        box-sizing: border-box;
                        text-overflow: ellipsis;
                        vertical-align: middle;
                        position: relative;

                        &:last-child{
                            border-right:1px solid #ebeef5;
                        }

                        .tree-icon{
                            font-size: 20px;
                            position: relative;
                            top: 3px;
                            cursor: pointer;
                            padding-right: 5px;
                            display: inline-block;
                            min-width: 25px;
                        }
                    }

                    &:last-child{
                        td{
                            border-bottom:1px solid #ebeef5;
                        }
                    }

                    &:nth-child(2n+1) {
                        background-color: #f9f9f9;
                    }

                    &:hover{
                        background-color: #f5f5f5;
                    }
                }

                tr.tt-row-selected{
                    background-color: #d2e4f8;
                }
            }
        }

        .tt-checkbox{
            width: 40px;
        }

        .no-data{
                text-align: center;
                padding: 10px;
                color: #808080;
        }
    }
</style>
