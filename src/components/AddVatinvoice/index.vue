<!-- 关联增值税发票 -->
<template>
	<div style="padding: 16px 0;">
		<el-button type="primary" size="mini" icon="el-icon-plus" @click="add">关联增值税发票</el-button>
		<el-dialog :close-on-click-modal="false" :visible="addDialog.show" title="增值税发票列表" width="70%" b
			@close="cancel">
			<table-list :columns="table.columns" :data="table.data" :showPaging="false" multipleSelect
				@refresh="handleSearch" @selection="selectChange">
			</table-list>
			<div class="footer">
				<div>
					<el-pagination v-bind="innerPage" background @current-change="handleCurrentChange"
						@size-change="handleSizeChange" />
				</div>
			</div>
			<template #footer>
				<div style="text-align: center;">
					<el-button size="mini" @click="cancel" style="margin-right: 10px">取消</el-button>
					<el-button type="primary" size="mini" @click="confirm"
						:disabled="selectRows.length > 0 ? false : true">确认
					</el-button>
				</div>
			</template>
		</el-dialog>
		<div class="content" v-if="contentShow">
			<div class="content_container">
				<div v-for="(item, index) in contentList" :key="index" class="content_item">
					<div>
						<div class="item">
							<span style="margin-right:6px">{{ item.InvoiceNo }}</span><i class="el-icon-close"
								@click="handledelete(item, index)"></i>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
import { getVatlist, addunion, deleteunion, Getunion } from '@/api/negotiationInvoice'
export default {
	name: 'AddVatinvoice',
	props: {
		params: {
			type: Object,
			default: () => ({})
		},
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
			contentShow: false,
			typeList: INVOICE_TYPE,
			table: {
				columns: [
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
            align:'right'
          },
          {
            prop: 'Rate',
            label: '税率',
            minWidth: '120',
            align:'right',
          },
          {
            prop: 'TotalTaxMoney',
            label: '合计税额',
            minWidth: '120',
            align:'right'
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
				pageSize: 20,
				currentPage: 1,
				total: 0,
				pageSizes: [10, 20, 50, 100, 200],
				layout: 'total, sizes, prev, pager, next'
			},
			selectRows: [],
			contentList: [],
			addDialog: {
				show: false,
			},
		}
	},
	created() {
		this.GetUnion();
	},
	watch: {
		contentList(val) {
			if (val.length) {
				this.contentShow = true
			} else {
				this.contentShow = false
			}
		}
	},
	methods: {
		add() {
			this.addDialog.show = true
			this.handleSearch()
		},
		// 查询列表信息
		handleSearch() {
			const params = {
				IsUse:0,
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
		async GetUnion() {
			console.log(this.params)

			var param={
				InvoiceRecordNumber:this.params.InvoiceRecordNumber,
				recordNo:this.params.RecordNo?.InvoiceNo,
				SalesOrderNumber:this.params.SalesOrderNumber,
			}

			var res = await Getunion(param);
			if (res?.Code === 200) {
				this.contentList = res.Data
			}

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
		selectChange(rows) {
			this.selectRows = rows
		},
		cancel() {
			this.addDialog.show = false
			this.selectRows = []
		},
		confirm() {
			console.log(1);
			let flag = this.params.hasOwnProperty('RecordNo') && this.params.hasOwnProperty('SalesOrderNumber') && this.params.hasOwnProperty('InvoiceRecordNumber')
			if (flag) {
				let list = []
				this.selectRows.forEach(item => {
					let obj = {}
					obj = {
						InvoiceNo: item.InvoiceNo,
						InvoiceCode: item.InvoiceCode,
						VATInvoiceId: item.Id,
						InvoiceRecordNumber: this.params.InvoiceRecordNumber,
						SalesOrderNumber: this.params.SalesOrderNumber,
						RecordNo: this.params.RecordNo?.InvoiceNo,
						IsDelete: item.IsDelete,
					}
					list.push(obj)
				})
				addunion(list).then(res => {
					if (res?.Code === 200) {
						this.$message.success('关联成功')
						this.contentList = this.contentList.concat(this.selectRows)
						this.contentList = this.ArrSet(this.contentList, 'InvoiceNo')
						this.cancel();
						this.GetUnion();
					} else {
						this.$message.error(res.Messase || '关联失败')
						this.cancel()
					}
				})
			} else {
				this.$message.error('参数错误')
			}
		},
		handledelete(item, index) {
			console.log(item)
			console.log(this.params)
			this.$confirm('是否确认删除该条数据', '删除确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteunion({ Id: item.Id }).then((res) => {
					if (res.Code === 200) {
						this.$message.success('删除成功')
						this.contentList.splice(index, 1)
					} else {
						this.$message.error('删除失败')
					}
				})
			}).catch(() => { })
		},

		//数组去重
		ArrSet(Arr, param) {
			var obj = {};
			const arrays = Arr.reduce((setArr, item) => {
				obj[item[param]] ? '' : obj[item[param]] = true && setArr.push(item);
				return setArr;
			}, []);
			return arrays;
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

.el-dialog__footer .el-button {
	min-width: 0;
	margin: 0;
}

.content {
	width: 100%;
	background-color: #F7F8FA;
	margin-top: 10px;

	.content_container {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		height: 40px;

		.content_item {


			.item {
				margin: 0 8px;
				font-size: 12px;
				width: 95px;
				height: 22px;
				background: #FFFFFF;
				border: 1px solid #DCDEE0;
				border-radius: 2px;
				line-height: 22px;
				text-align: center;

				.el-icon-close:hover {
					cursor: pointer;
					color: blue
				}
			}
		}
	}
}
::v-deep .el-table {
  tr th,
  tr td {
    border-right: none;
  }
}
</style>