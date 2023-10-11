<template>
    <div class="ac-advanced-search" v-outside="handleClose">
      <div class="advanced-search_container">
        <el-input
          class="advanced-search_input"
          :style="{width: width}"
          :placeholder="placeholder"
          clearable
          @clear="handleEmptyText"
          @keyup.enter.native="handleSearch"
          v-model="text"
          v-show="showSearch"
          >
          <el-button slot="append" class="code-btn" icon="el-icon-search" @click.native="handleSearch"></el-button>
        </el-input>
        <div class="senior-select" @click="seniorSelect" v-if="showAdvanced">高级搜索</div>
      </div>
      <!--<div :class="show ? 'modalBox' : ''" @click.stop="show = false">-->
      <!--</div>-->
      <div class="advanced-search_dialog" v-show="show" :style="{top: top, right: right, bottom: bottom, width: dialogWidth}">
        <div class="advanced-search-title">
          <span>高级搜索</span>
          <i class="el-icon-close" @click="show = false"></i>
        </div>
        <div class="advanced-search-content">
          <slot></slot>
        </div>
        <ac-footer cancelText="重置" saveText="搜索" @save="handleAdvanceSearch" @cancel="handleReset"></ac-footer>
      </div>
    </div>
  </template>
  
  <script type="text/ecmascript-6">
  export default {
    props: {
      placeholder: {
        type: String,
        default: '请输入关键字'
      },
      dialogWidth: {
        type: String,
        default: '350px'
      },
      top: {
        type: String,
        default: '82px'
      },
      right: {
        type: String,
        default: '14px'
      },
      bottom: {
        type: String,
        default: '0'
      },
      showAdvanced: {
        type: Boolean,
        default: true
      },
      showSearch:{
        type: Boolean,
        default: true
      },
      width: {
        type: String,
        default: '300px'
      }
    },
    data () {
      return {
        text: '',
        show: false,
        visible: false
      }
    },
    created () {
      // // 监听输入框的改变，
      // this.$watch('text', debounce((newQuery) => {
      // }, 300))
    },
    mounted () {
    },
    computed: {},
    methods: {
      seniorSelect () {
        this.show = true
      },
      handleAdvanceSearch () {
        this.$emit('handleAdvanceSearch');
        this.show = false
      },
      handleReset () {
        this.$emit('handleReset');
        this.show = false;
      },
      handleSearch () {
        this.$emit('search', this.text);
      },
      handleClose (e) {
        if (e && e.target.classList.contains('el-input__clear')) return
        this.show = false
      },
      // 清空搜索框
      handleEmptyText () {
        this.text = ''
        this.$emit('search', this.text)
      },
      // 清空搜索框
      handleEmptyTextNoEmit () {
        this.text = ''
      }
    },
    watch: {},
    components: {}
  }
  </script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "~@/common/styles/variable.styl";
    @import "~@/common/styles/mixin.styl";
    .code-btn
      padding: 0 15px;
    .modalBox
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
  
    .ac-advanced-search /deep/
      display: inline-block;
      vertical-align bottom
  
    .senior-select
      // background: url(../../assets/images/sprite-new.png) 10px -956px no-repeat;
      font-size: 14px;
      display: inline-block;
      cursor: pointer;
      height: 36px;
      line-height 36px
      width: 92px;
      text-align: right;
      color: $color;
  
    .advanced-search_dialog
      position: absolute;
      bottom 0
      width: 410px;
      overflow-y: auto;
      background: #ffffff;
      box-shadow: 0 0 8px 0 rgba(52, 60, 70, 0.14);
      z-index: 2001;
      .advanced-search-title
        height: 50px;
        line-height: 50px;
        padding: 0 24px;
        border-bottom: solid 1px $color-border-bottom;
        font-size: 16px;
        text-align left
        span
          color: #333333;
        i
          float: right;
          padding: 18px 24px;
          margin-right: -22px;
          cursor: pointer
          &:hover
            cursor pointer
      .advanced-search-content
        width 100%
        max-height calc(100% - 120px)
        overflow-y auto
        padding: 24px;
        box-sizing border-box
  </style>
  