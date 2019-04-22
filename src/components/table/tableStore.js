export default class{
    constructor(data,option){
        option = option || {};
        this.initOption(option);

        this.model = {
            data:data || [],
            ...option
        }
    }

    initOption(option){
        option.idField = option.idField || '';
        
        if(option.showSerial==null){
            option.showSerial = false;
        }

        option.serialLabel = option.serialLabel || '序号';

        if(option.showCheck == null){
            option.showCheck = false;
        }

        if(option.showRadio == null){
            option.showRadio = false;
        }

        if(option.showPage == null){
            option.showPage = false;
        }

        if(option.isMountedPaging == null){
            option.isMountedPaging = true;
        }

        if(option.autoHeight == null){
            option.autoHeight = false;
        }

        //列配置
        this.initColumns(option.columns);

        //分页配置
        option.pageInfo = option.pageInfo || {};
        option.pageInfo.currentPage = option.pageInfo.currentPage || 1;
        option.pageInfo.pageSizes = option.pageInfo.pageSizes || [10,15,20,30,50];
        option.pageInfo.pageSize = option.pageInfo.pageSize || 20;
        option.pageInfo.total = option.pageInfo.total || 0;
    }

    initColumns(columns){
        if(columns){
            columns.map(column=>{
                this.initColumn(column);
            })
        }
    }

    initColumn(column){
        column.prop = column.prop || '';
        column.label = column.label || '';
        column.width = column.width || null;
        column.render = column.render || null;
        column.fixed = column.fixed || null;
    }
}