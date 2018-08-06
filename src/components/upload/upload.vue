<template>
    <div v-show="visible" class="upload-main" :class="{'upload-main-hide':value}">
        <el-upload
            ref="upload"
            :action="uploadPath"
            :accept="userAccept"
            :file-list="fileList"
            :multiple="false"
            :limit="limit"
            :data="data"
            :on-success="onSuccess"
            :on-error="onError"
            :on-remove="onRemove"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            name="file"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">{{tips}}</span>
        </el-upload>
    </div>
</template>
<script>
import uploadJs from './upload.js';
export default uploadJs;
</script>
<style lang="scss">
    .upload-main{
        display: inline-block;
        .el-upload__tip{display: inline-block;padding-left: 10px;}
        .el-upload-list__item-name{max-width: 200px;}
    }
    .upload-main-hide{
        .el-upload{display: none;}
        .el-upload__tip{display: none;}
    }
</style>
