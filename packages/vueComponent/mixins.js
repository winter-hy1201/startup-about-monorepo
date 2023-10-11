import {mapGetters} from "vuex";
import {
  fetchPowerStation,
  fetchDesignScheme,
  fetchDistributors,
  fetchTableAccountApplicationData,
  fetchProjects,
  fetchDictListByDiffParams,
} from "@/api/common";
import {isMobileByUserAgent, isSuccess} from ".";
import dateTimeCmp from "@/components/form-fields/date-time-cmp";
import inputCmp from "@/components/form-fields/input-cmp";
import selectCmp from '@/components/form-fields/select-cmp';
import textareaCmp from "@/components/form-fields/textarea-cmp";
import upImgCmp from "@/components/form-fields/up-img-cmp";
import upVideoCmp from "@/components/form-fields/up-video-cmp";
import upFileCmp from "@/components/form-fields/up-file-cmp";
import {fetchProcessInfo} from "@/api/cofirmCompletion";
import {getHistoryTask} from "@/pages/CompletionAcceptance/api";
import {saveChangeProcess} from "@/api/process";
import {getCurrentNodeInformation} from "@/utils/getCurrentNodeInformation";
import {closeSystemTab} from "@/utils/closeSystemTab";
import {REQ_ERROR_MSG} from "@/common/lib/code";
import _ from 'lodash'

export const formFieldControlMixin = {
  methods: {
    fieldControlComponent(type) {
      if (type) {
        switch (type) {
          case 1:
            return inputCmp;
          case 2:
            return textareaCmp;
          case 3:
            return upImgCmp;
          case 4:
            return selectCmp;
          case 5:
            return dateTimeCmp;
          case 6:
            break;
          case 7:
            return upVideoCmp;
          case 8:
            return upFileCmp;
        }
      }
    },
    // 防止自己封装的字段控件在选择之后不走验证，手动验证动态组件
    changeSelect(form, prop) {
      this.$refs[form].validateField(prop);
    },
  },
  components: {
    dateTimeCmp,
    inputCmp,
    // selectCmp,
    textareaCmp,
    upImgCmp,
  },
};

export const queryPowerStation = {
  data() {
    return {
      stations: [],
      queryParams: {},
    };
  },
  methods: {
    _queryStations(params = this.queryParams) {
      fetchPowerStation(params).then(({code, data}) => {
        if (isSuccess(code)) {
          this.stations = data;
        } else {
          this.$message.warning(REQ_ERROR_MSG);
        }
      });
    },
  },
};
export const queryDesignScheme = {
  data() {
    return {
      designSchemes: [],
      queryParams: {},
    };
  },
  methods: {
    _queryDesignScheme(params = this.queryParams) {
      fetchDesignScheme(params).then(({data, code}) => {
        if (isSuccess(code)) {
          this.designSchemes = data.records;
          this.total = data.total;
        } else {
          this.$message.warning(REQ_ERROR_MSG);
        }
      });
    },
  },
};
export const buttonAuth = {
  computed: {
    ...mapGetters([
      'buttonAuthority',
    ])
  },
  methods: {
    btnAuth(auth) {
      let is_show = false
      let firstPermission = this._.head(this.buttonAuthority);
      //超级管理员默认为全部权限
      if (firstPermission && firstPermission === '*:*:*') {
        is_show = true;
      } else {
        is_show = this.buttonAuthority.some(i => i === auth)
      }

      return is_show
    },
  },
};

export const tablePaginationMixin = {
  data() {
    return {
      paginationObj: {
        page: 1,
        limit: 10,
      },
      total: 0,
      tableSelectedList: [],
    };
  },
  methods: {
    // 复选框回调
    handleSelectionChange(val) {
      this.tableSelectedList = val;
    },
    // 搜索
    search(text) {
      this.query.fuzzyField = text;
      this.$refs.tableRef.refresh();
    },
    // 高级搜索
    handleAdvanceSearch() {
      this.$refs.tableRef.refresh();
    },
    // 重置
    handleReset() {
      this.$refs.advancedSearch.handleReset();
      this.$refs.tableRef.refresh();
    },
  },
};

export const getDistributorsMixin = {
  data() {
    return {
      distributorsList: [],
      distributorsQuery: {
        delearName: "",
      },
      distributorsProps: {
        children: "children",
        label: "org_name",
        disabled: "disabled",
        id: "id",
      },
    };
  },
  methods: {
    _getDistributors() {
      fetchDistributors(this.distributorsQuery).then(({code, data}) => {
        if (isSuccess(code)) {
          this.distributorsList = data;
        } else {
          this.$message.warning(REQ_ERROR_MSG);
        }
      });
    },
  },
};

export const getCustomTableAccountApplicationMixin = {
  data() {
    return {
      CTAccountApplicationlist: [],
      CTAccountAppliationQuery: {
        tableName: "custom_table_accountApplication",
      },
      distributorsProps: {
        children: "children",
        label: "org_name",
        disabled: "disabled",
        id: "id",
      },
    };
  },
  methods: {
    _getCTAccountApplication() {
      return new Promise((resolve, reject) => {
        fetchTableAccountApplicationData(this.CTAccountAppliationQuery).then(
          ({data, code}) => {
            if (isSuccess(code)) {
              resolve({
                list: data,
              });
            } else {
              this.$message.warning(REQ_ERROR_MSG);
            }
          }
        );
      });
    },
  },
};

export const regType = [
  {
    name: "整数",
    reg: "^\\d+$", // 验证范围整数
  },
  {
    reg: "(^([1-9]\\d{0,9}|0)(\\.\\d{1,2})?$)", // 验证范围数字，最多两位小数
  },
];

export const formFieldValidateMixin = {
  methods: {
    getValidator(type) {
      const formMap = {
        code: this.$Regs.RegMin2MaxNumberLetterSYMBOLSRequired(
          2,
          30,
          `${type.attr_name}只能输入<%0%>-<%0%>位，可包含字母，数字，符号“-”`,
          `请输入${type.attr_name}`
        ),
        name: this.$Regs.RegMin2MaxCharRequired(
          2,
          20,
          `${type.attr_name}只能输入<%0%>-<%0%>位`,
          `请输入${type.attr_name}`
        ),
        select: this.$Regs.RegSelectRequired(`请选择${type.attr_name}`),
        length: this.$Regs.RegLength(40, `${type.attr_name}不可超过<%0%>位`),
        min2max: this.$Regs.RegMin2MaxNumber(
          1,
          999,
          `${type.attr_name}只能输入<%0%>-<%0%>之间${regType[0].name}`,
          regType[0].reg,
          false
        ),
        1: this.$Regs.RegMin2MaxCharRequired(
          1,
          40,
          `${type.attr_name}只能输入<%0%>-<%0%>位`,
          `请输入${type.attr_name}`
        ),
        4: this.$Regs.RegSelectRequired(`请选择${type.attr_name}`),
        5: this.$Regs.RegDateRequired(`请选择${type.attr_name}`),
      };
      if (type.is_fixed === 1) {
        // 通用属性
        return formMap[type.attr_id];
      } else if (type.is_fixed === 0) {
        // 自定义属性
        return formMap[type.attr_type];
      }
    },
    // 封装验证数组表单的函数
    checkFormArray(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (this.$refs[formName].$el) {
            this.$refs[formName].$el.scrollIntoView();
          }
          if (valid) {
            resolve({
              result: valid,
            });
          } else {
            reject({
              result: valid,
            });
          }
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs[formName].validate().catch(() => {
        document.body.scrollTop = this.$refs.a.scrollTop = 0;
      });
      this.$refs[formName].clearValidate();
    },
  },
};

export const dictListByDiffParamsMixin = {
  data() {
    return {
      // listData: [],
    };
  },
  methods: {
    async getDictListByDiffParams(dictType) {
      const paramsData = {
        dictType: dictType,
        pageNum: 1,
        pageSize: 99999,
      };
      const {data} = await fetchDictListByDiffParams(paramsData);
      // this.listData = data;
      return data;
    },
  },
};

export const getProjectsMixin = {
  data() {
    return {
      projectsList: [],
      projectsQuery: {},
    };
  },
  methods: {
    _getProjects() {
      fetchProjects(this.projectsQuery).then(({data, code}) => {
        if (isSuccess(code)) {
          this.projectsList = data;
        } else {
          this.$message.warning(REQ_ERROR_MSG);
        }
      });
    },
  },
};

export const processMixin = {
  data() {
    return {
      isProcess: false,
      historyTaskList: [],
      processInfo: {},
      isCurrentNodeEditable: false,
      suggest: '',
      currentNodeName: '',
      needEmbeddedSuggest: false,
    };
  },
  methods: {
    _getSuggest(value) {
      this.suggest = value;
    },
    _getProcessData(rowData, callback) {
      fetchProcessInfo({businessId: rowData.id}).then(({data, msg}) => {
        getHistoryTask({businessId: rowData.id, ...data}).then(({data: dataV2, msg, code: codeV2}) => {
          if (isSuccess(codeV2)) {
            if (!this._.isEmpty(data)) {
              this.isProcess = true;
              this.historyTaskList = dataV2;
              this.processInfo = {
                businessId: rowData.id,
                ...data,
              };
              // this.$nextTick(() => {
              //     this.$refs.viewRefCompletion.stationInfo = rowData;
              //     this.$refs.viewRefCompletion._fetchPrevChangeCompletion(rowData);
              // });
              if (callback) callback();
              const {
                currentHistory,
                isCurrentNodeEditable,
                isFirstNode
              } = getCurrentNodeInformation(this.historyTaskList);
              this.isCurrentNodeEditable = isCurrentNodeEditable;
              this.currentNodeName = this._.last(this.historyTaskList).nodeName;
              // this.handleViewRef(rowData);
            } else {
              console.warn('没有流程信息');
            }
          } else {
            if (typeof msg === 'string') this.$message.warning(msg);
          }
        }).catch(err => {
          this.$message.error(err);
        });
      }).catch(err => {
        this.$message.error(err);
      });
    },
    _handleAllOperation(submitStatus = 0, processStatus = '', delegateOrChangeUser = '') {
      // 转办(WP)、委派(ZB)不用填审核意见
      if (!this._.includes(['WP', 'ZB'], processStatus)) {
        if (this._.isEmpty(this.suggest) && this.needEmbeddedSuggest) {
          this.$message.warning('审批意见必填');
          return;
        }
      }
      const processParams = {
        businessId: this.processInfo.businessId,
        processId: this.processInfo.processId,
        processVersion: this.processInfo.processVersion,
        suggest: this.suggest,
        status: processStatus, //? 不需要动
        delegateOrChangeUser//? 不需要动
      };
      saveChangeProcess(processParams)
        .then(({code, data, msg}) => {
          if (isSuccess(code)) {
            this.$message.success(data?.msg || '操作成功');
            closeSystemTab(this.$route);
          } else {
            this.$message.error(msg || '操作失败');
          }

        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
  },
};

export const responsiveMixin = {
  data() {
    return {
      isMobile: false,
      xs: {
        span: 24,
      },
      style_mb0: {
        marginBottom: '0',
      },
      style_mb20: {
        marginBottom: '20px',
      },
    };
  },
  methods: {
    isMobileEnv() {
      const isMobile = isMobileByUserAgent();
      if (isMobile) {
        this.isMobile = isMobile;
      }
    },
    setHTMLZoom() {
      const $html = document.querySelector('html');
      if ($html) {
        // const ratio = document.body.offsetWidth / window.screen.availWidth;
        const ratio = 0.5;
        $html.setAttribute('style', `zoom: ${ratio}`);
      }
    },
  }
};

export const tableHighlightingMixin = {
  methods: {
    tableRowClassName({row, rowIndex}) {
      console.log(row, rowIndex)
      if (row?.materialType === '0' || _.isEmpty(row?.materialType)) {
        return '';
      } else {
        return 'blue-row';
      }
    },
  }
}
