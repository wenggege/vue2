
<template>
    <div class="container" id="A123d" v-loading="loading" element-loading-text="数据加载中">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane class="tab_pane" v-for="(item, index) in DataArry" :key="index"
                :label="item.InvoiceTitle.SAPSalesOrderNumber" :name="String(index)">
                <div class="content">
                 
                    <div class="text">
                        <el-row>
                            <el-col class="txtname"><img :src="companyIcon" style="margin-right: 8px" />{{ item.CustomerModel["Name"] }}</el-col>
                        </el-row>
                        <!-- <el-row>
                            <el-col :span="4">客户名称：{{ item.CustomerModel["Name"] }}</el-col>
                            <el-col :span="4">订单：{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-col>
                            <el-col :span="3">ISO:{{ item.CustomerModel.ISO }}</el-col>
                            <el-col :span="4">服务可开票金额(元)：{{ item.InvoiceTitle.TADToTAlCount }}</el-col>
                            <el-col :span="4">产品可开票金额(元)：{{ item.InvoiceTitle.TANToTAlCount }}</el-col>
                        </el-row> -->
                        <el-descriptions :column="5" >
                            <el-descriptions-item label="客户名称">{{ item.CustomerModel.Name}}</el-descriptions-item>
                            <el-descriptions-item label="订单">{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-descriptions-item>
                            <el-descriptions-item label="ISO">{{ item.CustomerModel.ISO  }}</el-descriptions-item>
                            <!-- <el-descriptions-item label="服务可开票金额">{{ item.InvoiceTitle.TADToTAlCount }}</el-descriptions-item>
                            <el-descriptions-item label="产品可开票金额">{{ item.InvoiceTitle.TANToTAlCount }}</el-descriptions-item>                      -->
                        </el-descriptions>
                    </div>

                </div>
                <div class="split"></div>
                <div style="margin-top:16px">
                        <el-form ref="customerForm" :model="item.Consignee" label-width="200px" label-position="left">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="客户接收及抄送email地址：" style="margin-bottom:0">
                                        <el-input
                                        v-model="item.Consignee.CustomerEmail"
                                        placeholder="请输入"
                                        style="width:600px"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                <audit :InvoiceRecordNumber="item.InvoiceRecordNumber"></audit>
                <div class="split"></div>
                <div class="add">
                    <el-button type="primary" @click="AddBtn(InvoiceCountArry, item)" size="mini">新建发票</el-button>
                </div>

                <div class="datatable">

                    <div>
                        <el-form size="mini">
                            <el-table empty-text="暂无数据，可 添加行 进行填写" ref="multipleTable"
                                :id="item.InvoiceTitle.SalesOrderNumber" :data="item.optional" @select="Selection"
                                @select-all="Selection" stripe style="width: 100%" resizable highlight-current-row>

                                <el-table-column type="selection" width="46">
                                </el-table-column>
                                <el-table-column align="center" label="行项目" width="80">
                                    <template slot-scope="scope">
                                        <el-form-item prop="ProjectNumber">
                                            {{ scope.row.ProjectNumber }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="ElabName" label="品名" width="120">
                                    <template slot-scope="scope">
                                        <el-form-item prop="ElabName'">
                                            {{ scope.row.ElabName }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="ElabCode" label="产品号" width="120">
                                    <template slot-scope="scope">
                                        <el-form-item prop="'ElabCode'">
                                            {{ scope.row.ElabCode }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="ProjectCode" label="客户产品代码" width="120">
                                    <template slot-scope="scope">
                                        <el-form-item prop="'ProjectCode'">
                                            {{ scope.row.ProjectCode }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="TransactionType" width="100">
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
                                <el-table-column align="center" prop="InvoiceAmount" width="140">
                                    <template slot="header" slot-scope="scope">
                                        <span style="color:red">*</span>最终客户总价
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item prop="InvoiceAmount">
                                            {{ scope.row.InvoiceAmount }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="Currency" width="80">
                                    <template slot="header" slot-scope="scope">
                                        <span style="color:red">*</span>币别
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item prop="Currency">
                                            {{ scope.row.Currency }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="Num" label="数量" width="100">
                                    <template slot-scope="scope">
                                        <el-form-item prop="Num">
                                            {{ scope.row.Num }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="Unit" label="单位" width="100">
                                    <template slot-scope="scope">
                                        <el-form-item prop="Unit">
                                            {{ scope.row.Unit }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="InvoicRemarks" label="备注" width="120">
                                    <template slot-scope="scope">
                                        <el-form-item prop="InvoicRemarks">
                                            {{ scope.row.InvoicRemarks }}
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="datashuju" label="操作" width="120">
                                    <template slot-scope="scope">

                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                    </div>

                </div>
                <div class="spilttab"></div>
                <div class="table" v-for="(item_, idnex_) in (GettInvoiceCountArry(item))" :key="item_">
                    <el-row>
                        <el-col :span="24">
                            <h5>
                                <span class="mark"></span>
                                <span class="tit">发票{{ idnex_ + 1 }}</span>
                            </h5>
                        </el-col>
                        <el-col :span="24" style="margin-bottom: 16px;">
                            <el-button type="primary" size="mini" @click="AddDetails(item_, item)"
                                style="margin-right:10px">
                                添加行
                            </el-button>
                            <el-button size="mini" @click="delBtn(item, item_)" style="margin-left:0px">删除发票</el-button>
                        </el-col>
                    </el-row>
                    <el-form size="mini">
                        <el-table :data="getinvoice(item_, item.SalesOrderNumber, item)" stripe style="width: 100%"
                            resizable highlight-current-row>

                            <el-table-column align="center" label="行项目" width="80">
                                <template slot-scope="scope">
                                    <el-form-item prop="ProjectNumber">
                                        {{ scope.row.ProjectNumber }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="ElabName" label="品名" width="140">
                                <template slot-scope="scope">
                                    <el-form-item prop="ElabName'">
                                        {{ scope.row.ElabName }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="ElabCode" label="产品号" width="140">
                                <template slot-scope="scope">
                                    <el-form-item prop="'ElabCode'">
                                        {{ scope.row.ElabCode }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="TransactionType" width="100">
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
                            <el-table-column align="center" prop="InvoiceAmount" width="140">
                                <template slot="header" slot-scope="scope">
                                    <span style="color:red">*</span>发票金额
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="InvoiceAmount">
                                        {{ scope.row.InvoiceAmount }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="InvoiceRate" width="100">
                                <template slot="header" slot-scope="scope">
                                    <span style="color:red">*</span>销项税率
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item prop="InvoiceRate">
                                        {{ scope.row.InvoiceRate }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="Num" label="数量" width="100">
                                <template slot-scope="scope">
                                    <el-form-item prop="Num">
                                        {{ scope.row.Num }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="Unit" label="单位" width="130">
                                <template slot-scope="scope">
                                    <el-form-item prop="Unit">
                                        {{ scope.row.Unit }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="InvoicRemarks" label="备注" width="170">
                                <template slot-scope="scope">
                                    <el-form-item prop="InvoicRemarks">
                                        {{ scope.row.InvoicRemarks }}
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="datashuju" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="del(scope.row, item)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-col :span="24" style="margin-top:16px">
                            <span class="tit" style="margin:0;font-weight:600">发票{{ idnex_ + 1 }}关联值税发票</span>
                        </el-col>
                        <AddVatinvoice style="margin-top:16px"
                            :params="{ SalesOrderNumber: item.SalesOrderNumber, InvoiceRecordNumber: item.InvoiceRecordNumber, RecordNo: item_ }">
                        </AddVatinvoice>
                    </el-form>

                </div>
                <div class="btn">
                    <el-button size="mini" @click="goTo">返回</el-button>
                    <el-button type="primary" size="mini" @click="Allbtn" :disabled="Sub">提交申请</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
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

        // this.ObjDretail = JSON.parse(this.$route.query.data);
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
            Consignee:[],
            Sub: false,
            typeList: [],
            DataArry: [],
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

        AddBtn(row, item) {
            console.log(1);
            let SalesOrderNumber = item.InvoiceTitle.SalesOrderNumber;
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
                    var isadd = item.InvoiceItem.filter(c => { return c.DeliveryProjectID == element.DeliveryProjectID })
                    if (isadd.length > 0) {

                        Message.error('项目已经存在')
                        return;
                    }
                    var optional = item.optional.filter(c => { return c.DeliveryProjectID == element.DeliveryProjectID });
                    if (optional.length > 0) {
                        item.optional.Remove(optional[0])
                    }
                    element.InvoiceType = item.InvoiceTitle.InvoiceType;
                    isadd = item.InvoiceItem.filter(c => { return c.Id > 0 })
                    if (isadd.length > 0) {
                        element.InvoiceRecordNumber = isadd[0].InvoiceRecordNumber;
                    }
                    else {
                        element.InvoiceRecordNumber = no;
                    }
                    item.InvoiceItem.push(element)
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
        // 删除发票
        delBtn(row, InvoiceNo) {
            for (let i = row.InvoiceItem.length - 1; i >= 0; i--) {
                var a = row.InvoiceItem[i]
                if (a.InvoiceNo == InvoiceNo) {
                    row.InvoiceItem.Remove(a)
                    var addmodel = JSON.parse(JSON.stringify(a));
                    addmodel.IsDelete = 0;
                    if (!row.optional) {
                        row.optional = [];
                    }
                    var optional = row.optional.filter(c => { return c.DeliveryProjectID == a.DeliveryProjectID });
                    if (optional.length == 0) {
                        row.optional.push(addmodel)
                    }

                }
            }
        },
        // 删除行
        del(row, item) {
           let element=item;
           for (let i =  element.InvoiceItem.length - 1; i >= 0; i--) {
                var a =  element.InvoiceItem[i]
                if (a.DeliveryProjectID == row.DeliveryProjectID) {
                    element.InvoiceItem.splice(i, 1)
                    var addmodel = JSON.parse(JSON.stringify(a));
                    addmodel.IsDelete = 0;
                    if (!element.optional) {
                        element.optional = [];
                    }
                    var optional = element.optional.filter(c => { return c.DeliveryProjectID == row.DeliveryProjectID });
                    if (optional.length == 0) {
                        element.optional.push(addmodel)
                    }
                }
            }

        },
        // 添加行
        AddDetails(no, row) {
            console.log(1);
            let SalesOrderNumber = row.InvoiceTitle.SalesOrderNumber;

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
                    var isadd = arry.optional.filter(c => { return c.DeliveryProjectID == element.DeliveryProjectID })
                    if (isadd.length > 0) {
                        arry.optional.Remove(isadd[0])
                    }
                    element.InvoiceType = arry.InvoiceTitle.InvoiceType;
                   element.InvoiceNo = arry.InvoiceItem[0].InvoiceNo;
                   arry.InvoiceItem.push(element)

                }
            }
            var model = this.$refs.multipleTable.filter(a => { return a.$el.id == SalesOrderNumber })[0]
            model.clearSelection();
            this.Selection([]);
            console.log(this.DataArry)

        },
        GettInvoiceCountArry(row) {

            var arry = new Set();
            //  .InvoiceRecordNumber
            for (let j = 0; j < row.InvoiceItem.length; j++) {
                const item = row.InvoiceItem[j];
                if (item.IsDelete == 0) {
                    arry.add(item.InvoiceNo)
                }
            }
            this.InvoiceCountArry = [...arry];

            return arry;
        },
        getinvoice(InvoiceNo, SalesOrderNumber, row) {
            var arry = [];
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const model = data[index].InvoiceItem.filter(c => c.InvoiceNo == InvoiceNo && c.IsDelete == 0);
                arry.push(...model)
            }

            var TANCount = 0;
            var TADCount = 0;
            row.InvoiceItem.map(a => {
                if (a.TransactionType == "TAD" && a.IsDelete == 0) {
                    TADCount += (Math.round(parseFloat(a.InvoiceAmount) * 100) / 100);
                }
                if (a.TransactionType != "TAD" && a.IsDelete == 0) {
                    TANCount += (Math.round(parseFloat(a.InvoiceAmount) * 100) / 100);
                }
            })
            if (TANCount >= 0) {
                var newtan = ((Math.round(parseFloat(row.Amounts.TANToTAlCount) * 100)) -
                    (Math.round(parseFloat(TANCount) * 100))) / 100;
                this.$set(row.InvoiceTitle, "TANToTAlCount", newtan)
            }
            if (TADCount >= 0) {
                var newtad = ((Math.round(parseFloat(row.Amounts.TADToTAlCount) * 100))
                    - (Math.round(parseFloat(TADCount) * 100))) / 100;
                this.$set(row.InvoiceTitle, "TADToTAlCount", newtad)
            }
            var CurCount = (Math.round(parseFloat(TADCount) * 100) / 100) + (Math.round(parseFloat(TANCount) * 100) / 100);
            this.$set(row.InvoiceTitle, "TotalAmounts", CurCount);
            console.log(row)
            return arry;
        },
        Allbtn: _.debounce(function (e) {
           this.apyDialog.show=true;
        }, 400),
        apyDialogSubmit: _.debounce(function (e) {
            this.Sub = true
            this.submit()
        }, 400),
        async submit() {
            var data = [];
            this.Consignee=[];
            for (let index = 0; index < this.DataArry.length; index++) {
                const model = this.DataArry[index];
                var arry = model.InvoiceItem.filter(a => { return a.IsDelete == 0 });
                if (arry.length != null) {
                    arry.map(d=>{
                        d.InvoiceRecordNumber=model.InvoiceRecordNumber
                    })
                    data.push(...arry)
                }
                this.Consignee.push(model.Consignee);
            }
            this.apyForm.CrmAuth = parseInt(this.apyForm.CrmAuth);
            var param = { user: {}, list: [] }
            param.list = data;
            param.Consignee=this.Consignee;
            param.user = this.apyForm;

            var res = await UpdatarecordData(param);
            if (res.Code == 200) {

                Message.success("操作成功");
                this.$router.go(-1)
            }
            else {
                Message.error(res.Message);

            }

        },
        goTo() {
            this.$router.go(-1)
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
        // 提交申请弹窗
        apyDialogClose() {
            this.Sub = false
            this.apyDialog.show = false
            this.$refs.apyForm.resetFields()
        },
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
    height: 16px;
}

.el-form-item--mini.el-form-item {

    margin-bottom: 20px !important;
}

.container {
    padding: 16px !important;

    .content {
        .text {
            width: 100%;
            font-size: 12px;
            min-height: 60px;
            border-radius: 6px;
            border: none;
            padding: 0 0 16px 0 !important;


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

        //padding-left: 16px !important;
        padding-top: 16px !important;
        padding-bottom: 16px !important;
    }

    .datatable {
        // padding-left: 20px !important;
        // padding-top: 2px !important;
    }

    .btn {
        margin: 16px 0 0 0;
        text-align: center;
    }
}
</style>
