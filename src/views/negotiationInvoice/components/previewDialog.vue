<!-- 预览弹窗 -->
<template>
  <el-dialog :close-on-click-modal="false" :visible="visible" :title="fileData?.FileNmae + `预览` || '预览'" width="60%"
    @close="dialogClose">
    <div class="image" v-if="imgTypes.includes(type)">
      <div>
        <el-image :src="imgSrc"></el-image>
      </div>
    </div>
    <div class="docWrap" v-if="type == 'doc'">
      <!-- 预览文件的地方（用于渲染） -->
      <div ref="file"></div>
    </div>
    <div v-if="type == 'xls'">
      <div class="excel-view-container">
        <div id="excelView" v-html="excelView"></div>
      </div>
    </div>
    <!-- // pdf用嵌套的iframe -->
    <div v-if="type == 'pdf'">
      <iframe :src="pdfurl" type="application/x-google-chrome-pdf" width="100%" height="100%" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import XLSX from 'xlsx'
import { getFile } from '@/api/negotiationInvoice'
export default {
  name: 'previewDialog',
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fileData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      type: '', // 文件类型
      imgTypes: ['png', 'jpg', 'jpeg'], //图片类型集合
      imgSrc: '', //图片路径
      excelView: '',// excel
      pdfurl: '' // pdf
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init(this.fileData)
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('input', false)
      this.type = ''
    },
    init(data) {
      console.log(data)
      if (this.imgTypes.includes(data.FileType)) {
        this.type = data.FileType
        this.imgSrc = data.FileUrl
      } else if (data.FileType === 'xls') {
        this.dialogClose()
        window.open(data.FileUrl)
      } else {
        this.dialogClose()
        window.open(data.FileUrl)
      }
    },
  }
}
</script>
