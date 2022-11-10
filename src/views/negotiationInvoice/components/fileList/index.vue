<template>
  <div class="container">
    <upload-file ref="uploadFile" :uploadShow="uploadShow" accept=".xls,.xlsx,.doc,.docx,.pdf,.png,.jpg,.jpeg," buttonText="上传文件" buttonType="default" multiple
      :titleShow="true" :title="`${orderId}订单文件列表`" :limit="10" @httpRequest="httpRequest">
    </upload-file>
    <table-list :columns="table.columns" :data="table.data" :showPaging="false" @refresh="handleSearch"
      style="margin-top:16px">
      <template #FileNmae="{ row }">
        <a @click.prevent="handleLink(row)">{{ row.FileNmae }}</a>
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
      <div v-if="buttonShow">
        <el-button type="primary" size="mini">已上传文件</el-button>
      </div>
    </div>
    <div class="footer_btn" v-if="splitArr[1]">
      <el-button size="mini" @click="back">返回</el-button>
    </div>
    <!-- 预览弹窗 -->
    <previewDialog v-model="preview.visible" :fileData="preview.data"></previewDialog>
  </div>
</template>
<script>
import previewDialog from "../previewDialog";
import { fileUpload, getFilelist, addorupdatefile, deletefile } from '@/api/negotiationInvoice'
export default {
  name: 'FileList',
  components: { previewDialog }, 
  data() {
    return {
      orderId:'', //订单号
      uploadShow: true, // 是否显示上传按钮
      splitArr: [],
      SalesOrderNumber: '',
      buttonShow: false,
      table: {
        props: {
        },
        columns: [
          {
            prop: 'FileNmae',
            type: 'slot',
            label: '文件名称',
            minWidth: '120',
            align: 'left',
          },
          {
            prop: 'FileType',
            label: '格式',
            minWidth: '120',
            align: 'left',
          },
          {
            prop: 'FileSize',
            label: '大小',
            minWidth: '120',
            align: 'left',
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
            align: 'left',
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            width: '160',
            fixed: 'right',
            align: 'right',
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
      preview: {
        visible: false,
        data: {}
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.SalesOrderNumber !== '') {
          this.splitArr = route.params.SalesOrderNumber.split('-')
          this.SalesOrderNumber = this.splitArr[0]
          if (route.query.data) {
            let obj = JSON.parse(route.query.data)
            console.log(obj)
            this.orderId = obj.SAPSalesOrderNumber
            if (obj.hasOwnProperty('uploadShow')) this.uploadShow = obj.uploadShow
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    httpRequest(params) {
      const file = params.file
      const filetype = file.name.split('.').pop()
      console.log(file)
      console.log(filetype)
      var form = new FormData()
      form.append('file', file)
      fileUpload(form).then((res) => {
        if (res?.Code === 200) {
          this.$message.success(res?.Message || '上传成功')
          const data = {
            SalesOrderNumber: this.SalesOrderNumber,
            FileNmae: file.name,
            FileType: filetype,
            FileSize: file.size,
            FileUrl: res.Data[0]
          }
          // 调用添加发票申请文件接口
          addorupdatefile(data).then((res) => {
            if (res?.Code === 200) {
              this.handleSearch()
            } else {
              this.$message.error('添加文件失败')
            }
          })
        } else {
          this.$message.error(res?.Message || '上传失败')
        }
      }).catch((err) => {
        this.$message.error(err || '上传失败')
      }).finally(() => {
        this.$refs.uploadFile.uploadLoading = false
      })
    },
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
        type: 'text',
        label: '下载',
        icon: '',
        id: 'download',
        onClick: () => {
          this.download(row)
        }
      })
      btns.push({
        type: 'text',
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
      this.preview.visible = true
      this.preview.data = row
    },
    handleClose() {
      this.dialog.show = false
    },
    download(row) {
      const link = document.createElement('a')
      let blob = new Blob([row.FileUrl])
      link.download = row.FileNmae
      link.href = URL.createObjectURL(blob)
      link.href = row.FileUrl
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blob)
    },
    deletefile(row) {
      console.log(row)
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
    // 取消
    back() {
      this.$router.go(-1)
    },

  },
}


</script>
<style lang="scss" scoped>
.container {
  padding: 16px 16px 0px 16px !important;
  overflow-y: hidden;

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

.footer_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}
::v-deep .el-table {
  tr th,
  tr td {
    border-right: none;
  }
}
</style>