
<template>
    <div class="container" id="A123" v-loading="loading" element-loading-text="数据加载中">


        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane class="tab_pane" v-for="(item, index) in tab" :key="index" :label="item.CustomerModel.Name"
                :name="String(index)">
                <div class="content">
                    <div class="text">
                        <!-- <el-row>
                            <el-col :span="8">本次开票金额：{{ item.InvoiceTitle.CurCount }}</el-col>
                            <el-col :span="8">币别：{{ item.InvoiceTitle.OrderCurrency }}</el-col>
                            <el-col :span="8">总金额：{{ item.InvoiceTitle.OrderTotalAmount }}</el-col>
                            <el-col :span="8">服务可开票金额(元)：{{ item.InvoiceTitle.TADToTAlCount }}</el-col>
                            <el-col :span="8">已开票金额：{{ item.InvoiceTitle.CurCountCompleteAmount }}</el-col>
                            <el-col :span="8">产品可开票金额(元)：{{ item.InvoiceTitle.TANToTAlCount }}</el-col>
                        </el-row> -->
                        <el-descriptions>
                            <el-descriptions-item label="本次开票金额">{{ item.InvoiceTitle.CurCount }}</el-descriptions-item>
                            <el-descriptions-item label="币别">{{ item.InvoiceTitle.OrderCurrency }}
                            </el-descriptions-item>
                            <el-descriptions-item label="总金额">{{ item.InvoiceTitle.OrderTotalAmount}}
                            </el-descriptions-item>
                            <el-descriptions-item label="服务可开票金额(元)">{{ item.InvoiceTitle.TADToTAlCount }}
                            </el-descriptions-item>
                            <el-descriptions-item label="已开票金额">{{ item.InvoiceTitle.CurCountCompleteAmount }}
                            </el-descriptions-item>
                            <el-descriptions-item label="产品可开票金额(元)">{{ item.InvoiceTitle.TANToTAlCount }}
                            </el-descriptions-item>
                        </el-descriptions>
                    </div>
                    <div class="split"></div>
                </div>
                <div class="add">
                    <el-button type="primary" @click="AddBtn(InvoiceCountArry, item.InvoiceTitle.SalesOrderNumber)"
                        size="mini">新建发票</el-button>
                </div>

                <div class="datatable">

                    <div>
                        <el-form size="mini" :model="resultForm" :rules="resultForm.resultRuls">
                            <el-table empty-text="暂无数据，可 添加行 进行填写" ref="multipleTable"
                                :id="item.InvoiceTitle.SalesOrderNumber" :data="item.InvoiceItem" @select="Selection"
                                @select-all="Selection" stripe style="width: 100%" resizable highlight-current-row>

                                <el-table-column type="selection" width="46">
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
                                        <span style="color:red">*</span>可冲销金额
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
                                <!-- <el-table-column align="center" prop="datashuju" label="操作" width="120">
                                    <template slot-scope="scope">

                                    </template>
                                </el-table-column> -->
                            </el-table>
                        </el-form>
                    </div>

                </div>
                <!-- <div class="spilttab"></div> -->
                <div class="table"
                    v-for="(item_, idnex_) in (GettInvoiceCountArry(item.InvoiceTitle.SalesOrderNumber, item))"
                    :key="item_.InvoiceNo">
                    <el-row>
                        <el-col :span="24">
                            <h5>
                                <span class="mark"></span>
                                <span class="tit">发票{{ idnex_ + 1 }}</span>
                            </h5>
                        </el-col>
                        <el-col :span="24" style="margin-bottom: 10px;">
                            <el-button type="primary" size="mini" v-show="false" @click="AddDetails()">
                                添加行
                            </el-button>
                            <el-button size="mini" @click="delBtn(item.InvoiceTitle.SalesOrderNumber, item_.InvoiceNo,item)"
                                style="margin-left:0px">删除发票</el-button>
                        </el-col>
                    </el-row>
                    <el-form size="mini">
                        <el-table :model="resultForm" :rules="resultForm.resultRuls" ref="resultForm"
                            :data="getinvoice(item_.InvoiceNo, item)" stripe style="width: 100%" resizable
                            highlight-current-row>

                            <el-table-column align="center" label="行项目" minWidth="80">
                                <template slot-scope="scope">
                                    <el-form-item prop="ProjectNumber">
                                        {{ scope.row.ProjectNumber }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="ElabName" label="品名" minWidth="130">
                                <template slot-scope="scope">
                                    <el-form-item prop="ElabName'">
                                        {{ scope.row.ElabName }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="ElabCode" label="产品号" minWidth="130">
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
                            <el-table-column align="center" prop="InvoiceAmount" minWidth="130">
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
                                        {{ scope.row.InvoiceRate }}%
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="Num" label="数量" minWidth="120">
                                <template slot-scope="scope">
                                    <el-form-item prop="Num">
                                        {{ scope.row.Num }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="Unit" label="单位" minWidth="120">
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
                            <!-- <el-table-column align="center" prop="datashuju" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="del(scope.row, idnex_)">删除
                                    </el-button>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </el-form>
                </div>


                <div class="btn">
                    <el-button size="mini" @click="goTo">返回</el-button>
                    <el-button type="primary" size="mini" @click="Allbtn">提交申请</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- <AddDatil ref="AddDatil" :DataArry='DataArry' :ObjDretail='ObjDretail'  ></AddDatil> -->

        <!-- 提交申请弹窗 -->
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
                    <el-input type="textarea" v-model="apyForm.AuditResult" ></el-input>
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
import { Message } from 'element-ui'
import AddDatil from "@/components/AddDatil";
import InvoiceModel from "../../../../Model/invoiceModel";
import _ from 'lodash';

import {
    getApplyinfo,
    getRate,
    getsubinvoice,
    getelab,
    gettransactionType
} from "@/api/negotiationInvoice";
export default {
    name: "invoiceTradeDetail",
    components: { AddDatil },
    created() {
        var id = this.$route.params.Id;
        this.infodata = JSON.parse(this.$route.query.data);

        this.ObjDretail = { ...this.infodata[0] };
        this.get_Applyinfo();
        this.get_Rate();
    },
    data() {
        return {
            loading: true,
            Sub:false,
            activeName: 0,
            detailsIndex: "",
            infodata: [],
            InvoiceType: 0,
            ObjDretail: {
                Id: "",
                SalesOrderNumber: "",
                InvoiceType: ""
            },
            SelectArry: [],
            tab: [],
            ElabList: [],
            searchLoading: false,
            typeList: [],
            DataArry: [],
            ItemData: [],
            InvoiceCountArry: [],
            InvoiceItemData: [],
            ApprovalUser: {
                ApprovalUserName: "",
                ApprovalserCode: ""
            },
            taxList: [],
            resultForm: {
                InvoiceItem: [],
                resultRuls: {}
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
        };
    },
    methods: {
        // 添加发票
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
                var arry = this.ItemData.filter(a => {
                    return a.DeliveryProjectID == element.DeliveryProjectID && a.SalesOrderNumber == element.SalesOrderNumber
                })
                if (arry.length > 0) {
                    Message.error('请勾选未选择项目')
                    return;
                }
                element.InvoiceNo = no;
                element.SalesOrderNumber = SalesOrderNumber;
                element.IsDelete = 1;
            }
            var model = this.$refs.multipleTable.filter(a => { return a.$el.id == SalesOrderNumber })[0]
            model.clearSelection();
            row.push(rowmodel);
            this.ItemData.push(...this.SelectArry)

            this.Selection([]);
        },

        /*获取所有 */
        Selection(selection) {

            this.SelectArry = selection
        },

        // 提交申请
        Allbtn: _.debounce(function (e) {
            this.submit()
        }, 200),
        submit() {

            var isadd = this.InvoiceCountArry.length;
            if (isadd <= 0) {
                Message.error('请添加发票')
                return;
            }
            for (let index = 0; index < this.DataArry.length; index++) {
                const model = this.DataArry[index];
                model.InvoiceTitle.InvoiceType = this.ObjDretail.InvoiceType
                model.InvoiceItem = [];
                var countarry = this.InvoiceCountArry.filter(a => { return a.SalesOrderNumber == model.InvoiceTitle.SalesOrderNumber })
                for (let j = 0; j < countarry.length; j++) {

                    var arry = this.ItemData.filter(a => {

                        return a.InvoiceNo == this.InvoiceCountArry[j].InvoiceNo && a.SalesOrderNumber == this.InvoiceCountArry[j].SalesOrderNumber
                    })
                    model.InvoiceItem.push(...arry);
                    // model.InvoiceItem.map(m => { m.InvoiceType = this.ObjDretail.InvoiceType; m.InvoiceAmount = -m.InvoiceAmount })
                }
            }

            this.DataArry.some((a, i) => {
                if (a.InvoiceItem.length == 0) {
                    this.DataArry.splice(i, 1)
                }
            });

            //console.log( this.DataArry)
            // this.$refs.AddDatil.show();
            this.apyDialog.show = true;

        },
        // 添加行
        AddDetails(i, invoiceno) {


        },
        GettInvoiceCountArry(SalesOrderNumber, row) {
         
            var data = this.InvoiceCountArry.filter(a => {
                return a.SalesOrderNumber == SalesOrderNumber;
            });

            var TANCount = 0;//服务金额
            var TADCount = 0;//产品金额
            var isselect = this.ItemData.length;
            row.InvoiceItem.map(a => {
                if (a.TransactionType == "TAD" &&a.IsDelete==1 ) {
                    //SurplusAmount InvoiceAmount
                    TADCount += (Math.round(parseFloat(a.InvoiceAmount) * 100) / 100);
                }
                if (a.TransactionType !== "TAD"&&a.IsDelete==1) {
                    //SurplusAmount InvoiceAmount
                    TANCount += (Math.round(parseFloat(a.InvoiceAmount) * 100) / 100);
                }
            })
         
            if (TANCount >= 0) {
                var newtan = ((Math.round(parseFloat(row.Amounts.TANToTAlCount) * 100)) - (Math.round(parseFloat(TANCount) * 100))) / 100;
                if (isselect == 0) {
                    newtan = row.Amounts.TANToTAlCount
                }
                this.$set(row.InvoiceTitle, "TANToTAlCount", newtan)
            }
            if (TADCount >= 0) {
                var newtad = ((Math.round(parseFloat(row.Amounts.TADToTAlCount) * 100)) - (Math.round(parseFloat(TADCount) * 100))) / 100;

                if (isselect == 0) {
                    newtan = row.Amounts.TADToTAlCount
                }
                this.$set(row.InvoiceTitle, "TADToTAlCount", newtad)
            }
            if (isselect > 0) {
                var CurCount = (Math.round(parseFloat(TADCount) * 100) / 100) + (Math.round(parseFloat(TANCount) * 100) / 100);
                this.$set(row.InvoiceTitle, "CurCount", CurCount);
                this.$set(row.InvoiceTitle, "CurCountCompleteAmount",  (Math.round(parseFloat( row.InvoiceTitle.CompleteAmount) * 100) / 100) - (Math.round(parseFloat(CurCount) * 100) / 100)
               );
                
            }
            if (isselect == 0) {             
                this.$set(row.InvoiceTitle, "CurCount", 0);
                this.$set(row.InvoiceTitle, "CurCountCompleteAmount", row.InvoiceTitle.CompleteAmount);
            }
            return data;
        },
        getinvoice(invoiceno, row) {

            console.log(row)
            var data = this.ItemData.filter(a => {
                return a.InvoiceNo == invoiceno;
            });
            return data;
        },

        // 提交申请弹窗
        apyDialogClose() {
            this.apyDialog.show = false
            this.Sub=false;
            this.$refs.apyForm.resetFields()
            this.reload();
        },
        apyDialogSubmit: _.debounce(function (e) {
            this.Sub=true;
            this.confirm()
        }, 400),
        async confirm() {
            this.Sub=true;
            console.log(1);
            let isvalid = 0;
            this.$refs.apyForm.validate((valid) => {
                if (valid) {
                    var data = this.DataArry;
                    this.apyForm.CrmAuth = parseInt(this.apyForm.CrmAuth);
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        element.ApprovalUser = this.apyForm;
                    }
                    isvalid = 1;
                }
                else{
                    this.Sub=false;
                }
            });
            if (isvalid == 1) {
                this.Sub=true;
                const res = await getsubinvoice(this.DataArry);
                if (res.Code == 200) {
                    Message.success("操作成功")
                }
                else {
                    Message.error(res.Messase)
                    this.Sub=false;
                }
                this.$router.go(-1);
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
        // 删除发票
        delBtn(SalesOrderNumber, invoiceno,row) {

            var asd123 = 123;
            for (let i = this.InvoiceCountArry.length - 1; i >= 0; i--) {
                var item = this.InvoiceCountArry[i]
                if (item.SalesOrderNumber == SalesOrderNumber && item.InvoiceNo == invoiceno) {
                    this.InvoiceCountArry.splice(i, 1)
                }
            }

            for (let i = this.ItemData.length - 1; i >= 0; i--) {
                var item = this.ItemData[i]
                if (item.SalesOrderNumber == SalesOrderNumber && item.InvoiceNo == invoiceno) {
                    this.ItemData.splice(i, 1)
                }
            }
            row.InvoiceItem.map(a => {
                if(a.InvoiceNo == invoiceno){
                    a.IsDelete = 0;
                }
             
            })

        },
        // 删除行
        del(row, e) {


        },
        goTo() {

            this.$router.go(-1)
        },
        pepBtn(e) {
            this.ApprovalUser = e;
        },
        get_Applyinfo() {
            var that = this;
            that.loading = true
            getApplyinfo(that.infodata)
                .then(res => {
                    if (res.Code === 200) {
                        that.tab = res.data;
                        this.DataArry = res.data;
                        that.loading = false
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

    margin-bottom: 0px !important;
}

.container {


    padding: 16px !important;
    //overflow-y: hidden;

    .content {
        .text {
            width: 100%;
            font-size: 12px;
            min-height: 60px;
            padding-left: 16px !important;

            .el-col {
                margin: 5px 0;
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

        //padding-left: 20px !important;
        padding-top: 16px !important;
        padding-bottom: 16px !important;
    }

    .table {
        //padding-left: 16px !important;
        //padding-top: 2px !important;
        margin-bottom: 16px;
    }

    .btn {
        //margin: 20px 0px;
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
