<template>
	<el-dialog :close-on-click-modal="false" :visible="visible" :title="dialog.title" width="60%" @close="dialogClose">
		<table-list
      :columns="table.columns"
      :data="table.data"
      :showPaging="false"
      :autoLoad="false"
    >
      <template #operation="{ row }">
        <table-button :list="getButtons(row)" />
      </template>
    </table-list>
		<template #footer>
			<div style="text-align: right;">
				<el-button type="primary" size="mini" @click="dialogClose">关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<script>
import { getSaleUnionList, subSaleUnion } from "@/api/salesConfirmation";
export default {
	name: "sapInfo",
	model: {
		prop: 'visible'
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		a: {
			type: String,
			default: ''
		},
		b: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			dialog: {
				title: 'SAP信息'
			},
			      table: {
        columns: [
          {
            prop: "InvoniceNo",
            label: "类型",
            minWidth: "100",
            align: "left",
          },
          {
            prop: "InvoiceAmount",
            label: "主体",
            minWidth: "100",
            align: "left",
          },
          {
            prop: "OrderCurrency",
            label: "编号",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "SaleNo",
            label: "SAP失败原因",
            minWidth: "120",
            align: "left",
          },   
          {
            type: "slot",
            prop: "operation",
            label: "操作",
            width: "120",
            fixed: "right",
            align: "right",
          },
        ],
        data: [],
      },
		}
	},
	watch: {
    visible(val) {
      if (val) {
        this.handleSearch();
      }
    },
  },
	methods: {
		dialogClose() {
			this.$emit('input', false)
		},
		handleSearch() {
      const params = {
        SaleNo: this.data.SaleNo,
        pageSize: this.innerPage.pageSize,
        pageIndex: this.innerPage.currentPage,
      };
      getSaleUnionList(params)
        .then((res) => {
          if (res?.Code === 200) {
            this.table.data = res?.Data;
            this.innerPage.total = res?.Count;
          }
        })
        .finally(() => {});
    },
		getButtons(row) {
      const btns = [];
      btns.push({
        type: "text",
        label: "重新发起SAP申请",
        icon: "",
        id: "export",
        onClick: () => {
          // this.exportDialog.show = true;
          // this.exportDialogSearch(row);
        },
      });
      return btns;
    },
	}
}
</script>
<style lang="scss" scoped>
.el-dialog__footer .el-button {
	min-width: 0;
	margin: 0;
}
::v-deep .el-dialog__header{
	padding: 16px 16px 16px 0;
}
</style>