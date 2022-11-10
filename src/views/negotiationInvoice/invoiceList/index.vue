<template>
  <div class="container">
    <form-search
      class="form_search"
      :form="form.props"
      :items="form.items"
      :values.sync="form.values"
      @reset="handleReset"
      @search="search"
    />
    <table-list
      :columns="table.columns"
      :data="table.data"
      :showPaging="false"
      @refresh="handleSearch"
    >
      <template #InvoiceRecordNumber="{ row }">
        <a @click.prevent="handleLink(row)">{{ row.InvoiceRecordNumber }}</a>
      </template>
      <template #operation="{ row }">
        <table-button :list="getButtons(row)" />
      </template>
    </table-list>
    <div class="footer">
      <div>
        <el-pagination
          v-bind="innerPage"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <!-- 导出弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible="exportDialog.show"
      :title="exportDialog.title"
      width="60%"
      @close="exportDialogClose"
    >
      <el-row>
        <el-col :span="8">
          <div class="tree">
            <div class="tree_item">
              <el-tree
                :data="exportDialog.treeData"
                empty-text="暂无数据"
                node-key="id"
                :highlight-current="true"
                :default-expand-all="true"
                :props="exportDialog.defaultProps"
                @node-click="handleNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ data }">
                  <span>
                    <i class="el-icon-document" style="margin-right: 10px"></i
                    >{{ data.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <table-list
            :columns="exportDialog.columns"
            :data="exportDialog.data"
            :showPaging="false"
            :auto-load="false"
          >
            <template #operation="{ row }">
              <table-button :list="exportButtons(row)" />
            </template>
          </table-list>
        </el-col>
      </el-row>
      <template #footer>
        <div style="text-align: right">
          <el-button
            size="mini"
            @click="exportDialogClose"
            style="margin-right: 10px"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="exportDialogClose"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 作废弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible="invalidDialog.show"
      :title="invalidDialog.title"
      width="30%"
      @close="invalidDialogClose"
    >
      <el-form
        :model="invalidForm"
        :rules="invalidRules"
        ref="invalidForm"
        lable-width="100px"
      >
        <el-form-item label="流程号：" prop="processNo">
          <span>{{ invalidForm.ServiceCode }}</span>
        </el-form-item>
        <el-form-item label="客户认证" prop="custom">
          <el-radio-group v-model="invalidForm.custom">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="作废原因" prop="Results">
          <el-input type="textarea" v-model="invalidForm.Results"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right">
          <el-button
            size="mini"
            @click="invalidDialogClose"
            style="margin-right: 10px"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="Sub" :disabled="SubBtn"
            >提交</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 拒绝弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible="rejectDialog.show"
      :title="rejectDialog.title"
      width="30%"
      @close="rejectDialogClose"
    >
      <el-form
        :model="rejectForm"
        :rules="rejectRules"
        ref="rejectForm"
        lable-width="100px"
      >
        <el-form-item label="流程号：" prop="processNo">
          <span>{{ rejectForm.processNo }}</span>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="rejectReason">
          <el-input
            type="textarea"
            v-model="rejectForm.rejectReason"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right">
          <el-button
            size="mini"
            @click="rejectDialogClose"
            style="margin-right: 10px"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="Sub" :disabled="SubBtn"
            >提交</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRecordlist,
  Cancellation,
  recordexportList,
  recordexport,
} from "@/api/negotiationInvoice";
import { Message } from "element-ui";
import _ from "lodash";
export default {
  name: "InvoiceList",
  components: {},
  data() {
    const INVOICE_TYPE = [
      {
        label: "增值",
        id: 0,
        value: 0,
      },
      {
        label: "商业",
        id: 1,
        value: 1,
      },
      {
        label: "冲销",
        id: 2,
        value: 2,
      },
    ];
    return {
      typeList: INVOICE_TYPE,
      SubBtn: false,
      form: {
        props: {
          labelWidth: "110px",
          labelPosition: "right",
          labelSuffix: "：",
        },
        items: [
          {
            name: "SAPSalesOrderNumber",
            label: "订单号",
            type: "input",
          },
          {
            name: "PortonCode",
            label: "产品号",
            type: "input",
          },
          {
            name: "Status",
            label: "状态",
            type: "select",
            paramItems: [
              {
                id: 0,
                label: "审批中",
                value: 0,
                enLabel: "",
              },
              {
                id: 1,
                label: "待开票",
                value: 1,
                enLabel: "",
              },
              {
                id: 2,
                label: "已开票",
                value: 2,
                enLabel: "",
              },
              {
                id: 3,
                label: "作废",
                value: 3,
                enLabel: "",
              },
              {
                id: 4,
                label: "已拒绝",
                value: 4,
                enLabel: "",
              },
            ],
          },
        ],
        values: {
          SalesOrderNumber: "",
          PortonCode: "",
          Status: "",
        },
      },
      statusObj: {
        0: "审批中",
        1: "待开票",
        2: "已开票",
        3: "作废",
        4: "已拒绝",
      },
      table: {
        props: {},
        columns: [
          {
            prop: "InvoiceRecordNumber",
            type: "slot",
            label: "发票申请",
            minWidth: "180",
            align: "left",
          },
          // {
          //   prop: "ProcessUrl",
          //   label: "BPM流程号",
          //   minWidth: "200",
          //   align: "left",
          // },
          {
            prop: "SAPSalesOrderNumber",
            label: "订单号",
            minWidth: "200",
            align: "left",
          },
          {
            prop: "SaleSubject",
            label: "销售主体",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "FinalCustomer",
            label: "最终客户名称",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "PONumber",
            label: "PO/合同号",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "BD",
            label: "BD",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "PMM",
            label: "PMM",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "PortonCode",
            label: "产品号",
            minWidth: "150",
            align: "left",
          },
          {
            prop: "TransactionType",
            label: "交易类型",
            minWidth: "120",
            align: "left",
            formatter: ({ row }) => {
              // 'ZADS' 收费样品| 'TAD' 服务'|  'TAN' 产品交付| 'ZADZ' 免费样品

              return row.TransactionType == "ZADS"
                ? "收费样品"
                : row.TransactionType == "TAD"
                ? "服务"
                : row.TransactionType == "TAN"
                ? "产品交付"
                : "免费样品";
            },
          },
          {
            prop: "InvoiceAmount",
            label: "开票金额",
            minWidth: "120",
            align: "right",
          },
          {
            prop: "OrderCurrency",
            label: "币别",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "Num",
            label: "数量",
            minWidth: "120",
            align: "right",
          },
          {
            prop: "Unit",
            label: "单位",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "InvoiceType",
            label: "发票类型",
            minWidth: "120",
            align: "left",
            formatter: ({ row }) => {
              if (row.InvoiceType || row.InvoiceType === 0) {
                return this.typeList.find((item) => item.id === row.InvoiceType)
                  .label;
              }
            },
          },
          {
            prop: "InvoiceRate",
            label: "销项税率",
            minWidth: "120",
            align: "right",
            formatter: ({ row }) => {
              if (row.InvoiceRate || row.InvoiceRate === 0) {
                return row.InvoiceRate + "%";
              }
            },
          },
          {
            prop: "Status",
            label: "状态",
            minWidth: "120",
            align: "left",
            formatter: ({ row }) => {
              if (row.Status || row.Status === 0) {
                return this.statusObj[row.Status];
              }
            },
          },
          {
            prop: "Createtime",
            label: "申请日期",
            minWidth: "120",
            align: "left",
            formatter: ({ row }) => {
              if (row.Createtime) {
                return this.$moment(row.Createtime).format("YYYY-MM-DD");
              }
            },
          },
          {
            prop: "InvoiceTime",
            label: "开票日期",
            minWidth: "120",
            align: "left",
            formatter: ({ row }) => {
              if (row.InvoiceTime) {
                return this.$moment(row.InvoiceTime).format("YYYY-MM-DD");
              }
            },
          },
          {
            prop: "ApplyUserName",
            label: "申请人",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "InvoicRemarks",
            label: "备注",
            minWidth: "120",
            align: "left",
          },
          {
            type: "slot",
            prop: "operation",
            label: "操作",
            minWidth: "160",
            fixed: "right",
            align: "right",
          },
        ],
        data: [],
      },
      innerPage: {
        pageSize: 20,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        layout: "total, sizes, prev, pager, next",
      },
      // 导出弹窗
      exportDialog: {
        show: false,
        title: "导出发票",
        columns: [
          {
            prop: "FinalCustomer",
            label: "公司名称",
            align: "left",
          },
          {
            type: "slot",
            prop: "operation",
            label: "操作",
            width: "80",
            fixed: "right",
          },
        ],
        data: [],
        treeData: [],
        defaultProps: {
          children: "children",
          label: "label",
          disabled: function (data, node) {
            if (data.children && data.children.length) {
              return true;
            } else {
              return false;
            }
          },
        },
        params: {
          InvoiceRecordNumber: "",
          salesOrderNumber: "",
          crmname: "",
        },
      },
      // 作废弹窗
      invalidDialog: {
        show: false,
        title: "作废发票",
      },
      InvoiceNo:"",
      invalidForm: {
        ServiceCode: "",
        custom: "0",
        Results: "",
      },
      invalidRules: {
        custom: [
          { required: true, message: "请选择客户认证", trigger: "change" },
        ],
        Results: [{ required: true, message: "作废原因必填", trigger: "blur" }],
      },
      // 拒绝弹窗
      rejectDialog: {
        show: false,
        title: "拒绝申请",
      },
      rejectForm: {
        processNo: "66666",
        rejectReason: "7777777",
      },
      rejectRules: {
        rejectReason: [
          { required: true, message: "拒绝原因必填", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    search() {},
    getButtons(row) {
      const btns = [];
      if (row.Status === 0) {
        // 状态为业务审批中
        btns.push({
          type: "text",
          label: "审批",
          icon: "",
          id: "approval",
          onClick: () => {
            //let url = `https://bpm-pre.porton.cn/jcy/#/processForm/view?name=&instanceId=${row.ProcessUrl}`;
            let url =`https://bpm-pre.porton.cn/jcy/#/staging/personal/approveList`
            window.open(url);
          },
        });
        // btns.push({
        //   type: 'text',
        //   label: '同意',
        //   icon: '',
        //   id: 'agree',
        //   onClick: () => {
        //     //todo
        //   }
        // })
        // btns.push({
        //   type: 'text',
        //   label: '拒绝',
        //   icon: '',
        //   id: 'reject',
        //   onClick: () => {
        //     this.rejectDialog.show = true
        //   }
        // })
      }
      if (row.Status === 1) {
        // 状态为待开票
        // btns.push({
        //   type: 'text',
        //   label: '确认开票',
        //   icon: '',
        //   id: 'confirm',
        //   onClick: () => {
        //     //todo
        //   }
        // })
      }
      if (row.Status === 2) {
        // 状态为已开票
        if (row.InvoiceType === 0) {
          // 发票类型为增值税发票
          // btns.push({
          //   type: 'text',
          //   label: '发票',
          //   icon: '',
          //   id: 'invoice',
          //   onClick: () => {
          //     //todo
          //   }
          // })
          // btns.push({
          //   type: "text",
          //   label: "导出",
          //   icon: "",
          //   id: "export",
          //   onClick: () => {
          //     this.invalidForm.ServiceCode = row.InvoiceRecordNumber;
          //     this.exportDialog.show = true;
          //     this.exportDialogSearch();
          //   },
          // });
        } else {
          btns.push({
            type: "text",
            label: "导出",
            icon: "",
            id: "export",
            onClick: () => {
              this.invalidForm.ServiceCode = row.InvoiceRecordNumber;
              this.exportDialog.show = true;
              this.exportDialogSearch();
            },
          });
        }
        if (row.InvoiceType !== 2) {
          btns.push({
            type: "text",
            label: "作废",
            icon: "",
            id: "invalid",
            onClick: () => {
              this.invalidForm.ServiceCode = row.InvoiceRecordNumber;
              this.invalidDialog.show = true;
            },
          });
        }
        // btns.push({
        //   type: 'text',
        //   label: '作废',
        //   icon: '',
        //   id: 'invalid',
        //   disabled: row.InvoiceType === 2 ? true : false,//冲销的不能作废
        //   onClick: () => {
        //     this.invalidForm.ServiceCode = row.InvoiceRecordNumber
        //     this.invalidDialog.show = true
        //   }
        // })
      }
      if (row.Status === 4) {
        // 状态为已拒绝
        btns.push({
          type: "text",
          label: "修改",
          icon: "",
          id: "modify",
          onClick: () => {
            if (row.InvoiceType == 1) {
              this.$router.push({
                path: `./editcommerce`,
                query: {
                  data: JSON.stringify({
                    InvoiceRecordNumber: row.InvoiceRecordNumber,
                    Id: row.Id,
                  }),
                },
              });
            }
            /*增值税 */
            if (row.InvoiceType == 0) {
              this.$router.push({
                path: `./edittax`,
                query: {
                  data: JSON.stringify({
                    InvoiceRecordNumber: row.InvoiceRecordNumber,
                    Id: row.Id,
                  }),
                },
              });
            }
            /*冲销 */
            if (row.InvoiceType == 2) {
              /**类型：1 商业冲销 ，2增值冲销 */
              if (row.InvoicetSerilisationType == 1) {
                this.$router.push({
                  path: `./editsterilisation`,
                  query: {
                    data: JSON.stringify({
                      InvoiceRecordNumber: row.InvoiceRecordNumber,
                      Id: row.Id,
                    }),
                  },
                });
              } else {
                this.$router.push({
                  path: `./editTaxSterilisation`,
                  query: {
                    data: JSON.stringify({
                      InvoiceRecordNumber: row.InvoiceRecordNumber,
                      Id: row.Id,
                      checkType: "EDIT",
                    }),
                  },
                });
              }
              // if (row.InvoicetSerilisationType == 2) {
              //   this.$router.push({ path: `./editsterilisation`, query: { data: JSON.stringify({ InvoiceRecordNumber: row.InvoiceRecordNumber, Id: row.Id }) } })
              // }
            }
          },
        });
      }
      if (row.Status === 5) {
        // 状态为待申请
        btns.push({
          type: "text",
          label: "申请",
          icon: "",
          id: "apply",
          onClick: () => {
            //todo
          },
        });
      }
      return btns;
    },

    // 表单重置
    handleReset() {
      this.form.values = this.$options.data().form.values;
      this.innerPage = this.$options.data().innerPage;
      this.handleSearch();
    },

    // 表单查询
    search() {
      (this.innerPage.currentPage = 1), this.handleSearch();
    },

    // 查询列表信息
    handleSearch() {
      const params = {
        ...this.form.values,
        pageSize: this.innerPage.pageSize,
        pageIndex: this.innerPage.currentPage,
      };
      getRecordlist(params)
        .then((res) => {
          if (res?.Code === 200) {
            this.table.data = res?.Data;
            this.innerPage.total = res?.Count;
          }
        })
        .finally(() => {});
    },

    //切换每页条数
    handleSizeChange(val) {
      this.innerPage.pageSize = val;
      this.innerPage.currentPage = 1;
      this.handleSearch();
    },

    //切换当前页
    handleCurrentChange(val) {
      this.innerPage.currentPage = val;
      this.handleSearch();
    },

    //流程编号跳转详情
    handleLink(row) {
      if (row.InvoiceType == 1) {
        this.$router.push({
          path: `./InvoicecommerceInfo`,
          query: {
            InvoiceRecordNumber: row.InvoiceRecordNumber,
              Id:  JSON.stringify(row.Id)
          },
        });
      }
      /*增值税 */
      /**  data: JSON.stringify({
              InvoiceRecordNumber: row.InvoiceRecordNumber,
              Id: row.Id,
              Status: row.Status, // 状态
              InvoiceType: row.InvoiceType // 状态类型
            }), */
      if (row.InvoiceType == 0) {
        this.$router.push({
          path: `./InvoiceInfo`,
          query: {
              InvoiceRecordNumber: row.InvoiceRecordNumber,
              Id:  JSON.stringify(row.Id),
              Status:JSON.stringify(row.Status), // 状态
              InvoiceType: JSON.stringify(row.InvoiceType) // 状态类型           
          },
        });
      }
      /*冲销 */
      if (row.InvoiceType == 2) {
        /**类型：1 商业冲销 ，2增值冲销 */
        if (row.InvoicetSerilisationType == 1) {
          this.$router.push({
            path: `./editsterilisation`,
            query: {              
              InvoiceRecordNumber: row.InvoiceRecordNumber,
              Id:  JSON.stringify(row.Id),
              Status:JSON.stringify(row.Status), // 状态
              InvoiceType: JSON.stringify(row.InvoiceType) // 状态类型     

            },
          });
        } else {
          this.$router.push({
            path: `./editTaxSterilisation`,
            query: {
                InvoiceRecordNumber: row.InvoiceRecordNumber,
                Id: JSON.stringify(row.Id),
                checkType: "DETAILS",
            },
          });
        }
      }
    },
    // 导出弹窗
    exportDialogClose() {
      this.exportDialog.show = false;
      this.exportDialog.data = [];
    },
    exportDialogSearch() {
      recordexportList({
        InvoiceRecordNumber: this.invalidForm.ServiceCode,
      }).then((res) => {
        if (res?.Code === 200) {
          this.exportDialog.treeData = this.toTreeData(res.Data);
        }
      });
    },
    exportButtons(row) {
      console.log(row)
      const btns = [];
      btns.push({
        type: "text",
        label: "导出",
        icon: "",
        id: "exportPPS",
        onClick: () => {
          console.log(this.InvoiceNo)
          window.location.href =
            "https://pjm-finance-api-test.porton.cn/api/invoice/recordexport?InvoiceRecordNumber=" +
            this.exportDialog.params.InvoiceRecordNumber +
            "&salesOrderNumber=" +
            this.exportDialog.params.salesOrderNumber +
            "&crmname=" +
            row.FinalCustomer+
            "&InvoiceNo=" +
            this.InvoiceNo;
        },
      });
      return btns;
    },
    // 作废弹窗
    invalidDialogClose() {
      this.invalidDialog.show = false;
      this.SubBtn = false;
      this.$refs.invalidForm.resetFields();
    },
    Sub: _.debounce(function (e) {
      this.SubBtn = true;
      this.invalidDialogSubmit();
    }, 400),
    async invalidDialogSubmit() {
      var valids = 0;
      this.SubBtn = true;
      this.$refs.invalidForm.validate((valid) => {
        if (valid) {
          valids = 1;
        }
      });
      if (valids == 1) {
        var res = await Cancellation(this.invalidForm);
        if (res.Code == 200 || res.Code == 0) {
          Message.success("操作成功");
          this.invalidDialog.show = false;
          location.reload();
        } else {
          Message.error(res.Message);
          this.SubBtn = false;
        }
      }
    },
    // 拒绝弹窗
    rejectDialogClose() {
      this.rejectDialog.show = false;

      this.$refs.rejectForm.resetFields();
    },

    rejectDialogSubmit() {
      this.$refs.rejectForm.validate((valid) => {
        if (valid) {
          console.log(this.rejectForm);
          //todo
        }
      });
    },
    handleNodeClick(data) {
      if (data.hasOwnProperty("children")) return;
      this.exportDialog.data = [];
      console.log(data);
      this.exportDialog.params.InvoiceRecordNumber = data.InvoiceRecordNumber;
      this.exportDialog.params.salesOrderNumber = data.SalesOrderNumber;
      this.exportDialog.data = data.salePathDtos;
      this.InvoiceNo= data.InvoiceNo;
    },
    toTreeData(list) {
      if (!list.length) return list;
      list.forEach((item, index) => {
        item.label = item.SAPSalesOrderNumber
        if (item.recordExporItem.length) {
          item.recordExporItem.forEach((ele, index) => {
            ele.label = ele.InvoiceNo;
            ele.SalesOrderNumber = item.SalesOrderNumber;
          });
          item.children = item.recordExporItem;
        }
      });
      return list;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px 16px 0px 16px !important;
  overflow-y: hidden;

  .form_search {
    padding-top: 16px;
    margin-bottom: 16px;
    background: #f7f8fa;
    border-radius: 2px;
  }

  .type_check {
    &:hover {
      cursor: pointer;
    }
  }

  .footer {
    padding: 16px 0;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

a {
  font-size: 14px;
  color: #1765ec;
  height: 22px;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}

::v-deep .TableButton .el-button {
  font-size: 14px;
  color: #1765ec;
  height: 22px;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}

.el-dialog__footer .el-button {
  min-width: 0;
  margin: 0;
}

.tree {
  width: 100%;
  height: 100%;
  margin-top: -16px;

  .tree_item {
    margin-right: 10px;
    border: 1px solid #ebeef5;
    border-top: none;
    padding-top: 16px;
  }
}

::v-deep .el-table {
  tr th,
  tr td {
    border-right: none;
  }
}
</style>