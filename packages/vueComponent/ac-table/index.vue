<template>
  <div class="ac-container_table">
    <el-table
      ref="elTable"
      :data="tableData"
      :height="height"
      v-loading="loading"
      border
      tooltip-effect="dark"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @expand-change="expandChange"
      @sort-change="handleSortChange"
      :header-cell-style="{height: '40px', background: '#f9fafc', fontSize: '13px', padding: '0', color: '#333333', textAlign: 'center'}"
      :row-style="{fontSize: '13px', color: '#666666'}"
      :row-key="rowKey"
      :indent="14"
      :class="{'el-table-tree': isTree}"
      :expand-row-keys="expands"
      :row-class-name="tableRowClassName"
      :lazy="lazy"
      :load="load"
    >
      <slot></slot>
      <template slot="empty">
        <ac-img-empty></ac-img-empty>
        <p style="font-size: 16px;line-height: 3">~ 暂无数据 ~</p>
      </template>
    </el-table>
    <div>
      <slot name="custom-left-footer"></slot>
    </div>
    <div class="pagination-container" v-if="showPagination && tableData && tableData.length">
      <div class="table-count_selected" v-if="showCount" @click="handleClickSelected">
        已选择<span style="padding:0 5px;">{{ selectedNum }}</span>条
      </div>
      <el-pagination
        :pager-count="pageInfo.count"
        :page-sizes="pageInfo.pageSizes"
        :total="total"
        :page-size="pageInfo.limit"
        :current-page.sync="pageInfo.page"
        background
        :layout="pageInfo.layout"
        prev-text="上一页"
        next-text="下一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <ac-dialog :title="`已选择（${selectedNum}）`" v-if="selectedVisible" :visible.sync="selectedVisible" width="1000px"
               height="75vh" cancel-text="关闭" :show-footer="false">
      <ac-table-base ref="multipleTable" :tableData="multipleSelection" height="calc(75vh - 60px)" :total="selectedNum"
                     :show-count="false" :show-pagination="false" :init-get-data="false">
        <el-table-column
          label="操作"
          width="80"
          fixed="left"
          align="center"
          class-name="action-bar"
        >
          <template slot-scope="scope">
            <el-button type="text" class="operation-item" @click="handleMoveOut(scope.row)">移除</el-button>
          </template>
        </el-table-column>
        <slot name="dialog"></slot>
      </ac-table-base>
    </ac-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageData: {
      type: Object,
      default: () => {
        return {
          limit: 10,
          page: 1
        }
      }
    },
    total: {
      type: Number,
      default: 0
    },
    showCount: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: 'calc(100vh - 286px)'
    },
    isTree: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: [String, Number],
      default: 'id'
    },
    isHighLight: {
      type: Boolean,
      default: false
    },
    initGetData: {
      type: Boolean,
      default: true
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function
    },
    tableRowClassName: {
      type: Function
    }
  },
  data() {
    return {
      pageInfo: {
        count: 5,
        page: 1,
        limit: 10,
        pageSizes: [10, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper'
      },
      loading: false,
      selectedNum: 0,
      multipleSelection: [],
      expandRowKeys: [],
      selectedVisible: false,
      expands: [],
      currentHeight: '',
      currentRow: ''
    }
  },
  created() {
    this.pageInfo = {...this.pageInfo, ...this.pageData}
    if (this.initGetData) {
      this._getTableData()
    }
  },
  mounted() {
  },
  computed: {
    currentPageInfo() {
      const {page, limit} = this.pageInfo
      return {page, limit}
    }
  },
  methods: {
    // 跳转到某一页
    handleCurrentChange(val) {
      this.pageInfo.page = val
      this._getTableData()
      this.$emit('handleCurrentChange',
        {
          ...this.currentPageInfo
        },
        () => {
          this.loading = false
        }
      )
    },
    // 切换一页展示多少条
    handleSizeChange(val) {
      this.pageInfo.limit = val
      this.pageInfo.page = 1
      this._getTableData()
      this.$emit('handleSizeChange',
        {
          ...this.currentPageInfo
        },
        () => {
          this.loading = false
        }
      )
    },
    // 设置loading状态
    handleSetLoadingStatus(bol) {
      this.loading = bol
    },
    // 获取数据
    _getTableData() {
      this.loading = true;
      this.$emit('getTableData',
        {
          ...this.currentPageInfo
        },
        () => {
          this.loading = false
        }
      )
    },
    // 刷新数据
    refresh() {
      this.pageInfo.page = 1
      this.clearSelection()
      this._getTableData()
    },
    // 高亮某行
    // tableRowClassName({row, rowIndex}) {
    //   if (!this.isHighLight) return ''
    //   if (row.isHighLight) {
    //     return 'success-row'
    //   }
    //   return ''
    // },
    // 模拟点击事件，默认展开
    expandAll() {
      const els = document.getElementsByClassName('el-table__expand-icon')
      for (let i = 0; i < els.length / 2; i++) {
        els[i].click()
      }
    },
    // 点击当前行
    handleRowClick(row, column, event) {
      if (this.currentRow === JSON.stringify(row)) {
        this.currentRow = '';
        this.$refs.elTable.setCurrentRow();
        this.$emit('handleRowClick', {row: row, isCurrent: false});
      } else {
        this.currentRow = JSON.stringify(row);
        this.$emit('handleRowClick', {row: row, isCurrent: true});
      }
    },
    // 复选框回调
    handleSelectionChange(val) {
      this.selectedNum = val.length
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    // 排序
    handleSortChange(col) {
      this.$emit('sortChange', col)
    },
    // 展开回调
    expandChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.pd_no)
          this.$emit('expandChange', row)
        }
      } else {
        this.expands = []
      }
    },
    // 点击已选择
    handleClickSelected() {
      if (this.multipleSelection && !this.multipleSelection.length) {
        return this.$message.warning('暂未选择资产')
      }
      this.selectedVisible = true
    },
    handleMoveOut(row) {
      this.$refs.elTable.toggleRowSelection(row)
    },
    // 清空选中
    clearSelection() {
      this.$refs.elTable.clearSelection()
    }
  },
  watch: {
    tableData: {
      handler() {
        this.$nextTick(() => {
          if (this.isTree && !this.lazy) {
            this.expandAll()
            this.$refs.elTable.doLayout()
          }
        })
      },
      deep: true
    }
  },
  components: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~@/common/styles/variable.styl";
.ac-container_table >>>
position relative
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .blue-row {
    background: #cee4f8;
  }


  .el-select
    width: auto

  .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next
    padding 0 10px

  .table-cell-highlight
    color: $color;
    cursor: pointer;

    &:hover
      cursor: pointer;

  .pagination-container
    position relative
    text-align center

    .table-count_selected
      position: absolute;
      bottom: 17px;
      font-size: 13px;
      font-weight: 400;
      color: $color;
      cursor pointer

    .el-pagination
      padding: 20px 5px 10px 5px

  .action-bar
    .operation-item
      display inline-block
      padding 0
      margin 0

    div + div
      &::before
        content: "";
        margin: 0 8px;
        display: inline-block;
        height: 0.9em;
        width: 1px;
        vertical-align: middle;
        position: relative;
        top: -0.06em;
        line-height: 1.5;
        background: #e8e8e8;

    button + button
      &::before
        content: "";
        margin: 0 8px;
        display: inline-block;
        height: 0.9em;
        width: 1px;
        vertical-align: middle;
        position: relative;
        top: -0.06em;
        line-height: 1.5;
        background: #e8e8e8;

    .el-dropdown::before
      content: "";
      margin: 0 5px 0 8px;
      display: inline-block;
      height: 0.9em;
      width: 1px;
      vertical-align: middle;
      position: relative;
      top: -0.06em;
      line-height: 1.5;
      background: #e8e8e8;
</style>

