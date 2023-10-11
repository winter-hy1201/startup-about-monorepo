<template>
  <el-form-item
    :label="obj.attr_name ? obj.attr_name : ''"
    :prop="prop"
    :rules="rules"
    v-if="obj.is_show"
    :class="{'form-item_disabled': obj.is_disabled === 1}"
    :id="`${obj.attr_id}-item`"
  >
    <div v-if="obj.is_disabled === 0">
      <!-- 有默认数据 -->
      <el-select
              clearable
              :popper-append-to-body="false"
              v-model="obj.attr_value"
              filterable
              :placeholder="'请选择' + obj.placeholder? obj.placeholder: obj.attr_name"
              v-if="obj.default_data"
      >
        <el-option v-for="(inner_item, index) in dataSource" :label="inner_item" :value="inner_item"
                   :key="index"></el-option>
      </el-select>
      <!-- 没有默认数据，是普通下拉框 -->
      <el-select
              clearable
              :popper-append-to-body="false"
              v-model="obj.attr_value"
              filterable
              :placeholder="'请选择' + obj.placeholder? obj.placeholder: obj.attr_name"
              v-if="!cmpType(obj.bind_api) && !obj.default_data"
      >
        <el-option v-for="(item, index) in dataSource" :label="item.label" :value="item.value" :key="index"></el-option>
      </el-select>
      <!--&lt;!&ndash; 没有默认数据，是树状下拉框 &ndash;&gt;-->
      <div class="dic-select el-select" v-if="cmpType(obj.bind_api)" v-popover:popover2>
        <div class="el-select__tags" :style="{ 'max-width': '268px', width: '100%' }">
          <span>
            <span class="el-tag el-tag--info el-tag--small" v-for="item in selectedList" :key="item.id">
              <span class="el-select__tags-text">{{ item[defaultProps.label] }}</span>
              <i class="el-tag__close el-icon-close closecha" @click.stop="delOrgItem(item.id)"></i>
            </span>
          </span>
          <input
            type="text"
            class="el-select__input"
            v-model="query"
            v-if="filterable"
            @input="debouncedQueryChange"
            :style="{ 'flex-grow': '1', width: inputLength / (300 - 32) + '%', 'max-width': 300 - 42 + 'px', 'cursor': 'pointer' }"
            ref="input">
        </div>
        <el-input
          ref="reference"
          type="text"
          :placeholder="query || selectedList && selectedList.length ? '' : ('请选择' + obj.attr_name)"
          :readonly="true"
          :class="{ 'is-focus': visible }"
        >
          <i :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"></i>
        </el-input>
      </div>
      <i class="el-icon-plus" v-if="isAddAuth(obj.attr_id) && obj.is_add" @click="handleAdd"></i>
      <!-- <jc-dialog :title="title" v-if="addVisible" :visible.sync="addVisible" :width="dialogWidth" @save="handleSaveAdd">
        <add-area ref="addAreaRef" @success="successAdd" v-if="addAreaVisible"></add-area>
        <add-emp ref="addEmpRef" @success="successAdd" v-if="addEmpVisible"></add-emp>
        <add-asset-type ref="addAssetRef" @success="successAdd" v-if="addAssetVisible"></add-asset-type>
        <add-org-cmp ref="addOrgRef" @success="successAdd" v-if="addOrgVisible"></add-org-cmp>
        <quick-add-account ref="addAccountRef" @success="successAdd" v-if="addAccountVisible"></quick-add-account>
      </jc-dialog> -->
      <el-popover
        ref="popover2"
        placement="bottom"
        width="272"
        trigger="click"
        v-model="visible"
      >
        <el-tree
          :id="`${obj.attr_id}-tree`"
          ref="tree"
          :filter-node-method="filterNode"
          :data="treeData"
          :props="defaultProps"
          :check-strictly="true"
          :node-key="nodeKey"
          :expand-on-click-node="false"
          :default-expand-all="true"
          :show-checkbox="showCheckbox"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :render-content="renderContent"
          @current-change="handleNodeChange"
        >
        </el-tree>
      </el-popover>
    </div>
    <el-input v-if="obj.is_disabled === 1" clearable v-model="obj.attr_value" :disabled="obj.is_disabled === 1" :placeholder="`请选择${obj.attr_name}`">
    </el-input>
  </el-form-item>
</template>

<script type="text/ecmascript-6">
import { isSuccess } from "@/utils";
import { getCommonUrl } from '@/api/common'
import { fieldState } from '@/common/lib/observeable';
// import AddArea from '@/views/set-manage/area-manage/addArea'
// import AddEmp from './add-emp-cmp'
// import AddAssetType from './new-asset-type'
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'
// import AddOrgCmp from './add-org-cmp'
// import QuickAddAccount from './quick-add-account'

const treeUrl = ['common/getAllowCustomType', 'common/getAllowOrg']
export default {
  name: 'field-select-cmp',
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
    label: {
      type: String,
      default: ''
    },
    nodeKey: {// 主键key
      type: String,
      default: 'id'
    },
    showCheckbox: {// 是否显示checkbox
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {// 默认展开节点
      type: Array,
      default: () => {
        return []
      }
    },
    defaultCheckedKeys: {// 默认选中节点
      type: Array,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      rules: {
        required: this.obj.is_required === 1 && !this.obj.noValidator,
        validator: this.obj['validator'],
        trigger: 'change'
      },
      dataSource: [],
      treeData: [],
      selectedList: [],
      visible: false,
      defaultProps: {
        children: 'children',
        label: 'org_name',
        disabled: 'disabled',
        id: 'id'
      },
      valueKey: '',
      relationState: fieldState,
      relationData: '',
      isHandleChange: false,
      title: '新增区域',
      addVisible: false,
      addAreaVisible: false,
      addEmpVisible: false,
      addAssetVisible: false,
      addOrgVisible: false,
      addAccountVisible: false,
      query: '',
      inputLength: 20,
      inputWidth: 0,
      dialogWidth: '480px',
      currentAdminLength: 0
    }
  },
  created () {
    this.debouncedQueryChange = debounce((e) => {
      this.handleQueryChange(e.target.value)
    }, 300);
    // 判断是否有默认数据
    if (this.obj.is_disabled === 0) {
      if (this.obj.default_data && this.obj.default_data.length) {
        this.dataSource = this.obj.default_data;
      } else if (this.obj.bind_api) {
        // 改变默认的tree的label
        if (this.obj.bind_api === 'common/getAllowCustomType') {
          this.defaultProps.label = 'custom_type_name'
        }
        if (this.obj.bind_api === 'electric/completion/getSpecification') {
          this._getCommonUrl(this.obj.bind_api, this.obj.bind_api_params);
        }
      }
    }
    if (this.obj.attr_value === 0) {
      this.obj.attr_value = ''
    }
  },
  mounted () {
  },
  computed: {
    // ...mapGetters([
    //   'buttonPower',
    //   'userInfo',
    //   'userDataAuthorityStatus'
    // ]),
    iconClass () {
      return this.visible ? 'arrow-up is-reverse' : 'arrow-up'
    }
  },
  methods: {
    // 设置默认数据
    setSelected () {
      let result = []
      if (Array.isArray(this.defaultCheckedKeys) && !this.defaultCheckedKeys.length) return
      if (!Array.isArray(this.defaultCheckedKeys)) return console.error('defaultCheckedKeys default value must be array')
      if (Array.isArray(this.defaultCheckedKeys)) {
        try {
          this.defaultCheckedKeys.forEach(value => {
            if (!value && value !== 0) {
              throw Error('Error in defaultCheckedKeys: Parameter cannot be empty!')
            }
            if (this.getOption(this.treeData, value)) {
              result.push(this.getOption(this.treeData, value))
            }
          })
          if (result.length) {
            this.selectedList = result
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
    // 获取选中项
    getOption (arr, value) {
      let retNode = null
      for (let i = 0; i < arr.length; i++) {
        if (value === arr[i][this.defaultProps.id]) {
          retNode = arr[i]
          return retNode
        } else if (arr[i].children && arr[i].children.length) {
          retNode = this.getOption(arr[i].children, value)
          if (retNode) {
            return retNode
          }
        }
      }
    },
    handleQueryChange (val) {
      this.$refs.tree.filter(val)
    },
    // 判断是否有新增权限
    isAddAuth (auth) {
      // if (auth === 'custom_type_id') {
      //   return this.userDataAuthorityStatus['type_global'] && this.buttonPower['customtype_module'] && this.buttonPower['customtype_module'].is_show
      // }
      // if (auth === 'emp_id') {
      //   return this.buttonPower['emp_module'] && this.buttonPower['emp_module'].is_show
      // }
      // if (auth === 'area_id') {
      //   return this.userDataAuthorityStatus['area_global'] && this.buttonPower['area_module'] && this.buttonPower['area_module'].is_show
      // }
      // if (auth === 'org_id') {
      //   return this.userDataAuthorityStatus['org_global'] && this.buttonPower['org_module'] && this.buttonPower['org_module'].is_show
      // }
      // if (auth === 'use_org_id') {
      //   return this.userDataAuthorityStatus['org_global'] && this.buttonPower['org_module'] && this.buttonPower['org_module'].is_show
      // }
      // if (auth === 'admin_userid') {
      //   return this.buttonPower['account_module'] && this.buttonPower['account_module'].is_show
      // }
      return false
    },
    // 判断应该展示哪种控件类型
    cmpType (url) {
      return url && treeUrl.includes(url)
    },
    // 根据url获取数据源
    _getCommonUrl (url, obj) {
      getCommonUrl(url, obj).then(({ code, data }) => {
        if (isSuccess(code)) {
          if (
              data && data.length
              // (data.data && data.data.length) ||
              // (data.data.list && data.data.list.length)
          ) {
            this.changeFieldType(this.obj, data);
          } else if (data.data && data.data.length) {
            this.changeFieldType(this.obj, data.data);
          } else {
            this.treeData = []
            this.dataSource = []
          }
        }
      })
    },
    // 根据relation获取数据源
    _getRelationData (url, obj) {
      getCommonUrl(url, obj).then(({ data }) => {
        if (isSuccess(data.code)) {
          this.selectedList = [data.data]
        }
      });
    },
    // tree render函数
    renderContent (h, { node, data, store }) {
      let classname = ''
      if (node.disabled === true) {
        classname = 'disabled-label'
      }
      return (<span class={classname}><span>{node.label}</span></span>)
    },
    // 过滤
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // 单击选择
    handleNodeChange (data) {
      if (data.disabled) return
      this.query = ''
      this.handleQueryChange(this.query)
      this.selectedList = [data]
      this.isHandleChange = true
      this.visible = false
    },
    // 删除
    delOrgItem (id) {
      this.selectedList = this.selectedList.filter(item => {
        return item.id !== id
      })
      this.isHandleChange = true
      this.$refs.tree.setChecked(id, false)
    },
    // 新增
    handleAdd () {
      if (this.obj.attr_id === 'admin_userid') {
        if (this.currentAdminLength >= this.userInfo.account_max_num) return this.$message.warning(`您当前的资产管理员账号数量已达上限(${this.userInfo.account_max_num}个)，如需继续添加请联系客服`)
      }
      this.addVisible = true
      this.dialogWidth = '480px'
      if (this.obj.attr_id === 'custom_type_id') {
        this.dialogWidth = '540px'
        this.title = '新增资产分类'
        this.addAssetVisible = true
      }
      if (this.obj.attr_id === 'emp_id') {
        this.title = '新增员工'
        this.addEmpVisible = true
      }
      if (this.obj.attr_id === 'area_id') {
        this.title = '新增区域'
        this.addAreaVisible = true
      }
      if (this.obj.attr_id === 'org_id' || this.obj.attr_id === 'use_org_id') {
        this.title = '新增组织'
        this.addOrgVisible = true
      }
      if (this.obj.attr_id === 'admin_userid') {
        if (this.currentAdminLength >= this.userInfo.account_max_num) return this.$message.warning(`您当前的资产管理员账号数量已达上限(${this.userInfo.account_max_num}个)，如需继续添加请联系客服`)
        this.dialogWidth = '520px'
        this.title = '新增管理员'
        this.addAccountVisible = true
      }
    },
    // 保存新增区域
    handleSaveAdd () {
      if (this.addAssetVisible) {
        this.$refs.addAssetRef.handleSave()
      }
      if (this.addEmpVisible) {
        this.$refs.addEmpRef.handleSave()
      }
      if (this.addAreaVisible) {
        this.$refs.addAreaRef.handleSave()
      }
      if (this.addOrgVisible) {
        this.$refs.addOrgRef.handleSave()
      }
      if (this.addAccountVisible) {
        this.$refs.addAccountRef.handleSave()
      }
    },
    // 快捷入口新增成功回调
    successAdd () {
      this.addVisible = false
      if (this.obj.attr_id === 'emp_id') {
        this._getCommonUrl(this.obj.bind_api, {
          wd: '',
          org_id: this.relationState.toValue
        })
      } else {
        this._getCommonUrl(this.obj.bind_api)
        // 通知其他组件刷新数据
        if (this.obj.attr_id === 'org_id') {
          this.$store.commit('SET_WATCH_CURRENT_CONTROL', 'use_org_id')
        }
        if (this.obj.attr_id === 'use_org_id') {
          this.$store.commit('SET_WATCH_CURRENT_CONTROL', 'org_id')
        }
      }
    },
    handleFocus () {
      this.visible = true
    },
    handleClose () {
      this.visible = false
    },
    // 处理字段不一样的数据类型
    changeFieldType (obj, data) {
      if (obj.bind_api === 'common/getUser') {
        this.dataSource = data.map(item => {
          return {
            label: item.user_name,
            value: item.id
          }
        })
        this.currentAdminLength = this.dataSource.length
      } else if (obj.bind_api === 'electric/completion/getSpecification') {
        if (!this._.isEmpty(data)) {
          this.dataSource = data.map(item => {
            return {
              label: item,
              value: item
            }
          })
        } else {
          this.dataSource = []
        }
      } else if (obj.bind_api === 'common/getAllowArea') {
        this.dataSource = data.map(item => {
          return {
            label: item.area_name,
            value: item.area_id
          }
        })
      } else if (obj.bind_api === 'doc/getAuditor') {
        this.dataSource = data.list.map(item => {
          return {
            label: item.user_name,
            value: item.id
          }
        })
      } else if (obj.bind_api === 'common/getAssetSourceGroup') {
        this.dataSource = data.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.obj.attr_value = 1
      } else {
        this.treeData = data
      }
    }
  },
  watch: {
    treeData: {
      handler () {
        this.setSelected()
        fieldState.to = ''
        fieldState.to = this.obj.to
        fieldState.toValue = this.obj.attr_value
        fieldState.isHandleChange = this.isHandleChange
      },
      deep: true
    },
    'obj.attr_value': {
      handler () {
        if (this.obj.attr_value === '') {
          this.selectedList = []
        }
      }
    },
    selectedList: {
      handler (newValue) {
        if (this.cmpType(this.obj.bind_api)) {
          if (newValue && newValue.length) {
            this.obj.attr_value = newValue[0].id
          } else {
            this.obj.attr_value = ''
          }
          if (this.obj.to) {
            fieldState.to = ''
            fieldState.to = this.obj.to
            fieldState.toValue = this.obj.attr_value
            fieldState.isHandleChange = this.isHandleChange
          } else {
            fieldState.to = ''
            fieldState.toValue = ''
            fieldState.isHandleChange = this.isHandleChange
          }
          if (this.$refs.input) {
            this.inputLength = this.$refs.input.value.length * 15 + 20
          }
          this.$emit('update:obj', this.obj)
          this.$emit('handleValidate', this.prop)
        }
      },
      deep: true
    },
    visible: {
      handler (val) {
        if (!val) {
          if (this.$refs.input) {
            this.$refs.input.blur()
          }
        }
      }
    },
    relationState: {
      handler () {
        if (this.relationState.to === this.obj.attr_id) {
          if (this.obj.attr_id === 'emp_id') {
            this._getCommonUrl(this.obj.bind_api, {
              wd: '',
              org_id: this.relationState.toValue
            })
            if (this.relationState.isHandleChange) {
              this.obj.attr_value = ''
            }
          }
        }
      },
      deep: true
    },
  },
  components: {
    // QuickAddAccount,
    // AddOrgCmp,
    // AddArea,
    // AddEmp,
    // AddAssetType
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~@/common/styles/variable.styl"
  .el-form-item >>>
    .el-form-item__content
      .el-icon-plus
        margin-left 10px
        font-size 16px
        font-weight 600
        color $color
        cursor pointer
  .dic-select /deep/
    position: relative;
    width: 300px;
    font-size: 14px;
    cursor pointer
  .form-item_disabled >>>
    .el-form-item__content
      cursor: not-allowed;
</style>
