import commonService from '../../utils/common.js'
export default class {
    constructor(option){
        this.option = option;
        this.nodeShowModel = null;
    }

    //初始化数据
    initData(data,nodeShowModel){
        this.nodeShowModel = nodeShowModel;
        this.handleData(data);
        return commonService.deepCopy(data);
    }

    //处理数据 idChain:为数组
    handleData(data,level,rootId,parentItem){
        if(data && data.length > 0){
            data.forEach(item=>{
                level = level || 1;
                rootId = rootId || 0;

                let id = item[this.option.idField];
  
                if(level==1){
                    rootId = id;
                }

                this.addProperty(item,level,rootId,parentItem);
                
                let child = item[this.option.childField];

                if(child && child.length > 0){
                    this.handleData(child,level + 1,rootId,item);
                }
            })
        }
    }

    //添加属性
    addProperty(row,level,rootId,parentItem){
        row._showChild = false;

        if(this.option.showAllChild){
            row._showChild = true;
        }

        if(this.nodeShowModel){
            let showValue = this.nodeShowModel[row[this.option.idField]];

            if(showValue !=null && showValue != undefined){
                row._showChild = showValue;
            }
        }
        
        row._level = level;
        row._fatherId = parentItem ? parentItem.id : 0;
        row._rootId = rootId;
        row._check = false;
        row._checkDisabled = false;
        row._idChain = [];
        
        if(parentItem){
            if(parentItem._idChain && parentItem._idChain.length > 0){
                parentItem._idChain.forEach(id=>{
                    row._idChain.push(id);
                })
            }

            row._idChain.push(parentItem.id);
        }

        if(this.option.afterAddProperty && this.option.afterAddProperty instanceof Function){
            this.option.afterAddProperty(row);
        }
    }

    //返回根项
    getRootDataByRootId(data,rootId){
        let result = null;

        if(data && data.length > 0){
            for(var i in data){
                if(data[i]._rootId == rootId){
                    result = {
                        index:parseInt(i),
                        item:data[i]
                    }
                    break;
                }
            }
        }

        return result;
    }

    //根据id获取数据
    getDataById(data,id){
        let result = null;

        if(data && data.length > 0){
            for(var i in data){
                if(data[i][this.option.idField] == id){
                    result = data[i];
                    break;
                }

                result = this.getDataById(data[i][this.option.childField]||[],id);

                if(result){
                    break;
                }
            }
        }

        return result;
    }

    //全靠|取消全选
    checkAll(data,isCheck){
        if(data && data.length>0){
            data.forEach(item=>{
                item._check = isCheck;
                let children = item[this.option.childField];
                this.checkAll(children,isCheck);
            })
        }
    }

    //复选框选中事件
    checkboxChange(data,row){
        this.checkAll(row[this.option.childField],row._check);
        let forEachData = [];

        if(row._check){
            for(var i in row._idChain){
                let id = row._idChain[i];
    
                if(i==0){
                    forEachData = data;
                }
    
                if(forEachData && forEachData.length >0){
                    for(var j in forEachData){
                        if(forEachData[j][this.option.idField] == id){
                            forEachData[j]._check = row._check;
                            forEachData = forEachData[j][this.option.childField];
                            break;
                        }
                    }
                }
            }
        }
    }

    //获取选择中的id集合
    getCheckedIds(data,ids){
        ids = ids || [];

        if(data && data.length>0){
            data.forEach(row=>{
                if(row._check){
                    ids.push(row[this.option.idField]);
                    let children = row[this.option.childField];
                    this.getCheckedIds(children,ids);
                }
            })
        }

        return ids;
    }
}