<template>
    <div class="in-storage-main">
        <div class="common-search">
            <div class="item">
                <label>商品品类：</label>
                <el-input v-model="searchModel.commodityCategory" placeholder="请输入" :maxlength="50"></el-input>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

        <!--已有商品入库弹窗-->
        <my-dialog 
            :title='inStorageDialog.title' 
            :visible.sync='inStorageDialog.visible'
            @onConfirm="inStorageDialogSave()">
            <div v-if="inStorageDialog.item" class="in-storage-dialog">
                <div class="my-form">
                    <div class="form-item">
                        <label>商品：</label>
                        <span>{{inStorageDialog.item.commodityCategory}}</span>
                        <span>{{inStorageDialog.item.commodityAttr}}</span>
                    </div>
                    <div class="form-item">
                        <label>进货商：</label>
                        <el-select v-model="model.vendorCode">
                            <el-option label="请选择进货商" value=""></el-option>
                            <el-option 
                                v-for="item in providers" :key="item.vendorCode"
                                :label="item.name" :value="item.vendorCode"></el-option>
                        </el-select>
                    </div>
                    <div class="form-item">
                        <label>识别码及对应库存码：</label>
                        <my-upload id="uploadDiv"
                            ref="upload"
                            v-model="inStorageDialog.fileId" 
                            :acceptType="2"
                            :path="inStorageDialog.uploadPath"
                            @uploadSuccess="uploadSuccess"
                            @onRemove="onRemove"></my-upload>
                    </div>
                    <div class="form-item">
                        <label>进货单价：</label>
                        <el-input  v-model="model.price" type="text" :maxlength="50"></el-input>
                        元/台
                    </div>
                    <div class="form-item">
                        <label>台数：</label>
                        <span>{{inStorageDialog.count}}</span>
                    </div>
                </div>
            </div>
        </my-dialog>
    </div>
</template>

<script>
    import vueJs from './inStorage.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .in-storage-main{
        .in-storage-dialog{
            padding: 10px 60px;
            .my-form .form-item > label
            {
                width: 140px;
            }
            .upload-main{
                display: inline-block;
            }
        }
    }
    
</style>

