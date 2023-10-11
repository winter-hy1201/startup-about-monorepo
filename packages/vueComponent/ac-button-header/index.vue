<template>
    <div class="ac-button-header" :style="{padding: padding}">
      <div class="button-header_left">
        <slot name="left">
        </slot>
      </div>
      <div class="button-header_right">
        <slot name="right">
        </slot>
      </div>
    </div>
  </template>
  
  <script type="text/ecmascript-6">
  export default {
    props: {
      padding: {
        type: String,
        default: '15px 24px'
      }
    },
    data () {
      return {}
    },
    created () {
    },
    mounted () {
    },
    computed: {},
    methods: {},
    watch: {},
    components: {}
  }
  </script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
    .ac-button-header
      display flex
      justify-content space-between
      min-height 36px
      > .button-header_right
        flex 1
        text-align right
  </style>
  