<template>
  <el-form-item
    :label="obj.attr_name ? obj.attr_name : ''"
    :prop="prop"
    :rules="rules"
    v-if="obj.is_show"
    :id="`${obj.attr_id}-item`"
  >
    <el-input class="textarea-content" :disabled="obj.is_disabled === 1" clearable resize="none" type="textarea" :style="{width: width, height: height}" v-model="obj.attr_value"
              :maxlength="maxlength"
              show-word-limit
              :placeholder="`请输入${obj.attr_name}`"></el-input>
  </el-form-item>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '118px'
    },
    maxlength: {
      type: Number,
      default: 100
    },
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    prop: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rules: {
        required: this.obj.is_required === 1 && !this.obj.noValidator,
        validator: this.obj['validator'],
        trigger: 'change'
      }
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {},
  methods: {},
  watch: {
    obj: {
      handler (newValue) {
        console.log('update:obj', newValue);
        this.$emit('update:obj', newValue)
      },
      deep: true
    }
  },
  components: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .textarea-content /deep/
    .el-textarea__inner
      height 100%
</style>
