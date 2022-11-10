<template>
  <div class="container" v-loading="loading" element-loading-text="数据加载中">
    <div>
      <el-descriptions>
        <el-descriptions-item label="币别">{{ cashInfoForm.OrderCurrency }}</el-descriptions-item>
        <el-descriptions-item label="总金额(元)">{{ cashInfoForm.OrderTotalAmount }}</el-descriptions-item>
        <el-descriptions-item label="本次开票金额(元)">{{ cashInfoForm.TheTotalAmount }}</el-descriptions-item>
        <el-descriptions-item label="已开票金额(元)">{{ cashInfoForm.CompleteAmount }}</el-descriptions-item>
        <el-descriptions-item label="剩余开票金额(元)">{{ cashInfoForm.SurplusAmount }}</el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <!-- <span style="color:red">*</span> -->
            文件
          </template>
          <span style="color:#1765EC;cursor: pointer;" @click="checkFile">{{ cashInfoForm.file }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="split_line"></div>
    <!-- <field-set title='冲销原因' :borderBottom="false">
      <div class="reason"><span>{{ reason }}</span></div>
    </field-set> -->
    <field-set title='客户信息' :borderBottom="false">
      <el-descriptions>
        <el-descriptions-item label="客户名称">{{ customInfoForm.Name }}</el-descriptions-item>
        <el-descriptions-item label="纳税人识别码">{{ customInfoForm.Taxpayer_Identification_Number__c }}
        </el-descriptions-item>
        <el-descriptions-item label="注册地址">{{ customInfoForm.Billing_Address__c }}</el-descriptions-item>
        <el-descriptions-item label="开户行名称">{{ customInfoForm.Bank_Name__c }}</el-descriptions-item>
        <el-descriptions-item label="银行账户">{{ customInfoForm.Bank_Number__c }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ customInfoForm.Phone }}</el-descriptions-item>
        <el-descriptions-item label="ISO">{{ customInfoForm.ISO }}</el-descriptions-item>
      </el-descriptions>
    </field-set>
    <field-set title='内部信息' :borderBottom="false">
      <el-descriptions>
        <el-descriptions-item label="销售订单号">{{ cashInfoForm.SAPSalesOrderNumber }}</el-descriptions-item>
        <el-descriptions-item label="PO">{{ cashInfoForm.PONumber }}
        </el-descriptions-item>
        <el-descriptions-item label="开票流程号">{{ ''}}</el-descriptions-item>
        <el-descriptions-item label="申请开票日期">{{ cashInfoForm.Createtime ? $moment(cashInfoForm.Createtime).format('YYYY-MM-DD') : '' }}</el-descriptions-item>
        <el-descriptions-item label="BD">{{ cashInfoForm?.BD }}
        </el-descriptions-item>
        <el-descriptions-item label="PMM">{{ cashInfoForm?.PMM }}
        </el-descriptions-item>
      </el-descriptions>
    </field-set>
    <field-set title='发票' :borderBottom="false">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="mini" @click="addRow">
            添加行
          </el-button>
        </el-col>
      </el-row>
      <div style="margin-top:10px">
        <el-form ref="applyForm" :model="applyForm" :rules="applyRules">
          <el-table :data="applyForm.applyDataList" stripe>
            <el-table-column label="描述">
              <template slot-scope="scope">
                <el-form-item :prop="'applyDataList.' + scope.$index + '.InvoicRemarks'"
                  :rules="applyRules.InvoicRemarks">
                  <el-input v-model="scope.row.InvoicRemarks" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot="header">
                <span style="color:red">*</span> 交易类型
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="'applyDataList.' + scope.$index + '.TransactionType'"
                  :rules="applyRules.TransactionType">
                  <el-select v-model="scope.row.TransactionType" placeholder="请选择交易类型"
                    @change="transactionTypeChange(scope.row)">
                    <el-option v-for="item in typeList" :key="item.Key" :label="item.Value" :value="item.Key" />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="数量">
              <template slot-scope="scope">
                <el-form-item :prop="'applyDataList.' + scope.$index + '.Num'" :rules="applyRules.Num">
                  <el-input v-model="scope.row.Num" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="单位">
              <template slot-scope="scope">
                <el-form-item :prop="'applyDataList.' + scope.$index + '.Unit'" :rules="applyRules.Unit">
                  <el-input v-model="scope.row.Unit" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot="header">
                <span style="color:red">*</span> 冲销金额(元)
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="'applyDataList.' + scope.$index + '.InvoiceAmount'"
                  :rules="applyRules.InvoiceAmount">
                  <el-input v-model="scope.row.InvoiceAmount" type="number"  placeholder="请输入" @change="invoiceAmountChange" />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100px" align="center">
              <template slot-scope="scope">
                <el-form-item>
                  <el-button type="text" size="mini" @click="deleteRows(scope.row, scope.$index)">删除</el-button>
                </el-form-item>
              </template>
            </el-table-column>

          </el-table>
        </el-form>

      </div>
      <div class="btn">
        <el-button size="mini" @click="back">取消</el-button>
        <el-button type="primary" size="mini" @click="Allbtn">提交申请</el-button>
      </div>
    </field-set>

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
          <el-button size="mini" @click="apyDialogClose" style="margin-right: 10px;margin: 0px;">取消</el-button>
          <el-button type="primary" size="mini" @click="apyDialogSubmit"  :disabled="Sub">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 查看文件 -->
    <fileList v-model="fileDialog.visible" :SalesOrderNumber="ObjDretail.SalesOrderNumber"></fileList>
  </div>
</template>
<script>
import {
  getApplyinfo,
  gettransactionType,
  getsubinvoice,
  getAudit
} from "@/api/negotiationInvoice";
import InvoiceModel from "../../../../Model/invoiceModel";
import fileList from "./fileList";
import _ from 'lodash';
export default {
  name: "sterilisation",
  components: { fileList },
  data() {
    // 检验冲销金额
    const checkAmount = (rule, value, callback) => {     
      if (!value) {
        return callback(new Error('请输入正确的冲销金额'))
      }
      let reg = /(0|[1-9]\d*)(\.\d)?/
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的冲销金额'))
      }
      var v = 0;

			this.applyForm.applyDataList.map(d => {
				d.InvoiceAmount = -Math.abs(parseFloat(d.InvoiceAmount));
				var InvoiceAmount = d.InvoiceAmount;
				v += (Math.abs(parseFloat(InvoiceAmount) * 100))
			});
			v = v / 100.00
			console.log(v)
			if (v > this.CompleteAmount) {
				return callback(new Error('冲销金额不能大于已开票金额'))
			}
      callback()
    }
    return {
      loading: true,
      Sub:false,
      CompleteAmount: 0,
      SurplusAmount: 0,
      SAPSalesOrderNumber: '', // 订单号
      cashInfoForm: {
        OrderCurrency: '',
        OrderTotalAmount: '',
        CompleteAmount: '',
        SurplusAmount: '',
        TheTotalAmount: 0,
        file: '点击查看'
      },
      cashInfoFormRules: {
        file: [{ required: true }],
      },
      reason: '这里是冲销原因',
      customInfoForm: {
        Name: '',
        Taxpayer_Identification_Number__c: '',
        Billing_Address__c: '',
        Bank_Name__c: '',
        Bank_Number__c: '',
        Phone: '',
        ISO: ''
      },
      searchParams: [],

      applyForm: {
        applyDataList: []
      },
      applyRules: {
        TransactionType: [{ required: true, message: '请选择交易类型', trigger: 'change' }],
        InvoiceAmount: [{ validator: checkAmount, trigger: 'blur' }]
      },
      typeList: [],
      ObjDretail: {
        Id: "",
        SalesOrderNumber: "",
        InvoiceType: ""
      },
      DataArry: [],
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
      copyList: [],
      fileDialog: {
        visible: false,
      },
      InvoiceRecordNumber: '',
    }
  },
  created() {
    //this.getTypeList()
    //this.getAudit()
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.Id !== '') {
          if (route.query.data) {
            const arr = JSON.parse(route.query.data)
            this.searchParams = arr
            this.ObjDretail = { ...arr[0] };
          }
          this.getApplyinfo()
        }
      },
      immediate: true
    }
  },
  methods: {
    getApplyinfo() {
      this.loading = true
      getApplyinfo(this.searchParams).then((res) => {
        if (res?.Code === 200) {
          this.loading = false
          this.DataArry = res.data;
          this.customInfoForm = res.data[0].CustomerModel || {}
          this.cashInfoForm = Object.assign(this.cashInfoForm, res.data[0].InvoiceTitle || {})
          this.CompleteAmount = res.data[0].InvoiceTitle?.CompleteAmount
          this.SurplusAmount = res.data[0].InvoiceTitle?.SurplusAmount
          this.SAPSalesOrderNumber = res.data[0].InvoiceTitle?.SAPSalesOrderNumber
          this.InvoiceRecordNumber = res.data[0].InvoiceItem[0].InvoiceRecordNumber || ''
          this.copyList = res.data[0].InvoiceItem || []
          this.getTheTotalAmount(this.applyForm.applyDataList)
          this.typeList = res.data[0].Typelist || []
        }
      })
    },
    async getTypeList() {
      const res = await gettransactionType();
      if (res.Code === 200) {
        this.typeList = res.Data || []
      }
    },
    //查看文件
    checkFile() {
      //this.fileDialog.visible = true
      let obj = {
        SAPSalesOrderNumber: this.SAPSalesOrderNumber,
        uploadShow: false
      }
      this.$router.push({ path: `../fileList/${this.ObjDretail.SalesOrderNumber}-show`, query: { data: JSON.stringify(obj) } })
    },
    // 添加行
    addRow() {
      var model = JSON.parse(JSON.stringify(InvoiceModel.invoiceModel));
      model.InvoiceNo = '100';
      model.ProjectNumber = 0;
      var no = Math.random().toString(36).substr(2)
      model.InvoiceCode = no;
      model.TransactionType = this.typeList.length > 0 ? this.typeList[0].Key : ''
      model.Unit = model.TransactionType === "TAD" ? "次" : "KG"
      this.applyForm.applyDataList.push(model);
      this.getTheTotalAmount(this.applyForm.applyDataList)
    },

    // 提交申请
    Allbtn: _.debounce(function (e) {
      this.submit()
    }, 400),

    submit() {
      if (!this.applyForm.applyDataList.length) {
        this.$message.warning('请先添加行')
        return
      }
      this.$refs.applyForm.validate((valid) => {
        if (valid) {
          this.applyForm.applyDataList.forEach((item) => {
            item.Num = parseFloat(item.Num)
            let cash = parseFloat(item.InvoiceAmount)
            if (isNaN(cash)) cash = 0
            if (cash > 0) {
              item.InvoiceAmount = parseFloat(-cash)
            } else {
              item.InvoiceAmount = parseFloat(cash)
            }
          })
          this.apyDialog.show = true
        }
      })
    },
    // 取消
    back() {
      this.$router.go(-1)
    },
    // 提交申请弹窗
    apyDialogClose() {
      this.apyDialog.show = false
      this.Sub=false;
      this.$refs.apyForm.resetFields()
    },
    apyDialogSubmit: _.debounce(function (e) {
      this.Sub=true;
      this.dialogSubmit()
    }, 400),
    dialogSubmit() {
      this.Sub=true;
      this.$refs.apyForm.validate((valid) => {
        if (valid) {
          this.apyForm.CrmAuth = parseInt(this.apyForm.CrmAuth);
          for (let index = 0; index < this.DataArry.length; index++) {
            const model = this.DataArry[index];
            model.InvoiceTitle.InvoiceType = 2;
            model.InvoiceType = 2;
            this.applyForm.applyDataList.map(c => { c.InvoiceType = 2 })
            model.InvoiceItem = this.applyForm.applyDataList;
            model.ApprovalUser = this.apyForm
          }
          getsubinvoice(this.DataArry).then((res) => {
            if (res?.Code === 200) {
              this.$message.success('提交成功')
              this.apyDialog.show = false;
              this.$router.go(-1)
            } else {
              this.$message.error(res.Message)
              this.Sub=false;

            }
          })
        }
      })
    },
    invoiceAmountChange(e) {
			var value = parseFloat(e);
			if (value > 0){
				e = -(value)
			}
			this.getTheTotalAmount(this.applyForm.applyDataList)
    },
    // 删除行
    deleteRows(row, index) {
      this.applyForm.applyDataList.splice(index, 1)
      this.getTheTotalAmount(this.applyForm.applyDataList)
    },
    // 计算本次开票金额
    getTheTotalAmount(list) {
      let cash1 = this.copyList.reduce((total, cur) => {
        let cash = cur.InvoiceAmount
        return total + cash
      }, 0)

      let cash2 = list.reduce((total, cur) => {
        let cash = parseFloat(cur.InvoiceAmount)
        if (isNaN(cash)) cash = 0
        if (cash < 0) cash = -cash
        return total + cash
      }, 0)
      //本次开票金额(元)
      this.cashInfoForm.TheTotalAmount = -cash2
      // 剩余开票金额(元)
      this.cashInfoForm.SurplusAmount = this.SurplusAmount + cash2
      // 已开票金额(元)：
      this.cashInfoForm.CompleteAmount = this.CompleteAmount - cash2
    },
    //冲销原因
    // async GetAudit() {
    // 	const res = await getAudit({ InvoiceRecordNumber: this.InvoiceRecordNumber });
    // 	if (res.Code == 200) {
    // 		this.reason = res.Data[0].AuditResult;
    // 	}
    // },
    transactionTypeChange(val) {
      val.Unit = val.TransactionType === "TAD" ? "次" : "KG"
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 16px !important;
}

.btn {
  margin-top: 16px;
  text-align: center;
}

.split_line {
  width: calc(100% + 32px);
  margin-left: -16px;
  height: 16px;
  background-color: #F7F8FA;
}

.reason {
  width: 100%;
  height: 55px;
  background: #F6FFED;
  line-height: 55px;
  border: 1px dashed #95DE64;
  border-radius: 1px;

  span {
    padding: 0 16px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
  }
}

::v-deep .field-set .field-set-header {
  margin-left: 0px;
  padding: 16px 16px 0 0
}

::v-deep .field-set .field-set-content {
  padding: 0;
}
</style>