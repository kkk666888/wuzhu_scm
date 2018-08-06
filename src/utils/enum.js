const enumService = {
    logisticsCompanyList:[
        {text:'京东',value:1},
        {text:'顺丰',value:2}
    ],
    getTxtByData(arr,value){
        let txt = '';

        if(arr && arr.length > 0){
            for(var i in arr){
                if(arr[i].value === value){
                    txt = arr[i].text;
                    break;
                }
            }
        }

        return txt;
    }
}

export default enumService