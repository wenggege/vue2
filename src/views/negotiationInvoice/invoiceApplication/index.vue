<template>
  <div class="container">
    <form-search class="form_search" :form="form.props" :items="form.items" :values.sync="form.values"
      @reset="handleReset" @search="search" />
    <!-- <table-handle :buttons="buttons" /> -->
    <table-list :columns="table.columns" :data="table.data" :paging.sync="table.paging" :showPaging="false"
      multipleSelect @refresh="handleSearch" @selection="selectChange" @selectAll="handleSelectAll" @row-click="rowClick">
      <template #SAPSalesOrderNumber="{ row }">
        <a @click.prevent="handleLink(row)">{{ row.SAPSalesOrderNumber }}</a>
      </template>
      <template #InvoiceType="{ row }">
        <span class="type_check" v-if="!row.isSelect" @click="typeClick(row)"> {{ typeList.find(item => item.id===
        row.InvoiceType).label}} </span>
        <el-select v-else v-model="row.InvoiceType" size="mini" placeholder="请选择" @change="typeChange(row)">
          <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </template>
      <template #operation="{ row }">
        <table-button :list="getButtons(row)" />
      </template>
    </table-list>
    <div class="footer">
      <div class="footer_content">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
        <div style="width:100%;padding: 0 16px;">已选择<span>{{ selectRows.length }}</span><span>项内容</span></div>
        <div>
          <table-handle :buttons="buttons" />
        </div>
      </div>
      <div>
        <el-pagination v-bind="innerPage" background @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { getApplylist, updateinvoicetype } from '@/api/negotiationInvoice'
export default {
  name: "InvoiceApplication",
  components: {
  },
  data() {
    const INVOICE_TYPE = [
      {
        label: '增值税发票',
        id: 0,
        value: 0
      },
      {
        label: '商业发票',
        id: 1,
        value: 1
      },
      // {
      //   label: '冲销',
      //   id: 2,
      //   value: 2
      // },
    ]
    return {
      typeList: INVOICE_TYPE,
      form: {
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'SAPSalesOrderNumber',
            label: '订单号',
            type: 'input',
          },
          {
            name: 'PortonCode',
            label: '产品号',
            type: 'input',
          },
        ],
        values: {
          SAPSalesOrderNumber: '',
          PortonCode: '',
        },
      },
      buttons: [
        {
          id: 'invoiceApplication',
          type: '',
          label: '申请开票',
          disabled: true,
          onClick: () => {
            this.checkType()
          }
        },
      ],
      table: {
        props: {
        },
        columns: [
          {
            prop: 'SAPSalesOrderNumber',// SalesOrderNumber
            type: 'slot',
            label: '订单号',
            minWidth: '140',
            align:'left'
          },
          {
            prop: 'SaleSubject',
            label: '销售主体',
            minWidth: '120',
            align: 'left',
            formatter: ({ row }) => {
              return row.SaleSubject === 1 ? '重庆博腾' : row.SaleSubject === 2 ? '江西博腾' : '其他'
            }
          },
          {
            prop: 'FinalCustomer',
            label: '最终客户名称',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'PONumber',
            label: 'PO/合同号',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'BD',
            label: 'BD',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'PMM',
            label: 'PMM',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'PortonCode',
            label: '产品号',
            minWidth: '80',
            align:'left'
          },
          {
            prop: 'OrderCurrency',
            label: '币别',
            minWidth: '80',
            align:'left'
          },
          {
            prop: 'OrderTotalAmount',
            label: '订单金额',
            minWidth: '120',
            align: 'right',
            formatter: ({ row }) => {
              return row.OrderTotalAmount.toFixed(2);
            }
          },
          {
            prop: 'CompleteAmount',
            label: '已开票金额',
            width: '120',
            align: 'right',
            formatter: ({ row }) => {
              return row.CompleteAmount.toFixed(2);
            }
          },
          {
            prop: 'SurplusAmount',
            label: '剩余可开票金额',
            minWidth: '140',
            align: 'right',
            formatter: ({ row }) => {
              return row.SurplusAmount.toFixed(2);
            }
          },
          {
            prop: 'InvoiceType',
            type: 'slot',
            label: '发票类型',
            minWidth: '110',
            align:'left'
          },
          {
            prop: 'Num',
            label: '数量',
            minWidth: '60',
            align:'right'
          },
          {
            prop: 'Unit',
            label: '单位',
            minWidth: '60',
            align:'left'
          },
          {
            prop: 'InvoicRemarks',
            label: '特殊要求',
            minWidth: '120',
            align:'left'
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            minWidth: '220',
            fixed: 'right',
            align: 'right'
          }
        ],
        data: [],
        paging: {
          Total: 0,
          PageSize: 10,
          PageIndex: 1
        }
      },
      innerPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        layout: 'total, sizes, prev, pager, next'
      },
      selectRows: [],
      selectAllRows: [],
      checkAll: false,
      isIndeterminate: false,
    }
  },
  computed: {},
  watch: {
    selectRows(val) {
      this.buttons.forEach(item => {
        if (item.id === 'invoiceApplication') {
          if (val.length) {
            item.disabled = false
            item.type = 'primary'
          } else {
            item.disabled = true
            item.type = ''
          }
        }
      })
    }
  },
  methods: {
    search() { },
    getButtons(row) {
      const btns = []
      btns.push({
        type: 'text',
        label: '文件',
        icon: '',
        id: 'fileId',
        onClick: () => {
          let obj = {
            SAPSalesOrderNumber: row.SAPSalesOrderNumber
          }
          this.$router.push({ path: `./fileList/${row.SalesOrderNumber}-show`, query: { data: JSON.stringify(obj) } })
        }
      })
      if (row.CompleteAmount > 0&&row.Status==0) {
        btns.push({
        type: 'text',
        label: '冲销发票',
        icon: '',
        id: 'invoiceId',
        onClick: () => {

          var data = [{ SalesOrderNumber: row.SalesOrderNumber, InvoiceType: 2, Id: row.Id }]
          if (row.InvoiceType == 1) {
            this.$router.push({ path: `./sterilisationcommerce/${row.Id}`, query: { data: JSON.stringify(data) } })
          }
          else {

            // this.$router.push({ path: `./sterilisation/${row.Id}`, query:{ data: JSON.stringify(data) } })

            this.$router.push({ path: `./sterilisation/${row.Id}`, query: { data: JSON.stringify(data) } })

          }

        }
      })
      }
      btns.push({
        type: 'text',
        label: '导出ISO',
        icon: '',
        id: 'export',
        onClick: () => {
          //to do 正式上线替换地址
          window.location.href = "https://pjm-finance-api-test.porton.cn/api/invoice/exportIso?salesOrderNumber=" + row.SalesOrderNumber + "&Id=" + row.Id;
        }
      })
      return btns
    },

    // 表单重置
    handleReset() {
      this.form.values = this.$options.data().form.values
      this.innerPage = this.$options.data().innerPage
      this.handleSearch()
    },

    // 表单查询
    search() {
      this.innerPage.currentPage = 1,
        this.handleSearch()
    },

    // 查询列表信息
    handleSearch() {
      const params = {
        ...this.form.values,
        pageSize: this.innerPage.pageSize,
        pageIndex: this.innerPage.currentPage
      }
      getApplylist(params).then((res) => {
        if (res?.Code === 200) {
          this.table.data = res?.Data
          this.innerPage.total = res?.Count
          if (this.table.data.length) {
            this.table.data.forEach(item => {
              item.isSelect = false
            })
          }
        }
      }).finally(() => {
      })
    },

    // 发票类型选择
    typeChange(row) {
      row.isSelect = false
      this.table.data.forEach((item, index) => {
        if (item.OrderInfoId === row.OrderInfoId) {
          item = row
          this.$set(this.table.data, index, item)
        }
      })
      // 修改发票类型
      const params = {
        Id: row.Id,
        InvoiceType: row.InvoiceType,
        SalesOrderNumber: row.SalesOrderNumber,
      }
      updateinvoicetype(params).then((res) => {
        if (res.Code === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.Messase)
        }
        this.handleSearch()
      })
    },

    // 表格checkbox发生改变时
    selectChange(row) {
      this.selectRows = row
      let checkedCount = row.length;
      this.checkAll = checkedCount === this.table.data.filter(row => row.IsFile ===1).length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.table.data.filter(row => row.IsFile ===1).length;
    },

    //切换每页条数
    handleSizeChange(val) {
      this.innerPage.pageSize = val
      this.innerPage.currentPage = 1;
      this.handleSearch()
    },

    //切换当前页
    handleCurrentChange(val) {
      this.innerPage.currentPage = val;
      this.handleSearch()
    },

    //订单号跳转详情
    handleLink(row) {
      // todo 上线后这个要换成生产地址
      let url = `https://pjm-pre.porton.cn/Sales/SalesOrder/detail?dtl=1&id=${row.OrderInfoId}`
      window.open(url)
    },

    // 点击发票类型文本，切换为下拉框选择
    typeClick(row) {
      // 当订单存在未作废得发票时，无法修改发票类型
      if (row.Status !== 3 && row.Status !== 0) return
      row.isSelect = true
      this.table.data.forEach((item, index) => {
        if (item.OrderInfoId === row.OrderInfoId) {
          item = row
          this.$set(this.table.data, index, item)
        } else {
          item.isSelect = false
          this.$set(this.table.data, index, item)
        }
      })
    },

    // 申请开票
    checkType() {
      // 发票类型  /*0 增值，1商业 2红票(冲销)*/
      var rowtype = this.selectRows[0].InvoiceType;
      var routearry = ["InvoiceApplicationDetail", "invoiceTradeDetail"]

      if (this.selectRows.length === 1) { //只选择一条时，点击申请开票
        this.$router.push({
          path: "./" + routearry[rowtype] + "/" + `${this.selectRows[0].Id}`,
          query: { SalesOrderNumber: this.selectRows[0].SalesOrderNumber }
        })
        return
      }


      const isSameType = this.selectRows.every((item, i, arr) => item.InvoiceType === arr[0].InvoiceType) //判断所选订单的发票类型是否一致
      if (isSameType) {
        let list = []
        this.selectRows.forEach(item => {
          const obj = {
            Id: item.Id,
            SalesOrderNumber: item.SalesOrderNumber,
            InvoiceType: item.InvoiceType
          }
          list.push(obj)
        })
        let data = {
          data: list
        }
        this.$router.push({ path: "./" + routearry[rowtype] + "/undefined", query: { data: JSON.stringify(data) } })
      } else {
        this.$message.error(`请选择发票类型一致的订单号`)
      }
    },
    handleSelectAll(val) {
      this.selectAllRows = val
      this.isIndeterminate = false;
      this.checkAll = val.length? true: false
    },
    handleCheckAllChange(val) {
      document.querySelector('thead .el-checkbox').click()
      this.isIndeterminate = false;
    },
    rowClick(row) {
      if (!row.IsFile) {
        return this.$message.warning('申请开票必须上传PO或合同')
      }
      if (!row.SurplusAmount) {
        return this.$message.warning('剩余可开票金额为零')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 16px 16px 0px 16px !important;
  overflow-y: hidden;

  .form_search {
    padding-top: 16px;
    margin-bottom: 16px;
    background: #F7F8FA;
    border-radius: 2px;
  }

  .type_check {
    &:hover {
      cursor: pointer
    }
  }

  .footer {
    padding: 16px 0;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .footer_content {
      margin-left: 16px;
      display: flex;
      align-items: center;
    }
  }
}

.TableHandle {
  background-color: #fff !important;
  border: 0;
  margin-left: -16px;
}

a {
  font-size: 14px;
  color: #1765EC;
  height: 22px;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}

::v-deep .TableButton .el-button {
  font-size: 14px;
  color: #1765EC;
  height: 22px;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}

::v-deep .el-table {

  tr th,
  tr td {
    border-right: none;
  }
}

</style>