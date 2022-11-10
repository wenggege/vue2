<template>
  <el-form ref="formSearch" class="el-form-search" v-bind="local.form" :model="local.values" :rules="rules">
    <el-row class="items" :gutter="16">
      <el-col v-for="item in items" :key="item.name" :span="item.span || 8">
        <el-form-item v-bind="item.itemProps" :label="item.label" :rules="undefined" :prop="item.name"
          :labelWidth="item.labelWidth" style="margin-right: 16px">
          <el-input v-if="item.type === 'input'" v-model="local.values[item.name]" v-bind="item.props"
            :disabled="disabled || item.disabled" :placeholder="(item.props && item.props.placeholder) || '请输入'"
            :maxlength="(item.props && item.props.maxlength) || 50">
          </el-input>
          <el-select v-else-if="item.type === 'select'" v-bind="item.props" v-model="local.values[item.name]"
            :disabled="disabled || item.disabled">
            <el-option :label="item.labelOption || '全部'" key="_all" value=""></el-option>
            <el-option v-for="paramItem in item.paramItems" :key="paramItem.id" v-bind="paramItem.props"
              :label="`${paramItem.label} ${paramItem?.enLabel}`" :value="paramItem.value">
            </el-option>
          </el-select>
          <el-date-picker v-else-if="item.type === 'date'" v-model="local.values[item.name]"
            @change="handleButtonChange(item.props)" :disabled="disabled || item.disabled" :type="item.paramItems.type"
            :value-format="item.paramItems.format || 'yyyy-MM-dd HH:mm:ss'"
            :range-separator="item.paramItems.separator || '至'" :start-placeholder="item.paramItems.start || '开始日期'"
            :end-placeholder="item.paramItems.end || '结束日期'">
            >
          </el-date-picker>
          <el-popover v-else-if="item.type === 'input-popover'" placement="right" width="400" trigger="click">
            <el-tree :data="treeData" accordion :props="defaultProps" :render-content="renderContent"
              :style="{ height: '500px', overflow: 'auto', display: 'flex' }" :highlight-current="true"
              @node-click="data => handleNodeClick(data, item)"></el-tree>

            <el-input slot="reference" v-model="local.values[item.name]" v-bind="item.props"
              @focus="handleButtonFocus(item.props)" :disabled="disabled || item.disabled"
              :placeholder="(item.props && item.props.placeholder) || '请输入'"
              :maxlength="(item.props && item.props.maxlength) || 50">
            </el-input>
          </el-popover>
        </el-form-item>
      </el-col>
      <div v-show="btnstate">
        <el-button type="primary" v-preventReclick size="medium" @click="search" class="footer_btn" :style="{'margin-left':marginLeft,'margin-bottom':marginBottom}">查询</el-button>
        <el-button v-preventReclick size="medium" class="footer_btn" @click="reset">重置</el-button>
      </div>
    </el-row>

    <!-- <div class="btns" v-show="btnstate">
      <el-button type="primary" v-preventReclick @click="search">查询</el-button>
      <el-button v-preventReclick @click="reset">重置</el-button>
    </div> -->
  </el-form>
</template>

<script>
export default {
  name: 'FormSearch',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    btnstate: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      default: () => []
    },
    values: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    form: {
      type: Object
    },
    treeData: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      local: {
        values: {},
        form: {
          labelWidth: '80px'
        }
      },
      defaultProps: {
        children: 'Children',
        label: 'DeptName'
      },
      marginLeft: '-8px',
      marginBottom: '0px'
    }
  },
  methods: {
    handleNodeClick (data, item) {
      if (data.UserGUID) { this.local.values[item.name] = data.EmpName }
    },
    renderContent (h, { node, data, store }) {
      return (
        <div>
          {data.UserGUID ? (
            <span>
              {data.EmpName}
            </span>
          ) : (
            <span>{data.DeptName}</span>
          )}
        </div>
      )
    },
    search () {
      if (this.$listeners.search) {
        this.$emit('search')
      }
    },
    reset () {
      if (this.$listeners.reset) {
        this.$emit('reset')
      } else {
        this.$refs.formSearch.resetFields()
        this.$nextTick(() => {
          this.search()
        })
      }
    },
    handleButtonChange (btn) {
      if (btn?.onChange && typeof btn.onChange === 'function') {
        btn.onChange.call(undefined, btn)
      }
    },
    handleButtonFocus (btn) {
      if (btn?.onFocus && typeof btn.onFocus === 'function') {
        btn.onFocus.call(undefined, btn)
      }
    }
  },
  mounted() {
    if (this.items.length%3===0 || this.items.length >= 3) {
      let width = parseInt(this.$refs.formSearch.labelWidth.replace('px',''))
      this.marginLeft = width + 8 +'px'
    }
    if (this.items.length%3===0) {
      this.marginBottom = '16px'
    }
  },
  watch: {
    values: {
      handler (val) {
        if (
          Object.prototype.toString.call(val) === '[object Object]' &&
          JSON.stringify(val) !== JSON.stringify(this.local.values)
        ) {
          this.$set(this.local, 'values', { ...val })
        }
      },
      immediate: true,
      deep: true
    },
    form: {
      handler (val) {
        if (Object.prototype.toString.call(val) === '[object Object]') {
          this.local.form = Object.assign(this.local.form, val)
        }
      },
      immediate: true,
      deep: true
    },
    'local.values': {
      handler (val) {
        this.$emit('update:values', { ...val })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.el-form-search {
  display: flex;

  .items {
    flex: 1;
  }

  .btns {
    flex: 0 0 auto;
    width: 170px;
    text-align: right;
    padding-right: 10px;
  }

  .down-tree {
    max-height: 200px;
    // display: block;
    overflow-y: scroll;
  }
  .footer_btn{
    height: 32px;
    width: 60px;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 15px;
    gap: 8px;
  }
}
</style>
