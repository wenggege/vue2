<template>
  <div class="container">
    <form-search class="form_search " :form="form.props" :items="form.items" :values.sync="form.values" @reset="handleReset"
      @search="handleFormSearch" />
    <table-handle :buttons="buttons" />
    <table-list :columns="table.columns" :data="table.data" :showPaging="false" @refresh="handleSearch">
      <template #SaleNo="{ row }">
        <a @click.prevent="handleLink(row)">{{  row.SaleNo  }}</a>
      </template>
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
    <!-- 发票 -->
    <invoice v-model="invoice.visible" :data="invoice.data"></invoice>
    <!-- sap信息 -->
    <sapInfo v-model="sapInfo.visible" :a="sapInfo.a" :b="sapInfo.b"></sapInfo>
    <!-- 服务类销售确认 -->
    <applySales v-model="applySales.visible" :data="applySales.data"></applySales>
    <!-- 发起销售确认弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible="saleDialog.visible" :title="saleDialog.title" width="30%" @close="dialogClose">
      <el-form ref="saleDialogForm" :model="saleDialog.form" label-width="70px">
        <el-form-item label="申请说明">
          <el-input type="textarea" v-model="saleDialog.form.applyReason"></el-input>
        </el-form-item>
      </el-form>
		<template #footer>
			<div style="text-align: right;">
				<el-button size="mini" @click="dialogClose">关闭</el-button>
        <el-button type="primary" size="mini" @click="saleDialogSubmit">提交</el-button>
			</div>
		</template>
	</el-dialog>
  </div>
</template>

<script>
import { getsalelist } from '@/api/salesConfirmation'
import { getApplylist } from '@/api/negotiationInvoice'
import sapInfo from './components/sapInfo.vue'
import invoice from './components/invoice.vue'
import applySales from './components/applySales.vue'
export default {
  name: "SalesConfirmation",
  components: {
    sapInfo,
    invoice,
    applySales
  },
  data() {
    const STATUS = [
      {
        label: '未上传',
        id: 0,
        value: 0
      },
      {
        label: '已上传',
        id: 1,
        value: 1
      },
      {
        label: '未上传',
        id: -1,
        value: -1
      },
    ]
    return {
      statusList: STATUS,
      form: {
        props: {
          labelWidth: '140px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'OrderNo',
            label: '销售订单',
            type: 'input',
          },
          {
            name: 'DeliveryNoList',
            label: '交货单号',
            type: 'input',
          },
          {
            name: 'InvoiceNo',
            label: '发票号',
            type: 'input'
          },
          {
            name: 'Btime',
            label: '创建时间',
            type: 'date',
            paramItems: {
              type: 'date',
              format: 'yyyy-MM-dd'
            }
          },
          {
            name: 'FileSaleStatus',
            label: '销售文件上传状态',
            type: 'select',
            paramItems: [
              {
                id: 0,
                label: '未上传',
                value: 0,
                enLabel: ''
              },
              {
                id: 1,
                label: '已上传',
                value: 1,
                enLabel: ''
              },
            ]
          },
          {
            name: 'FileStatus',
            label: '物流文件上传状态',
            type: 'select',
            paramItems: [
              {
                id: 0,
                label: '未上传',
                value: 0,
                enLabel: ''
              },
              {
                id: 1,
                label: '已上传',
                value: 1,
                enLabel: ''
              },
            ]
          },
          {
            name: 'AuditStatus',
            label: '状态',
            type: 'select',
            paramItems: [
              // {
              //   id: 0,
              //   label: '未申请',
              //   value: 0,
              //   enLabel: ''
              // },
              // {
              //   id: 1,
              //   label: '管理审核通过',
              //   value: 1,
              //   enLabel: ''
              // },
              // {
              //   id: 2,
              //   label: '管理拒绝',
              //   value: 2,
              //   enLabel: ''
              // },
              {
                id: 3,
                label: '拒绝',
                value: 3,
                enLabel: ''
              },
              {
                id: 4,
                label: '审核通过',
                value: 4,
                enLabel: ''
              },
              {
                id: 101,
                label: '审批中',
                value: 101,
                enLabel: ''
              },
            ]
          },
        ],
        values: {
          OrderNo: '',
          DeliveryNoList: '',
          InvoiceNo: '',
          Btime: '',
          FileSaleStatus: '',
          FileStatus: '',
          AuditStatus: ''
        },
      },
      buttons: [
        {
          id: 'import',
          type: 'primary',
          icon: 'el-icon-circle-plus-outline',
          label: '服务类销售确认',
          onClick: () => {
            this.applySales.visible = true
          }
        },
      ],
      statusObj: {
        0: '未申请',
        1: '管理审核通过',
        2: '管理拒绝',
        3: '财务拒绝',
        4: '通过',
        101: '审批中'
      },
      table: {
        props: {
        },
        columns: [
          {
            prop: 'SaleNo',
            type: 'slot',
            label: '销售确认申请',
            minWidth: '210',
            align: 'left'
          },
          {
            prop: 'OrderNoList',
            label: '销售订单',
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
          },
          {
            prop: 'DeliveryNoList',
            label: '交货单号',
            minWidth: '120',
            align: 'left'
          },
          {
            prop: 'InvoiceNo',
            label: '发票号',
            minWidth: '120',
            align: 'left'
          },
          {
            prop: 'FileSaleStatus',
            label: '销售文件上传状态',
            minWidth: '150',
            align: 'left',
            formatter: ({ row }) => {
              if (row.FileSaleStatus || row.FileSaleStatus === 0) {
                return this.statusList.find(item => item.id === row.FileSaleStatus).label
              }
            }
          },
          {
            prop: 'FileStatus',
            label: '物流文件上传状态',
            minWidth: '150',
            align: 'left',
            formatter: ({ row }) => {
              if (row.FileStatus || row.FileStatus === 0) {
                return this.statusList.find(item => item.id === row.FileStatus).label
              }
            }
          },
          {
            prop: 'AuditStatus',
            label: '状态',
            minWidth: '120',
            align: 'left',
            formatter: ({ row }) => {
              if (row.AuditStatus || row.AuditStatus === 0) {
                return this.statusObj[row.AuditStatus]
              }
            }
          },
          {
            prop: 'CreateTime',
            label: '创建日期',
            minWidth: '120',
            align: 'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'AuditTime',
            label: '审核时间',
            minWidth: '120',
            align: 'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            width: '275',
            fixed: 'right',
            align: 'right'
          }
        ],
        data: [],
      },
      innerPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20],
        layout: 'total, sizes, prev, pager, next'
      },
      // 发票
      invoice: {
        visible: false,
        data: {},
        a: 'aaaa',
        b: 'bbbb'
      },
      // sap信息
      sapInfo: {
        visible: false,
        a: 'aaaa',
        b: 'bbbb'
      },
      applySales: {
        visible: false,
        data: {},
      },
      //发起销售确认弹窗
      saleDialog: {
        title: '提示',
        visible: false,
        form: {
          applyReason: ''
        }
      }
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
      if (!this.form.values.AuditStatus && this.form.values.AuditStatus !== 0 ) params.AuditStatus = -1
      if (!this.form.values.FileSaleStatus && this.form.values.FileSaleStatus !== 0 ) params.FileSaleStatus = -1
      if (!this.form.values.FileStatus && this.form.values.FileStatus !== 0 ) params.FileStatus = -1
      getsalelist(params).then((res) => {
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
        label: '发起销售确认',
        icon: '',
        id: 'sale',
        onClick: () => {
          this.saleDialog.visible = true
        }
      })
      btns.push({
        type: 'text',
        label: '文件',
        icon: '',
        id: 'file',
        onClick: () => {
          let obj = {
            SalesType: row.SalesType
          }
          this.$router.push({ path: `./salesConfirmFileList/${row.SaleNo}`, query:{data:JSON.stringify(obj)}})
        }
      })
      btns.push({
        type: 'text',
        label: '发票',
        icon: '',
        id: 'invoice',
        onClick: () => {
          this.invoice.data = row
          this.invoice.visible = true
        }
      })
      btns.push({
        type: 'text',
        label: 'SAP信息',
        icon: '',
        id: 'SAP',
        onClick: () => {
          //todo
          this.sapInfo.visible = true
        }
      })
      // if (row.Status === 5) { // 通过审批后出现
      //   btns.push({
      //     type: 'text',
      //     label: 'SPA信息',
      //     icon: '',
      //     id: 'SPA',
      //     onClick: () => {
      //       //todo
      //     }
      //   })
      // }
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
    //流程编号跳转详情
    handleLink(row) {
      console.log(row)
      if (row.SalesType === '服务') {
        this.$router.push({ path: `./serviceDetail`, query: { OrderNoList: JSON.stringify(row.OrderNoList),SaleNo: JSON.stringify(row.SaleNo) } })
      } else {
        this.$router.push({ path: `./productDetail`, query: { OrderNoList: JSON.stringify(row.OrderNoList),SaleNo: JSON.stringify(row.SaleNo) } })
      }
    },
    dialogClose() {
      this.saleDialog.visible = false
      this.saleDialog.form.applyReason = ''
    },
    saleDialogSubmit() {
      console.log(this.saleDialog.form.applyReason)
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
.el-dialog__footer .el-button{
  margin: 0 5px;
}
</style>