<template>
  <div class="container" v-loading="loading" element-loading-text="数据加载中">
    <el-alert v-if="!loading" title="新建发票：发票金额同订单金额一致时选择；预付款发票：发票金额与订单金额不一致时选择" type="warning" :closable="false"
      show-icon>
    </el-alert>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in tab" :key="index" :label="item.CustomerModel.Name" :name="String(index)">
        <div class="content">
          <div class="text">
            <el-row>
              <el-col :span="8">本次开票金额：{{ item.InvoiceTitle.CurCount }} </el-col>
              <el-col :span="8">币别：{{ item.InvoiceTitle.OrderCurrency }}</el-col>
              <el-col :span="8">总金额：{{ item.InvoiceTitle.OrderTotalAmount|GetDecimal }}</el-col>
              <el-col :span="8">服务可开票金额(元)：{{ item.InvoiceTitle.TADToTAlCount }}</el-col>
              <el-col :span="8">已开票金额：{{ item.InvoiceTitle.CompleteAmount }}</el-col>
              <el-col :span="8">产品可开票金额(元)：{{ item.InvoiceTitle.TANToTAlCount }}</el-col>
              <el-col :span="8">文件：<span style="color:#1765EC;cursor: pointer;"
                  @click="checkFile(item.InvoiceTitle.SAPSalesOrderNumber,item.InvoiceTitle.SalesOrderNumber)">点击查看</span>
              </el-col>
            </el-row>
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
            <el-row>
              <el-col :span="8">客户名称：{{ item.CustomerModel.Name }}</el-col>
              <!-- <el-col :span="8">客户产品代码：{{}}</el-col> -->
              <el-col :span="8">纳税人识别号：{{ item.CustomerModel.Taxpayer_Identification_Number__c }}</el-col>
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
            <el-form ref="customerForm" :model="item.Consignee" label-width="100px" label-position="left">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="姓名：" prop="CustomerName" :rules="[
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                      ]">
                    <el-input
                      v-model="item.Consignee.CustomerName"
                      placeholder="请输入"
                      style="width:150px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="电话：" prop="CustomerPhone" :rules="[
                        { required: true, message: '请输入电话', trigger: 'blur' },
                      ]">
                    <el-input
                      v-model="item.Consignee.CustomerPhone"
                      placeholder="请输入"
                      style="width:150px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所在地区：" prop="CustomerArea" :rules="[
                        { required: true, message: '请输入所在地区', trigger: 'blur' },
                      ]">
                    <el-input
                      v-model="item.Consignee.CustomerArea"
                      placeholder="请输入"
                      style="width:150px"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="详细地址：" prop="CustomerAdress" :rules="[
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                      ]">
                    <el-input
                      v-model="item.Consignee.CustomerAdress"
                      placeholder="请输入"
                      style="width:300px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
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
            <el-row>
              <el-col :span="8">销售订单号：{{ item.InvoiceTitle.SAPSalesOrderNumber }}</el-col>
              <el-col :span="8">合同号：{{ item.InvoiceTitle.PONumber }}</el-col>
              <el-col :span="8">开票流程号：{{''}}</el-col>
              <el-col :span="8">申请开票日期：{{ item.InvoiceTitle.Createtime ?
              $moment(item.InvoiceTitle.Createtime).format('YYYY-MM-DD') : ''}}</el-col>
              <el-col :span="8">BD：{{item.InvoiceTitle?.BD}}</el-col>
              <el-col :span="8">PMM：{{item.InvoiceTitle?.PMM }}</el-col>
            </el-row>
          </div>
        </div>
        <div class="table" v-for="(item_, idnex_) in item.InvoiceCountArry" :key="idnex_">
          <el-row>
            <el-col :span="24">
              <h5>
                <span class="mark"></span>
                <span class="tit">增值税{{item_.TaxType==0?"普通发票":"专用发票"}}{{ idnex_ + 1 }}</span>
              </h5>
            </el-col>
            <el-col :span="24">
              <!-- <el-button type="primary" size="mini" 
                @click="AddDetails(idnex_, item_, item.InvoiceTitle.SalesOrderNumber)">
                添加行
              </el-button> -->
              <el-button size="mini" @click="delBtn(item_,  item)">删除发票</el-button>
            </el-col>
          </el-row>
          <div>
            <el-form size="mini" ref="resultForm">
              <el-table empty-text="暂无数据，可 添加行 进行填写" ref="multipleTable" :data="getinvoice(item_, item)" stripe
                style="width: 100%" v-loading="searchLoading" resizable highlight-current-row>

                <el-table-column align="center" label="行项目" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="ProjectNumber">
                      <el-input v-model="scope.row.ProjectNumber" size="mini"
                        :disabled="item.InvoiceTitle.InvoiceType == 1" />
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
                      <el-input v-model="scope.row.ElabCode" size="mini" @input="getelab($event,scope.row)" />
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
                        <!-- @change="ChangeTransactionType(scope.row)"> -->
                        <el-option v-for="item in item.Typelist" :key="item.Key" :label="item.Value"
                          :value="item.Key" />
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
                      <el-input v-model="scope.row.InvoiceAmount" size="mini" type="number" step="0.01" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="InvoiceRate" width="180">
                  <template slot="header" slot-scope="scope">
                    <span style="color:red">*</span>销项税率
                  </template>
                  <template slot-scope="scope">
                    <el-form-item prop="InvoiceRate">
                      <el-select v-model="scope.row.InvoiceRate" size="mini"
                        :disabled="item.InvoiceTitle.InvoiceType == 1">
                        <el-option v-for="item in taxList" :key="item.value" :label="item.label + '%'"
                          :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Num" label="数量" width="180">
                  <template slot-scope="scope">
                    <el-form-item prop="Num">
                      <el-input v-model="scope.row.Num" size="mini" :disabled="item.InvoiceTitle.InvoiceType == 1" />
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
                <!-- 
                <el-table-column align="center" prop="datashuju" label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="del(scope.row, idnex_)">删除</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </el-form>
          </div>


        </div>

        <div class="add">

          <el-button type="primary" @click="AddBtn(item,0)" size="mini">添加普通发票</el-button>
          <el-button type="primary" @click="AddBtn(item,1)" size="mini">添加专用发票</el-button>

        </div>
        <div class="btn">
          <el-button size="mini" @click="goTo">取消</el-button>
          <el-button type="primary" size="mini" @click="Allbtn">提交申请</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <AddDatil ref="AddDatil" :DataArry='Subdata' :ObjDretail='ObjDretail' :NewBU="NewBU"></AddDatil>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import AddDatil from "@/components/AddDatil";
import InvoiceModel from "../../../../Model/invoiceModel";
import _ from 'lodash';
import {
  getApplyinfo,
  getRate,
  getsubinvoice,
  getOrdertransactionType,
  getelab,
  gettransactionType
} from "@/api/negotiationInvoice";
export default {
  name: "InvoiceApplicationDetail",
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
      init: 0,
      detailsIndex: "",
      infodata: [],
      NewBU: "",
      InvoiceType: 0,
      ObjDretail: {
        Id: "",
        SalesOrderNumber: "",
        InvoiceType: ""
      },
      tab: [],
      ElabList: [],
      searchLoading: false,
      typeList: [],
      typeArry: [],
      DataArry: [],
      Subdata: [],
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
      }
    };
  },
  methods: {
    // 添加发票
    AddBtn(row, Tax) {
      /* 增值税发票类型：0 增值税普通发票，1增值税专用发票*/
      var no = Math.random().toString(36).substr(2);
      var model = {
        InvoiceNo: no,
        TaxType: Tax
      };
      row.InvoiceCountArry.push(model);

      this.AddDetails(model, row)

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
        const model = this.DataArry[0];
        this.NewBU = model.InvoiceTitle.NewBU;
        this.submit()
      }
    }, 400),
    // 提交申请
    submit() {
      console.log(1);
      var subdata = JSON.parse(JSON.stringify(this.DataArry));

      for (let index = 0; index < subdata.length; index++) {
        const model = subdata[index];
        if (model.InvoiceCountArry.length == 0) {
          Message.error("发票信息不完整");
          return;
        }
        for (let i = model.InvoiceItem.length - 1; i >= 0; i--) {
          var item = model.InvoiceItem[i]
          if (item.IsDelete != 1) {
            model.InvoiceItem.splice(i, 1)
          }
        }
        //Pharma
        // this.NewBU=model.InvoiceTitle.NewBU;

      }
      this.Subdata = subdata;
      console.log(subdata)
      this.$refs.AddDatil.show();

    },
    // 添加行
    AddDetails(invoicemodel, row) {

      var SalesOrderNumber = row.InvoiceTitle.SalesOrderNumber;
      var arry = row.InvoiceItem.filter(a => a.SalesOrderNumber == SalesOrderNumber);
      var oldmodel = arry[0];
      var max = row.InvoiceItem.filter(a => a.SalesOrderNumber == SalesOrderNumber && a.InvoiceNo == invoicemodel.InvoiceNo)
        .sort((a, b) => { return b.ProjectNumber - a.ProjectNumber })[0];
      var proindex = 0
      if (max) {
        proindex = max.ProjectNumber;
      }
      var model = JSON.parse(JSON.stringify(InvoiceModel.invoiceModel));
      model.IsDelete = 1;
      model.InvoiceNo = invoicemodel.InvoiceNo;
      model.TaxType = invoicemodel.TaxType;
      model.SalesOrderNumber = SalesOrderNumber;
      model.ProjectNumber = parseInt(proindex) + 10;
      if (oldmodel) {
        model.TransactionType = "";
        model.Unit = oldmodel.Unit;
      }
      var no = Math.random().toString(36).substr(2)
      model.InvoiceCode = no;
      var datamodel = this.tab.filter(a => a.SalesOrderNumber == SalesOrderNumber);
      row.InvoiceItem.push(model);

    },
    ChangeTransactionType(row) {
      var txt = row.TransactionType == "TAD" ? "次" : "KG"
      row.Unit = txt;
    },
    getinvoice(invoicemodel, row) {
      var data = row.InvoiceItem.filter(a => {
        return a.InvoiceNo == invoicemodel.InvoiceNo;
      });
      var TANCount = 0;
      var TADCount = 0;
      console.log(row)
      var InvoiceItemData = [...row.InvoiceItem];

      InvoiceItemData.map(a => {
        if (a.TransactionType != "") {
          if (a.TransactionType == "TAD" && a.IsDelete == 1) {
            //SurplusAmount InvoiceAmount          
            TADCount += (Math.round(parseFloat(a.InvoiceAmount) * 100) / 100);
          }
          if (a.TransactionType != "TAD" && a.IsDelete == 1) {
            TANCount += (Math.round(parseFloat(a.InvoiceAmount) * 100) / 100);
          }
        }
      })
      var TANCounts = 0;//服务金额
      var TADCounts = 0;//产品金额
      if (TANCount >= 0) {

        var newtan = ((Math.round(parseFloat(row.Amounts.TANToTAlCount) * 100)) - (Math.round(parseFloat(TANCount) * 100))) / 100;
        this.$set(row.InvoiceTitle, "TANToTAlCount", newtan)
      }
      if (TADCount >= 0) {
        var newtad = ((Math.round(parseFloat(row.Amounts.TADToTAlCount) * 100)) - (Math.round(parseFloat(TADCount) * 100))) / 100;
        this.$set(row.InvoiceTitle, "TADToTAlCount", newtad)
      }
      var CurCount = (Math.round(parseFloat(TADCount) * 100) / 100) + (Math.round(parseFloat(TANCount) * 100) / 100);
      this.$set(row.InvoiceTitle, "CurCount", CurCount)
      // this.getOrdertransactionType(row.InvoiceTitle.OrderInfoId, row.InvoiceTitle.SalesOrderNumber)
      return data;
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
    delBtn(idata, rowdata) {

      var row = rowdata.InvoiceCountArry;
      row.some((item, i) => {
        if (item == idata) {
          row.splice(i, 1)
        }
      })
      for (let i = this.InvoiceItemData.length - 1; i >= 0; i--) {
        var item = this.InvoiceItemData[i]
        if (item.InvoiceNo == idata.InvoiceNo) {
          this.InvoiceItemData.splice(i, 1)
        }
      }
      for (let i = rowdata.InvoiceItem.length - 1; i >= 0; i--) {
        var item = rowdata.InvoiceItem[i]
        if (item.InvoiceNo == idata.InvoiceNo && item.IsDelete == 1) {
          rowdata.InvoiceItem.splice(i, 1)
        }
      }

      this.getinvoice(idata, rowdata)
    },
    // 删除行
    del(row, e) {

      this.InvoiceItemData.some((item, i) => {
        if (item.InvoiceCode === row.InvoiceCode && item.InvoiceNo == row.InvoiceNo) {
          this.InvoiceItemData.splice(i, 1)
        }
      })

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
            that.loading = false
            that.tab = res.data;
            this.DataArry = res.data;
            for (let i = 0; i < res.data.length; i++) {
              this.InvoiceType = res.data[i].InvoiceTitle.InvoiceType;
              that.InvoiceItemData.push(...res.data[i].InvoiceItem)
              res.data[i].InvoiceCountArry = []

            }
            for (let i = 0; i < that.InvoiceItemData.length; i++) {
              var no = Math.random().toString(36).substr(2);
              that.InvoiceItemData[i].Select = 0;
              that.InvoiceItemData[i].InvoiceCode = no;
            }

          }
        })
        .finally(() => { });
    },
    async get_Rate() {
      const res = await getRate();
      this.taxList = [];
      res.Data.forEach(item => {
        this.taxList.push({ label: item.Rate, value: item.Rate });
      });
    },
    async getelab(e, row) {
      const res1 = await getelab({ key: e });
      if (res1.Code == "200" && res1.Data) {
        this.ElabList = res1.Data;
        row.ElabName = res1.Data.NameCn
      }

    },
    async getOrdertransactionType(orderid, SalesOrderNumber) {

      const res2 = await getOrdertransactionType({ OrderInfoID: orderid });

      if (res2.Code == 200) {
        var arry = this.typeArry.filter(a => { return a.SalesOrderNumber == SalesOrderNumber })[0];
        if (arry && arry.length > 0) {
          arry.data = res2.Data;
        }
        else {
          var model = {
            data: res2.Data,
            SalesOrderNumber: SalesOrderNumber
          }
          this.GettypeList(model)
          this.typeArry.push(model)
        }
        this.typeList = res2.Data;
      }

    },
    async GettypeList(item) {

      var arry = this.typeArry.filter(a => { return a.SalesOrderNumber == item.SalesOrderNumber })[0];
      if (arry && arry.length > 0) {

        return arry.data;
      }
    },
    goTo() {
      this.$router.go(-1);
    },
    //查看文件
    checkFile(SAPSalesOrderNumber, SalesOrderNumber) {
      let obj = {
        SAPSalesOrderNumber: SAPSalesOrderNumber,
        uploadShow: false
      }
      this.$router.push({ path: `../fileList/${SalesOrderNumber}-show`, query: { data: JSON.stringify(obj) } })
    },

  },
  filters: {
    GetDecimal: function (a) {
      return a.toFixed(2);
    }

  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px !important;
  //overflow-y: hidden;

  .content {
    .text {
      width: 100%;
      background: #f7f8fa;
      min-height: 60px;
      padding: 10px;
      font-size: 12px;

      .el-col {
        margin: 5px 0;
      }
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
    font-size: 12px;

    .el-col {
      margin: 5px 0;
    }
  }

  .add {
    margin: 10px 0;
  }

  .btn {
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
