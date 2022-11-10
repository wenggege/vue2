<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible="visible"
    :title="dialog.title"
    width="70%"
    @close="dialogClose"
  >
    <div>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add"
        >关联发票</el-button
      >
    </div>
    <table-list
      :columns="table.columns"
      :data="table.data"
      :showPaging="false"
      :autoLoad="false"
      style="margin-top: 16px"
    >
      <template #operation="{ row }">
        <table-button :list="getButtons(row)" />
      </template>
    </table-list>
    <div class="footer1">
      <!-- <div>
				<el-pagination v-bind="innerPage" background @current-change="handleCurrentChange"
					@size-change="handleSizeChange" />
			</div> -->
      <div>
        <el-button type="primary" size="mini" @click="dialogClose"
          >关闭</el-button
        >
      </div>
    </div>
    <!-- 关联弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible="addDialog.visible"
      :title="addDialog.title"
      width="70%"
      append-to-body
      @close="addDialogClose"
    >
      <form-search
        :form="form.props"
        :items="form.items"
        :values.sync="form.values"
        @reset="handleReset"
        @search="handleFormSearch"
      />
      <table-list
        :columns="addDialog.columns"
        :data="addDialog.data"
        :showPaging="false"
        :autoLoad="false"
      >
        <template #operation="{ row }">
          <table-button :list="getaddDialogButtons(row)" />
        </template>
      </table-list>
      <div class="footer">
        <div>
          <el-pagination
            v-bind="addDialog.innerPage"
            background
            @current-change="handleaddDialogCurrentChange"
            @size-change="handleaddDialogSizeChange"
          />
        </div>
        <div>
          <el-button type="primary" size="mini" @click="addDialogClose"
            >关闭</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- 导出弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible="exportDialog.show"
      :title="exportDialog.title"
      width="60%"
      append-to-body
      @close="exportDialogClose"
    >
      <el-row>
        <el-col :span="8">
          <div class="tree">
            <div class="tree_item">
              <el-tree
                :data="exportDialog.treeData"
                empty-text="暂无数据"
                node-key="id"
                :highlight-current="true"
                :default-expand-all="true"
                :props="exportDialog.defaultProps"
                @node-click="handleNodeClick"
              >
                <span class="custom-tree-node" slot-scope="{ data }">
                  <span>
                    <i class="el-icon-document" style="margin-right: 10px"></i
                    >{{ data.label }}
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <table-list
            :columns="exportDialog.columns"
            :data="exportDialog.data"
            :showPaging="false"
            :auto-load="false"
          >
            <template #operation="{ row }">
              <table-button :list="exportButtons(row)" />
            </template>
          </table-list>
        </el-col>
      </el-row>
      <template #footer>
        <div style="text-align: right">
          <el-button
            size="mini"
            @click="exportDialogClose"
            style="margin-right: 10px"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="exportDialogClose"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { getSaleUnionList, subSaleUnion } from "@/api/salesConfirmation";
import { getRecordlist, recordexportList } from "@/api/negotiationInvoice";
export default {
  name: "invoice",
  model: {
    prop: "visible",
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialog: {
        title: "发票",
      },
      table: {
        columns: [
          {
            prop: "InvoniceNo",
            label: "发票号",
            minWidth: "140",
            align: "left",
          },
          {
            prop: "InvoiceAmount",
            label: "金额",
            minWidth: "120",
            align: "right",
          },
          {
            prop: "OrderCurrency",
            label: "币别",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "SaleNo",
            label: "产品号",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "InvoiceTime",
            label: "开票日期",
            width: "120",
            align: "left",
            formatter: ({ cellValue }) => {
              if (cellValue) {
                return this.$moment(cellValue).format("YYYY-MM-DD");
              }
            },
          },
          {
            type: "slot",
            prop: "operation",
            label: "操作",
            width: "180",
            fixed: "right",
            align: "right",
          },
        ],
        data: [],
      },
      innerPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 50, 100, 200],
        layout: "total, sizes, prev, pager, next",
      },
      // 关联弹窗
      form: {
        props: {
          labelWidth: "100px",
          labelPosition: "right",
          labelSuffix: "：",
        },
        items: [
          {
            name: "ElabCode",
            label: "产品号",
            type: "input",
          },
          {
            name: "InvoiceTime",
            label: "开票日期",
            type: "date",
            paramItems: {
              type: "date",
              format: "yyyy-MM-dd",
            },
          },
        ],
        values: {
          ElabCode: "",
          InvoiceTime: "",
        },
      },
      addDialog: {
        visible: false,
        title: "商业发票",
        columns: [
          {
            prop: "InvoiceRecordNumber",
            label: "发票号",
            minWidth: "140",
            align: "left",
          },
          {
            prop: "InvoiceAmount",
            label: "金额",
            minWidth: "120",
            align: "right",
          },
          {
            prop: "OrderCurrency",
            label: "币别",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "ElabCode",
            label: "产品号",
            minWidth: "120",
            align: "left",
          },
          {
            prop: "InvoiceTime",
            label: "开票日期",
            width: "120",
            align: "left",
            formatter: ({ cellValue }) => {
              if (cellValue) {
                return this.$moment(cellValue).format("YYYY-MM-DD");
              }
            },
          },
          {
            type: "slot",
            prop: "operation",
            label: "操作",
            width: "180",
            fixed: "right",
            align: "right",
          },
        ],
        data: [],
        innerPage: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
          pageSizes: [10, 20, 50, 100, 200],
          layout: "total, sizes, prev, pager, next",
        },
      },
      // 导出弹窗
      exportDialog: {
        show: false,
        title: "导出发票",
        columns: [
          {
            prop: "FinalCustomer",
            label: "公司名称",
            align: "left",
          },
          {
            type: "slot",
            prop: "operation",
            label: "操作",
            width: "80",
            fixed: "right",
          },
        ],
        data: [],
        treeData: [],
        defaultProps: {
          children: "children",
          label: "label",
          disabled: function (data, node) {
            if (data.children && data.children.length) {
              return true;
            } else {
              return false;
            }
          },
        },
        params: {
          InvoiceRecordNumber: "",
          salesOrderNumber: "",
          crmname: "",
        },
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.dialog.title = this.data.SaleNo + "发票";
        this.handleSearch();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("input", false);
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
        label: "导出",
        icon: "",
        id: "export",
        onClick: () => {
          this.exportDialog.show = true;
          this.exportDialogSearch(row);
        },
      });
      btns.push({
        type: "text",
        label: "删除",
        icon: "",
        id: "delete",
        onClick: () => {
          this.deletefile(row);
        },
      });
      return btns;
    },
    //切换每页条数
    handleSizeChange(val) {
      this.innerPage.pageSize = val;
      this.innerPage.currentPage = 1;
      this.handleSearch();
    },

    //切换当前页
    handleCurrentChange(val) {
      this.innerPage.currentPage = val;
      this.handleSearch();
    },
    // 删除
    deletefile(row) {
      this.$confirm("是否确认删除该条数据", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = [];
          let obj = {
            Id: row.Id,
            SaleNo: this.data.SaleNo,
            InvoniceNo: row.InvoiceRecordNumber,
            InvoiceAmount: row.InvoiceAmount,
            OrderCurrency: row.OrderCurrency,
            InvoiceTime: row.InvoiceTime,
            Status: 3,
          };
          params.push(obj);
          subSaleUnion(params).then((res) => {
            if (res?.Code === 200) {
              this.$message.success("删除成功");
              this.handleSearch();
            } else {
              this.$message.success("删除失败");
            }
          });
        })
        .catch(() => {});
    },
    add() {
      this.addDialog.visible = true;
      this.handleaddDialogSearch();
    },
    // 关联弹窗
    addDialogClose() {
      this.form.values = this.$options.data().form.values;
      this.addDialog.innerPage = this.$options.data().addDialog.innerPage;
      this.addDialog.visible = false;
    },
    // 表单重置
    handleReset() {
      this.form.values = this.$options.data().form.values;
      this.addDialog.innerPage = this.$options.data().addDialog.innerPage;
      this.handleaddDialogSearch();
    },

    // 表单查询
    handleFormSearch() {
      this.addDialog.innerPage.currentPage = 1;
      this.handleaddDialogSearch();
    },
    getaddDialogButtons(row) {
      const btns = [];
      btns.push({
        type: "text",
        label: "关联",
        icon: "",
        id: "add",
        onClick: () => {
          this.subSaleUnion(row);
        },
      });
      return btns;
    },
    handleaddDialogSearch() {
      const params = {
        ...this.form.values,
        status: 2,
        pageSize: this.addDialog.innerPage.pageSize,
        pageIndex: this.addDialog.innerPage.currentPage,
      };
      getRecordlist(params)
        .then((res) => {
          if (res?.Code === 200) {
            this.addDialog.data = res?.Data;
            this.addDialog.innerPage.total = res?.Count;
          }
        })
        .finally(() => {});
    },
    //切换每页条数
    handleaddDialogSizeChange(val) {
      this.addDialog.innerPage.pageSize = val;
      this.addDialog.innerPage.currentPage = 1;
      this.handleaddDialogSearch();
    },

    //切换当前页
    handleaddDialogCurrentChange(val) {
      this.addDialog.innerPage.currentPage = val;
      this.handleaddDialogSearch();
    },
    // 关联发票
    subSaleUnion(row) {
      let params = [];
      let obj = {
        SaleNo: this.data.SaleNo,
        InvoniceNo: row.InvoiceRecordNumber,
        InvoiceAmount: row.InvoiceAmount,
        OrderCurrency: row.OrderCurrency,
        InvoiceTime: row.InvoiceTime,
        Status: 1,
      };
      params.push(obj);
      subSaleUnion(params).then((res) => {
        if (res?.Code === 200) {
          this.$message.success("关联成功");
          this.addDialogClose();
          this.handleSearch();
        } else {
          this.$message.success("关联失败");
        }
      });
    },
    // 导出弹窗
    exportDialogClose() {
      this.exportDialog.show = false;
      this.exportDialog.data = [];
    },
    exportDialogSearch(row) {
      recordexportList({ InvoiceRecordNumber: row.InvoniceNo }).then((res) => {
        if (res?.Code === 200) {
          this.exportDialog.treeData = this.toTreeData(res.Data);
        }
      });
    },
    exportButtons(row) {
      const btns = [];
      btns.push({
        type: "text",
        label: "导出",
        icon: "",
        id: "exportPPS",
        onClick: () => {
          window.location.href =
            "https://pjm-finance-api-test.porton.cn/api/invoice/recordexport?InvoiceRecordNumber=" +
            this.exportDialog.params.InvoiceRecordNumber +
            "&salesOrderNumber=" +
            this.exportDialog.params.salesOrderNumber +
            "&crmname=" +
            row.FinalCustomer;
        },
      });
      return btns;
    },
    handleNodeClick(data) {
      if (data.hasOwnProperty("children")) return;
      this.exportDialog.data = [];
      this.exportDialog.params.InvoiceRecordNumber = data.InvoiceRecordNumber;
      this.exportDialog.params.salesOrderNumber = data.SalesOrderNumber;
      this.exportDialog.data = data.salePathDtos;
    },
    toTreeData(list) {
      if (!list.length) return list;
      list.forEach((item, index) => {
        item.label = item.SAPSalesOrderNumber;
        if (item.recordExporItem.length) {
          item.recordExporItem.forEach((ele, index) => {
            // ele.label = `发票${index + 1}`
            ele.label = ele.InvoiceNo;
            ele.SalesOrderNumber = item.SalesOrderNumber;
          });
          item.children = item.recordExporItem;
        }
      });
      return list;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 16px 16px 16px 0;
}
.el-dialog__footer .el-button {
  min-width: 0;
  margin: 0;
}

.footer1 {
  padding: 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: -10px;
}
.footer {
  padding: 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: -10px;
}
::v-deep .el-table {
  tr th,
  tr td {
    border-right: none;
  }
}
</style>