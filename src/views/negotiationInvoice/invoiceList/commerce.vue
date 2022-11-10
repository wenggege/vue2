
<template>
    <div v-loading="loading" element-loading-text="数据加载中" style="padding: 0">
    <div class="container" id="A123d">


        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane class="tab_pane" v-for="(item, index) in DataArry" :key="index" :label="item.InvoiceTitle.SAPSalesOrderNumber"
                :name="String(index)">
                <div class="content">
                    <div class="text">
                        <el-row>
                            <el-col class="txtname" style="margin: 0"><img :src="companyIcon" style="margin-right: 8px" />{{ item.CustomerModel.Name }}</el-col>
                        </el-row>
                        <el-descriptions :column="5" >
                            <el-descriptions-item label="客户名称">{{ item.CustomerModel.Name}}</el-descriptions-item>
                            <el-descriptions-item label="订单">{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-descriptions-item>
                            <el-descriptions-item label="ISO">{{ item.CustomerModel.ISO  }}</el-descriptions-item>
                            <!-- <el-descriptions-item label="产品可开票金额">{{ item.InvoiceTitle.SurplusAmount }}</el-descriptions-item>
                            <el-descriptions-item label="服务可开票金额">{{ item.InvoiceTitle.SurplusAmount }}</el-descriptions-item> -->
                        </el-descriptions>
                        <!-- <el-row>
                            <el-col :span="4">客户名称：{{ item.CustomerModel.Name}}</el-col>
                            <el-col :span="4">订单：{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-col>
                            <el-col :span="3">ISO:{{ item.CustomerModel.ISO }}</el-col>
                            <el-col :span="5">产品可开票金额：{{ item.InvoiceTitle.SurplusAmount }}</el-col>
                            <el-col :span="5">服务可开票金额：{{ item.InvoiceTitle.SurplusAmount }}</el-col>
                        </el-row> -->
                    </div>
                    <div class="table" v-for="(item_, idnex_) in (GettInvoiceCountArry(item.SalesOrderNumber))"
                        :key="item_">
                        <el-row>
                            <el-col :span="24">
                                <h5>
                                    <span class="mark"></span>
                                    <span class="tit">发票{{ idnex_ + 1 }}</span>
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
                                            {{ scope.row.InvoiceRate }}
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
                            <!-- <el-col :span="24" style="margin:16px 0">
                                <span class="tit" style="margin:0;font-weight:600;padding-left: 0;">发票{{ idnex_ + 1 }}关联值税发票</span>
                            </el-col>
                            <AddVatinvoice
                                :params="{ SalesOrderNumber: item.SalesOrderNumber, InvoiceRecordNumber: item.InvoiceRecordNumber, RecordNo: item_ }">
                            </AddVatinvoice> -->
                        </el-form>
                    </div>
                </div>

            </el-tab-pane>
        </el-tabs>
        <div class="btn">
            <el-button size="mini" @click="goTo">返回</el-button>

        </div>
    </div>
</div>
</template>

<script>
import { Message } from 'element-ui'
import AddVatinvoice from '../../../components/AddVatinvoice/index.vue'

import {
    getRecordInfo
} from "@/api/negotiationInvoice";
export default {
    name: "TradeDetail",
    components: { AddVatinvoice },
    created() {

        this.ObjDretail = JSON.parse(this.$route.query.data);
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
            companyIcon: require("@imgs/svg-icons/companyIcon.svg"),


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

            var arry = new Set();
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const model = data[index];
                //  .InvoiceRecordNumber
                for (let j = 0; j < model.InvoiceItem.length; j++) {
                    const item = model.InvoiceItem[j];
                    arry.add(item.InvoiceNo)
                }
            }
            return arry;
        },
        getinvoice(InvoiceNo, SalesOrderNumber) {

            var arry = [];
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const model = data[index].InvoiceItem.filter(c => c.InvoiceNo == InvoiceNo);
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
        goTo() {

            this.$router.go(-1)
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
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav-wrap {
    //padding-left: 20px !important;
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
            padding: 0 16px 4px !important;
            background-color: #F7F8FA;

            .el-col {
                margin: 5px 0;
            }

            .txtname {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 24px;
                color: #2E2E2F;
                padding: 16px 0;
                display: flex;
                .companyIcon{
                    width: 32px;
                    height: 32px;
                    margin-right: 8px;
                    //background-image:url('./imgs/companyIcon.png');
                    background-repeat: no-repeat;
                }
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

    h5{
        margin:0;
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
            margin: 5px 0;
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
        //margin: 16px 0px 0px;
        margin-top: 16px;
        text-align: center;
    }
}
::v-deep .el-descriptions__body {
    background: #F7F8FA;
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
