<template>
  <el-dialog :close-on-click-modal="false" :visible="visible" :title="dialog.title" width="60%" @close="dialogClose">
    <table-list :columns="table.columns" :data="table.data" :showPaging="false" @refresh="handleSearch">
      <template #FileNmae="{ row }">
        <a @click.prevent="handleLink(row)">{{  row.FileNmae  }}</a>
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
  </el-dialog>
</template>
<script>
import { getFilelist, deletefile } from '@/api/negotiationInvoice'
export default {
  name: "fileList",
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    SalesOrderNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialog: {
        title: '文件列表'
      },
      table: {
        props: {
        },
        columns: [
          {
            prop: 'FileNmae',
            type: 'slot',
            label: '文件名称',
            minWidth: '180',
            align: 'left'
          },
          {
            prop: 'FileType',
            label: '格式',
            minWidth: '60',
            align: 'left'
          },
          {
            prop: 'FileSize',
            label: '大小',
            minWidth: '60',
            align: 'left'
          },
          {
            prop: 'Createtime',
            label: '上传时间',
            minWidth: '120',
            align: 'left',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'ApplyUser',
            label: '上传人',
            minWidth: '120',
            align: 'left'
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            width: '160',
            fixed: 'right',
            align: 'right'
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
    dialogClose() {
      this.$emit('input', false)
    },
    dialogSubmit() { },
    // 查询列表信息
    handleSearch() {
      const params = {
        SalesOrderNumber: this.SalesOrderNumber,
        pageSize: this.innerPage.pageSize,
        pageIndex: this.innerPage.currentPage
      }
      getFilelist(params).then((res) => {
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

    getButtons(row) {
      const btns = []
      btns.push({
        type: 'primary',
        label: '下载',
        icon: '',
        id: 'download',
        onClick: () => {
          this.download(row)
        }
      })
      btns.push({
        type: 'danger',
        label: '删除',
        icon: '',
        id: 'delete',
        onClick: () => {
          this.deletefile(row)
        }
      })
      return btns
    },
    handleLink(row) {
      window.open(row.FileUrl)
    },
    download(row) {
      const link = document.createElement('a')
      let blob = new Blob([row.FileUrl])
      link.download = row.FileNmae
      link.href = URL.createObjectURL(blob)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blob)
    },
    deletefile(row) {
      this.$confirm('是否确认删除该条数据', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletefile({ Id: row.Id, SalesOrderNumber: row.SalesOrderNumber }).then((res) => {
          if (res.Code === 200) {
            this.$message.success('删除成功')
            this.handleSearch()
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => { })
    },
  }
}
</script>
<style lang="scss" scoped>
.footer {
  padding: 16px 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

a {
  font-size: 14px;
  color: #1765EC;

  &:hover {
    color: #1765EC !important;
    ;
  }
}

::v-deep .el-table {

  tr th,
  tr td {
    border-right: none;
  }
}
</style>