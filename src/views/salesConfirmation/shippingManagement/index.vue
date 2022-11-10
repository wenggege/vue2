<template>
  <div class="container">
    <form-search class="form_search" :form="form.props" :items="form.items" :values.sync="form.values" @reset="handleReset"
      @search="handleFormSearch" />
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
  </div>
</template>

<script>
import { getVatlist } from '@/api/negotiationInvoice'
export default {
  name: "ShippingManagement",
  components: {
  },
  data() {
    return {
      form: {
        props: {
          labelWidth: '160px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'a',
            label: '销售订单',
            type: 'input'
          },
          {
            name: 'b',
            label: '发票号',
            type: 'input'
          },
          {
            name: 'c',
            label: '数量',
            type: 'input'
          },
          {
            name: 'd',
            label: '运输方式',
            type: 'input'
          },
          {
            name: 'e',
            label: '发运条款',
            type: 'input'
          },
          {
            name: 'f',
            label: '操作状态',
            type: 'select',
            paramItems: []
          },
          {
            name: 'g',
            label: '物流负责人',
            type: 'input'
          },
          {
            name: 'h',
            label: '提货日期',
            type: 'date',
            paramItems: {
              type: 'date',
              //format: 'yyyy-MM-ddTHH:mm:ss'
            }
          },
          {
            name: 'i',
            label: '实现销售日期',
            type: 'date',
            paramItems: {
              type: 'date',
              //format: 'yyyy-MM-ddTHH:mm:ss'
            }
          },
          {
            name: 'j',
            label: '是否有实现销售日期',
            type: 'select',
            paramItems: []
          },
          {
            name: 'k',
            label: '是否完成销售确认',
            type: 'select',
            paramItems: []
          },
        ],
        values: {
          a: '',
          b: '',
          c: '',
          d: '',
          e: '',
          f: '',
          g: '',
          h: '',
          i: '',
          j: '',
          k: '',
        },
      },
      table: {
        props: {
        },
        columns: [
          {
            prop: 'a',
            label: '发票号',
            minWidth: '180',
            align:'left',
          },
          {
            prop: 'b',
            label: '产品号',
            minWidth: '200',
            align:'left',
          },
          {
            prop: 'c',
            label: '数量',
            minWidth: '120',
            align:'left',
          },
          {
            prop: 'd',
            label: '单位',
            minWidth: '120',
            align:'left',
          },
          {
            prop: 'e',
            label: '预计出厂日期',
            minWidth: '120',
            align:'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'f',
            label: '提货日期',
            minWidth: '120',
            align:'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'g',
            label: '运输方式',
            minWidth: '120',
            align:'left',
          },
          {
            prop: 'h',
            label: '发运条款',
            minWidth: '120',
            align:'left',
          },
          {
            prop: 'i',
            label: '实现销售日期',
            minWidth: '120',
            align:'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'j',
            label: '到达日期',
            minWidth: '120',
            align:'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'k',
            label: '操作状态',
            minWidth: '120',
            align:'left',
            // formatter: ({ row }) => {
            //   if (row.Status || row.Status === 0) {
            //     return this.statusObj[row.Status]
            //   }
            // }
          },
          {
            prop: 'l',
            label: '物流责任人',
            minWidth: '120',
            align:'left',
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            width: '180',
            fixed: 'right',
            align:'right'
          }
        ],
        data: [],
      },
      innerPage: {
        pageSize: 20,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        layout: 'total, sizes, prev, pager, next'
      },
    }
  },
  methods: {
    // 表单重置
    handleReset() {
      this.form.values = this.$options.data().form.values
      this.innerPage = this.$options.data().innerPage
      this.handleSearch()
    },

    // 表单查询
    handleFormSearch() {
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
    getButtons(row) {
      const btns = []
      btns.push({
        type: 'text',
        label: '取消发运',
        icon: '',
        id: 'cancel',
        onClick: () => {
          //todo
        }
      })
      btns.push({
        type: 'text',
        label: '文件管理',
        icon: '',
        id: 'management',
        onClick: () => {
          //todo
          this.$router.push({ path: `./fileList/${row.SalesOrderNumber}` })
        }
      })
      return btns
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
    margin-bottom: 16px;
  }

  .footer {
    padding-top: 16px;
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
