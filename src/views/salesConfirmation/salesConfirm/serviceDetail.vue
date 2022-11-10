<template>
  <div class="container" v-loading="loading" element-loading-text="数据加载中">
    <div class="container1">
    <div style="width: 90%;background: #fff;padding: 16px;" id="left_container">
      <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tab" :key="index" :label="OrderNoList" :name="String(index)">
          <field-set title='基本信息' :borderBottom="false" id="BaseInfo">
            <el-descriptions :column="4" class="base_info">
              <el-descriptions-item label="SAP销售订单号">{{ item.orderInfo.SAPSalesOrderNumber || '' }}
              </el-descriptions-item>
              <el-descriptions-item label="PO号">{{ item.orderInfo.PONumber || '' }}</el-descriptions-item>
              <el-descriptions-item label="所属公司">{{ item.orderInfo.SaleSubject === '1' ? '重庆博腾' : '江西博腾' }}</el-descriptions-item>
              <el-descriptions-item label="所属部门">{{ `${item.orderInfo.BizDivision}/${item.orderInfo.OrgName}`  }}</el-descriptions-item>
              <el-descriptions-item label="售达方">{{ item.orderInfo.SoldSide || '' }}</el-descriptions-item>
              <el-descriptions-item label="项目群经理">{{ item.orderInfo.PMM || '' }}</el-descriptions-item>
              <el-descriptions-item label="研发机构">{{ item.orderInfo.RDInstitutionID || '' }}</el-descriptions-item>
              <el-descriptions-item label="交付场地">{{ item.orderInfo.SiteName || ''}}</el-descriptions-item>
            </el-descriptions>
            <div v-if=" item.orderInfo.salePaths !== null && item.orderInfo.salePaths.length" class="sale_title">
              <div class="sale_title_img"></div>销售路径
            </div>
            <!-- 销售路径 -->
            <div class="sale-paths" v-if="item.orderInfo.salePaths !== null && item.orderInfo.salePaths.length " style="margin-left: 0px;height: 100%;">
              <!-- 销售主体 -->
              <div class="sale_main">
                <div class="sale_main_one">
                  <div class="sale_main_one_title">销售主体</div>
                  <div class="sale_main_one_line">
                    <div></div>
                  </div>
                </div>
                <div class="sale_main_two" style="height:115px">
                  <div class="sale_main_two_title">
                    <div class="sale_main_two_title_img"></div>
                    <div>{{item.orderInfo.salePaths ? item.orderInfo.salePaths.find(item => item.Seq == 0)?.SaleSubject : ''}}</div>
                  </div>
                  <el-descriptions :column="1" class="sale_main_two_content">
                    <el-descriptions-item label="币别">{{ item.orderInfo.salePaths ?
                    item.orderInfo.salePaths.find(item => item.Seq == 0)?.Currency : ''}}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
              <!-- 贸易主体 -->
              <div v-if="item.orderInfo.tradeList.length" v-for="(element, index) in item.orderInfo.tradeList"
                :key="index">
                <div class="sale_main">
                  <div class="sale_main_one">
                    <div class="sale_main_one_othertitle">贸易主体</div>
                    <div class="sale_main_one_otherline" style="width:175px">
                      <div></div>
                    </div>
                  </div>
                  <div class="sale_main_two" style="width:244px;height:115px">
                    <div class="sale_main_two_title">
                      <div class="sale_main_two_title_img2"></div>
                      <div>{{element?.TradeSubject}}</div>
                    </div>
                    <el-descriptions :column="1" class="sale_main_two_content">
                      <el-descriptions-item label="币别">{{ element?.Currency || '' }}
                      </el-descriptions-item>
                      <el-descriptions-item label="贸易毛利率">{{ element?.Tax *100 + '%' || '' }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
              </div>
              <!-- 售达方 -->
              <div class="sale_main">
                <div class="sale_main_one">
                  <div class="sale_main_one_lasttitle">客户</div>
                </div>
                <div class="sale_main_two" style="height:115px">
                  <div class="sale_main_two_title">
                    <div class="sale_main_two_title_img3"></div>
                    <div>售达方：{{ item.orderInfo.salePaths ? item.orderInfo.salePaths.find(item => item.Seq == 100)?.SoldSideID : '' }}</div>
                  </div>
                  <el-descriptions :column="1" class="sale_main_two_content">
                    <el-descriptions-item label="最终客户">{{ item.orderInfo.salePaths ?
                    item.orderInfo.salePaths.find(item => item.Seq == 100)?.FinalCustomer : ''
                    }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
            </div>
          </field-set>

          <!-- 销售明细 -->
          <field-set title='销售明细' :borderBottom="false" id="SaleInfo">
            <div v-if="!item.deliveryPlanInfos.length" style="padding-left:16px">暂无销售明细</div>
            <div v-else>
              <el-collapse v-model="activeNames">
                <el-collapse-item v-for="(ele, index) in item.deliveryPlanInfos" :key="index"
                  :title="`行项目 ${ele.ItemNumber}`" :name="index" :id="`SaleInfo_${ele.ItemNumber}`">
                  <el-descriptions :column="4" class="sale_info">
                    <!-- <el-descriptions-item label="行项目">{{ ele.ItemNumber || '' }}
                    </el-descriptions-item> -->
                    <el-descriptions-item label="SAP物料代码">{{ ele.SAPMaterialCode || '' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="物料描述">{{ ele.MaterialDescription || '' }}</el-descriptions-item>
                    <el-descriptions-item label="服务类型">{{ ele.DeliveryNoList || '服务' }}</el-descriptions-item>
                    <el-descriptions-item label="特殊要求">{{ ele.SpecialRequire || '' }}</el-descriptions-item>
                    <el-descriptions-item label="交付项目类别">{{ ele.LineProjectType || '' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="付款条款">{{ ele.PaymentTerms || '' }}</el-descriptions-item>
                    <el-descriptions-item label="币别">{{ ele.Currency || '' }}</el-descriptions-item>
                    <el-descriptions-item label="含税总价">{{ ele.TaxTotal || '' }}</el-descriptions-item>
                    <el-descriptions-item label="含税单价">{{ ele.TaxUnitPrice || '' }}</el-descriptions-item>
                    <el-descriptions-item label="销项税率">{{ ele.TaxOutput || '' }}</el-descriptions-item>
                    <el-descriptions-item label="ISO">{{ ele.DSPurchaseOrderNumber || '' }}</el-descriptions-item>
                    <el-descriptions-item label="最终客户单价">{{ ele.FinalCustomerPrice || '' }}</el-descriptions-item>
                    <el-descriptions-item label="最终客户总价">{{ ele.FinalCustomerTotal || '' }}</el-descriptions-item>
                    <el-descriptions-item label="不含税金额">
                      <el-input v-model="ele.NoTaxMoney" style="width:50%" :disabled="!editNoTaxMoney=== -1" oninput ="value=value.replace(/[^0-9.]/g,'')" @change="((val)=>{inputChange(val,ele,ele.TaxTotal,ele.TaxOutput)})" ></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item label="税金">{{ ele.Tax || '' }}</el-descriptions-item>
                  </el-descriptions>

                  <div class="sale_title" v-if="ele.salePaths !== null && ele.salePaths.length">
                    <div class="sale_title_img" style="margin-top:5px"></div>销售路径
                  </div>
                  <!-- 销售路径 -->
                  <div class="sale-paths" v-if="ele.salePaths !== null && ele.salePaths.length" style="margin-left: 0px">
                    <!-- 销售主体 -->
                    <div class="sale_main">
                      <div class="sale_main_one">
                        <div class="sale_main_one_title">销售主体</div>
                        <div class="sale_main_one_line">
                          <div></div>
                        </div>
                      </div>
                      <div class="sale_main_two">
                        <div class="sale_main_two_title">
                          <div class="sale_main_two_title_img" style="margin-top: 3px"></div>
                          <div>{{ ele.salePaths ? ele.salePaths.find(item => item.Seq ==0).SaleSubject : ''}}</div>
                        </div>
                        <el-descriptions :column="1" class="sale_main_two_content">
                          <el-descriptions-item label="币别">{{ ele.salePaths.find(item => item.Seq ==
                          0).Currency 
                          }}
                          </el-descriptions-item>
                          <el-descriptions-item label="含税总价">{{ ele.salePaths.find(item => item.Seq
                          == 0).Amount 
                          }}
                          </el-descriptions-item>
                          <el-descriptions-item label="含税单价">{{ ele.salePaths.find(item => item.Seq
                          == 0).Price 
                          }}</el-descriptions-item>
                        </el-descriptions>
                      </div>
                    </div>
                    <!-- 贸易主体 -->
                    <div v-if="ele.tradeList.length" v-for="(element, index) in ele.tradeList" :key="index">
                      <div class="sale_main">
                        <div class="sale_main_one">
                          <div class="sale_main_one_othertitle">贸易主体</div>
                          <div class="sale_main_one_otherline" style="width:175px">
                            <div></div>
                          </div>
                        </div>
                        <div class="sale_main_two" style="width:244px">
                          <div class="sale_main_two_title">
                            <div class="sale_main_two_title_img2" style="margin-top:4px"></div>
                            <div>{{ element?.TradeSubject}}</div>
                          </div>
                          <el-descriptions :column="1" class="sale_main_two_content">
                            <el-descriptions-item label="币别">{{ element.Currency }}
                            </el-descriptions-item>
                            <el-descriptions-item label="含税总价">{{ element.Amount  }}
                            </el-descriptions-item>
                            <el-descriptions-item label="含税单价">{{ element.Price  }}
                            </el-descriptions-item>
                            <el-descriptions-item label="贸易毛利率">{{ element.Tax  }}
                            </el-descriptions-item>
                          </el-descriptions>
                        </div>
                      </div>
                    </div>
                    <!-- 售达方 -->
                    <div class="sale_main">
                      <div class="sale_main_one">
                        <div class="sale_main_one_lasttitle">客户</div>
                      </div>
                      <div class="sale_main_two">
                        <div class="sale_main_two_title">
                          <div class="sale_main_two_title_img3" style="margin-top:4px"></div>
                          <div>售达方：{{ ele.salePaths ? ele.salePaths.find(item => item.Seq == 100)?.SoldSideID : ''}}</div>
                        </div>
                        <el-descriptions :column="1" class="sale_main_two_content">
                          <el-descriptions-item label="最终客户">{{ ele.salePaths ? ele.salePaths.find(item => item.Seq
                          == 100).FinalCustomer : ''
                          }}
                          </el-descriptions-item>
                        </el-descriptions>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </field-set>
        </el-tab-pane>
      </el-tabs>
      <!-- 审批流 -->
      <div>
        <field-set title='审批流' :borderBottom="false" id="ApprovalProcess">
          <table-list style="width:100%;margin-top: 16px;" :columns="table.columns" :data="table.data" :showPaging="false" @refresh="handleSearch"></table-list>
        </field-set>
      </div>
    </div>
    </div>

    <div style="width: 10%;" v-show="!loading && tab.length !== 0">
      <div class="directory">
        <div style="position: fixed;">
          <div :class="[index == status ? 'directory_title_active' : 'directory_title']"
            v-for="(item, index) in htmlObj" @click="selectInfo(index,item.id)" v-if="index < 2">
            {{ item.title }}
          </div>
          <div v-if="htmlObj[1].children.length"
            :class="[index == chirldrenStatus ? 'directory_title_active' : 'directory_title']" style="padding-left:20px"
            v-for="(item, index) in htmlObj[1].children">
            <a @click="selectChirldrenInfo(index,item.ItemNumber)">{{ `2.${index + 1}行项目${item.ItemNumber}` }}</a>
          </div>
          <div :class="[index == status ? 'directory_title_active' : 'directory_title']" v-for="(item, index) in htmlObj"
            @click="selectInfo(index,item.id)" v-if="index > 1">
            {{ item.title }}
          </div>
        </div>
        <div class="directory_btn">
          <div class="directory_btn_item">
            <el-button size="mini" @click="back">取消</el-button>
          </div>
          <div class="directory_btn_item">
            <el-button size="mini" type="primary" @click="save">保存</el-button>
          </div>
          <div class="directory_btn_item" v-if="Audit">
            <el-button type="danger" size="mini" @click="reject">拒绝</el-button>
          </div>
          <div class="directory_btn_item" v-if="Audit">
            <el-button type="primary" size="mini" @click="openAgree">审核通过</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 拒绝弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible="rejectDialog.show" :title="rejectDialog.title" width="30%"
      @close="rejectDialogClose">
      <el-form :model="rejectForm" :rules="rejectRules" ref="rejectForm" lable-width="100px">
        <el-form-item label="类型：" prop="checkList">
          <el-checkbox-group v-model="rejectForm.checkList">
            <el-checkbox label="销售"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="描述" prop="AuditDec">
          <el-input type="textarea" v-model="rejectForm.AuditDec"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right;">
          <el-button size="mini" @click="rejectDialogClose" style="margin-right: 10px">取消</el-button>
          <el-button type="primary" size="mini" @click="rejectDialogSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 同意弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible="agreeDialog.visible" :title="agreeDialog.title" width="30%" @close="agreeDialogClose">
      <el-form ref="saleDialogForm" :model="agreeDialog.form" label-width="70px">
        <el-form-item label="审核内容">
          <el-input type="textarea" v-model="agreeDialog.form.content"></el-input>
        </el-form-item>
      </el-form>
		<template #footer>
			<div style="text-align: right;">
				<el-button size="mini" @click="agreeDialogClose">关闭</el-button>
        <el-button type="primary" size="mini" @click="agree">提交</el-button>
			</div>
		</template>
	</el-dialog>
  </div>
  </div>
</template>
<script>
import { getsalelinfo,subSaleAuditDto,subSale } from '@/api/salesConfirmation'
import _ from 'lodash';
export default {
  name: 'productDetail',
  data() {
    return {
      Audit: 0,
      SaleNo: '',
      status: 0,
      chirldrenStatus: undefined,
      loading: true,
      OrderNoList: '',
      activeName: 0,
      activeNames: [],//销售明细展开表
      editNoTaxMoney: undefined,
      tab: [],
      // 拒绝弹窗
      rejectDialog: {
        show: false,
        title: '拒绝原因',
      },
      rejectForm: {
        checkList: [],
        AuditDec: '',
      },
      rejectRules: {
        checkList: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        AuditDec: [
          { required: true, message: '拒绝原因必填', trigger: 'blur' }
        ],
      },
      directoryHeight: '',
      htmlObj: [
        { id: '#BaseInfo', title: '1. 基本信息', children: [] },
        { id: '#SaleInfo', title: '2. 销售明细', children: [] },
        { id:'#ApprovalProcess' , title: '3. 审批流', children: [] },
      ],
      //审批流
      table: {
        columns: [
          {
            prop: 'OrderNoList',
            label: '审批节点',
            minWidth: '120',
            align: 'left'
          },
          {
            prop: 'SalesType',
            label: '交易类型',
            minWidth: '120',
            align: 'left'
          },
          {
            prop: 'TrackBizType',
            label: '业务类型',
            minWidth: '120',
            align: 'left'
          }
        ],
        data: [],
      },
      //同意弹窗
      agreeDialog: {
        title: '提示',
        visible: false,
        form: {
          content: ''
        }
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.OrderNoList = JSON.parse(route.query.OrderNoList)
        this.SaleNo = JSON.parse(route.query.SaleNo)
        this.getsalelinfo()
      },
      immediate: true
    }
  },
  mounted() { },
  methods: {
    getsalelinfo() {
      this.loading = true
      getsalelinfo({ OrderNo: this.OrderNoList,SaleNo: this.SaleNo }).then((res) => {
        if (res.Code === 200) {
          this.loading = false
          this.Audit = res.Audit
          this.SaleNo = res.Saleinfo.SaleNo
          this.editNoTaxMoney = res.Saleinfo.FileSaleStatus
          this.tab = res.Data || []
          if (this.tab.length) {
            this.tab.forEach(item => {
              if (item.deliveryPlanInfos === null || item.deliveryPlanInfos?.length === 0) {
                item.deliveryPlanInfos = []
              } else {
                this.htmlObj[1].children = item.deliveryPlanInfos
                item.deliveryPlanInfos.forEach((ele, index) => {
                  ele.CpoyNoTaxMoney = ele.NoTaxMoney
                  this.activeNames.push(index)
                  if (ele.salePaths?.length === 0 || ele.salePaths === null) {
                    ele.tradeList = []
                  } else {
                    let list = ele.salePaths.filter((item, index) => {
                      return item.Seq != 100 && item.Seq != 0
                    })
                    ele.tradeList = list //贸易主体
                  }
                })
              }
              if (item.orderInfo.salePaths === null ||item.orderInfo.salePaths?.length===0) {
                item.orderInfo.tradeList = []
              } else {
                let list = item.orderInfo.salePaths.filter((item, index) => {
                  return item.Seq != 100 && item.Seq != 0
                })
                item.orderInfo.tradeList = list //贸易主体
              }
            })
          }
        }
      })
    },
    handleClick() {
    },
    back() {
      this.$router.go(-1)
    },
    reject() {
      this.rejectDialog.show = true
    },
    // 拒绝弹窗
    rejectDialogClose() {
      this.rejectDialog.show = false
      this.$refs.rejectForm.resetFields()
    },
    rejectDialogSubmit: _.debounce(function (e) {
      this.$refs.rejectForm.validate((valid) => {
        if (valid) {
          let params = {
            SaleNo: this.SaleNo,
            AuditDec: this.rejectForm.AuditDec,
            AuditResult: 0,
          }
          this.rejectForm.checkList.forEach((item) => {
            if (item === '销售') params.FileSaleStatus = 0
          })
          subSaleAuditDto(params).then((res) => {
            if (res.Code === 200) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            } else {
              this.$message.success('操作失败')
            }
          })
        }
      })
    }, 400),

    selectInfo(index, id) {
      this.status = index
      this.chirldrenStatus = undefined
      document.querySelector(id).scrollIntoView({
        behavior: "smooth"
      })
    },
    selectChirldrenInfo(index, orderNum) {
      this.status = undefined
      this.chirldrenStatus = index
      let selector = '#SaleInfo_' + orderNum
      document.querySelector(selector).scrollIntoView({
        behavior: "smooth"
      })
    },
    save: _.debounce(function (e) {
      let params = {
        saleNo: this.SaleNo,
        saleTaxes: []
      }
      this.tab.forEach(item => {
        if (item.deliveryPlanInfos.length) {
          item.deliveryPlanInfos.forEach(ele => {
            let obj = {
              ItemNumber:ele.ItemNumber,
              OrderNo:item.orderInfo.SAPSalesOrderNumber,
              NoTaxMoney:ele.NoTaxMoney,
              SaleNo:this.SaleNo,
            }
            params.saleTaxes.push(obj)
          })
        }       
      })
      subSale(params).then((res) => {
        if (res.Code === 200) {
          this.$message.success('保存成功')
          this.$router.go(-1)
        } else {
          this.$message.success('保存失败')
        }
      })
    }, 400),

    openAgree() {
      this.agreeDialog.visible = true
    },
    agreeDialogClose() {
      this.agreeDialog.visible = false
      this.agreeDialog.content = ''
    },

    agree: _.debounce(function (e) {
      let params = {
        SaleNo: this.SaleNo,
        AuditDec: this.rejectForm.AuditDec,
        FileSaleStatus: 1,
        AuditResult: 1,
      }
      subSaleAuditDto(params).then((res) => {
        if (res.Code === 200) {
          this.$message.success('操作成功')
          this.$router.go(-1)
        } else {
          this.$message.success('操作失败')
        }
      })
    }, 400),
    inputChange(val,ele,TaxTotal,TaxOutput) {
      let newTaxOutput = parseFloat(TaxOutput.replace('%',''))
      if (newTaxOutput <= 0 && val > parseFloat(TaxTotal)) {
        this.$message.error('不含税金额不能大于含税总价')
        this.$set(ele,'NoTaxMoney',ele.CpoyNoTaxMoney)
        return
      }
      if (newTaxOutput > 0 && val >= parseFloat(TaxTotal)) {
        this.$message.error('不含税金额不能大于等于含税总价')
        this.$set(ele,'NoTaxMoney',ele.CpoyNoTaxMoney)
        return
      }
      // 税金
      this.$set(ele,'Tax',parseFloat(ele.TaxTotal) - parseFloat(ele.NoTaxMoney))
    },
    //获取审批流
    handleSearch() {
      //todo
    }
  }
}
</script>
<style lang="scss" scoped>
.app-main {

  >* {
    background-color: #F7F8FA;
  }
}

.container {
  padding: 0px 16px 16px 0px !important;
  overflow: hidden;
}
.container1 {
  display: flex;
}

.left_container {
  padding: 0 16px;
  background-color: #fff;
}

.sale_title {
  padding: 16px 0;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #323233;
  display: flex;

  .sale_title_img {
    height: 15px;
    width: 15px;
    margin-right: 5px;
    margin-top: 2px;
    background-image: url('../imgs/Frame.png');
    background-repeat: no-repeat;
  }
}

.sale-paths {
  width: calc(100% + 16px);
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  // border: 1px solid black;
  align-items: flex-start;
  margin-left: -16px;
  margin-bottom: 16px;

  .sale_main {
    margin-right: 16px;

    .sale_main_one {
      display: flex;

      //justify-content: center;
      .sale_main_one_title {
        height: 22px;
        margin-bottom: 16px;
        margin-right: 12px;
        line-height: 22px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: #1765EC;
      }

      .sale_main_one_othertitle {
        height: 22px;
        margin-bottom: 16px;
        margin-right: 12px;
        line-height: 22px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: #15B84D;
      }

      .sale_main_one_lasttitle {
        height: 22px;
        margin-bottom: 16px;
        margin-right: 12px;
        line-height: 22px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: #FA8817;
      }

      .sale_main_one_line {
        width: 160px;
        height: 22px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;

        div {
          width: 100%;
          height: 5px;
          background-image: url('../imgs/Line 1.png');
          background-repeat: no-repeat;
        }
      }

      .sale_main_one_otherline {
        width: 160px;
        height: 22px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;

        div {
          width: 100%;
          height: 5px;
          background-image: url('../imgs/Line 2.png');
          background-repeat: no-repeat;
        }
      }
    }

    .sale_main_two {
      width: 227px;
      height: 190px;
      border: 1px solid #DCDFE6;
      border-radius: 1px;
      padding-left: 12px;
      padding-top: 12px;
      margin-bottom: 12px;

      .sale_main_two_title {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: -0.01px;
        color: #2E2E2F;
        margin-bottom: 12px;
        display: flex;

        .sale_main_two_title_img {
          height: 16px;
          width: 16px;
          margin-right: 8px;
          margin-top: 2px;
          background-image: url('../imgs/Icon1.png');
          background-repeat: no-repeat;
        }

        .sale_main_two_title_img2 {
          height: 16px;
          width: 16px;
          margin-right: 8px;
          margin-top: 2px;
          background-image: url('../imgs/Icon2.png');
          background-repeat: no-repeat;
        }

        .sale_main_two_title_img3 {
          height: 16px;
          width: 16px;
          margin-right: 8px;
          margin-top: 2px;
          background-image: url('../imgs/Icon3.png');
          background-repeat: no-repeat;
        }
      }

      .sale_main_two_content {
        padding-left: 22px;
      }
    }
  }
}

span {
  display: block;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -icab-text-overflow: ellipsis;
  -khtml-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
}

.footer_btn {
  text-align: right;
  margin-right: 36px;
}

.field-set {
  margin-left: -16px;
}

::v-deep .field-set .field-set-header {
  padding: 0;
  background-color: #F5F7FA;
  margin-top: 16px;
}

::v-deep .field-set .field-set-header--title {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #323233;
}

::v-deep .el-tabs__header {
  margin: 0;
}

::v-deep .field-set .field-set-content {
  padding: 0 16px;
}

::v-deep .el-table {
  tr th,
  tr td {
    border-right: none;
  }
}

.base_info {
  margin-top: 16px;
  margin-right: -16px;

  ::v-deep .el-descriptions__body {
    padding-left: 16px;
    padding-top: 16px;
    background-color: #F7F8FA;

    .el-descriptions-item__label {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
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
}

.sale_info {
  margin-top: 16px;
  margin-right: -16px;

  ::v-deep .el-descriptions-item__label {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: -0.01px;
    color: #646566;
  }

  ::v-deep .el-descriptions-item__content {
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -0.01px;
    color: #2E2E2F;
  }

  ::v-deep .field-set .field-set-content {
    padding: 0;
  }
}

::v-deep .el-collapse {
  margin-right: -16px;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 20px;
}

::v-deep .el-collapse-item__header {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #323233;
  border-bottom: 1px solid #E4E7ED;
}

.directory {
  height: 100%;
  width: 100%;
  background-color: #FFFFFF;
  padding: 16px;
  margin-left: 16px;
  position: relative;

  .directory_title {
    width: 100%;
    //height: 22px;
    padding-left: 10px;
    padding-bottom: 6px;
    border-left: 2px solid #EBEEF5;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: -0.01px;
    color: #646566;
    cursor: pointer;
    transition: 1s;
  }

  .directory_title_active {
    width: 100%;
    //height: 22px;
    padding-left: 10px;
    padding-bottom: 6px;
    border-left: 2px solid #1765EC;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: -0.01px;
    color: #1765EC;
    cursor: pointer;
    transition: 1s;
  }

  .directory_btn {
    position: absolute;
    width: 100%;
    bottom: 20px;
    text-align: center;
    margin-left: -16px;

    .directory_btn_item {
      margin-top: 20px;
    }
  }
}

::v-deep .el-input__inner {
  height: 50%;
}

::v-deep #ApprovalProcess .field-set-content {
  padding-right: 0 !important;
}
.el-dialog__footer .el-button{
  margin: 0 5px;
}
</style>
