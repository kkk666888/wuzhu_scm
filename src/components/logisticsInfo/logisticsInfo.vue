<template>
    <div class="logistic-info">
        <my-dialog
            title='物流信息' 
            :option='{showFooter:false}'
            :visible.sync='show'>
            <div v-if="logistctItem && baseItem" class="logistics-info-dialog">
                <div class="header">
                    <span>客户：{{baseItem.receiveName}}</span>
                    <span>收货地址：{{baseItem.customerAddress}}</span>
                    <br/>
                    <span>物流公司：{{logistctItem.expressCompanyName}}</span>
                    <span>运单号：{{logistctItem.deliveryOrderNo}}</span>
                    
                </div>
                <div v-if="logistctItem.routeTraceList" class="content">
                    <div class="item" v-for="(m,$index) in logistctItem.routeTraceList" :key="$index">
                        <span>{{m.day}}</span>
                        <span>{{m.times}}</span>
                        <span>{{m.address}}</span>
                    </div>
                </div>
                <div v-else class="content">无物流信息</div>
            </div>
        </my-dialog>
    </div>
</template>

<script>
import vueJs from './logisticsInfo.js';
export default vueJs;
</script>

<style lang="scss" scoped>
    .logistic-info{
        /deep/ .dialog-main {
            .dialog-conainer{
                .dialog-body{
                    padding: 0;
                }
            }
        }
        .logistics-info-dialog{
            width: 650px;
            min-height: 200px;
            .header{
                padding: 20px;
                color: red;
                border-bottom: 1px solid #ddd;
                span{
                    display: inline-block;
                    margin-right: 20px;
                }
            }
            .content{
                padding: 20px;
                max-height: 450px;
                overflow-y: auto;
                .item{
                    margin-bottom: 10px;
                }
            }
        }
    }
</style>


