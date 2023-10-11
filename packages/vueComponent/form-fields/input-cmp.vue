<template>
  <div class="input-cmp">
    <el-form-item
      :label="obj.attr_name ? obj.attr_name : ''"
      :prop="prop"
      :rules="rules"
      v-if="obj.is_show"
      :id="`${obj.attr_id}-item`"
    >
      <el-input
              clearable
              class="w-full"
              v-model="obj.attr_value"
              :disabled="obj.is_disabled === 1"
              :placeholder="obj.placeholder? obj.placeholder: `请输入${obj.attr_name}`"
      ></el-input>
    </el-form-item>
  </div>
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
  methods: {
  },
  watch: {
    obj: {
      handler (newValue) {
        this.$emit('update:obj', newValue);
      },
      deep: true
    }
  },
  components: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
