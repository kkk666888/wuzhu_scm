export default {
    getList:{
        url:'api/scm/baskstageManager/getAllBaskStageCommidityStock'
    },
    getAllVendot:{
        url:'api/scm/baskstageManager/getAllVendot',
        method:'get'
    },
    confirmStorage:{
        url:'api/scm/baskstageManager/goods/confirmStorage'
    },
    getGoodNum:{
        url:'api/scm/baskstageManager/goods/getGoodsNum'
    },
    upload:{
        url:'api/scm/baskstageManager/goods/upload'
    },
    getBaskStageStockInfoVO:{
        url:'api/scm/baskstageManager/goods/getBaskStageStockInfoVO'
    },
    deletStock:{
        url:'api/scm/baskstageManager/goods/deletStock'
    },
    getAllStockEnum:{
        url:'api/scm/baskstageManager/goods/getAllStockEnum',
        method:'get'
    },
    getCommodityAssemble:{
        url:'api/scm/baskstageManager/goods/getCommodityAssemble'
    },
    updateStockCommodityNoAndGoodId:{
        url:'api/scm/baskstageManager/goods/updateStockCommodityNoAndGoodId'
    }
}