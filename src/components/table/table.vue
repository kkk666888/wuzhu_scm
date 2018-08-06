<template>
    <div class="table-main">
        <el-table ref="table" :data="model.data" 
            border
            :show-overflow-tooltip="true"
            highlight-current-row
            :height="tHeight"
            :row-class-name="rowClassName"
            @row-click="onRowClick"
            @selection-change="onSelectionChange">

            <!--展开行-->
            <el-table-column v-if="model.expandId" type="expand">
                <template slot-scope="props">
                    <slot :name="model.expandId" slot-scope="props"></slot>
                </template>
            </el-table-column>

            <!--复选框-->
            <el-table-column :resizable="false" :selectable="selectable"
                v-if="model.showCheck"
                type="selection" width="37"></el-table-column>

            <!--单选框-->
            <el-table-column v-if="model.showRadio" width="40" align="center" :resizable="false">
                <template slot-scope="scope">
                    <el-radio v-model="selectedId" :disabled="isRowDisable(scope.row)" :label="scope.row[model.idField]" class="column-radio"></el-radio>
                </template>
            </el-table-column>

            <!--序号列-->
            <el-table-column 
                v-if="model.showSerial" :resizable="false"
                :index="indexMethod"
                type="index" width="50" :label="model.serialLabel"></el-table-column>

            <template v-for="column in model.columns">
                <el-table-column 
                    :key="column.prop"
                    :prop="column.prop"
                    :label="column.label"
                    :width="column.width"
                    :resizable="false"
                    :fixed="column.fixed">
                    <template slot-scope="scope">
                        <my-render 
                            v-if="column.render" 
                            :row="scope.row" 
                            :index="scope.$index"
                            :render="column.render"></my-render>

                        <template v-else>
                            {{scope.row[column.prop] | cellEmptyValue}}
                        </template>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <!--分页-->
        <el-pagination v-if="model.showPage"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
            :current-page="model.pageInfo.currentPage"
            :page-sizes="model.pageInfo.pageSizes"
            :page-size="model.pageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="model.pageInfo.total">
        </el-pagination>
    </div>
</template>

<script>
import tableJs from './table.js';
export default tableJs;
</script>

<style lang="scss">
    .table-main{
        .el-table{width: 100%;
            .column-radio{
                .el-radio__label{display: none;}
            }
        }
        .el-table .el-table__header th > .cell{font-size: 13px;color: #676a6c;}

        .el-table__body > tbody > tr:nth-child(2n){
            background-color: #fff;
        }
        .el-table__body > tbody > tr:nth-child(2n+1){
            background-color: #f9f9f9;
        }
        .el-table--enable-row-hover .el-table__body tr:hover>td{
            background-color: #e0edfc;
        }

        .el-pagination{padding: 10px;}
    }
</style>

