<template>
  <el-form-item
    :label="obj.attr_name ? obj.attr_name : ''"
    :prop="prop"
    :rules="rules"
    v-if="obj.is_show "
    :id="`${obj.attr_id}-item`"
  >
    <el-date-picker
      :disabled="obj.is_disabled === 1"
      style="width: 300px"
      v-model="obj.attr_value"
      value-format="yyyy-MM-dd"
      :placeholder="'请选择' + obj.attr_name">
    </el-date-picker>
  </el-form-item>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
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
      type: Number,
      default: 0
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
        this.$emit('update:obj', newValue)
      },
      deep: true
    }
  },
  components: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
