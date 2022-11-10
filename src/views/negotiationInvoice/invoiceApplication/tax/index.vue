<template>
  <div class="tax">
    <div class="content">
      <h4>博腾制药有限公司</h4>
      <el-row>
        <el-col :span="4">客户代码：</el-col>
        <el-col :span="4">订单：</el-col>
        <el-col :span="4">ISO：</el-col>
        <el-col :span="4">PO：</el-col>
      </el-row>
    </div>
    <!-- 新建发票 -->
    <div class="addtax">
      <div class="button">
        <el-button size="mini" type="primary" @click="AddBtn">新建发票</el-button>
      </div>
      <div>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="行项目" width="120"></el-table-column>
          <el-table-column prop="name" label="品名"></el-table-column>
          <el-table-column prop="address" label="交易类型"></el-table-column>
          <el-table-column prop="address" label="客户产品代码" width="180"></el-table-column>
          <el-table-column prop="address" label="产品号"></el-table-column>
          <el-table-column prop="address" label="最终客户总价" width="180"></el-table-column>
          <el-table-column prop="address" label="币别"></el-table-column>
          <el-table-column prop="address" label="数量"></el-table-column>
          <el-table-column prop="address" label="单位"></el-table-column>
          <el-table-column prop="address" label="特殊描述"></el-table-column>
        </el-table>
      </div>
      <div class="table" v-for="(item,idnex) in piaoNum" :key="idnex">
        <el-row>
          <el-col :span="24">
            <h5>
              <span class="mark"></span>
              <span class="tit">发票{{idnex+1}}</span>
            </h5>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" size="mini" @click="AddDetails(idnex)">添加行</el-button>
            <el-button size="mini">删除发票</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <div>
          <el-form size="mini" :model="resultForm" :rules="resultForm.resultRuls" ref="resultForm">
            <el-table
              empty-text="暂无数据，可 添加行 进行填写"
              ref="multipleTable"
              :data="resultForm.tableData"
              stripe
              style="width: 100%"
              v-loading="searchLoading"
              resizable
              highlight-current-row
            >
              <el-table-column align="center" prop="datashuju" label="行项目" width="180">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-input v-model="scope.row.datashuju" size="mini" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" label="品名" width="180">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-input v-model="scope.row.datashuju" size="mini" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" label="产品号" width="180">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-input v-model="scope.row.datashuju" size="mini" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" width="180">
                <template slot="header" slot-scope="scope">
                  <span style="color:red">*</span> 交易类型
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-select v-model="scope.row.datashuju" size="mini">
                      <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" width="180">
                <template slot="header" slot-scope="scope">
                  <span style="color:red">*</span>发票金额(CNY)
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-input v-model="scope.row.datashuju" size="mini" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" width="180">
                <template slot="header" slot-scope="scope">
                  <span style="color:red">*</span>销项税率
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-select v-model="scope.row.datashuju" size="mini">
                      <el-option
                        v-for="item in taxList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" label="数量" width="180">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-input v-model="scope.row.datashuju" size="mini" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" label="单位" width="180">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-input v-model="scope.row.datashuju" size="mini" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" label="备注" width="180">
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.datashuju'">
                    <el-input v-model="scope.row.datashuju" size="mini" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datashuju" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button type="text" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>
      <div class="btn">
          <el-button  size="mini">取消</el-button>
          <el-button type="primary" size="mini">提交</el-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      piaoNum: 0,
      searchLoading: false,
      typeList: [
        { label: "产品", value: "产品" },
        { label: "服务", value: "服务" },
        { label: "其他", value: "其他" }
      ],
      taxList: [
        { label: "0%", value: "0%" },
        { label: "3%", value: "3%" },
        { label: "6%", value: "6%" },
        { label: "9%", value: "9%" },
        { label: "13%", value: "13%" }
      ],
      resultForm: {
        tableData: [],
        resultRuls: {}
      }
    };
  },
  methods: {
    AddBtn() {
      this.piaoNum++;
    },
    AddDetails(i) {
      this.resultForm.tableData.push({
        datashuju: ""
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tax {
  background: #f7f8fa;
  padding: 0 !important;
  .content {
    background: #ffffff;
    padding: 5px 0 15px 10px;
  }
  .addtax {
    margin: 10px 0;
    padding: 10px;
    background: #ffffff;
    .button {
      margin: 10px 0;
    }
  }
  .mark {
    content: "";
    width: 4px;
    height: 16px;
    border-radius: 0px;
    background-color: #005fe7;
    position: absolute;
    display: block;
    left: 0;
  }
  .tit {
    padding-left: 8px;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
        color: #323233;
  }
  .btn{
    text-align: center;
    margin: 10px 0;
  }
}
</style>