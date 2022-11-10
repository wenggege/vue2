<template>
	<div class="container">
		<upload-file ref="uploadFile" accept=".xls,.xlsx,.doc,.docx,.pdf,.png,.jpg,.jpeg," buttonText="上传文件" buttonType="default" multiple
			:titleShow="true" :tipsTitleShow="false" :title="`${SalesOrderNumber}文件列表`" :limit="10" @httpRequest="httpRequest">
		</upload-file>
		<table-list :columns="table.columns" :data="table.data" :showPaging="false" @refresh="handleSearch"
			style="margin-top:16px">
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
			<div v-if="buttonShow">
				<el-button size="mini" @click="back">返回</el-button>
				<el-button type="primary" size="mini" @click="logConfirm" v-if="SalesType === '产品'">已上传物流确认文件</el-button>
				<el-button type="primary" size="mini" @click="saleConfirm">已上传销售确认文件</el-button>
			</div>
		</div>
	</div>
</template>
<script>
import { fileUpload } from '@/api/negotiationInvoice'
import { saleAddorupdatefile, getFilelist, deletefile } from '@/api/salesConfirmation'
export default {
	name: 'FileList',
	data() {
		return {
			SalesType:'', // 交易类型
			SalesOrderNumber: '',
			buttonShow: true,
			title: '',
			table: {
				props: {
				},
				columns: [
					{
						prop: 'FileNmae',
						type: 'slot',
						label: '文件名称',
						minWidth: '120'
					},
					{
						prop: 'FileType',
						label: '格式',
						minWidth: '120'
					},
					{
						prop: 'FileSize',
						label: '大小',
						minWidth: '120'
					},
					{
						prop: 'Createtime',
						label: '上传时间',
						minWidth: '120',
						formatter: ({ cellValue }) => {
							if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
						}
					},
					{
						prop: 'ApplyUser',
						label: '上传人',
						minWidth: '120'
					},
					{
						type: 'slot',
						prop: 'operation',
						label: '操作',
						width: '160',
						fixed: 'right'
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
			fileList: [],
		}
	},
	watch: {
		$route: {
			handler: function (route) {
				if (route.params.SalesOrderNumber !== '') {
					this.SalesType = JSON.parse(route.query.data).SalesType
					this.SalesOrderNumber = route.params.SalesOrderNumber
				}
			},
			immediate: true
		}
	},
	methods: {
		httpRequest(params) {
			const file = params.file
			const filetype = file.name.split('.').pop()
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
					this.fileList.push({
						Id:0,
						FileNmae: file.name,
						FileType: filetype,
						FileSize: file.size,
						FileUrl: res.Data[0]
					})
					this.table.data.unshift({
						Id:0,
						FileNmae: file.name,
						FileType: filetype,
						FileSize: file.size,
						FileUrl: res.Data[0]
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
				serverCode: this.SalesOrderNumber,
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
			window.open(row.FileUrl)
		},
		download(row) {
			const link = document.createElement('a')
			link.download = row.FileNmae
			link.href = row.FileUrl
			link.style.display = 'none'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		},
		deletefile(row) {
			this.$confirm('是否确认删除该条数据', '删除确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if (row.Id === 0) {
					this.table.data.forEach((item,index) => {
						if (item.FileUrl === row.FileUrl) {
							this.table.data.splice(index,1)
						}
					})
				} else {
					deletefile({ Id: row.Id,SaleNo:this.SalesOrderNumber }).then((res) => {
						if (res.Code === 200) {
							this.$message.success('删除成功')
							this.handleSearch()
						} else {
							this.$message.error('删除失败')
						}
					})
				}	
			}).catch(() => { })
		},
		//物流上传
		logConfirm: _.debounce(function (e) {
      if (!this.table.data.length) return this.$message.warning('请选择文件上传')
			let paramsList = this.table.data.filter(item => item.Id === 0)
			if (!paramsList.length) return this.$message.warning('请上传新文件')
			const param = {
				SaleNo: this.SalesOrderNumber,
				FileSaleStatus: -1,
				FileStatus: 1,
				list: paramsList
			}
			saleAddorupdatefile(param).then((res) => {
				if (res?.Code === 200) {
					this.$message.success('上传成功')
					this.handleSearch()
					this.$router.go(-1)
				} else {
					this.$message.error('上传失败')
				}
			})
    }, 400),

		//销售上传
		saleConfirm: _.debounce(function (e) {
      if (!this.table.data.length) return this.$message.warning('请选择文件上传')
			let paramsList = this.table.data.filter(item => item.Id === 0)
			if (!paramsList.length) return this.$message.warning('请上传新文件')
			const param = {
				SaleNo: this.SalesOrderNumber,
				FileSaleStatus: 1,
				FileStatus: -1,
				list: paramsList
			}
			saleAddorupdatefile(param).then((res) => {
				if (res?.Code === 200) {
					this.$message.success('上传成功')
					this.handleSearch()
					this.$router.go(-1)
				} else {
					this.$message.error('上传失败')
				}
			})
    }, 400),

		// 取消
		back() {
			this.$router.go(-1)
			this.fileList = []
		},
	},
}


</script>
<style lang="scss" scoped>
.container {
	padding: 16px !important;
	overflow-y: hidden;

	.footer {
		padding: 16px 0 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}

a {
	font-size: 14px;
	color: #1765EC;

	&:hover {
		color: #1765EC !important;
		;
	}
}

.footer_btn {
	display: flex;
	justify-content: center;
	align-items: center;
}

::v-deep .el-table {

	tr th,
	tr td {
		border-right: none;
	}
}
</style>