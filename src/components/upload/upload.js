export default {
  props: {
    value: {},
    option: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 1
    },
    acceptType: {
      type: Number,
      default: 1
    },
    accept: {
      type: String
    },
    path: {
      type: String
    },
    showFilelist: {
      type: Boolean,
      default: true
    },
    btnText: {
      type: String,
      default: '点击上传'
    }
  },
  data() {
    let path = process.env.NODE_URL + '/api/upload/uploadImage';
    let accept = this.accept;
    switch (this.acceptType) {
      case 1:
        accept = 'image/jpeg,image/gif,image/png,image/bmp';
        break;
      case 2:
        accept = '.xls,.xlsx';
        break;
    }
    return {
      uploadPath: this.path,
      userAccept: accept,
      fileList: [],
      data: {},
      imageLimit: {}
    };
  },
  computed: {
    tips() {
      if (this.option && this.option.tips) {
        return this.option.tips;
      }
      return '';
    }
  },
  methods: {
    onSuccess(response, file, fileList) {
      this.$emit('uploadSuccess', response, file);

      if (response.code && response.code !== '00') {
        this.alert.error(response.errMsg || response.msg);
        fileList.length = 0;
        this.$refs.upload.clearFiles();
      }
      if (!response.code) {
        fileList.length = 0;
        this.$refs.upload.clearFiles();
      }
    },
    onError(err, file, fileList) {
      this.$emit('uploadError', err, file);
      this.$emit('input', '');
      fileList.length = 0;
      this.$refs.upload.clearFiles();
      this.alert.error(err.message || '上传出现未知错误');
    },
    onRemove(file, fileList) {
      this.$emit('onRemove', file);
      this.$emit('input', '');
    },
    onChange(file, fileList) {
      // console.log(file, fileList);
    },
    onExceed(file, fileList) {},
    beforeUpload(file) {
      this.$emit('uploadBefore', file);

      let promise = new Promise((resolve, reject) => {
        if (this.acceptType === 1) {
          this.checkImgSize(resolve, reject);
        } else {
          resolve(true);
        }
      });

      return promise;
    },
    getImageWidthHeight(file) {
      let promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function(e) {
          var data = e.target.result;
          var image = new Image();
          image.onload = function() {
            resolve({ width: image.width, height: image.height });
          };
          image.src = data;
        };
        reader.readAsDataURL(file);
      });

      return promise;
    },
    open() {
      this.$refs.upload.$children[0].handleClick();
    },
    removeFile(uid) {
      let index = -1;
      for (var i in this.$refs.upload.uploadFiles) {
        this.$refs.upload.uploadFiles[i].uid = uid;
        index = parseInt(i);
        break;
      }
      if (index > -1) {
        let file = this.$refs.upload.uploadFiles[index];
        this.$refs.upload.handleRemove(file);
      }
    },
    getUploader() {
      return this.$refs.upload;
    },
    //检查图片尺寸
    checkImgSize(resolve, reject) {
      if (!this.option) {
        resolve(true);
        return;
      }

      this.getImageWidthHeight(file).then(item => {
        if (this.option.width == item.width && this.option.height == item.height) {
          resolve(true);
        } else {
          this.$emit('uploadError', null, file);
          this.alert.info('请上传尺寸为 ' + this.option.width + ' x ' + this.option.height + ' 的图片');
          reject(false);
        }
      });
    }
  },
  created() {
    if (this.value) {
      this.fileList = [];
      this.fileList.push({
        name: '',
        url: this.value
      });
    }
  },
  mounted() {}
};
