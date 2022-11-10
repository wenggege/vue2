
<template>
    <div v-loading="loading" element-loading-text="数据加载中">
        <div class="container" id="A123d">



            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab_pane" v-for="(item, index) in DataArry" :key="index"
                    :label="item.InvoiceTitle.SAPSalesOrderNumber" :name="String(index)">

                    <div class="content">
                        <div class="text">
                            <el-row>
                                <el-col :span="8">本次开票金额：{{ item.InvoiceTitle.TotalAmounts }}</el-col>
                                <el-col :span="8">币别：{{ item.InvoiceTitle.OrderCurrency }}</el-col>
                                <el-col :span="8">总金额：{{ item.InvoiceTitle.OrderTotalAmount }}</el-col>
                                <el-col :span="8">服务可开票金额(元)：{{ item.InvoiceTitle.TADToTAlCount }}</el-col>
                                <el-col :span="8">已开票金额：{{ item.InvoiceTitle.CompleteAmount }}</el-col>
                                <el-col :span="8">产品可开票金额(元)：{{ item.InvoiceTitle.TANToTAlCount }}</el-col>
                            </el-row>
                        </div>
                        <audit :InvoiceRecordNumber="item.InvoiceRecordNumber"
                            style="padding-left:0px;padding-top: 20px;"></audit>
                        <!-- 客户信息 -->
                        <div class="message">
                            <el-row>
                                <el-col :span="24">
                                    <span class="mark"></span>
                                    <span class="tit">客户信息</span>
                                </el-col>
                            </el-row>
                            <el-row style="font-size:12px">
                                <el-col :span="8">客户名称：{{ item.CustomerModel.Name }}</el-col>
                                <!-- <el-col :span="8">客户产品代码：{{}}</el-col> -->
                                <el-col :span="8">纳税人识别号：{{ item.CustomerModel.Taxpayer_Identification_Number__c }}
                                </el-col>
                                <el-col :span="8">注册地址：{{ item.CustomerModel.Billing_Address__c }}</el-col>
                                <el-col :span="8">开户行名称：{{ item.CustomerModel.Bank_Name__c }}</el-col>
                                <el-col :span="8">银行账号：{{ item.CustomerModel.Bank_Number__c }}</el-col>
                                <el-col :span="8">电话：{{ item.CustomerModel.Phone }}</el-col>
                                <el-col :span="8">IOS：{{ item.CustomerModel.ISO }}</el-col>
                            </el-row>
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
                            <el-form ref="customerForm" :model="item.Consignee" label-width="100px"
                                label-position="left">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="姓名：" prop="CustomerName" :rules="[
                                          { required: true, message: '请输入姓名', trigger: 'blur' },
                                        ]">
                                            <el-input v-model="item.Consignee.CustomerName" placeholder="请输入"
                                                style="width:150px" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="电话：" prop="CustomerPhone" :rules="[
                                          { required: true, message: '请输入电话', trigger: 'blur' },
                                        ]">
                                            <el-input v-model="item.Consignee.CustomerPhone" placeholder="请输入"
                                                style="width:150px" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="所在地区：" prop="CustomerArea" :rules="[
                                          { required: true, message: '请输入所在地区', trigger: 'blur' },
                                        ]">
                                            <el-input v-model="item.Consignee.CustomerArea" placeholder="请输入"
                                                style="width:150px" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="详细地址：" prop="CustomerAdress" :rules="[
                                          { required: true, message: '请输入详细地址', trigger: 'blur' },
                                        ]">
                                            <el-input v-model="item.Consignee.CustomerAdress" placeholder="请输入"
                                                style="width:300px" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                        <!-- 内部信息 -->
                        <div class="message">
                            <el-row>
                                <el-col :span="24">
                                    <span class="mark"></span>
                                    <span class="tit">内部信息</span>
                                </el-col>
                            </el-row>
                            <el-row style="font-size:12px">
                                <el-col :span="8">销售订单号：{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-col>
                                <el-col :span="8">合同号：{{ item.InvoiceTitle.PONumber }}</el-col>
                                <el-col :span="8">开票流程号：{{item.InvoiceRecordNumber}}</el-col>
                                <el-col :span="8">申请开票日期：{{ item.InvoiceTitle.Createtime ?
                                $moment(item.InvoiceTitle.Createtime).format('YYYY-MM-DD') : '' }}</el-col>
                                <el-col :span="8">BD：{{item.InvoiceTitle?.BD}}</el-col>
                                <el-col :span="8">PMM：{{item.InvoiceTitle?.PMM }}</el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="table" v-for="(item_, idnex_) in  (GettInvoiceCountArry(item))" :key="idnex_">
                        <el-row>
                            <el-col :span="24">
                                <span class="mark"></span>
                                <span class="tit">增值税{{item_.TaxType==0?"普通发票":"专用发票"}}{{ idnex_ + 1 }}</span>
                            </el-col>
                            <el-col :span="24" style="margin: 10px 0px;">
                                <!-- <el-button type="primary" size="mini"
                                    @click="AddDetails(item_, item.SalesOrderNumber, item.InvoiceRecordNumber)">
                                    添加行
                                </el-button> -->
                                <el-button size="mini" @click="delBtn(item_, item.SalesOrderNumber)">删除发票</el-button>
                            </el-col>
                        </el-row>
                        <div>
                            <el-form size="mini">
                                <el-table empty-text="暂无数据，可 添加行 进行填写" ref="multipleTable"
                                    :data="getinvoice(item_, item)" stripe style="width: 100%" resizable
                                    highlight-current-row>

                                    <el-table-column align="center" label="行项目" width="180">
                                        <template slot-scope="scope">
                                            <el-form-item prop="ProjectNumber">
                                                <el-input v-model="scope.row.ProjectNumber" size="mini" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="ElabName" label="品名" width="180">
                                        <template slot-scope="scope">
                                            <el-form-item prop="ElabName'">
                                                <el-input v-model="scope.row.ElabName" size="mini" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="ElabCode" label="产品号" width="180">
                                        <template slot-scope="scope">
                                            <el-form-item prop="'ElabCode'">
                                                <el-input v-model="scope.row.ElabCode" size="mini"
                                                    @input="getelab($event,scope.row)" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="TransactionType" width="180">
                                        <template slot="header">
                                            <span style="color:red">*</span> 交易类型
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="TransactionType'">
                                                <el-select v-model="scope.row.TransactionType" size="mini">
                                                    <el-option v-for="a in item.Typelist" :key="a.Key" :label="a.Value"
                                                        :value="a.Key" />
                                                </el-select>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoiceAmount" width="180">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color:red">*</span>发票金额(CNY)
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoiceAmount">
                                                <el-input v-model="scope.row.InvoiceAmount" size="mini" type="number"
                                                    step="0.01" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoiceRate" width="180">
                                        <template slot="header" slot-scope="scope">
                                            <span style="color:red">*</span>销项税率
                                        </template>
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoiceRate">
                                                <el-select v-model="scope.row.InvoiceRate" size="mini">
                                                    <el-option v-for="item in taxList" :key="item.value"
                                                        :label="item.label + '%'" :value="item.value" />
                                                </el-select>
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="Num" label="数量" width="180">
                                        <template slot-scope="scope">
                                            <el-form-item prop="Num">
                                                <el-input v-model="scope.row.Num" size="mini" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="Unit" label="单位" width="180">
                                        <template slot-scope="scope">
                                            <el-form-item prop="Unit">
                                                <el-input v-model="scope.row.Unit" size="mini" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoicRemarks" label="对应工作内容描述" width="180">
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoicRemarks">
                                                <el-input v-model="scope.row.InvoicRemarks" size="mini"
                                                    :disabled="item.InvoiceTitle.InvoiceType == 1" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="InvoicDec" label="发票栏备注" width="180">
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoicDec">
                                                <el-input v-model="scope.row.InvoicDec" size="mini" />
                                            </el-form-item>
                                        </template>
                                    </el-table-column>
                                    <!-- <el-table-column align="center" prop="datashuju" label="操作" width="180">
                                        <template slot-scope="scope">
                                            <el-button type="text" size="mini" @click="del(scope.row, item_, item)">删除
                                            </el-button>
                                        </template>
                                    </el-table-column> -->
                                </el-table>
                            </el-form>
                        </div>

                    </div>

                    <div class="add">
                        <el-button type="primary" @click="AddBtn(item.InvoiceRecordNumber, item.SalesOrderNumber,0)"
                            size="mini">普通发票</el-button>
                        <el-button type="primary" @click="AddBtn(item.InvoiceRecordNumber, item.SalesOrderNumber,1)"
                            size="mini">专用发票</el-button>
                    </div>

                </el-tab-pane>


            </el-tabs>
            <div class="btn">
                <el-button size="mini" @click="goTo">返回</el-button>
                <el-button type="primary" size="mini" @click="Allbtn">提交申请</el-button>
            </div>
        </div>
        <div class="diolog">
            <el-dialog title="提交申请" :visible.sync="dialog" width="30%" :show-close="false"
                :close-on-click-modal="false">
                <div class="content">
                    <div style="width:80px; text-align: right;">BU: </div>
                    <div>
                        <el-select @change="peopleBtn($event)" class="selects" size="mini" v-model="value">
                            <el-option v-for="item in options" :key="item.BuName" :label="item.BuKey"
                                :value="item.BuName"></el-option>
                        </el-select>
                    </div>

                </div>
                <div class="content">
                    <div style="width:80px;text-align: right;">业务审批人:</div>
                    <el-select v-model="DepUserName" placeholder="请选择" class="selects" size="mini"
                        @change="userBtn($event)" clearable filterable :filter-method="get_asslist">
                        <el-option v-for="item in PMOArry" :key="item.BuKey" :value="item.PMO"></el-option>
                    </el-select>

                </div>
                <div class="foot">
                    <el-button @click="hide" size="mini">取消</el-button>
                    <el-button type="primary" @click="okBtn" size="mini" :disabled="Sub">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { gettbaseinfo } from "@/api/negotiationInvoice";
import audit from '../../../components/Audit/auditResult.vue'
import InvoiceModel from "../../../Model/invoiceModel";
import { Message } from 'element-ui'
import _ from 'lodash';
import {
    getRecordInfo,
    Updatarecord,
    UpdatarecordData,
    getRate,
    getelab,
    gettransactionType
} from "@/api/negotiationInvoice";
export default {
    name: "TradeDetail",
    components: { audit },
    created() {

        this.ObjDretail = JSON.parse(this.$route.query.data);
        this.getRecordInfo();
        this.get_Rate();
        this.get_people();
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
            taxList: [],
            ElabList: [],
            typeList: [],
            DataArry: [],
            Consignee: [],
            ApprovalUser: {
                ApprovalUserName: "",
                ApprovalserCode: ""
            },

            dialog: false,
            options: [
                { BuKey: "Pharma", BuName: "白迎军", PMO: '郭敏', "porton": "porton\\min.guo" },
                { BuKey: "AP", BuName: "辛卓群 ", PMO: '辛卓群 ', "porton": "porton\\zhuoqun.xin1" },
                { BuKey: "US", BuName: "吉耀辉", PMO: '刘伟', "porton": "porton\\wei.liu7" },
            ],
            PMOArry: [
                { BuKey: "Pharma", BuName: "白迎军", PMO: '郭敏', "porton": "porton\\min.guo" },
                { BuKey: "AP", BuName: "辛卓群 ", PMO: '刘伟 ', "porton": "porton\\wei.liu7" },
                { BuKey: "US", BuName: "吉耀辉", PMO: '刘伟', "porton": "porton\\wei.liu7" },],
            PMO: "",
            porton: "",
            Sub: false,
            value: "",
            DepUsercode: "",
            DepUserName: "",
            page: {
                pageSize: 100,
                pageIndex: 1,
                query: ""
            }
        };
    },
    methods: {

        AddBtn(InvoiceRecordNumber, SalesOrderNumber, TaxType) {
            var model = JSON.parse(JSON.stringify(InvoiceModel.invoiceModel));
            var no = Math.random().toString(36).substr(2)
            model.InvoiceNo = no;
            model.IsDelete = 0;
            model.TaxType = TaxType;
            model.ProjectNumber = 10;
            model.SalesOrderNumber = SalesOrderNumber;
            model.InvoiceRecordNumber = InvoiceRecordNumber;
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const item = data[index];
                item.InvoiceItem.push(model)
            }

        },
        GettInvoiceCountArry(row) {
            console.log(2)
            var arry = [];
            const model = row;
            //  .InvoiceRecordNumber
            for (let j = 0; j < model.InvoiceItem.length; j++) {
                const item = model.InvoiceItem[j];
                if (item.IsDelete == 0) {
                    var arrymodel = {
                        InvoiceNo: item.InvoiceNo,
                        TaxType: item.TaxType
                    };
                    if (arry.length > 0) {
                        var have = arry.filter(d => d.InvoiceNo == arrymodel.InvoiceNo)
                        if (have.length == 0) {
                            arry.push(arrymodel)
                        }
                    }
                    else {
                        arry.push(arrymodel)
                    }

                }
            }
            console.log(arry)
            return arry;
        },

        // 删除发票
        delBtn(InvoiceNomodel, SalesOrderNumber) {

            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const element = data[index];

                for (let i = element.InvoiceItem.length - 1; i >= 0; i--) {
                    var a = element.InvoiceItem[i]
                    if (a.InvoiceNo == InvoiceNomodel.InvoiceNo) {
                        element.InvoiceItem.splice(i, 1)
                    }
                }

            }
        },
        // 删除行
        del(row, idnex, item) {

            var data = item.InvoiceItem;
            for (let i = data.length - 1; i >= 0; i--) {
                var a = data[i]
                if (a.InvoiceNo == row.InvoiceNo && a.SalesOrderNumber == row.SalesOrderNumber && a.InvoiceItemNumber == row.InvoiceItemNumber) {
                    data.splice(i, 1)
                }
            }
        },
        // 添加行
        AddDetails(InvoiceNomodel, SalesOrderNumber, InvoiceRecordNumber) {


            var model = JSON.parse(JSON.stringify(InvoiceModel.invoiceModel));
            var InvoiceItemNumber = Math.random().toString(36).substr(2)
            model.InvoiceNo = InvoiceNomodel.InvoiceNo;
            model.TaxType = InvoiceNomodel.TaxType;
            model.InvoiceItemNumber = InvoiceItemNumber;
            model.IsDelete = 0;
            model.SalesOrderNumber = SalesOrderNumber;
            model.InvoiceRecordNumber = InvoiceRecordNumber;
            var data = this.DataArry.filter(a => a.SalesOrderNumber == SalesOrderNumber);
            for (let index = 0; index < data.length; index++) {
                const item = data[index];
                model.TransactionType = item.InvoiceItem[0].TransactionType
                var max = item.InvoiceItem.filter(a => a.InvoiceNo == InvoiceNomodel.InvoiceNo).sort((a, b) => { return b.ProjectNumber - a.ProjectNumber })[0];
                var proindex = max.ProjectNumber;
                model.ProjectNumber = parseInt(proindex) + 10;
                item.InvoiceItem.push(model)
            }
        },
        goTo() {
            this.$router.go(-1)
        },
        hide() {
            this.dialog = false;
        },
        userBtn(e) {
            var umodel = this.PMOArry.filter(a => a.PMO == e)[0]
            this.DepUserName = umodel.PMO;
            this.DepUsercode = umodel.porton;
        },
        getinvoice(InvoiceNomodel, row) {

            var arry = [];
            var data = row.InvoiceItem;
            for (let index = 0; index < data.length; index++) {
                const model = data[index];
                if (model.InvoiceNo == InvoiceNomodel.InvoiceNo && model.IsDelete == 0) {
                    arry.push(model)
                }
            }
            var TANCount = 0;
            var TADCount = 0;
            row.InvoiceItem.map(a => {
                if (a.TransactionType == "TAD") {
                    TADCount += (Math.round(parseFloat(a.InvoiceAmount) * 100) / 100);
                }
                else {
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

            return arry;
        },
        Allbtn: _.debounce(function (e) {
            let flag = true
            for (let i = 0; i < this.$refs.customerForm.length; i++) {
                let formObj = this.$refs.customerForm[i]
                formObj.validate((valid) => {
                    if (!valid) {
                        flag = false
                        this.$message.warning('请完善发票收件人信息')
                        return
                    }
                })
            }
            if (flag) {
                // this.submit();
                this.dialog = true;
            }
        }, 400),
        okBtn() {
            this.submit();
        },
        async submit() {
            if (this.DepUserName == "") {
                Message.error("审批人为空");
                return;
            }
            if (this.PMO == "") {

                Message.error("BU为空");
                return;
            }
            var data = [];
            this.Consignee = [];
            for (let index = 0; index < this.DataArry.length; index++) {
                const model = this.DataArry[index];
                var arry = model.InvoiceItem.filter(a => { return a.IsDelete == 0 });
                if (arry.length != null) {
                    data.push(...arry)
                }

                this.Consignee.push(model.Consignee)
            }
            var param = { user: {}, list: [], Consignee: [] }
            param.list = data;
            param.user = {
                ApprovalUserName: this.PMO,
                ApprovalserCode: this.porton,
                DepUserName: this.DepUsercode
            };;
            param.Consignee = this.Consignee;
            var res = await UpdatarecordData(param);
            if (res.Code == 200) {

                Message.success("操作成功");
                this.$router.go(-1)
            }
            else {
                Message.error(res.Message);
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

        peopleBtn(e) {
            var model = this.options.filter(a => a.BuName == e)[0]
            this.PMO = model.PMO;
            this.porton = model.porton;
            var umodel = this.PMOArry.filter(a => a.BuName == e)[0]
            this.DepUserName = umodel.PMO;
            this.DepUsercode = umodel.porton;
        },
        userBtn(e) {
            var umodel = this.PMOArry.filter(a => a.PMO == e)[0]
            this.DepUserName = umodel.PMO;
            this.DepUsercode = umodel.porton;
        },
        pepBtn(e) {
            this.ApprovalUser = e;
        },
        async getRecordInfo() {

            this.loading = true
            var res = await getRecordInfo(this.ObjDretail);
            if (res.Code === 200) {
                this.DataArry = res.Data;
                this.loading = false;
                this.value = res.Data[0]?.InvoiceTitle.NewBU;
                var models = this.options.filter(a => a.BuKey == this.value)[0]
                if (models) {
                    this.PMO = models.PMO
                    this.porton = models.porton
                    console.log(this.porton)
                }

            }
        },
        async get_people() {
            const res = await gettbaseinfo(this.page);
            this.Useroptions = res.Data;
        },
        get_asslist(e) {
            this.page.query = e;
            this.get_people();
        },
        async get_Rate() {
            const res = await getRate();
            const res2 = await gettransactionType();
            this.taxList = [];
            res.Data.forEach(item => {
                this.taxList.push({ label: item.Rate, value: item.Rate });
            });
            this.typeList = res2.Data;
        },
        async getelab(e, row) {
            const res1 = await getelab({ key: e });
            if (res1.Code == "200" && res1.Data) {
                this.ElabList = res1.Data;
                row.ElabName = res1.Data.NameCn
            }

        },
    }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav-wrap {
    //padding-left: 20px !important;
    padding-top: 10px !important;
    //padding-bottom: 10px !important;

}

.spilttab {
    height: 20px;
}

.el-form-item--mini.el-form-item {

    margin-bottom: 20px !important;
}

.container {


    padding: 20px !important;
    overflow-y: hidden;

    .content {
        .text {
            background: #f7f8fa;
            width: 100%;
            font-size: 12px;
            min-height: 60px;
            border-radius: 6px;
            border: none;
            padding: 10px 20px !important;


            .el-col {
                margin: 5px 0;
            }

            .txtname {
                font-size: 16px;
                font-weight: 600;

            }
        }


    }

    .split {
        height: 16px;
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

        padding-left: 0px !important;
        padding-top: 16px !important;
        padding-bottom: 16px !important;
    }

    .table,
    .datatable {
        padding-left: 0px !important;
        padding-top: 20px !important;
    }

    .btn {
        margin: 20px 0px;
        text-align: center;
    }
}

::v-deep.diolog {
    .el-dialog {
        margin-top: 200px !important;
        width: 500px !important;
        height: 250px;
        border-radius: 7px;
    }

    .el-dialog__title {
        font-weight: bold;
        font-size: 14px;
        padding-left: 0px;
    }

    .el-dialog__title:before {
        display: none;
    }

    .content {
        text-align: left;
        margin-bottom: 30px;
        display: flex;
        align-items: center;

        div {
            margin-right: 25px;
        }
    }

    .el-dialog__header {
        padding: 10px 20px;
        margin: 0;
    }

    .selects {

        width: 280px !important;
    }

    .foot {
        text-align: center;
    }
}
</style>
<style>
.select-dropdown {
    max-width: 400px;
}

.select-dropdown .el-select-dropdown__item {
    overflow: visible;
    display: block;
}
</style>
