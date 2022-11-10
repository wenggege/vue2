
<template>
    <div v-loading="loading" element-loading-text="数据加载中" style="padding: 0">
        <div class="container" id="A123d">

            <!-- <audit InvoiceRecordNumber="ReY0RHXy8sIVxImEGA"></audit> -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab_pane" v-for="(item, index) in DataArry" :key="item.SalesOrderNumber"
                    :label="item.InvoiceTitle.SAPSalesOrderNumber" :name="String(index)">
                    <div class="content">
                        <div class="text">
                            <!-- <el-row>

                                <el-col :span="8">币别：{{ item.InvoiceTitle.OrderCurrency }}</el-col>
                                <el-col :span="8">本次开票金额：{{ item.Amounts.TotalAmounts }}</el-col>
                                <el-col :span="8">总金额：{{ item.InvoiceTitle.OrderTotalAmount }}</el-col>
                                <el-col :span="8">剩余可开(元)：{{ item.InvoiceTitle.SurplusAmount }}</el-col>
                                <el-col :span="8">已开票金额：{{ item.InvoiceTitle.CompleteAmount }}</el-col>
                                <el-col :span="8">文 件：点击查看</el-col>
                            </el-row> -->
                            <el-descriptions>
                                <el-descriptions-item label="币别">{{ item.InvoiceTitle.OrderCurrency }}
                                </el-descriptions-item>
                                <el-descriptions-item label="总金额(元)">{{ item.Amounts.TANToTAlCount }}
                                </el-descriptions-item>
                                <el-descriptions-item label="本次开票金额(元)">{{ item.Amounts.TotalAmounts}}
                                </el-descriptions-item>
                                <el-descriptions-item label="已开票金额(元)">{{ item.InvoiceTitle.CompleteAmount }}
                                </el-descriptions-item>
                                <el-descriptions-item label="剩余开票金额(元)">{{ item.InvoiceTitle.SurplusAmount }}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template slot="label">
                                        <!-- <span style="color:red">*</span> -->
                                        文件
                                    </template>
                                    <span style="color:#1765EC;cursor: pointer;"
                                        @click="checkFile(item.InvoiceTitle.SAPSalesOrderNumber,item.SalesOrderNumber)">{{
                                        '点击查看'
                                        }}</span>
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                        <!-- 客户信息 -->
                        <div class="message">
                            <el-row>
                                <el-col :span="24">
                                    <h5>
                                        <span class="mark"></span>
                                        <span class="tit">客户信息</span>
                                    </h5>
                                </el-col>
                            </el-row>
                            <el-descriptions>
                                <el-descriptions-item label="客户名称">{{ item.CustomerModel.Name }}</el-descriptions-item>
                                <el-descriptions-item label="纳税人识别号">{{
                                item.CustomerModel.Taxpayer_Identification_Number__c }}</el-descriptions-item>
                                <el-descriptions-item label="注册地址">{{ item.CustomerModel.Billing_Address__c }}
                                </el-descriptions-item>
                                <el-descriptions-item label="开户行名称">{{ item.CustomerModel.Bank_Name__c }}
                                </el-descriptions-item>
                                <el-descriptions-item label="银行账号">{{ item.CustomerModel.Bank_Number__c }}
                                </el-descriptions-item>
                                <el-descriptions-item label="电话">{{ item.CustomerModel.Phone }}</el-descriptions-item>
                                <el-descriptions-item label="IOS">{{ item.CustomerModel.ISO }}</el-descriptions-item>
                            </el-descriptions>
                            <!-- <el-row class="crm">
                                <el-col :span="8">客户名称：{{ item.CustomerModel.Name }}</el-col>
                                <el-col :span="8">客户产品代码：{{}}</el-col>
                                <el-col :span="8">纳税人识别号：{{ item.CustomerModel.Taxpayer_Identification_Number__c }}
                                </el-col>
                                <el-col :span="8">注册地址：{{ item.CustomerModel.Billing_Address__c }}</el-col>
                                <el-col :span="8">开户行名称：{{ item.CustomerModel.Bank_Name__c }}</el-col>
                                <el-col :span="8">银行账号：{{ item.CustomerModel.Bank_Number__c }}</el-col>
                                <el-col :span="8">电话：{{ item.CustomerModel.Phone }}</el-col>
                                <el-col :span="8">IOS：{{ item.CustomerModel.ISO }}</el-col>
                            </el-row> -->
                        </div>
                        <!-- 发票收件人信息 -->
                        <div class="message">
                            <el-row>
                                <el-col :span="24">
                                    <h5>
                                        <span class="mark"></span>
                                        <span class="tit">发票收件人信息</span>
                                    </h5>
                                </el-col>
                            </el-row>
                            <el-descriptions>
                                <el-descriptions-item label="姓名">{{ item.Consignee.CustomerNam }}</el-descriptions-item>
                                <el-descriptions-item label="电话">{{ item.Consignee.CustomerPhone }}
                                </el-descriptions-item>
                                <el-descriptions-item label="所在地区">{{ item.Consignee.CustomerArea}}
                                </el-descriptions-item>
                                <el-descriptions-item label="详细地址">{{ item.Consignee.CustomerAdress}}
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                        <!-- 内部信息 -->
                        <div class="message">
                            <el-row>
                                <el-col :span="24">
                                    <h5>
                                        <span class="mark"></span>
                                        <span class="tit">内部信息</span>
                                    </h5>
                                </el-col>
                            </el-row>
                            <el-descriptions>
                                <el-descriptions-item label="销售订单号">{{ item.InvoiceTitle.SAPSalesOrderNumber }}
                                </el-descriptions-item>
                                <el-descriptions-item label="PO">{{ item.InvoiceTitle.PONumber }}</el-descriptions-item>
                                <el-descriptions-item label="开票流程号">{{ item.InvoiceRecordNumber}}</el-descriptions-item>
                                <el-descriptions-item label="申请开票日期">{{ item.InvoiceTitle.Createtime ?
                                $moment(item.InvoiceTitle.Createtime).format('YYYY-MM-DD') : ''}}
                                </el-descriptions-item>
                                <el-descriptions-item label="BD">{{ item.InvoiceTitle?.BD }}</el-descriptions-item>
                                <el-descriptions-item label="PMM">{{ item.InvoiceTitle?.PMM }}</el-descriptions-item>
                            </el-descriptions>
                            <!-- <el-row class="crm">
                                <el-col :span="8">销售订单号：{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-col>
                                <el-col :span="8">PO：{{ item.InvoiceTitle.DSPurchaseOrderNumber }}</el-col>
                                <el-col :span="8">开票流程号：{{item.InvoiceRecordNumber}}</el-col>
                                <el-col :span="8">申请开票日期：{{ item.InvoiceTitle.Createtime ? $moment(item.InvoiceTitle.Createtime).format('YYYY-MM-DD') : ''  }}</el-col>
                            </el-row> -->
                        </div>


                        <div class="table" v-for="(item_, idnex_) in (GettInvoiceCountArry(item.SalesOrderNumber))"
                            :key="item_.InvoiceNo">
                            <el-row>
                                <el-col :span="24">
                                    <h5>
                                        <span class="mark"></span>
                                        <span class="tit">增值税{{item_.TaxType==0?"普通发票":"专用发票"}}{{ idnex_ + 1 }}</span>
                                    </h5>
                                </el-col>
                            </el-row>
                            <el-form size="mini">
                                <el-table ref="resultForm" :data="getinvoice(item_, item.SalesOrderNumber)" stripe
                                    style="width: 100%" resizable highlight-current-row>

                                    <el-table-column align="center" label="行项目" minWidth="80">
                                        <template slot-scope="scope">
                                            <el-form-item prop="ProjectNumber">
                                                {{ scope.row.ProjectNumber }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="ElabName" label="品名" minWidth="140">
                                        <template slot-scope="scope">
                                            <el-form-item prop="ElabName'">
                                                {{ scope.row.ElabName }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="ElabCode" label="产品号" minWidth="140">
                                        <template slot-scope="scope">
                                            <el-form-item prop="'ElabCode'">
                                                {{ scope.row.ElabCode }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="TransactionType" minWidth="130">
                                        <template slot="header">
                                            <span style="color:red">*</span> 交易类型
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="TransactionType'">
                                                {{
                                                scope.row.TransactionType == "ZADS" ? "收费样品" :
                                                (scope.row.TransactionType == "TAD" ? "服务" :
                                                (scope.row.TransactionType == "TAN" ? "产品交付" :
                                                (scope.row.TransactionType == "ZADZ" ? "免费样品" : "")))

                                                }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoiceAmount" minWidth="140">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color:red">*</span>发票金额
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoiceAmount">
                                                {{ scope.row.InvoiceAmount }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoiceRate" minWidth="130">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color:red">*</span>销项税率
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoiceRate">
                                                {{ scope.row.InvoiceRate + '%' }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="Num" label="数量" minWidth="140">
                                        <template slot-scope="scope">
                                            <el-form-item prop="Num">
                                                {{ scope.row.Num }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="Unit" label="单位" minWidth="140">
                                        <template slot-scope="scope">
                                            <el-form-item prop="Unit">
                                                {{ scope.row.Unit }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoicRemarks" label="备注" minWidth="170">
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoicRemarks">
                                                {{ scope.row.InvoicRemarks }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </el-form>
                            <AddVatinvoice
                                v-if="ObjDretail.InvoiceType === 0 && (ObjDretail.Status === 2 || ObjDretail.Status === 1) "
                                :params="{ SalesOrderNumber: item.SalesOrderNumber, InvoiceRecordNumber: item.InvoiceRecordNumber, RecordNo: item_ }">
                            </AddVatinvoice>
                            <!-- 查看文件 -->
                            <fileList v-model="fileDialog.visible" :SalesOrderNumber="item.SalesOrderNumber">
                            </fileList>
                        </div>
                    </div>

                </el-tab-pane>
            </el-tabs>
            <div class="foot">
                <el-button @click="hide" size="mini">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import AddVatinvoice from '../../../components/AddVatinvoice/index.vue'
import { GetUrlParams } from '../../../utils/GetNo'

import audit from '../../../components/Audit/auditResult.vue'
import fileList from "../invoiceApplication/sterilisation/fileList.vue";
import _ from 'lodash';
import {
    getRecordInfo
} from "@/api/negotiationInvoice";
export default {
    name: "TradeDetail",
    components: { audit, AddVatinvoice, fileList },
    created() {
        console.log(1)
        var dd = GetUrlParams();       
        this.ObjDretail = {...dd};
        this.getRecordInfo();       
    },
    data() {
        return {
            loading: true,
            activeName: 0,
            detailsIndex: "",
            InvoiceType: 0,
            ObjDretail: {},
            SelectArry: [],
            tab: [],
            typeList: [],
            DataArry: [],
            ApprovalUser: {
                ApprovalUserName: "",
                ApprovalserCode: ""
            },
            fileDialog: {
                visible: false,
            },


        };
    },
    methods: {

        /*获取所有 */
        Selection(selection) {

            this.SelectArry = selection
        },

        // 添加行
        AddDetails(i, invoiceno) {


        },
        GettInvoiceCountArry(SalesOrderNumber) {

            var arry = [];
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const model = data[index];
                //  .InvoiceRecordNumber
                for (let j = 0; j < model.InvoiceItem.length; j++) {
                    const item = model.InvoiceItem[j];
                    var arrymodel = {
                        InvoiceNo: item.InvoiceNo,
                        TaxType: item.TaxType
                    };
                    if (arry.length > 0) {
                        arry.forEach(e => {
                            if (e.InvoiceNo != arrymodel.InvoiceNo) {
                                arry.push(arrymodel)
                            }
                        });
                    }
                    else {
                        arry.push(arrymodel)
                    }

                }
            }
            return arry;
        },
        getinvoice(invoicemodel, SalesOrderNumber) {

            var arry = [];
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const model = data[index].InvoiceItem.filter(c => c.InvoiceNo == invoicemodel.InvoiceNo);
                arry.push(...model)
            }
            return arry;
        },


        handleClick() {
            // this.piaoNum = [];
            this.infodata.forEach((item, index) => {
                if (this.activeName == index) {
                    this.ObjDretail = { ...item };
                }
            });
        },

        pepBtn(e) {
            this.ApprovalUser = e;
        },
        getRecordInfo() {
            this.loading = true            
            getRecordInfo(this.ObjDretail)
                .then(res => {
                    if (res.Code === 200) {
                        this.DataArry = res.Data;
                        this.loading = false
                    }
                })
                .finally(() => { });
        },
        async get_Rate() {
            const res = await getRate();
            const res1 = await getelab();
            const res2 = await gettransactionType();
            this.taxList = [];
            res.Data.forEach(item => {
                this.taxList.push({ label: item.Rate, value: item.Rate });
            });
            this.ElabList = res1.Data;
            this.typeList = res2.Data;
        },

        hide() {
            this.$router.go(-1)
        },
        //查看文件
        checkFile(SAPSalesOrderNumber, SalesOrderNumber) {
            // this.fileDialog.visible = true
            let obj = {
                SAPSalesOrderNumber: SAPSalesOrderNumber,
                uploadShow: false
            }
            this.$router.push({ path: `./fileList/${SalesOrderNumber}-show`, query: { data: JSON.stringify(obj) } })
        },
    }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav-wrap {
    //padding-left: 10px !important;
    //padding-top: 10px !important;
    //padding-bottom: 10px !important;

}

.spilttab {
    height: 20px;
}

.el-form-item--mini.el-form-item {

    margin-bottom: 20px !important;
}

.container {


    padding: 16px !important;
    overflow-y: hidden;

    .content {
        .text {
            width: 100%;
            font-size: 14px;
            min-height: 60px;
            border-radius: 6px;
            border: none;
            padding: 16px 16px 4px !important;
            background-color: #f7f8fa;

            ::v-deep .el-descriptions__body {
                background-color: #f7f8fa;
            }

            .el-col {
                margin: 5px 0;
            }

            .txtname {
                font-size: 16px;
                font-weight: 600;

            }
        }

        .split {
            height: 1px;
            background-color: #f2f3f5;
        }

    }

    .mark {
        content: "";
        width: 4px;
        height: 16px;
        border-radius: 0px;
        background-color: #005fe7;
        position: absolute;
        display: block;
        left: 0;
    }

    .crm {
        font-size: 14px !important;
    }

    h5 {
        margin: 0;
        padding: 16px 0;
    }

    .tit {
        padding-left: 8px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        color: #323233;
    }

    .message {
        .el-col {
            //margin: 5px 0;
        }
    }

    .add {

        padding-left: 20px !important;
        padding-top: 16px !important;
        padding-bottom: 16px !important;
    }

    .table {
        padding-left: 0px !important;
        padding-top: 2px !important;
    }

    .btn {
        margin: 20px 0px;
        text-align: center;
    }

    .foot {
        margin-top: 16px;
        text-align: center;
    }
}

::v-deep .el-descriptions__body {
    .el-descriptions-item__label {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        letter-spacing: -0.01px;
        color: #646566;
    }

    .el-descriptions-item__content {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        letter-spacing: -0.01px;
        color: #2E2E2F;
    }
}
</style>
