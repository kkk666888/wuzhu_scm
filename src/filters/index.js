import commonService from '@/utils/common.js';
const filters = {
    cellEmptyValue: function (value) {
        if(value === 0){
            return value;
        }

        if(value == null || value == undefined || value ==''){
            return '-';
        }

        return value;
    },
    //时间格式化
    dateFormat(str, fmt = 'yyyy-MM-dd hh:mm:ss') {
        return commonService.formatDate(str,fmt);
    },
    //金额格式化
    moneyFormat(value) {
        return common.moneyFormat(value)
    },
}

export default filters;