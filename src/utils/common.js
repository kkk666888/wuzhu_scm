import storageService from './storageService.js';
//公用js方法
export default {
    testData(){
        let data = [];
        for(var i = 1;i<50;i++){
            data.push({
                a:'测试数据',
                b:'测试数据',
                c:'测试数据',
                d:'测试数据',
                e:'测试数据',
                f:'测试数据',
                g:'测试数据',
                h:'测试数据',
                i:'测试数据',
                j:'测试数据',
                k:'测试数据',
                l:'测试数据',
                m:'测试数据',
                n:'测试数据',
            })
        }
        return data;
    },
    //获取后台接口地址
    getBaseUrl(hostName) {
        let url;
        switch (hostName) {
          case 'core':
            url = process.env.coreUrl;
            break;
          case 'portal':
            url = process.env.portalUrl;
            break;
          default:
            url = process.env.NODE_URL;
            break;
        }
        return url;
    },
    logonOut(vm){
        storageService.session.remove(this.storageKey.resources);
    },
    storageKey:{
        resources:'resources',
        userInfo:'userInfo'
    },
    //深复制
    deepCopy(obj) {
        let type = Object.prototype.toString.call(obj);

        if(type == '[object Object]'){
            let newobj = {};

            for (var attr in obj) {
            newobj[attr] = this.deepCopy(obj[attr]);
            }

            return newobj;
        }
        else if(type == '[object Array]'){
            let newArr = [];

            for (var attr in obj) {
                newArr.push(this.deepCopy(obj[attr]))
            }

            return newArr;
        }
        else{
            return obj;
        }
    },
    //两对象深合并
    deepMerge(obj1,obj2) {
        var key;
        for(key in obj2) {
            obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
            this.deepMerge(obj1[key], obj2[key]) : obj1[key] = obj2[key];
        }
        return obj1;
    },
    //model赋值 目前只作用于一层
    setModelValue(model,data){
        if(model && data){
            for(var i in data){
                if(model.hasOwnProperty(i)){
                    model[i] = data[i];
                }
            }
        }
    },
    //减少执行次数 比如在window.onresize
    throttle(method, context) { 
        if (!method.tId) { 
            method.call(context); 
            method.tId = 1;
            setTimeout(() => method.tId = 0, 100); 
        } 
    },
    //数组里移除项
    removeItem(data,prop,value){
        let removeIndex = -1;

        if(data){
            for(var i in data){
                if(data[i][prop] == value){
                    removeIndex = parseInt(i);
                    break;
                }
            }
        }

        if(removeIndex > -1){
            data.splice(removeIndex,1);
        }

        return removeIndex;
    },
    //上下移动排序
    move(data,type,index){ 
        let result = [];
        let currentItem = data[index];

        switch(type){
            case 'up':
                data[index] = data[index-1];
                data[index-1] = currentItem;
                break;
            case 'down':
                data[index] = data[index+1];
                data[index+1] = currentItem;
                break;
        }

        result = Object.assign([],data);

        return result;
    },
    // 金额格式化
    moneyFormat(str) {
        if (!str) return '0.00'
        let num = parseFloat(str).toFixed(2)
        return num && num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ','
        })
    },
    //时间格式化
    defaultFormartData(str){
            return this.formatDate(str,'yyyy-MM-dd hh:mm:ss');
    },
    //时间格式化
    formatDate(str,fmt='yyyy-MM-dd'){
        try {
            if (!str) {
                return ''
            }
            // 兼容苹果浏览器 date的格式为2018-01-01 10:00:00 || 2018/01/01 10:00:00
            let arr = str.split(/[- : /]/);
            let date = null;
            if(arr.length===3){
                date = new Date(arr[0], arr[1]-1, arr[2]);
            }
            else if(arr.length === 6){
                date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
            }
            else{
                return str
            }
            let o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                'S': date.getMilliseconds() // 毫秒
            }
            if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                }
            }
            return fmt
        } catch (e) {
            return ''
        }
    },
    //获取时间差-小时
    getDateDifference(start,end){
        var startDate = new Date(start);
        var endDate = new Date(end);
        return parseInt(endDate - startDate) / 1000 / 60 / 60;
    },
    //生成唯一标识
    generateUniqueValue() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);});
            return uuid;
    },
    //替换换行符
    replaceEnter(value){
        value = value || '';
        let str = value.replace(/\r\n/g,"<br>");
        str = str.replace(/\n/g,"<br>");
        return str;
    },
    //设置高度
    setAutoHeight(el){
        let rect = el.getBoundingClientRect();
        let height = window.innerHeight - rect.top - 10;
        el.style.height = height + 'px';
    },
    //正则验证
    valid:{
        isFloat(value){
            let pattern = /^\d+(?:\.\d{1,2})?$/;
            return pattern.test(value);
        },
        //正整数
        isNum(value){
            let pattern = /^\+?[0-9][0-9]*$/;
            return pattern.test(value);
        },
        isDate(value){
            let pattern = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            return pattern.test(value);
        },
        //判断是否只有一个字母
        isOneLetter(val){
            let pattern = /^[A-Za-z]{1}$/;
            return pattern.test(val);
        }
    }
}
