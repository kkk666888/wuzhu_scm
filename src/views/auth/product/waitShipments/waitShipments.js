import ExportFile from '@/utils/export';
import { resolve } from 'path';
import OSS from 'ali-oss';

//待发货管理
export default {
    name: 'waitShipments',
    data() {
        return {
            searchModel: this.initSearchModel(),
            tableData: [],
            tableOption: this.getTableOption(),
            deliverDialog: {
                title: '发货',
                visible: false,
                logisticsCompanyValue: ''
            },
            addressDialog: {
                title: '修改发货地址',
                visible: false,
                item: null,
                customerAddress: ''
            },
            offlineDeliverDialog: {
                title: '线下发货',
                visible: false,
                item: null,
                deliveryOrderNo: '',
                logisticsCompany: '',
                deliverDate: '',
                deliverTime: ''
            },
            pickUpDialog: {
                title: '自提',
                visible: false,
                signUser: '',
                item: null
            },
            logisticsCompanyList: this.enum.logisticsCompanyList,
            logisticsCompanyListOffLine: this.enum.logisticsCompanyListOffLine,
            shouldUploadFile: true,
            shouldChooseRoute: true,
            autoSendCommodity: true,
            qcVedioFlag: false,
            fileList: [],
            importUrl: '',
            qcVedioFlagTitle: '上传发货视频',
            selectRowOrderNo: '',
            selectRowIdentifiCode: '',
            businessNo: '',
            uploadPercent: 0
        }
    },
    methods: {
        //查询
        search() {
            this.$refs.table.refreshPaging(1);
        },
        initSearchModel() {
            return {
                commodityCategory: '',
                orderSource: '',
                orderSources: [{
                    value: 'ONLINE',
                    label: '线上'
                },
                {
                    value: 'STORE',
                    label: '门店'
                }],
                orderNo: '',
                customerName: '',
                commodityNo: '',
                createDate: '',
                createDateBegin: '',
                createDateEnd: ''
            }
        },
        //表格配置
        getTableOption() {
            let thisObj = this;
            let option = {
                showPage: true,
                autoHeight: true,
                showCheck: true,
                columns: [
                    { prop: 'orderNo', label: '订单编号', width: 220 },
                    { prop: 'orderSource', label: '订单来源', width: 80 },
                    { prop: 'orderSourceNo', label: '来源编号', width: 80 },
                    { prop: 'commodityNo', label: '商品编号', width: 100 },
                    { prop: 'stockStatus', label: '商品状态', width: 100 },
                    { prop: 'commodityType', label: '商品类型', width: 100 },
                    { prop: 'brandName', label: '商品品牌', width: 100 },
                    { prop: 'commodityCategory', label: '商品品类', width: 200 },
                    { prop: 'commodityAttr', label: '商品属性', width: 200 },
                    { prop: 'receiveName', label: '客户姓名', width: 100 },
                    { prop: 'customerAddress', label: '客户地址', width: 300 },
                    { prop: 'receiveTel', label: '电话', width: 100 },
                    { prop: 'identifiCode', label: '识别码', width: 120 },
                    { prop: 'stockCode', label: '库存码', width: 150 },
                    { prop: 'vendorName', label: '供应商', width: 150 },
                    { prop: 'orderUpperChainName', label: '是否上链', width: 100 },
                    { prop: 'createDate', label: '下单时间', width: 100 },
                    {
                        prop: 'operates',
                        label: '发货视频',
                        fixed: 'right',
                        width: '80',
                        render(h, param) {
                            let showAhref = 'display:none';
                            // 存在附件链接，现实附件链接不显示上传质检按钮
                            if (param.row.filePath) {
                                showAhref = 'display:inline-block'
                            }
                            return (
                                <div>
                                    <a style={showAhref} href="#">{param.row.filePath}</a>
                                </div>
                            );
                        }
                    },
                    {
                        prop: 'operate', label: '操作', fixed: 'right', width: 400, render(h, param) {
                            let disabledUploadBtn = true
                            if (param.row.orderUpperChainFlag === '1') {
                                disabledUploadBtn = false
                                // if (param.row.filePath) { // 可以重复上传
                                //     disabledUploadBtn = true
                                // }
                            }
                            return (
                                <div>
                                    <el-button type="primary" disabled={disabledUploadBtn} onClick={() => { thisObj.uploadQCVedio(param.row) }}>上传发货</el-button>
                                    <el-button type="primary" onClick={() => { thisObj.pickUpMyself(param.row) }}>确认自提</el-button>
                                    <el-button type="primary" onClick={() => { thisObj.changeAddr(param.row) }}>修改地址</el-button>
                                    <el-button type="primary" onClick={() => { thisObj.offlineDeliver(param.row) }}>线下发货</el-button>
                                </div>
                            )
                        }
                    }
                ]
            }

            return option;
        },
        // 导出
        async exportExcel() {
            let param = {
                commodityCategory: this.searchModel.commodityCategory || null,
                orderSource: this.searchModel.orderSource || null,
                orderNo: this.searchModel.orderNo || null,
                customerName: this.searchModel.customerName || null,
                commodityNo: this.searchModel.commodityNo || null
            }
            if (this.searchModel.createDate) {
                param['createDateBegin'] = this.searchModel.createDate[0]
                param['createDateEnd'] = this.searchModel.createDate[1]
            }
            try {
                const res = await this.$api.logistic.exportAllSendingInfo.send(param, { showLoading: true });
                if (res.code === '00') {
                    this.$alert.toast('导出中', { autoHideTimeout: 2000 });
                    let date = new Date().toLocaleDateString();
                    ExportFile(res.data, `待发货清单${date}`);
                }
            } catch (error) {
                console.log(error);
            }

        },
        //获取表格数据
        getList(pageInfo, callback) {
            let param = {
                pageNum: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                commodityCategory: this.searchModel.commodityCategory || null,
                orderSource: this.searchModel.orderSource || null,
                orderNo: this.searchModel.orderNo || null,
                customerName: this.searchModel.customerName || null,
                commodityNo: this.searchModel.commodityNo || null
            }
            if (this.searchModel.createDate) {
                param['createDateBegin'] = this.searchModel.createDate[0]
                param['createDateEnd'] = this.searchModel.createDate[1]
            }

            this.api.logistic.getAllSendingInfo.send(param, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    this.tableData = res.data.list || [];
                    callback(res.data.total);
                }
            })
        },
        //下发货单：弹出选择物流窗口
        deliver() {
            this.shouldUploadFile = true
            this.shouldChooseRoute = true
            let rows = this.$refs.table.getSelectedRows();
            if (rows.length == 0) {
                this.alert.toast('请选择需要发货的订单');
                return;
            }
            let orders = ''
            rows.forEach(row => {
                if (row.orderSource !== '线上') {
                    orders = orders + '\n' + row.orderNo
                }
                //判断是否有已上链并且未上传视频的订单
                if (row.orderUpperChainFlag === '1' && !row.filePath) {
                    this.shouldUploadFile = false
                }

                if (row.stockStatus === '物流已接单') {
                    this.shouldChooseRoute = false
                }


            })
            if (!this.shouldUploadFile) {
                this.$message({
                    type: 'info',
                    message: '存在已上链未上传发货视频的订单'
                });
                return;
            }

            if (!this.shouldChooseRoute) {
                this.$message({
                    type: 'info',
                    message: '存在已下物流单订单'
                });
                return;
            }


            if (orders.length == 0) {
                this.deliverDialog.visible = true;
                this.deliverDialog.logisticsCompanyValue = '';
            } else {
                this.$confirm(orders + '\n为非线上订单，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deliverDialog.visible = true;
                    this.deliverDialog.logisticsCompanyValue = '';
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发货'
                    });
                })
            }
        },
        //下物流单保存：执行后端服务修改库存状态和物流信息
        deliverSave() {
            if (!this.deliverDialog.logisticsCompanyValue) {
                this.alert.toast('请选择物流公司');
                return;
            }

            let rows = this.$refs.table.getSelectedRows();
            let param = {
                logisticCompany: this.deliverDialog.logisticsCompanyValue,
                stockNos: []
            }
            rows.forEach(row => {
                param.stockNos.push(row.stockNo);
            })
            this.api.logistic.confirmSendCommodity.send(param, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    let msg = '下发货单成功 ' + res.data.successNum + ' 个,下发货单失败 ' + res.data.failNum + ' 个';
                    this.alert.info(msg);
                    this.deliverDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        // 确认发货
        confirmSended() {
            this.autoSendCommodity = true
            let rows = this.$refs.table.getSelectedRows();
            let param = {
                stockNos: []
            }
            rows.forEach(row => {
                param.stockNos.push(row.stockNo);

                if (row.stockStatus !== '物流已接单') {
                    this.autoSendCommodity = false
                }
            })

            if (!this.autoSendCommodity) {
                this.$message({
                    type: 'info',
                    message: '存在未下物流单订单'
                });
                return;
            }

            this.api.logistic.sendRouter.send(param, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    let msg = '发货成功 ' + res.data.successNum + ' 个,发货失败 ' + res.data.failNum + ' 个';
                    this.alert.info(msg);
                    this.deliverDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //确认自提
        pickUpMyself(item) {
            // 判断是否有已上链并且未上传视频的订单
            if (item.orderUpperChainFlag === '1' && !item.filePath) {
                this.$message({
                    type: 'info',
                    message: '上链订单需要上传附件'
                });
                return;
            }

            this.pickUpDialog.visible = true;
            this.pickUpDialog.signUser = '';
            this.pickUpDialog.item = item;
        },
        //确认自提保存
        pickUpSave() {
            if (!this.pickUpDialog.signUser) {
                this.alert.toast('请输入签收人');
                return;
            }

            let param = {
                signUser: this.pickUpDialog.signUser,
                stockNo: this.pickUpDialog.item.stockNo
            }

            this.api.logistic.comfirmSelfExtraction.send(param, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    this.pickUpDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //修改收货地址
        changeAddr(item) {
            this.addressDialog.visible = true;
            this.addressDialog.item = item;
            this.addressDialog.customerAddress = item.customerAddress
        },
        //修改收货地址保存
        changeAddrSave() {
            if (!this.addressDialog.customerAddress) {
                this.alert.toast('请输入客户地址');
                return;
            }
            let param = {
                customerAddress: this.addressDialog.customerAddress,
                orderNo: this.addressDialog.item.orderNo,
                stockNo: this.addressDialog.item.stockNo
            }
            this.api.logistic.editCustomerAddress.send(param, { showLoading: true }).then(res => {
                if (res.code == '00') {
                    this.addressDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        //线下发货
        offlineDeliver(item) {

            // 判断是否有已上链并且未上传视频的订单
            if (item.orderUpperChainFlag === '1' && !item.filePath) {
                this.$message({
                    type: 'info',
                    message: '上链订单需要上传附件'
                });
                return;
            }

            if (item.orderSource === '线上') {
                this.offlineDeliverDialog.visible = true;
                this.offlineDeliverDialog.item = item;
                this.offlineDeliverDialog.deliveryOrderNo = ''
                this.offlineDeliverDialog.logisticsCompany = ''
                this.offlineDeliverDialog.deliverDate = ''
                this.offlineDeliverDialog.deliverTime = ''
            } else {
                this.$confirm('该订单为非线上订单，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.offlineDeliverDialog.visible = true;
                    this.offlineDeliverDialog.item = item;
                    this.offlineDeliverDialog.deliveryOrderNo = ''
                    this.offlineDeliverDialog.logisticsCompany = ''
                    this.offlineDeliverDialog.deliverDate = ''
                    this.offlineDeliverDialog.deliverTime = ''
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发货'
                    });
                })
            }
        },
        //线下发货保存
        offlineDeliverSave() {
            if (!this.offlineDeliverDialog.deliveryOrderNo) {
                this.alert.toast('请输入运单号');
                return;
            }
            if (!this.offlineDeliverDialog.logisticsCompany) {
                this.alert.toast('请选择物流公司');
                return;
            }
            let param = {
                deliveryOrderNo: this.offlineDeliverDialog.deliveryOrderNo,
                logisticsCompany: this.offlineDeliverDialog.logisticsCompany,
                deliverDate: this.offlineDeliverDialog.deliverDate,
                deliverTime: this.offlineDeliverDialog.deliverTime,
                stockNo: this.offlineDeliverDialog.item.stockNo
            }
            this.api.logistic.gounderline.send(param, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    this.offlineDeliverDialog.visible = false;
                    this.$refs.table.refreshPaging();
                }
            })
        },
        // 打开上传质检视频页面
        uploadQCVedio(row) {
            this.qcVedioFlag = true;
            let baseUrl = process.env.NODE_URL;
            this.uploadPercent = 0
            let uploadPath = baseUrl + '/' + this.api.qc.uploadFileToOss.url;
            this.selectRowOrderNo = row.orderNo;
            this.selectRowIdentifiCode = row.identifiCode
            this.importUrl = uploadPath + '?orderNo=' + row.orderNo + '&businessType=Fahuo';
        },
        confirmQCVedioFiles() {
            this.qcVedioFlag = false
            this.$refs.table.refreshPaging(1)
        },
        handlePreview(file) {
            //console.log(file)
        },
        handleRemove(file, fileList) {
            //console.log(file, fileList);
        },
        handleSuccess(response) {
            console.log(response)
            // 上传成功调用上链服务「将此服务调用放在确认发货按钮操作上」
            // if(response.code === '00'){
            //     let param = {
            //         orderNo: this.selectRowOrderNo,
            //         filename: response.data
            //     }
            //     console.log(param)
            //     this.api.qc.orderDeliverVedioToLink.send(param,{showLoading:true}).then(res=>{
            //         if(res.code==='00'){

            //         }
            //     })
            // }
        },
        addFile(file, fileList) {
            console.log('change', file);
            let filename = file.name
            let filenameExceptType = file.name.split('.')[0]
            let orderNo = this.selectRowOrderNo
            let identifiCode = this.selectRowIdentifiCode
            // 这里和供应链管理员协商，未了避免文件上传错误，imem码要和文件名保持一致
            if(filenameExceptType !== identifiCode){
                this.$message({
                    type: 'info',
                    message: '文件名称需要和iemi码保持一致'
                });
                return;
            }
            this.multipartUpload(file,orderNo,identifiCode);
        },
        // 断点续传
        async multipartUpload(file,orderNo,identifiCode) {
            let client = {};
            let filesize = file.size;
            //获取执行器配置
            let res = await this.$api.qc.getAliOssProfile.send({}, { showLoading: false })
            if (res.data.region) {
                // 执行器
                client = new OSS({ ...res.data });
            }
            let that = this
            // 回调
            const progress = async function (p) {
                that.uploadPercent = p * 100
                console.log(that.uploadPercent)
            };
            try {
                let result = await client.multipartUpload(`wz_delivery_bucket_2019/${file.name}`, file.raw, {
                    progress,
                    partSize: 1024000,
                    meta: {
                        year: 2019,
                        people: 'test'
                    }
                });
                // 上传成功之后保持
                this.addFilesInfo(result,filesize,orderNo,identifiCode)
                // let head = await client.head('object-name');
                // console.log(head);
            } catch (e) {
                // 捕获超时异常
                if (e.code === 'ConnectionTimeoutError') {
                    console.log('Woops,超时啦!');
                }
                console.log(e);
            }
        },

        addFilesInfo(res, fs, ono, bno) {
            let param = {
                orderNo: ono,
                bucket: res.bucket,
                fileName: res.name,
                fileSize: fs,
                businessType: 'Fahuo',
                etag: res.etag,
                businessNo: bno
            };
            this.$api.qc.addFilesInfo.send(param, { showLoading: false }).then(res => {
                if (res.code === '00') {
                    this.resultOptions = res.data;
                }
            });
        },


        // 打印
        print() {
            let rows = this.$refs.table.getSelectedRows();
            if (rows.length === 0) {
                this.alert.toast('请至少选择一条订单操作');
                return;
            }
            let stockNos = []
            rows.forEach(item => {
                stockNos.push(item.stockNo);
            })
            this.api.logistic.printerWayBill.send(stockNos, { showLoading: true }).then(res => {
                if (res.code === '00') {
                    let msg = '打印成功 ' + res.data.successNum + ' 个,打印失败 ' + res.data.failNum + ' 个.\n';
                    let htmlMsg = '';
                    res.data.messages.forEach(item => {
                        if (item.printStatus === 'SUCCESS') {
                            htmlMsg = htmlMsg + "<img style='width:48%' src='data:image/jpeg;base64," + item.printMessage + "'/>";
                        }

                        else if (item.printStatus === 'FAIL') {
                            htmlMsg = htmlMsg + item.printMessage + "<br>";
                        }
                    })

                    this.$confirm(htmlMsg, msg, {
                        dangerouslyUseHTMLString: true,
                        center: true,
                        lockScroll: true
                    });
                }
            })
        },
    }
}