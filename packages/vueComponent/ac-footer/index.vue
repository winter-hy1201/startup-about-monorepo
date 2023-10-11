<template>
    <div class="ac-container_footer">
      <slot>
        <div v-if="right" class="footer-item_right">
          <span class="container-footer">
          <el-button @click="cancel" v-if="isCancel" :loading="loading" :disabled="disabled">{{cancelText}}</el-button>
          <el-button type="primary" @click="save" v-if="isSave">{{saveText}}</el-button>
        </span>
        </div>
        <div v-else class="footer-item_left">
          <span class="container-footer">
          <el-button type="primary" @click="save" v-if="isSave" :loading="loading" :disabled="disabled">{{saveText}}</el-button>
          <el-button @click="cancel" v-if="isCancel">{{cancelText}}</el-button>
          </span>
        </div>
      </slot>
    </div>
  </template>
  
  <script type="text/ecmascript-6">
  export default {
    name: 'ac-footer',
    props: {
      isCancel: {
        type: Boolean,
        default: true
      },
      isSave: {
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
      right: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      save (e) {
        this.$emit('save', e)
      },
      cancel () {
        this.$emit('cancel')
      }
    }
  }
  </script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
    .ac-container_footer
      .footer-item_right, .footer-item_left
        padding: 12px 20px;
        text-align: right;
        box-sizing: border-box;
        // box-shadow: 0 -1px 1px 0 rgba(0,0,0,0.1)
       //  border-top 1px solid #EBEEF5
      .footer-item_left
        text-align: left;
  </style>
  