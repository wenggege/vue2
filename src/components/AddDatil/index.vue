<template>
  <div class="diolog">
    <el-dialog title="提交申请" :visible.sync="dialog" width="30%" :show-close="false" :close-on-click-modal="false">
      <div class="content">
        <div style="width:80px; text-align: right;">BU: </div>
        <div>
          <el-select @change="peopleBtn($event)" class="selects" size="mini" v-model="value">
            <el-option v-for="item in options" :key="item.BuName" :label="item.BuKey" :value="item.BuName"></el-option>
          </el-select>
        </div>

      </div>
      <div class="content">
        <div style="width:80px;text-align: right;">业务审批人:</div>
        <div style="font-size:12px">
          <el-select v-model="DepUserName" placeholder="请选择" class="selects" size="mini" @change="userBtn($event)"
            clearable filterable :filter-method="get_asslist">
            <el-option v-for="item in PMOArry" :key="item.BuKey" :value="item.PMO"></el-option>
          </el-select>

        </div>

      </div>
      <div class="foot">
        <el-button @click="hide" size="mini">取消</el-button>
        <el-button type="primary" @click="okBtn" size="mini" :disabled="Sub">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { gettbaseinfo } from "@/api/negotiationInvoice";
import { getsubinvoice } from "../../api/negotiationInvoice";
import { Message } from 'element-ui';
import _ from 'lodash';
export default {
  props: ["DataArry", "ObjDretail", "NewBU"],
  data() {
    return {
      dialog: false,
      options: [
        { BuKey: "Pharma", BuName: "白迎军", PMO: '郭敏', "porton": "porton\\min.guo" },
        { BuKey: "AP", BuName: "辛卓群 ", PMO: '刘伟 ', "porton": "porton\\wei.liu7" },
        { BuKey: "US", BuName: "吉耀辉", PMO: '刘伟', "porton": "porton\\wei.liu7" },
      ],
      PMOArry: [
        { BuKey: "Pharma", BuName: "白迎军", PMO: '郭敏', "porton": "porton\\min.guo" },
        { BuKey: "AP", BuName: "辛卓群 ", PMO: '刘伟 ', "porton": "porton\\wei.liu7" },
        { BuKey: "US", BuName: "吉耀辉", PMO: '刘伟', "porton": "porton\\wei.liu7" },],

      Useroptions: [],
      PMO: "",
      porton: "",
      DepUsercode: "",
      DepUserName: "",
      Sub: false,
      value: "",
      peop: {},
      page: {
        pageSize: 100,
        pageIndex: 1,
        query: ""
      }
    };
  },
  created: function () {
    console.log(1)
    this.get_people();
  },

  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    peopleBtn(e) {
      var model = this.options.filter(a => a.BuName == e)[0]
      this.PMO = model.PMO;
      this.porton = model.porton;
      var umodel = this.PMOArry.filter(a => a.BuName == e)[0]
      this.DepUserName = umodel.PMO;
      this.DepUsercode = umodel.porton;

    },
    userBtn(e) {
      var umodel = this.PMOArry.filter(a => a.PMO == e)[0]
      this.DepUserName = umodel.PMO;
      this.DepUsercode = umodel.porton;
    },
    async get_people() {
      const res = await gettbaseinfo(this.page);
      this.Useroptions = res.Data;
    },
    get_asslist(e) {
      this.page.query = e;
      this.get_people();
    },
    okBtn: _.debounce(function (e) {
      this.Sub = true;
      this.confirm()
    }, 400),
    async confirm() {

      if (this.DepUsercode == "") {
        Message.error("审批人为空");
        return;
      }
      if (this.PMO == "") {

        Message.error("BU为空");
        return;
      }
      console.log(1)

      var data = this.DataArry;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        element.ApprovalUser = {
          ApprovalUserName: this.PMO,
          ApprovalserCode: this.porton,
          DepUserName: this.DepUsercode
        };
      }

      const res = await getsubinvoice(data);
      if (res.Code == 200) {

        Message.success("操作成功");
        this.$router.go(-1)
      }
      else {
        Message.error(res.Message)
        this.Sub = false;
      }
    },


  },
  watch: {
    NewBU(value) {
      this.value = value;
      var model = this.options.filter(a => a.BuKey == value)[0]
      console.log(model)
      this.PMO = model.PMO
      this.porton = model.porton
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.diolog {
  .el-dialog {
    margin-top: 200px !important;
    width: 500px !important;
    height: 250px;
    border-radius: 7px;
  }

  .el-dialog__title {
    font-weight: bold;
    font-size: 14px;
    padding-left: 0px;
  }

  .el-dialog__title:before {
    display: none;
  }

  .content {
    text-align: left;
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    div {
      margin-right: 25px;
    }
  }

  .el-dialog__header {
    padding: 10px 20px;
    margin: 0;
  }

  .selects {

    width: 280px !important;
  }

  .foot {
    text-align: center;
  }
}
</style>