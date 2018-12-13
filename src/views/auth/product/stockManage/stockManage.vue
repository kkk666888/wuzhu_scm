<template>
    <div class="stock-main">
        <div class="common-search">
            <div class="item">
                <label>供应商：</label>
                <el-input v-model="searchModel.vendorName" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>商品品类：</label>
                <el-input v-model="searchModel.commodityCategory" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>订单号：</label>
                <el-input v-model="searchModel.orderNo" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>库存编号：</label>
                <el-input v-model="searchModel.stockNo" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <label>库存状态：</label>
                <el-select v-model="searchModel.stockStatus">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in stockStatusList" :key="item.value" 
                        :label="item.text" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button type="primary" icon="el-icon-search" @click="reset()">重置</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>
        <!--汇总弹窗-->
        <my-dialog 
            title='汇总弹窗' 
            :visible.sync="collectDialog.visible" :option="{showFooter:false}">
            <div class="collect-dialog">
                <div class="common-search">
                    <div class="item">
                        <label>商品编号：</label>
                        <el-input v-model="collectSearchModel.commodityNo" placeholder="请输入" :maxlength="50"></el-input>
                    </div>
                    <div class="item">
                        <label>商品品类：</label>
                        <el-input v-model="collectSearchModel.commodityCategory" placeholder="请输入" :maxlength="50"></el-input>
                    </div>
                    <div class="item">
                        <el-button type="primary" icon="el-icon-search" @click="collectSearch()">查询</el-button>
                    </div>
                </div>
            </div>
            <my-table ref="collectTable" :height="400" :data="collectTableData" :option="collectTableOption"></my-table>
        </my-dialog>
        <!--修改库存识别码或者商品编号-->
        <my-dialog 
            title='修改库存识别码或者商品编号' 
            :visible.sync="updateDialog.visible"
            @onConfirm="updateSave()">
            <div v-if="updateDialog.item" class="update-dialog">
                <div class="my-form">
                    <div class="form-item-inline">
                        <div class="form-item">
                            <label>库存码：</label>
                            <span class="span-label">{{updateDialog.item.stockCode}}</span>
                        </div>
                        <div class="form-item">
                            <label>商品品类：</label>
                            <span class="span-label">{{updateDialog.item.commodityCategory}}</span>
                        </div>
                    </div>
                    <div class="form-item-inline">
                        <div class="form-item">
                            <label>规格属性：</label>
                            <span class="span-label">{{updateDialog.item.commodityAttr}}</span>
                        </div>
                        <div class="form-item">
                            <label>供应商：</label>
                            <span class="span-label">{{updateDialog.item.vendorName}}</span>
                        </div>
                    </div>
                    <div class="form-item-inline">
                        <div class="form-item">
                            <label>货物识别码(串码)：</label>
                            <el-input v-model="updateDialog.goodsId" placeholder="请输入" :maxlength="50"></el-input>
                        </div>
                        <div class="form-item">
                            <label>商品编号：</label>
                            <el-input v-model="updateDialog.commodityNo"  placeholder="请输入" :maxlength="50"></el-input>
                        </div>
                    </div>
                </div>
            </div>
        </my-dialog>
    </div>
</template>

<script>
    import vueJs from './stockManage.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .stock-main{
        .collect-dialog{
            padding: 10px 60px;
        }
        .update-dialog{
            padding: 10px;
            .span-label{
                display: inline-block;
                min-width: 300px;
            }
        }
    }
    
</style>

