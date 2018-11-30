<template>
    <div class="collectProductSku-main">
        <div class="common-search">
            <div class="item">
                <label>物主商品SKU：</label>
                <el-input v-model="searchModel.commdityNo" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <label>商品短名称：</label>
                <el-input  v-model="searchModel.shortName" placeholder="请输入" :maxlength="30"></el-input>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                <el-button @click="reset()">重置</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption" :onPaging="getList"></my-table>

        <!--绑定集采商SKU-->
        <my-dialog 
            title='绑定集采商SKU' 
            :option='{showFooter:false}'
            :visible.sync='collectDialog.bindSkuVisible'>
            <div class="bind-sku">
                <div class="item-div">
                    <div class="header">物主商品信息</div>
                    <div class="my-form" v-if="collectDialog.currentItem">
                        <div class="form-item-inline">
                            <div class="form-item">
                                <label>商品品牌：</label>
                                <span>{{collectDialog.currentItem.brand}}</span>
                            </div>
                            <div class="form-item">
                                <label>商品短名称：</label>
                                <span>{{collectDialog.currentItem.shortName}}</span>
                            </div>
                            <div class="form-item">
                                <label>规格参数：</label>
                                <span>{{collectDialog.currentItem.specDesc}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-div">
                    <div class="header">采集商商品列表</div>
                    <div class="my-form">
                        <div class="form-item-inline">
                            <div class="form-item">
                                <label>采集商：</label>
                                <el-select v-model="collectDialog.channelType">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option 
                                        v-for="item in channelList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.text"></el-option>
                                </el-select>
                            </div>
                            <div class="form-item">
                                <label>商品短名称：</label>
                                <el-input  v-model="collectDialog.keyword" placeholder="请输入，多属性建议英文逗号隔开" :maxlength="30"></el-input>
                            </div>
                            <div class="form-item">
                                <el-button type="primary" icon="el-icon-search" @click="bindSkuSearch()">搜索</el-button>
                            </div>
                        </div>

                        <my-table ref="skuTable" :height="300" :data="skuTableData" :option="skuTableOption"></my-table>
                    </div>
                </div>
            </div>
        </my-dialog>

        <!--解绑集采商SKU-->
        <my-dialog 
            title='解绑集采商SKU' 
            :visible.sync='unbindDialog.visible'
            @onClose="onUnbindClose()"
            :option="{showFooter:false}">
            <div class="unbind-sku">
                <my-table :height="200" :data="unbindDialog.data" :option="unbindDialog.option"></my-table>
            </div>
        </my-dialog>
    </div>
</template>

<script>
    import vueJs from './collectProductSku.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .collectProductSku-main{
        .select-provider{
            padding: 20px;
            .el-select{
                width: 200px;
            }
        }
        .bind-sku{
            width: 1000px;
            .item-div{
                margin-bottom: 20px;
                .header{
                    font-size: 14px;
                    font-weight: bold;
                    color: #111;
                    margin-bottom: 10px;
                }
                .my-form{
                    border:1px solid #ddd;
                    border-radius: 4px;
                    padding: 20px 20px 5px 20px;
                    .el-select{
                        width: 200px
                    }
                }
            }
        }
        .unbind-sku{
            padding: 10px;
        }
    }
</style>

