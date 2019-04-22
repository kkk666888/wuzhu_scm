import { mapGetters } from 'vuex';
import ExportFile from '@/utils/export';
import OSS from 'ali-oss';

// let client = new OSS({
//   region: 'oss-cn-shenzhen',
//   accessKeyId: 'LTAIQixI2lhf62Bg',
//   accessKeySecret: 'ddYFU4trbzSWAorW0rEmkm1QvNa8c6',
//   bucket: 'huoji-images'
// });

// 质检管理
export default {
    name: 'QCManager',
    data() {
        return {
            tableData: [], // table数据
            tableOption: this.getTableOption(), // table配置
            searchRules: {}, // 搜索校验
            searchModel: {
                inspectionReason: '',
                status: null,
                inspectionApplyNo: '',
                orderNo: '',
                customerName: '',
                afterRentApplyNo: ''
            },
            searchFields: this.getSearchFields(), // 搜索配置
            searchOptions: this.getSearchOptions(), // 搜索列表
            cancellationModel: this.initCancellationModel(), // 作废表单
            cancellationDialog: {
                visible: false,
                title: '作废'
            },
            qcDetail: {
                title: '',
                visible: false
            },
            qcDetailForm: this.initQCDetailForm(),
            resultOptions: [], //质检结论选项
            detailOption: {
                showFooter: true
            },
            qcVedioFlag: false,
            fileList: [],
            importUrl: '',
            qcVedioFlagTitle: '上传质检视频',
            chooseOrderNo: '',
            businessNo: '',
            uploadPercent: 0
        };
    },
    component: {},
    computed: {
        ...mapGetters(['get_user_info'])
    },
    methods: {
        // 质检详情表单
        initQCDetailForm() {
            return {
                orderNo: '', // 订单编号
                commodityName: '', //商品名称
                specContentList: '', //规格属性
                customerName: '', //客户姓名
                afterRentApplyNo: '', //租后申请单号
                applyTime: '', //申请时间
                inspectionApplyNo: '', //质检申请单号
                inspectionReasonName: '', //质检原因
                applyUser: '', //申请人
                rentAfterApplyType: '', //单据类型
                status: '', //质检状态
                statusName: '',
                inspectionResult: '' //质检结论
            };
        },
        // 作废表单
        initCancellationModel() {
            return {
                applyUserId: '',
                inspectionApplyNo: '',
                invalidReason: '',
                invalidRemark: ''
            };
        },
        // 搜索选择框列表
        getSearchOptions() {
            let option = {
                reasonMap: [
                    {
                        text: '拒收质检',
                        value: '1'
                    },
                    {
                        text: '退货质检',
                        value: '2'
                    },
                    {
                        text: '归还质检',
                        value: '3'
                    },
                    {
                        text: '维修质检',
                        value: '4'
                    }
                ],
                statusMap: [
                    {
                        text: '质检中',
                        value: '0'
                    },
                    {
                        text: '质检完成',
                        value: '1'
                    },
                    {
                        text: '已作废',
                        value: '2'
                    }
                ]
            };
            return option;
        },
        // 搜索配置
        getSearchFields() {
            let option = [
                {
                    type: 'select',
                    label: '申请质检原因',
                    name: 'inspectionReason',
                    list: 'reasonMap'
                },
                {
                    type: 'select',
                    label: '质检单状态',
                    name: 'status',
                    list: 'statusMap'
                },
                {
                    type: 'input',
                    label: '质检申请单号',
                    name: 'inspectionApplyNo'
                },
                {
                    type: 'input',
                    label: '订单编号',
                    name: 'orderNo'
                },
                {
                    type: 'input',
                    label: '客户姓名',
                    name: 'customerName'
                },
                {
                    type: 'input',
                    label: '租后申请单号',
                    name: 'afterRentApplyNo'
                }
            ];
            return option;
        },
        //表格配置
        getTableOption() {
            const _this = this;

            let option = {
                idField: 'inspectionApplyNo',
                showPage: true,
                autoHeight: true,
                showSerial: true,
                // showRadio: true,
                columns: [
                    { prop: 'inspectionApplyNo', label: '质检申请单号' },
                    { prop: 'applyUser', label: '申请人' },
                    {
                        prop: 'applyTime',
                        label: '申请时间'
                    },
                    { prop: 'inspectionReasonName', label: '质检的原因' },
                    { prop: 'afterRentApplyNo', label: '租后申请单编号' },
                    {
                        prop: 'statusName',
                        label: '状态'
                    },
                    { prop: 'inspectionResultName', label: '检验结论' },
                    { prop: 'orderNo', label: '订单编号' },
                    { prop: 'customerName', label: '客户姓名' },
                    { prop: 'commodityName', label: '商品短名称' },
                    { prop: 'specContentList', label: '规格属性' },
                    { prop: 'orderUpperChainName', label: '是否上链' },
                    {
                        prop: 'operates',
                        label: '质检视频',
                        fixed: 'right',
                        width: '80',
                        render(h, param) {
                            let showAhref = 'display:none';
                            // 存在附件链接，现实附件链接不显示上传质检按钮
                            if (param.row.filePath) {
                                showAhref = 'display:inline-block';
                            }
                            return (
                                <div>
                                    <a style={showAhref} href="#">
                                        {param.row.filePath}
                                    </a>
                                </div>
                            );
                        }
                    },
                    {
                        prop: 'operate',
                        label: '操作',
                        fixed: 'right',
                        width: '450',
                        render(h, param) {
                            let uploadBtn = true;
                            let resultBtn = true;
                            let detailBtn = true;
                            if (param.row.orderUpperChainFlag === '1') {
                                uploadBtn = false;
                            }
                            if (param.row.statusName === '质检中') {
                                resultBtn = false;
                            }
                            if (param.row.statusName === '质检完成') {
                                detailBtn = false;
                            }
                            return (
                                <div>
                                    <el-button
                                        disabled={uploadBtn}
                                        type="primary"
                                        onClick={() => {
                                            _this.uploadQCVedio(param.row);
                                        }}
                                    >
                                        上传质检视频
                  </el-button>
                                    <el-button
                                        disabled={resultBtn}
                                        type="primary"
                                        onClick={() => {
                                            _this.updateQCResult(param.row);
                                        }}
                                    >
                                        更新质检结果
                  </el-button>
                                    <el-button
                                        disabled={detailBtn}
                                        type="primary"
                                        onClick={() => {
                                            _this.viewQCDetail(param.row);
                                        }}
                                    >
                                        查看详情
                  </el-button>
                                    <el-button
                                        disabled={resultBtn}
                                        type="primary"
                                        onClick={() => {
                                            _this.cancellationOpen(param.row);
                                        }}
                                    >
                                        作废单据
                  </el-button>
                                </div>
                            );
                        }
                    }
                ]
            };

            return option;
        },
        // 搜索
        search() {
            this.$refs.table.refreshPaging(1);
        },
        // 重置
        reset() {
            this.$refs.searchForm.resetFields();
        },
        //加载表格数据
        getList(pageInfo, callback) {
            let param = { ...this.searchModel };
            param['pageNum'] = pageInfo.pageIndex;
            param['pageSize'] = pageInfo.pageSize;

            this.$api.qc.query.send(param, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            });
        },
        // 更新质检结果
        updateQCResult(row) {
            this.getQCResultList();
            this.qcDetail.title = '更新质检结果';
            this.qcDetail.visible = true;
            this.qcDetailForm = { ...row };
            this.qcDetailForm.status = '1';
            this.qcDetailForm.inspectionResult = '';
            this.detailOption.showFooter = true;
        },
        async updateQCResultFetch() {
            let param = {
                applyUserId: this.get_user_info.id,
                inspectionApplyNo: this.qcDetailForm.inspectionApplyNo,
                inspectionResult: this.qcDetailForm.inspectionResult
            };
            try {
                const res = await this.$api.qc.update.send(param, { showLoading: true });

                if (res.code === '00') {
                    this.$alert.toast('更新成功');
                    this.qcDetail.visible = false;
                    this.$refs.table.refreshPaging();
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        // 查看详情
        viewQCDetail(row) {
            this.qcDetail.title = '查看详情';
            this.qcDetail.visible = true;
            this.detailOption.showFooter = false;
            this.qcDetailForm = { ...row };
        },
        confirmQCDetail() {
            if (this.qcDetail.title === '更新质检结果') {
                if (!this.qcDetailForm.inspectionResult) {
                    this.$alert.info('请选择检测结论');
                    return false;
                }
                this.updateQCResultFetch();
            } else {
                this.qcDetail.visible = false;
            }
        },
        // 作废
        cancellationOpen(item) {
            this.cancellationModel.inspectionApplyNo = item.inspectionApplyNo;
            this.cancellationModel.applyUserId = this.get_user_info.id;
            this.cancellationDialog.visible = true;
        },
        cancellationSave() {
            if (!this.cancellationModel.invalidReason) {
                this.alert.toast('请输入作废原因');
                return;
            }

            this.cancellationFetch();
        },
        async cancellationFetch() {
            let param = { ...this.cancellationModel };
            try {
                const res = await this.$api.qc.invalid.send(param, { showLoading: true });
                if (res.code === '00') {
                    this.$alert.toast('作废成功');
                    this.cancellationModel = this.initCancellationModel();
                    this.cancellationDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            } catch (error) {
                // this.$alert.error(error.message);
                console.log(error.message);
            }
        },
        // 获取质检结论列表
        getQCResultList() {
            let param = {
                codeTypeNo: 'INSPECTION_RESULT',
                isInUse: '1'
            };
            this.$api.qc.result.send(param, { showLoading: false }).then(res => {
                if (res.code === '00') {
                    this.resultOptions = res.data;
                }
            });
        },
        // 导出
        async exportExcel() {
            let param = {};
            try {
                const res = await this.$api.qc.export.send(param, { showLoading: true });
                if (res.code === '00') {
                    this.$alert.toast('导出中', { autoHideTimeout: 2000 });
                    let date = new Date().toLocaleDateString();

                    ExportFile(res.data, `质检单${date}`);
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 打开上传质检视频页面
        uploadQCVedio(row) {
            this.chooseOrderNo = row.orderNo;
            this.businessNo = row.inspectionApplyNo;
            this.qcVedioFlag = true;
            this.uploadPercent = 0;
            let baseUrl = process.env.NODE_URL;
            let uploadPath = baseUrl + '/' + this.api.qc.uploadFileToOss.url;
            this.importUrl = uploadPath + '?orderNo=' + row.orderNo + '&businessType=Zhijian&businessNo=' + row.inspectionApplyNo;
        },
        confirmQCVedioFiles() {
            this.qcVedioFlag = false;
            this.$refs.table.refreshPaging(1);
        },
        handlePreview(file) {
            //console.log(file)
        },
        handleRemove(file, fileList) {
            //console.log(file, fileList);
        },
        handleSuccess(response) {
            console.log("1111");
            console.log(response);
            console.log("2222");
        },
        addFile(file, fileList) {
            //console.log('change', file);
            this.multipartUpload(file);
        },
        // 断点续传
        async multipartUpload(file) {
            let client = {};

            //获取执行器配置
            let res = await this.$api.qc.getAliOssProfile.send({}, { showLoading: false })
            if (res.data.region) {
                // 执行器
                client = new OSS({ ...res.data });
            }

            let that = this
            const progress = async function (p) {
                that.uploadPercent = p * 100
            };
            try {
                let result = await client.multipartUpload(`wz_qualitytest_bucket_2019/${file.name}`, file.raw, {
                    progress,
                    partSize: 204800,
                    meta: {
                        year: 2019,
                        people: 'test'
                    }
                });

                // 上传成功之后保持
                this.addFilesInfo(result)

                // let head = await client.head('object-name');
                // console.log(head);
            } catch (e) {
                // 捕获超时异常
                if (e.code === 'ConnectionTimeoutError') {
                    console.log('Woops,超时啦!');
                    // do ConnectionTimeoutError operation
                }
                console.log(e);
            }
        },

        addFilesInfo(res) {

            let param = {
                orderNo: this.chooseOrderNo,
                businessNo: this.businessNo,
                bucket: res.bucket,
                fileName: res.name,
                businessType: 'Zhijian',
                etag: res.etag
            };
            //文件上传成功保存数据
            this.$api.qc.addFilesInfo.send(param, { showLoading: false }).then(res => {
                if (res.code === '00') {
                    this.resultOptions = res.data;
                    this.toAlilink()
                }
            });

        },
        //上传成功调用上链服务
        toAlilink() {
            let param = {
                orderNo: this.chooseOrderNo
            };
            console.log(param);
            this.api.qc.orderQCVedioToLink.send(param, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    console.log("事件生成成功.")
                }
            });
        }

    },
    created() { },
    mounted() { }
};