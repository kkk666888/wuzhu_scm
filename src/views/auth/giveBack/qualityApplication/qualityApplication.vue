<template>
    <div class="quality-application-main">
        <div class="common-search">
            <div class="item">
                <label>质检申请单号：</label>
                <el-input placeholder="请输入" :maxlength="20"></el-input>
            </div>
            <div class="item">
                <label>归还申请单号：</label>
                <el-input placeholder="请输入" :maxlength="20"></el-input>
            </div>
            <div class="item">
                <label>订单编号：</label>
                <el-input placeholder="请输入" :maxlength="20"></el-input>
            </div>
            <div class="item">
                <label>状态：</label>
                <el-select>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="检测中" value="检测中"></el-option>
                    <el-option label="检测完成" value="检测完成"></el-option>
                    <el-option label="已取消" value="已取消"></el-option>
                </el-select>
            </div>
            <div class="item">
                <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
            </div>
            <div class="item">
                <el-button @click="search()">重置</el-button>
            </div>
        </div>
        <my-table ref="table" :data="tableData" :option="tableOption"></my-table>

        <!--填写检验结果弹窗-->
        <my-dialog 
            :title='qualityResultDialog.title' 
            :visible.sync='qualityResultDialog.visible'
            @onConfirm="qualityResultSave()">
            <div class="quality-result-dialog">
                <div class="my-form">
                    <div class="form-item">
                        <label>检测人<my-require/>：</label>
                        <el-input type="text" :maxlength="50"></el-input>
                    </div>
                    <div class="form-item">
                        <label>检测时间<my-require/>：</label>
                        <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
                    </div>
                    <div class="form-item">
                        <label>检测结论<my-require/>：</label>
                        <el-select placeholder="请选择">
                            <el-option label="检测合格" value="检测合格"></el-option>
                            <el-option label="不合格-需维修" value="不合格-需维修"></el-option>
                            <el-option label="不可维修" value="不可维修"></el-option>
                        </el-select>
                    </div>
                    <div class="form-item form-item-flex">
                        <label>详细描述：</label>
                        <el-input type="textarea" :maxlength="255" :rows="5"></el-input>
                    </div>
                    <div class="form-item">
                        <label>检测报告：</label>
                        <my-upload :acceptType="2"></my-upload>
                    </div>
                </div>
            </div>
        </my-dialog>
    </div>
</template>

<script>
    import vueJs from './qualityApplication.js'
    export default vueJs
</script>

<style lang="scss" scoped>
    .quality-application-main{
        .quality-result-dialog{
            padding: 10px 60px;
        }
    }
    
</style>

