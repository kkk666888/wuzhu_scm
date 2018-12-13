const enumService = {
    logisticsCompanyList:[
        {text:'京东',value:1},
        {text:'顺丰',value:2}
    ],
    logisticsCompanyListOffLine:[
        {text:'京东',value:1},
        {text:'顺丰',value:2},
        {text:'圆通',value:5},
        {text:'中通',value:6},
        {text:'申通',value:9},
        {text:'韵达',value:8},
        {text:'EMS',value:4}
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