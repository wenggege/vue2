

<template>

    <div class="audit">


        <div class="message">
            <el-row>
                <el-col :span="24">
                    <span class="mark"></span>
                    <span class="tit">拒绝原因</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="txt"> {{ AuditResult }} </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>

import { getAudit } from "../../api/negotiationInvoice";
import { Message } from 'element-ui'
export default {
    props: ["InvoiceRecordNumber"],
    data() {
        return {
            AuditResult: "",
            res: this.InvoiceRecordNumber
        };
    },
    created: function () {

        this.GetAudit();

    },

    methods: {
        async GetAudit() {

            const res = await getAudit({ InvoiceRecordNumber: this.InvoiceRecordNumber });
            if (res.Code == 200&&res.Data.length>0) {
                this.AuditResult = res.Data[0].AuditResult;
            }

        }

    }
};
</script>

<style lang="scss" scoped>
.audit {
    height: 112px;
    padding-top: 16px;
    //padding-left: 20px;

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

    .txt {
        margin-top: 16px;
        padding-left: 16px;
        line-height: 50px;
        box-sizing: border-box;
        height: 50px;
        border: 1px Dotted #bddeff;
        background-color: #e6f3ff;
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

}
</style>