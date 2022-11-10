<template>
  <div class="container">
    <form-search class="form_search" :form="form.props" :items="form.items" :values.sync="form.values"
      @reset="handleReset" @search="search" />
    <table-handle :buttons="buttons" />
    <table-list :columns="table.columns" :data="table.data" :showPaging="false" @refresh="handleSearch">
      <template #operation="{ row }">
        <table-button :list="getButtons(row)" />
      </template>
    </table-list>
    <div class="footer">
      <div>
        <el-pagination v-bind="innerPage" background @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
    </div>
    <upload-file ref="uploadFile" v-show="uploadFileShow" accept=".xls,.xlsx,.doc,.docx,.pdf"
      @httpRequest="httpRequest">
    </upload-file>
  </div>
</template>

<script>
import { getVatlist, vatfileUpload, deletevatfile } from '@/api/negotiationInvoice'
export default {
  name: "VatInvoiceList",
  components: {
  },
  data() {
    const INVOICE_TYPE = [
      {
        label: '增值',
        id: 0,
        value: 0
      },
      {
        label: '商业',
        id: 1,
        value: 1
      },
      {
        label: '冲销',
        id: 2,
        value: 2
      },
    ]
    return {
      typeList: INVOICE_TYPE,
      uploadFileShow: false,
      form: {
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'InvoiceCode',
            label: '发票代码',
            type: 'input',
          },
          {
            name: 'InvoiceNo',
            label: '发票号码',
            type: 'input',
          },
          {
            name: 'VerificationName',
            label: '销方名称',
            type: 'input',
          },
          {
            name: 'InvoiceDatetime',
            label: '开票日期',
            type: 'date',
            paramItems: {
              type: 'date',
              format: 'yyyy-MM-dd'
            },
          },
        ],
        values: {
          InvoiceCode: '',
          InvoiceNo: '',
          CompanyName: '',
          InvoiceDatetime: '',
        },
      },
      buttons: [
        {
          id: 'import',
          type: 'primary',
          icon: 'el-icon-circle-plus-outline',
          label: '导入发票',
          onClick: () => {
            document.querySelector('.UploadFile .el-upload__input').click()
          }
        },
        {
          id: 'template',
          type: '',
          label: '模板',
          onClick: () => {
            this.downloadTemplate()
          }
        },
      ],
      table: {
        props: {
        },
        columns: [
          {
            prop: 'PortonCode',
            label: '产品号',
            minWidth: '140',
            align:'left',          
          },
          {
            prop: 'VerificationName',
            label: '销方名称',
            minWidth: '140',
            align:'left'
          },
          {
            prop: 'InvoiceType',
            label: '发票种类',
            minWidth: '140',
            align:'left',          
          },
          {
            prop: 'InvoiceCode',
            label: '发票代码',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'InvoiceNo',
            label: '发票号码',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'BuyInvoiceNo',
            label: '购方税号',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'BuyInvoiceName',
            label: '购方名称',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'InvoiceDatetime',
            label: '开票日期',
            width: '120',
            align:'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'MasterProductName',
            label: '主要商品名称',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'InvoiceNo',
            label: '报送状态',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'TotalMoney',
            label: '合计金额',
            minWidth: '120',
            align: 'right',
            formatter: ({ row }) => {
              return row.TotalMoney.toFixed(2);
            }
          },
          {
            prop: 'Rate',
            label: '税率',
            minWidth: '120',
            align: 'right',
            formatter: ({ row }) => {
              if (row.Rate || row.Rate === 0) { return row.Rate + '%' }
            }
          },
          {
            prop: 'TotalTaxMoney',
            label: '合计税额',
            minWidth: '120',
            align: 'right',
            formatter: ({ row }) => {
              return row.TotalTaxMoney.toFixed(2);
            }
          },
          {
            prop: 'Invalid',
            label: '作废标志',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'InvoiceStatus',
            label: '发票状态',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'InvalidDate',
            label: '作废日期',
            minWidth: '120',
            align:'left'
          },
          {
            prop: 'Remark',
            label: '备注',
            minWidth: '120',
            align:'left'
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            minWidth: '86',
            fixed: 'right',
            align: 'right',
          }
        ],
        data: [],
      },
      innerPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        layout: 'total, sizes, prev, pager, next'
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    getButtons(row) {
      const btns = []
      btns.push({
        type: 'text',
        label: '删除',
        icon: '',
        id: 'delete',
        onClick: () => {
          this.delete(row)
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
      getVatlist(params).then((res) => {
        if (res?.Code === 200) {
          this.table.data = res?.Data
          this.innerPage.total = res?.Count
        }
      }).finally(() => {
      })
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

    //删除
    delete(row) {
      this.$confirm('是否确认删除该条数据', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletevatfile({ Id: row.Id }).then((res) => {
          if (res.Code === 200) {
            this.$message.success('删除成功')
            this.handleSearch()
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => { })
    },
    httpRequest(params) {
      const file = params.file
      var form = new FormData()
      form.append('file', file)
      vatfileUpload(form).then((res) => {
        if (res?.Code === 200) {
          this.$message.success(res?.Message || '导入成功')
          this.handleSearch()
        } else {
          this.$message.error(res?.Message || '导入失败')
        }
      }).catch((err) => {
        this.$message.error(err || '导入失败')
      }).finally(() => {
        this.$refs.uploadFile.uploadLoading = false
      })
    },
    downloadTemplate() {
      let url = ''
      const flag = process.env.NODE_ENV === 'development'
      if (flag) {
        url = 'https://pjm-finance-api-test.porton.cn' //测试地址
      } else {
        url = 'https://pjm-finance-api-test.porton.cn' //todo 后面换生产地址
      }
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = `${url}/导入模板.xls`
      link.setAttribute('download', '')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
    justify-content: flex-end;
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
::v-deep .TableButton .el-button{
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