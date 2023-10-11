<template>
    <el-dialog
      ref="dialog"
      append-to-body
      custom-class="ac-container__dialog"
      :fullscreen="fullscreen"
      :title="title"
      :visible="visible"
      :width="width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="showClose"
      @close="handleClose"
      @opened="handleOpen"
      destroy-on-close
      top="0"
    >
      <div slot="title" v-if="isTitle" style="display: flex; justify-content: space-between;flex: 1;align-items: center;">
        <slot name="title"></slot>
        <div style="padding-right: 50px;margin-top: -4px;" v-if="showExport">
          <el-button type="text" style="padding: 0" @click="handleExport">导出Excel</el-button>
        </div>
      </div>
      <div v-loading="loadingState">
        <div class="custom-dialog__body" :style="{height: height, maxHeight: maxHeight}">
          <slot>
          </slot>
        </div>
        <div class="dialog-footer" v-if="showFooter && !showCustomFooter">
          <el-button @click="handleCancel" v-if="!showApproval" class="cancel">{{cancelText}}</el-button>
          <el-button @click="handleApproval" v-if="showApproval" class="approval">{{cancelText}}</el-button>
          <el-button :loading="loading" @click="handleSave"  :disabled="saveDisabled">{{saveText}}</el-button>
          <el-button type="primary" v-if="addBtn" :loading="loading" @click="handleSave(true)"  :disabled="saveDisabled">{{submitText}}</el-button>
        </div>
        <div class="dialog-footer" v-if="!showFooter && showCloseFooter && !showCustomFooter">
          <el-button @click="handleCancel" class="approval">关闭</el-button>
        </div>
        <div class="dialog-footer" v-if="showCustomFooter">
          <slot name="custom">
          </slot>
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script type="text/ecmascript-6">
  import { dialogLoading } from '@/common/lib/observeable';
  
  export default {
    name: 'ac-dialog',
    watch: {},
    components: {},
    props: {
      fullscreen: {
         type: Boolean,
         default: false,
      },
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '弹窗'
      },
      isTitle: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '1000px'
      },
      height: {
        type: String,
        default: 'auto'
      },
      maxHeight: {
        type: String,
        default: '75vh'
      },
      showFooter: {
        type: Boolean,
        default: true
      },
      showCloseFooter: {
        type: Boolean,
        default: true
      },
      showCustomFooter: {
        type: Boolean,
        default: false
      },
      showSave: {
        type: Boolean,
        default: true
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      saveText: {
        type: String,
        default: '保存'
      },
      submitText:{
        type: String,
        default: '提交'
      },
      loading: {
        type: Boolean,
        default: false
      },
      showApproval: {
        type: Boolean,
        default: false
      },
      saveDisabled: {
        type: Boolean,
        default: false
      },
      showExport: {
        type: Boolean,
        default: false
      },
      showClose: {
        type: Boolean,
        default: true
      },
      addBtn:{
        type:Boolean,
        default:false
      }
    },
    data () {
      return {
        isShow: false
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
      loadingState () {
        return dialogLoading.show
      }
    },
    methods: {
      handleSave (field) {
        this.$emit('save',field)
      },
      handleCancel () {
        this.$emit('close')
        this.$emit('update:visible', false)
      },
      handleClose () {
        this.$emit('close')
        this.$emit('update:visible', false)
      },
      handleOpen () {
        this.$emit('open');
        // this.$emit('update:visible', true);
      },
      handleApproval () {
        this.$emit('orderHandle')
      },
      handleExport () {
        this.$emit('handleExport')
      }
    },
  }
  </script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
    .el-dialog__wrapper >>>
      display: flex;
      justify-content: center;
      align-items: center;
      .ac-container__dialog
        position relative
        margin 0
        border-radius 0 0 4px 4px
        .el-dialog__header
          display: flex;
          justify-content: space-between;
          flex: 1;
          align-items: center;
          box-sizing: border-box
          height: 55px
          padding: 17px 20px 12px
          border-bottom: 1px dashed #d6d9e2
          box-shadow: 0 4px 0 0 #03c1fd inset
          .el-dialog__title
            float: left
            font-size: 16px
            line-height: 1
            color: #03c1fd
        .el-dialog__body
          padding 0
        .custom-dialog__body
          padding 30px 40px
          box-sizing border-box
          overflow-y scroll
          overflow-x: hidden
        .dialog-footer
          padding: 12px 20px
          background #ffffff
          text-align: right
          border-radius 0 0 4px 4px
          border-top 1px solid #EBEEF5
  </style>
  
