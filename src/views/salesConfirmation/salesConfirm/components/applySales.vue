<template>
  <el-dialog :close-on-click-modal="false" :visible="visible" :title="dialog.title" width="60%" @close="dialogClose">
    <form-search :form="form.props" :items="form.items" :values.sync="form.values" @reset="handleReset"
      @search="handleSearch" />
    <el-table :data="tableData" @row-click="rowClick" @expand-change="toggleRowExpansion" ref="expandTable"
      :row-key="getRowKeys" :expand-row-keys="expands" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <table-list :columns="table.columns" :data="table.data" :showPaging="false" :autoLoad="false" multipleSelect
            @selection="selectChange">
          </table-list>
          <div class="footer1">
            <div>
              <el-button type="primary" size="mini" @click="addSale" :disabled="!selectRows.length">确定</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="SAPSalesOrderNumber">
      </el-table-column>
      <el-table-column label="产品代码" prop="PortonCode">
      </el-table-column>
      <el-table-column label="PO" prop="PONumber">
      </el-table-column>
      <el-table-column label="售达方" prop="SoldSide">
      </el-table-column>
      <el-table-column label="币别" prop="OrderCurrency">
      </el-table-column>
    </el-table>
    <div class="footer">
      <div>
        <el-pagination v-bind="innerPage" background @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
      </div>
      <div>
        <el-button type="primary" size="mini" @click="dialogClose">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getSaleOrder, getOrderInfo, addSale } from '@/api/salesConfirmation'
export default {
  name: "applySales",
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      isShow: true,
      dialog: {
        title: '发起服务类销售确认'
      },
      form: {
        props: {
          labelWidth: '90px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'sapSalesOrderNumber',
            label: '订单号',
            type: 'input',
          },
          {
            name: 'PortonCode',
            label: '产品代码',
            type: 'input',
          },
          {
            name: 'poNumber',
            label: 'PO',
            type: 'input',
          },
          {
            name: 'SoldSide',
            label: '售达方',
            type: 'input',
          },
        ],
        values: {
          sapSalesOrderNumbera: '',
          PortonCode: '',
          poNumber: '',
          SoldSide: '',
        },
      },
      tableData: [],
      innerPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        layout: 'total, sizes, prev, pager, next'
      },
      table: {
        columns: [
          {
            prop: 'ItemNumber',
            label: '行项目',
            minWidth: '140'
          },
          {
            prop: 'LineProjectType',
            label: '交易类型',
            minWidth: '120',
            formatter: ({ row }) => {
              if (row.LineProjectType === 'TAD') {
                return '服务 '
              }
            }
          },
          {
            prop: 'IsSale',
            label: '确认状态',
            minWidth: '120',
            formatter: ({ row }) => {
              if (row.IsSale === 1) {
                return '已确认'
              } else{
                return '未确认'
              }
            }
          },
          {
            prop: 'Currency',
            label: '币别',
            minWidth: '120'
          },
          {
            prop: 'MaterialDescription',
            label: '物料描述',
            minWidth: '120'
          },
        ],
        data: [],
      },
      selectRows: [],
      expands: [], // 只展开一行放入当前行id
      getRowKeys: (row) => { // 获取当前行id
        return row.ID; // 这里看这一行中需要根据哪个属性值是id
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.handleTableSearch()
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('input', false)
      this.form.values = this.$options.data().form.values
      this.innerPage = this.$options.data().innerPage
      this.selectRows = []
      this.expands = []
    },
    // 表单重置
    handleReset() {
      this.form.values = this.$options.data().form.values
      this.innerPage = this.$options.data().innerPage
      this.handleTableSearch()
    },

    // 表单查询
    handleSearch() {
      this.innerPage.currentPage = 1
      this.handleTableSearch()
    },
    handleTableSearch() {
      const params = {
        ...this.form.values,
        pageSize: this.innerPage.pageSize,
        pageIndex: this.innerPage.currentPage
      }
      console.log(params)
      getSaleOrder(params).then((res) => {
        if (res?.Code === 200) {
          this.tableData = res?.Data
          this.innerPage.total = res?.Count
        }
      }).finally(() => {
      })
    },
    //切换每页条数
    handleSizeChange(val) {
      this.innerPage.pageSize = val
      this.innerPage.currentPage = 1
      this.handleTableSearch()
    },

    //切换当前页
    handleCurrentChange(val) {
      this.innerPage.currentPage = val
      this.handleTableSearch()
    },
    toggleRowExpansion(row, expandedRows) {
      this.selectRows = []
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.ID)
        }
      } else {
        this.expands = []
      }
      if (expandedRows.length) {
        getOrderInfo({ OrderNo: row.SAPSalesOrderNumber }).then((res) => {
          if (res?.Code === 200) {
            this.table.data = res?.Data
          }
        }).finally(() => {
        })
      }
    },
    rowClick(row) {
      this.$refs.expandTable.toggleRowExpansion(row, row.expanded);
    },
    // 表格checkbox发生改变时
    selectChange(row) {
      this.selectRows = row
    },
    addSale() {
      let params = {
        OrderNoList: '',
        saleTaxes: []
      }
      let arr = this.selectRows.filter(item => item.IsSale !== 1)
      if ( !arr.length) return this.$message.warning('所选项全是已确认状态')
      arr.forEach(item => {
        params.OrderNoList = item.OrderNo
        let obj = {
          OrderNo: item.OrderNo,
          ItemNumber: item.ItemNumber,
          NoTaxMoney: 0,
        }
        params.saleTaxes.push(obj)
      })
      addSale(params).then((res) => {
        if (res?.Code === 200) {
          this.$message.success('添加成功')
          this.dialogClose()
          this.$parent.handleSearch()
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__footer .el-button {
  min-width: 0;
  margin: 0;
}

.footer {
  padding: 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer1 {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>