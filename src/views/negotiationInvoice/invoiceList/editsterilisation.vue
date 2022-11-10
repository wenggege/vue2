
<template>
    <div v-loading="loading" element-loading-text="数据加载中">
        <div class="container" id="A123d">


            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab_pane" v-for="(item, index) in DataArry" :key="index"
                    :label="item.InvoiceTitle.SAPSalesOrderNumber" :name="String(index)">
                    <div class="content">
                        <div class="text">
                            <el-row>
                                <el-col class="txtname" style="margin: 0"><img :src="companyIcon"
                                        style="margin-right: 8px" />{{ item.CustomerModel.Name }}</el-col>
                            </el-row>
                            <el-row>
                                <!-- <el-col :span="6">客户名称：{{item.CustomerModel.Name }}</el-col>
                                <el-col :span="4">订单：{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-col>
                                <el-col :span="3">ISO:{{ item.CustomerModel.ISO }}</el-col> -->
                                <!-- <el-col :span="5">产品可开票金额：{{ item.InvoiceTitle.SurplusAmount }}</el-col>
                            <el-col :span="5">服务可开票金额：{{ item.InvoiceTitle.SurplusAmount }}</el-col> -->
                                <el-descriptions :column="5">
                                    <el-descriptions-item label="客户名称">{{ item.CustomerModel.Name}}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="订单">{{ item.InvoiceTitle.SAPSalesOrderNumber }}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="ISO">{{ item.CustomerModel.ISO }}
                                    </el-descriptions-item>
                                </el-descriptions>
                            </el-row>

                        </div>

                    </div>
                    <div class="split"></div>
                    <audit :InvoiceRecordNumber="item.InvoiceRecordNumber" v-if="checkType !== 'DETAILS'"></audit>
                    <!-- <div class="split"></div> -->


                    <div class="datatable" v-if="checkType !== 'DETAILS'">

                        <div>
                            <el-form size="mini">
                                <el-table empty-text="暂无数据，可 添加行 进行填写" ref="multipleTable"
                                    :id="item.InvoiceTitle.SalesOrderNumber" :data="item.optional" @select="Selection"
                                    @select-all="Selection" stripe style="width: 100%" resizable highlight-current-row>

                                    <el-table-column type="selection" minWidth="46">
                                    </el-table-column>
                                    <el-table-column align="center" label="行项目" minWidth="80">
                                        <template slot-scope="scope">
                                            <el-form-item prop="ProjectNumber">
                                                {{ scope.row.ProjectNumber }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="ElabName" label="品名" minWidth="120">
                                        <template slot-scope="scope">
                                            <el-form-item prop="ElabName'">
                                                {{ scope.row.ElabName }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="ElabCode" label="产品号" minWidth="120">
                                        <template slot-scope="scope">
                                            <el-form-item prop="'ElabCode'">
                                                {{ scope.row.ElabCode }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="ProjectCode" label="客户产品代码" minWidth="120">
                                        <template slot-scope="scope">
                                            <el-form-item prop="'ProjectCode'">
                                                {{ scope.row.ProjectCode }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="TransactionType" minWidth="100">
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
                                    <el-table-column align="center" prop="InvoiceAmount" minWidth="120">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color:red">*</span>最终客户总价
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoiceAmount">
                                                {{ scope.row.InvoiceAmount }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="Currency" minWidth="80">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color:red">*</span>币别
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="Currency">
                                                {{ scope.row.Currency }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="Num" label="数量" minWidth="100">
                                        <template slot-scope="scope">
                                            <el-form-item prop="Num">
                                                {{ scope.row.Num }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="Unit" label="单位" minWidth="100">
                                        <template slot-scope="scope">
                                            <el-form-item prop="Unit">
                                                {{ scope.row.Unit }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoicRemarks" label="备注" minWidth="120">
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoicRemarks">
                                                {{ scope.row.InvoicRemarks }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="datashuju" label="操作" minWidth="120">
                                        <template slot-scope="scope">

                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                        </div>

                    </div>
                    <!-- <div class="spilttab"></div> -->
                    <div class="table" v-for="(item_, idnex_) in (GettInvoiceCountArry(item.SalesOrderNumber))"
                        :key="item_">
                        <el-row>
                            <el-col :span="24">
                                <h5 style="margin: 0;padding: 16px 0">
                                    <span class="mark"></span>
                                    <span class="tit">发票{{ idnex_ + 1 }}</span>
                                </h5>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 16px;" v-if="checkType !== 'DETAILS'">
                                <el-button type="primary" size="mini" @click="AddDetails(item_, item.SalesOrderNumber)"
                                    style="margin-right:10px">
                                    添加行
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-form size="mini">
                            <el-table :data="getinvoice(item_, item.SalesOrderNumber)" stripe style="width: 100%"
                                resizable highlight-current-row>

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
                                <el-table-column align="center" prop="TransactionType" minWidth="100">
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
                                <el-table-column align="center" prop="InvoiceRate" minWidth="100">
                                    <template slot="header" slot-scope="scope">
                                        <span style="color:red">*</span>销项税率
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item prop="InvoiceRate">
                                            {{ scope.row.InvoiceRate }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="Num" label="数量" minWidth="100">
                                    <template slot-scope="scope">
                                        <el-form-item prop="Num">
                                            {{ scope.row.Num }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="Unit" label="单位" minWidth="130">
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
                                <el-table-column align="center" prop="datashuju" label="操作" minWidth="120">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="mini" @click="del(scope.row,item)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- <el-col :span="24" style="margin:16px 0">
                                <span class="tit" style="margin:0;font-weight:600;padding:0">发票{{ idnex_ + 1
                                }}关联值税发票</span>
                            </el-col>
                            <AddVatinvoice
                                :params="{ SalesOrderNumber: item.SalesOrderNumber, InvoiceRecordNumber: item.InvoiceRecordNumber, RecordNo: item_ }">
                            </AddVatinvoice> -->
                        </el-form>

                    </div>

                </el-tab-pane>
            </el-tabs>
            <div class="btn">
                <el-button size="mini" @click="goTo">返回</el-button>
                <el-button type="primary" size="mini" @click="Allbtn" v-if="checkType !== 'DETAILS'">提交申请</el-button>
            </div>

        </div>
        <el-dialog :close-on-click-modal="false" :visible="apyDialog.show" :title="apyDialog.title" width="30%"
            @close="apyDialogClose">
            <el-form :model="apyForm" :rules="apyRules" ref="apyForm" lable-width="100px">
                <el-form-item label="客户认证" prop="CrmAuth">
                    <el-radio-group v-model="apyForm.CrmAuth">
                        <el-radio label=1>是</el-radio>
                        <el-radio label=0>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="原因" prop="AuditResult">
                    <el-input type="textarea" v-model="apyForm.AuditResult"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div style="text-align: right;">
                    <el-button size="mini" @click="apyDialogClose" style="margin-right: 10px;margin: 0px;">取消
                    </el-button>
                    <el-button type="primary" size="mini" @click="apyDialogSubmit" :disabled="Sub">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>

import audit from '../../../components/Audit/auditResult.vue'
import AddVatinvoice from '../../../components/AddVatinvoice/index.vue'
import { Message } from 'element-ui'
import { GetUrlParams } from '../../../utils/GetNo'
import _ from 'lodash';
import {
    getRecordInfo,
    Updatarecord,
    UpdatarecordData
} from "@/api/negotiationInvoice";
export default {
    name: "TradeDetail",
    components: { audit, AddVatinvoice },
    created() {
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
            InvoiceCountArry: [],
            tab: [],
            checkType: '',
            typeList: [],
            DataArry: [],
            Consignee: [],
            Sub: false,
            ApprovalUser: {
                ApprovalUserName: "",
                ApprovalserCode: ""
            },
            // 提交申请弹窗
            apyDialog: {
                show: false,
                title: '提交申请',
            },
            apyForm: {
                CrmAuth: '0',
                AuditResult: '',
            },
            apyRules: {
                CrmAuth: [
                    { required: true, message: '请选择客户认证', trigger: 'change' }
                ],
                AuditResult: [
                    { required: true, message: '原因必填', trigger: 'blur' }
                ],
            },
            companyIcon: require("@imgs/svg-icons/companyIcon.svg"),


        };
    },
    methods: {

        AddBtn(row, SalesOrderNumber) {

            var isadd = this.SelectArry.length;
            if (isadd <= 0) {
                Message.error('请选择项目')
                return;
            }
            var msg = 0;
            var no = Math.random().toString(36).substr(2)
            var rowmodel = { SalesOrderNumber: SalesOrderNumber, InvoiceNo: no };
            for (let index = 0; index < this.SelectArry.length; index++) {
                const element = this.SelectArry[index];
                if (element.SalesOrderNumber == SalesOrderNumber) {
                    element.InvoiceNo = no;
                    element.SalesOrderNumber = SalesOrderNumber;
                    var arry = this.DataArry.filter(a => { return a.SalesOrderNumber == SalesOrderNumber })[0];
                    var isadd = arry.InvoiceItem.filter(c => { return c.DeliveryProjectID == element.DeliveryProjectID && c.IsDelete == 0 })
                    if (isadd.length > 0) {
                        Message.error('项目已经存在')
                        return;
                    }
                    element.InvoiceType = arry.InvoiceTitle.InvoiceType;
                    isadd = arry.InvoiceItem.filter(c => { return c.Id > 0 })
                    if (isadd.length > 0) {
                        element.InvoiceRecordNumber = isadd[0].InvoiceRecordNumber;
                    }
                    else {
                        element.InvoiceRecordNumber = no;
                    }

                    arry.InvoiceItem.push(element)
                }

            }
            var model = this.$refs.multipleTable.filter(a => { return a.$el.id == SalesOrderNumber })[0]
            model.clearSelection();
            row.push(rowmodel);
            this.Selection([]);
        },


        /*获取所有 */
        Selection(selection) {

            this.SelectArry = selection
        },

        // 删除行
        del(row, data) {
            console.log(1)
            data.InvoiceItem.map(a => {
                if (a.DeliveryProjectID == row.DeliveryProjectID) {
                    a.IsDelete = 1;
                    var model = JSON.parse(JSON.stringify(a));
                    model.IsDelete = 0;
                    if (!data.optional) {
                        data.optional = [];
                    }
                    var optional = data.optional.filter(c => { return c.DeliveryProjectID == row.DeliveryProjectID });
                    if (optional.length == 0) {
                        model.InvoiceAmount = Math.abs(model.InvoiceAmount)
                        data.optional.push(model)
                    }

                }
            })
            console.log(data.optional)
        },
        // 添加行
        AddDetails(no, SalesOrderNumber) {


            var isadd = this.SelectArry.length;
            if (isadd <= 0) {
                Message.error('请选择项目')
                return;
            }

            for (let index = 0; index < this.SelectArry.length; index++) {
                const element = this.SelectArry[index];
                if (element.SalesOrderNumber == SalesOrderNumber) {
                    element.InvoiceRecordNumber = no;
                    element.SalesOrderNumber = SalesOrderNumber;
                    var arry = this.DataArry.filter(a => { return a.SalesOrderNumber == SalesOrderNumber })[0];

                    var isadd = arry.InvoiceItem.filter(c => { return c.DeliveryProjectID == element.DeliveryProjectID && c.IsDelete == 0 })
                    if (isadd.length > 0) {
                        Message.error('项目已经存在')
                        return;
                    }
                    element.InvoiceType = arry.InvoiceTitle.InvoiceType;
                    element.InvoiceNo = arry.InvoiceItem[0].InvoiceNo;
                    var addmodel = JSON.parse(JSON.stringify(element));
                    addmodel.IsDelete = 0;
                    addmodel.InvoiceAmount = -addmodel.InvoiceAmount
                    arry.InvoiceItem.push(addmodel)
                }
            }
            var model = this.$refs.multipleTable.filter(a => { return a.$el.id == SalesOrderNumber })[0]
            model.clearSelection();
            this.Selection([]);
            console.log(this.DataArry)

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
            this.InvoiceCountArry = [...arry];
            return arry;
        },
        getinvoice(InvoiceNo, SalesOrderNumber) {

            var arry = [];
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const model = data[index].InvoiceItem.filter(c => c.InvoiceNo == InvoiceNo && c.IsDelete == 0);
                arry.push(...model)
            }
            return arry;
        },
        Allbtn: _.debounce(function (e) {
            this.Sub = false;
            this.apyDialog.show = true;

        }, 400),
        apyDialogSubmit: _.debounce(function (e) {

            if (!this.apyForm.AuditResult) {
                Message.error("原因必填");
                return
            }
            this.Sub = true;
            this.submit()
        }, 400),
        async submit() {
            this.Sub = true;
            var data = [];
            for (let index = 0; index < this.DataArry.length; index++) {
                const model = this.DataArry[index];
                var arry = model.InvoiceItem.filter(a => { return a.IsDelete == 0 });
                if (!arry || arry.length == 0) {
                    Message.success("无可操作性项");
                    return
                }
                arry.map(a => {
                    if (a.InvoiceAmount > 0) {
                        a.InvoiceAmount = -a.InvoiceAmount;
                    }
                });
                if (arry.length != null) {
                    data.push(...arry)
                }
                this.Consignee.push(model.Consignee)
            }
            this.apyForm.CrmAuth = parseInt(this.apyForm.CrmAuth);
            var param = { user: {}, list: [], Consignee: [] }
            param.list = data;
            param.user = this.apyForm;
            param.Consignee = this.Consignee;
            var res = await UpdatarecordData(param);
            if (res.Code == 200) {

                Message.success("操作成功");
                this.$router.go(-1)
            }
            else {
                Message.error(res.Message);
                this.Sub = false;
            }

        },

        handleClick() {
            // this.piaoNum = [];
            this.infodata.forEach((item, index) => {
                if (this.activeName == index) {
                    this.ObjDretail = { ...item };
                }
            });
        },
        goTo() {

            this.$router.go(-1)
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
                        //this.Consignee=res.Data[0].Consignee
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
        // 提交申请弹窗
        apyDialogClose() {
            this.apyDialog.show = false
            this.Sub = false;
            this.$refs.apyForm.resetFields()
        },
    },
    watch: {
        $route: {

            handler: function (route) {         
                if (route.query.data) {
                    const queryObj = JSON.parse(route.query.data)
                    console.log(queryObj)                  
                    this.checkType = queryObj.checkType;
                    console.log(this.checkType)   
                }
            },
            immediate: true
        }
    },
};
</script>

<style lang="scss" scoped>
.app-main>* {
    padding: 16px;
}

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


    padding: 0px !important;
    overflow-y: hidden;

    .content {
        .text {
            width: 100%;
            font-size: 12px;
            min-height: 60px;
            border-radius: 6px;
            border: none;
            padding: 0 16px 4px !important;


            .el-col {
                //margin: 5px 0;
            }

            .txtname {
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 24px;
                color: #2E2E2F;
                padding: 0 0 16px;
                display: flex;

                .companyIcon {
                    width: 32px;
                    height: 32px;
                    margin-right: 8px;
                    //background-image:url('./imgs/companyIcon.png');
                    background-repeat: no-repeat;
                }
            }
        }


    }

    .split {
        height: 1px;
        background-color: #f2f3f5;
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

    .table,
    .datatable {
        //padding-left: 20px !important;
        //padding-top: 2px !important;
    }

    .btn {
        margin-top: 16px;
        text-align: center;
    }
}
</style>
