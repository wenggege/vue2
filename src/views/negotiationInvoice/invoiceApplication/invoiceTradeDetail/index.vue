<template>
    <div v-loading="loading" element-loading-text="数据加载中">
        <div class="container" id="A123">


            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab_pane" v-for="(item, index) in tab" :key="index" :label="item.CustomerModel.Name"
                    :name="String(index)">
                    <div class="content">
                        <!-- <div class="text">
                        <el-row>

                            <el-col :span="8">本次开票金额：{{ item.InvoiceTitle.CompleteAmount
                            }}</el-col>
                            <el-col :span="8">币别：{{ item.InvoiceTitle.OrderCurrency }}</el-col>
                            <el-col :span="8">总金额：{{ item.InvoiceTitle.OrderTotalAmount }}</el-col>
                            <el-col :span="8">服务可开票金额(元)：{{ item.InvoiceTitle.OrderTotalAmount-item.InvoiceTitle.CompleteAmount }}</el-col>
                            <el-col :span="8">已开票金额：{{ item.InvoiceTitle.CompleteAmount }}</el-col>
                            <el-col :span="8">产品可开票金额(元)：{{item.InvoiceTitle.SurplusAmount  }}</el-col>
                        </el-row>
                    </div> -->
                        <div class="text">
                            <el-row>
                                <el-col class="txtname" style="margin: 0"><img :src="companyIcon"
                                        style="margin-right: 8px" />{{ item.CustomerModel["Name"] }}</el-col>
                            </el-row>
                            <el-descriptions :column="5">
                                <el-descriptions-item label="客户名称">{{ item.CustomerModel.Name}}</el-descriptions-item>
                                <el-descriptions-item label="订单">{{ item.InvoiceTitle.SAPSalesOrderNumber }}
                                </el-descriptions-item>
                                <el-descriptions-item label="ISO">{{ item.CustomerModel.ISO }}</el-descriptions-item>
                            </el-descriptions>
                            <!-- <el-row>
                                <el-col :span="5">客户名称：{{ item.CustomerModel.Name }}</el-col>
                                <el-col :span="4">订单：{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-col>
                                <el-col :span="3">ISO:{{ item.CustomerModel.ISO }}</el-col>

                            </el-row> -->
                        </div>
                        <div class="split"></div>
                    </div>
                    <div style="margin-top:16px">
                        <el-form ref="customerForm" :model="item.Consignee" label-width="200px" label-position="left">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="客户接收及抄送email地址：" style="margin-bottom:0">
                                        <el-input v-model="item.Consignee.CustomerEmail" placeholder="请输入"
                                            style="width:600px" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div class="add">
                        <el-button type="primary" @click="AddBtn(InvoiceCountArry, item.InvoiceTitle.SalesOrderNumber)"
                            size="mini">新建发票</el-button>
                        <el-button type="primary"
                            @click="AddAdvance(InvoiceCountArry,item.InvoiceTitle.SalesOrderNumber)" size="mini">
                            预付款发票</el-button>
                    </div>

                    <div class="datatable">

                        <div>
                            <el-form size="mini" :model="resultForm" :rules="resultForm.resultRuls">
                                <el-table empty-text="暂无数据，可 添加行 进行填写" ref="multipleTable"
                                    :id="item.InvoiceTitle.SalesOrderNumber"
                                    :data="GetItemSources(item.InvoiceItem, item.InvoiceTitle.SalesOrderNumber)"
                                    @select="Selection" @select-all="Selection" stripe style="width: 100%"
                                    v-loading="searchLoading" resizable highlight-current-row>

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
                                    <el-table-column align="center" prop="InvoiceAmount" minWidth="140">
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
                                    <!-- <el-table-column align="center" prop="InvoicRemarks" label="对应工作内容描述"
                                        minWidth="120">
                                        <template slot-scope="scope">
                                            <el-form-item prop="InvoicRemarks">
                                                {{ scope.row.InvoicRemarks }}
                                            </el-form-item>
                                        </template>
                                    </el-table-column> -->
                                    <el-table-column align="center" prop="datashuju" label="操作" minWidth="120">
                                        <template slot-scope="scope">

                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form>
                        </div>

                    </div>
                    <!-- <div class="spilttab"></div> -->
                    <div class="table"
                        v-for="(item_, idnex_) in (GettInvoiceCountArry(item.InvoiceTitle.SalesOrderNumber))"
                        :key="item_.InvoiceNo">
                        <el-row>
                            <el-col :span="24">
                                <h5>
                                    <span class="mark"></span>
                                    <span class="tit">发票{{ idnex_ + 1 }}</span>
                                </h5>
                            </el-col>
                            <el-col :span="24" style="margin-bottom: 16px;">
                                <el-button type="primary" size="mini" v-show="false" @click="AddDetails()">
                                    添加行
                                </el-button>
                                <el-button size="mini" @click="delBtn(item.InvoiceTitle.SalesOrderNumber, item_)"
                                    style="margin-left:0px">删除发票</el-button>
                            </el-col>
                        </el-row>
                        <el-form size="mini">
                            <el-table :model="resultForm" :rules="resultForm.resultRuls" ref="resultForm"
                                :data="getinvoice(item_.InvoiceNo)" stripe style="width: 100%" v-loading="searchLoading"
                                resizable highlight-current-row>

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
                                            <el-select v-model="scope.row.ElabName" size="mini"
                                                popper-class="select-dropdown">
                                                <el-option v-for="item in ElabList" :key="item.cno" :label="item.nameCn"
                                                    :value="item.cno" />
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="ElabCode" label="产品号" minWidth="130">
                                    <template slot-scope="scope">
                                        <el-form-item prop="'ElabCode'">
                                            <el-input v-model="scope.row.ElabCode" size="mini" />
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="TransactionType" minWidth="130">
                                    <template slot="header">
                                        <span style="color:red">*</span> 交易类型
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item prop="TransactionType'">
                                            <el-select v-model="scope.row.TransactionType" size="mini">
                                                <el-option v-for="item in typeList" :key="item.Key" :label="item.Value"
                                                    :value="item.Key" />
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="InvoiceAmount" minWidth="130">
                                    <template slot="header" slot-scope="scope">
                                        <span style="color:red">*</span>发票金额
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item prop="InvoiceAmount">
                                            <el-input v-model="scope.row.InvoiceAmount" size="mini" type="number"
                                                step="0.01" />
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="InvoiceRate" minWidth="130">
                                    <template slot="header" slot-scope="scope">
                                        <span style="color:red">*</span>销项税率
                                    </template>
                                    <template slot-scope="scope">
                                        <el-form-item prop="InvoiceRate">
                                            <!-- <el-input v-model="scope.row.InvoiceRate" size="mini" /> -->
                                            <el-select v-model="scope.row.InvoiceRate" size="mini">
                                                <el-option v-for="item in taxList" :key="item.value"
                                                    :label="item.label + '%'" :value="item.value" />
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="Num" label="数量" minWidth="120">
                                    <template slot-scope="scope">
                                        <el-form-item prop="Num">
                                            <el-input v-model="scope.row.Num" size="mini" />
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="Unit" label="单位" minWidth="120">
                                    <template slot-scope="scope">
                                        <el-form-item prop="Unit">
                                            <el-input v-model="scope.row.Unit" size="mini" />
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="InvoicRemarks" label="对应工作内容描述" minWidth="120">
                                    <template slot-scope="scope">
                                        <el-form-item prop="InvoicRemarks">
                                            <el-input v-model="scope.row.InvoicRemarks" size="mini" />
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="datashuju" label="操作" minWidth="120">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="mini" @click="del(scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                    </div>


                    <div class="btn">
                        <el-button size="mini" @click="hide">取消</el-button>
                        <el-button type="primary" size="mini" @click="Allbtn" :disabled="Sub">提交申请</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <AddDatil ref="AddDatil" :DataArry='DataArry' :ObjDretail='ObjDretail'></AddDatil>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import AddDatil from "@/components/AddDatil";
import InvoiceModel from "../../../../Model/invoiceModel";

import {
    getApplyinfo,
    getRate,
    getsubinvoice,
    getelab,
    gettransactionType
} from "@/api/negotiationInvoice";
import { json } from 'body-parser';
import _ from 'lodash';
export default {
    name: "invoiceTradeDetail",
    components: { AddDatil },
    created() {
        var id = this.$route.params.Id;
        if (id) {
            this.infodata.push({
                Id: this.$route.params.Id,
                SalesOrderNumber: this.$route.query.SalesOrderNumber,
                InvoiceType: this.$route.query.InvoiceType
            });
        }
        if (id == "undefined") {
            this.infodata = JSON.parse(this.$route.query.data).data;
        }
        this.ObjDretail = { ...this.infodata[0] };
        this.get_Applyinfo();
        this.get_Rate();
    },
    data() {
        return {
            loading: true,
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
            copyData: [],
            Sub: false,
            companyIcon: require("@imgs/svg-icons/companyIcon.svg"),
        };
    },
    methods: {

        AddAdvance(row, SalesOrderNumber) {

            var Advance = this.ItemData.filter(a => { return a.Advance == 1 && a.SalesOrderNumber == SalesOrderNumber });
            if (Advance.length > 0) {
                Message.error('预付款已经存在，请编辑')
                return;
            }
            var model = JSON.parse(JSON.stringify(InvoiceModel.invoiceModel));
            var no = Math.random().toString(36).substr(2)
            var rowmodel = { SalesOrderNumber: SalesOrderNumber, InvoiceNo: no };
            model.Advance = 1;
            model.InvoiceNo = no;
            model.ProjectNumber = 10,
                model.SalesOrderNumber = SalesOrderNumber;
            row.push(rowmodel);
            this.ItemData.push(model)

        },
        // 添加发票
        AddBtn(row, SalesOrderNumber) {

            var isadd = this.SelectArry.length;
            if (isadd <= 0) {
                Message.error('请选择项目')
                return;
            }
            console.log(3)
            var msg = 0;
            var no = Math.random().toString(36).substr(2)
            var rowmodel = { SalesOrderNumber: SalesOrderNumber, InvoiceNo: no };
            var CompleteAmount = 0.00;
            for (let index = 0; index < this.SelectArry.length; index++) {
                const element = this.SelectArry[index];
                var arry = this.ItemData.filter(a => {
                    return a.DeliveryProjectID == element.DeliveryProjectID && a.SalesOrderNumber == element.SalesOrderNumber
                })
                if (arry.length > 0) {
                    Message.error('请勾选未选择项目')
                    return;
                }
                CompleteAmount += element.InvoiceAmount;
                element.InvoiceNo = no;
                element.SalesOrderNumber = SalesOrderNumber;
            }
            var model = this.$refs.multipleTable.filter(a => { return a.$el.id == SalesOrderNumber })[0]
            model.clearSelection();
            row.push(rowmodel);

            this.ItemData.push(...(JSON.parse(JSON.stringify(this.SelectArry))))
            this.Selection([]);
            var saledata = this.tab.filter(a => { return a["InvoiceTitle"].SalesOrderNumber == SalesOrderNumber })
            if (saledata) {
                saledata[0]["InvoiceTitle"].CompleteAmount = CompleteAmount;
            }


        },

        /*获取所有 */
        GetItemSources(row, SalesOrderNumber) {
            console.log(1);
            var data = row.filter(a => { return a.SalesOrderNumber == SalesOrderNumber });

            return data
        },
        /*获取所有 */
        Selection(selection) {

            this.SelectArry = selection
        },
        Allbtn: _.debounce(function (e) {
            this.submit()
        }, 400),

        // 提交申请
        async submit() {
            this.Sub = true;
            var isadd = this.InvoiceCountArry.length;
            if (isadd <= 0) {
                this.Sub = false;
                Message.error('请添加发票')
                return;
            }

            for (let index = 0; index < this.DataArry.length; index++) {
                const model = this.DataArry[index];
                var Consignee=model.Consignee;
                if (!Consignee || !Consignee.CustomerEmail) {
                    this.Sub = false;
                    Message.error("请完善" + model.CustomerModel.Name + '邮件信息')
                    return;
                }
                var countarry = this.InvoiceCountArry.filter(a => { return a.SalesOrderNumber == model.InvoiceTitle.SalesOrderNumber })
                if (!countarry || countarry.length == 0) {
                    this.Sub = false;
                    Message.error("请完善" + model.CustomerModel.Name + '发票信息')
                    return;
                }                
            }

            for (let index = 0; index < this.DataArry.length; index++) {
                const model = this.DataArry[index];
                var Consignee=model.Consignee;
                if (!Consignee || !Consignee.CustomerEmail) {
                    this.Sub = false;
                    Message.error("请完善" + model.CustomerModel.Name + '邮件信息')
                    return;
                }
                var countarry = this.InvoiceCountArry.filter(a => { return a.SalesOrderNumber == model.InvoiceTitle.SalesOrderNumber })
                if (!countarry || countarry.length == 0) {
                    this.Sub = false;
                    Message.error("请完善" + model.CustomerModel.Name + '发票信息')
                    return;
                }
                model.InvoiceItem = [];
                for (let j = 0; j < countarry.length; j++) {
                    var arry = this.ItemData.filter(a => {
                        return a.InvoiceNo == countarry[j].InvoiceNo && a.SalesOrderNumber == countarry[j].SalesOrderNumber
                    })
                    model.InvoiceItem.push(...arry);
                }
                model.InvoiceItem.map(a => {

                    a.InvoiceAmount = parseFloat(a.InvoiceAmount)
                })
                model.ApprovalUser = {
                    ApprovalUserName: "this.PMO",
                    ApprovalserCode: "this.PMO",
                };
            }

            // this.DataArry.some((a, i) => {
            //     if (a.InvoiceItem.length == 0) {
            //         this.DataArry.splice(i, 1)
            //     }
            // })

            console.log(this.DataArry)
            const res = await getsubinvoice(this.DataArry);
            if (res.Code == 200) {

                Message.success("操作成功");
                this.$router.go(-1)
            }
            else {
                this.$confirm(res.Message, '确认', {
                    confirmButtonText: '确定',                  
                    type: 'warning'
                }).then(() => {
                    this.$router.go(0)
                }).catch(() => { this.$router.go(0) })
                this.Sub = false;               
            }
        },
        // 添加行
        AddDetails(i, invoiceno) {


        },
        GettInvoiceCountArry(SalesOrderNumber) {

            var data = this.InvoiceCountArry.filter(a => {
                return a.SalesOrderNumber == SalesOrderNumber;
            });
            return data;
        },
        getinvoice(invoiceno) {
            // this.copyData = JSON.parse(JSON.stringify(this.ItemData))
            // this.copyData.push(...this.ItemData)
            //  console.log(this.ItemData)

            var data = this.ItemData.filter(a => {
                return a.InvoiceNo == invoiceno;
            });


            return data;
        },
        hide() {

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
        // 删除发票
        delBtn(SalesOrderNumber, item_) {
            console.log(item_)
            this.InvoiceCountArry.some((a, i) => {
                if (a.SalesOrderNumber == SalesOrderNumber && a.InvoiceNo == item_.InvoiceNo) {
                    this.InvoiceCountArry.splice(i, 1)
                }
            })
            // this.ItemData.some((item, i) => {
            //     if (item.SalesOrderNumber == SalesOrderNumber && item.InvoiceNo == item_.InvoiceNo) {
            //         this.ItemData.splice(i, 1)
            //     }                
            // })

            for (let i = this.ItemData.length - 1; i >= 0; i--) {
                var item = this.ItemData[i]
                if (item.SalesOrderNumber == SalesOrderNumber && item.InvoiceNo == item_.InvoiceNo) {

                    this.ItemData.splice(i, 1)
                }
            }
        },
        // 删除行
        del(row) {

            for (let i = this.ItemData.length - 1; i >= 0; i--) {
                var item = this.ItemData[i]
                if (item.SalesOrderNumber == row.SalesOrderNumber && item.InvoiceNo == row.InvoiceNo && item.ProjectNumber == row.ProjectNumber) {

                    this.ItemData.splice(i, 1)
                }
            }
            // this.ItemData.some((item, i) => {
            //     if (item.SalesOrderNumber == row.SalesOrderNumber && item.InvoiceNo == row.InvoiceNo) {
            //         this.ItemData.splice(i, 1)
            //     }
            // })

            var data = this.ItemData.filter(item => { return item.SalesOrderNumber == row.SalesOrderNumber && item.InvoiceNo == row.InvoiceNo })
            if (data.length == 0) {
                this.delBtn(row.SalesOrderNumber, row)
            }
            // var saledata = this.tab.filter(a => { return a["InvoiceTitle"].SalesOrderNumber == row.SalesOrderNumber })
            // if (saledata) {
            //     saledata[0]["InvoiceTitle"].CompleteAmount -= row.InvoiceAmount;
            // }
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
                        this.tab = res.data;
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
    },

    filters: {
        GetDecimal: function (a) {
            return a.toFixed(2);
        }

    }
};
</script>

<style lang="scss" scoped>
.app-main>* {
    padding: 16px;
}

// .container {
//     padding: 16px !important;
// }
::v-deep .el-tabs__nav-wrap {
    //padding-left: 20px !important;
    //padding-top: 10px !important;
    //padding-bottom: 10px !important;

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

    .companyIcon {
        width: 32px;
        height: 32px;
        margin-right: 8px;
        //background-image:url('./imgs/companyIcon.png');
        background-repeat: no-repeat;
    }
}

.spilttab {
    height: 20px;
}

.el-form-item--mini.el-form-item {

    margin-bottom: 0px !important;
}

.container {


    padding: 0px !important;
    overflow-y: hidden;

    .content {
        .text {
            width: 100%;
            font-size: 12px;
            min-height: 60px;
            padding-left: 16px !important;
            background-color: #F7F8FA;

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
        //padding-left: 20px !important;
        padding-top: 2px !important;
    }

    .btn {
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

h5 {
    margin: 0;
    padding: 16px 0;
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
