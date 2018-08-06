import commonService from '../../utils/common.js'

export default class {
    data = [];
    
    constructor(option){
        this.option = commonService.deepCopy(option);
    }

    initData(data){
        let level = 1;
        let rootId = 0;
        let fatherId = 0;
        this.handleData(data,level,fatherId,rootId);
        this.data = data;
        return commonService.deepCopy(this.data);
    }

    handleData(data,level,fatherId,rootId){
        if(data && data.length > 0){
            data.forEach(item=>{
                if(level==1){
                    rootId = item[this.option.idField];
                }

                let id = item[this.option.idField];
                this.addProperty(item,level,fatherId,rootId);
                let child = item[this.option.childField];

                if(child && child.length > 0){
                    this.handleData(child,level + 1,item.id,rootId);
                }
            })
        }
    }

    addProperty(row,level,fatherId,rootId){
        row._showChild = false;

        if(this.option.showAllChild){
            row._showChild = true;
        }
        
        row._level = level;
        row._fatherId = fatherId;
        row._rootId = rootId;

        let paddingLeft = (row._level - 1) * 20;

        if(level == 1){
            paddingLeft += 10;
        }

        row._style = {paddingLeft:paddingLeft + 'px'}
    }

    getRootDataByRootId(data,rootId){
        let result = null;

        for(var i in data){
            if(data[i]._rootId == rootId){
                result = {
                    index:parseInt(i),
                    item:data[i]
                }
                break;
            }
        }

        return result;
    }

    getItemById(data,id){
        let item = null;

        for(var i in data){
            if(data[i][this.option.idField] == id){
                item = data[i];
                break;
            }

            item = this.getItemById(data[i][this.option.childField] || [],id);

            if(item){
                break;
            }
        }

        return item;
    }
}