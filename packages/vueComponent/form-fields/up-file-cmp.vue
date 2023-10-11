<template>
  <el-form-item :label="obj.attr_name ? obj.attr_name : ''" :prop="prop" v-if="obj.is_show">
    <div v-if="obj.is_disabled === 1">
      <template v-if="obj.attr_value && obj.attr_value.length">
        <div class="disabled-up-image" v-for="(item, index) in obj.attr_value" :key="index">
          <el-row type="flex" align="middle">
            <el-col :span="2" @click.native="handlePreview(item)">
              <img class="mr-10 w-3.5 h4" :src="getFileIcon(item)" alt="pic not found" />
            </el-col>

            <el-col @click.native="handlePreview(item)">
              {{ getFileName(item) }}
            </el-col>

            <el-col>
              <i class="el-icon-download mr-10 cursor-pointer" @click="() => handleDownload(item)"></i>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-else>
        <div>未上传任何附件</div>
      </template>
    </div>
    <div class="up-file-cmp_container" v-else>
      <el-upload
        :disabled="obj.is_disabled === 1"
        class="upload-demo"
        :action="defaultAction"
        :headers="headers"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        :before-remove="beforeRemove"
        multiple
        :limit="limit"
        :accept="`.${fileType.join(',.')}`"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :on-error="handleError"
        :on-success="handleSuccess"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" :disabled="obj.is_disabled === 1">点击上传 </el-button>
        <div slot="tip" class="el-upload__tip">
          <template v-if="true">
            <!-- {{ userInfo.appendix_max_num }} -->
            单个附件不超过50M<br />
          </template>
          <template v-else>
            <!-- {{ userInfo.appendix_max_num }} -->
            最多上传{{ limit }}个附件，且单个附件不超过50M<br />
          </template>
        </div>
      </el-upload>
    </div>

    <ac-dialog title="附件预览" v-if="dialogVisible" :visible.sync="dialogVisible" height="75vh" :showFooter="false">
      <iframe :src="dialogImageUrl" width="100%" height="100%" border="0"></iframe>
    </ac-dialog>
  </el-form-item>
</template>

<script type="text/ecmascript-6">
import {isSuccess} from "@/utils";
import {getToken} from '@/utils/auth';
import {handleDownloadFile, handleServiceFileUrl} from '@/utils/downLoadFile'
import getIcon from "@/utils/upload";

export default {
  name: 'up-file-cmp',
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
    },
    limit: {
      type: Number || null,
      default: null
    },
    showTip: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      // 上传文件类型限制
      fileType: ['doc', 'dot', 'docx', 'jp2', 'jpe', 'jpeg', 'jpg', 'pdf', 'png', 'txt', 'xlc', 'xlm', 'xls', 'xlt', 'xlsx', 'zip', 'rar', 'csv', 'ppt', 'pptx', 'dwg', 'mp4', 'swf', 'flv', 'mov', 'avi', 'wmv', 'mpg', 'mpeg', 'rm', 'ram'],
      // fileType: ['doc', 'dot', 'docx', 'txt', 'xlc', 'xlm', 'xls', 'xlt', 'xlsx', 'zip', 'rar', 'csv', 'ppt', 'pptx'],
      // imageType: ['jp2', 'jpe', 'jpeg', 'jpg', 'png']
    }
  },
  created() {
    console.log('wing', this.obj)
    this.fileList = this.obj.attr_value;
  },
  mounted() {
  },
  updated() {
    this.fileList = this.obj.attr_value;
  },
  computed: {
    defaultAction() {
      return this.action || "/api/system/file/uploadByFile?applicationName=tbd&uploadType=1"
    },
    headers() {
      return {
        Authorization: getToken(),
      }
    },
  },
  methods: {
    getFileIcon(file) {
      console.log(file)
      const fileName = this.getFileName(file);
      return getIcon(fileName);
    },
    getFileName(file) {
      let fileName = '';
      if (file.name) {
        fileName = file.name;
      }
      if (file.originalFileName) {
        fileName = file.originalFileName;
      }
      return fileName;
    },
    // 上传数量限制
    handleExceed(files, fileList) {
      fileList?.length >= this.limit && this.$message.warning(`最多可上传 ${this.limit} 个附件`)
    },
    // 阻止upload的自己上传，进行再操作
    beforeUpload(file) {
      let suffix = file.name.replace(/.+\./, '')
      if (!this.fileType.includes(suffix)) { // 文件类型判断
        this.$message.error('文件类型不正确!')
        return false
      }
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) { // 图片大小大于50MB
        this.$message.error('上传附件大小不能超过 50MB!')
        return false
      }
    },
    handleRemove(file, fileList) {
      console.log('===>file', file, fileList)
      if (file.response && file.status === 'success') {
        this.obj.attr_value = this.obj.attr_value.filter(item => {
          // return item !== `${file.response.data.address}${file.response.data.path}`;
          return item.path !== file.response.data.path;
        });
        // this.obj._attr_value = this.obj.attr_value;
        // this.fileList = fileList;

        console.log('this.obj.attr_value', this.obj.attr_value)
      } else if (file.path) {
        this.obj.attr_value = this.obj.attr_value.filter(item => {
          return file.path !== item.path;
        });
        // this.obj._attr_value = this.obj.attr_value;
      }
    },
    handleFileRemove(file) {
      console.log(this.obj.attr_value, file)
      this.fileList = this.obj.attr_value.filter(item => {
        return item.path !== file.response.data.path;
      });
    },
    handlePreview(file) {
      if (file.response) {
        if (this.fileType.includes(this.getFileSuffix(file.response.data.path))) {
          this.dialogImageUrl = handleServiceFileUrl(file)
          this.dialogVisible = true
        } else {
          // link(`${http}${file.response.data.path}`)
        }
      } else {
        if (this.fileType.includes(this.getFileSuffix(file.path))) {
          this.dialogImageUrl = handleServiceFileUrl(file);
          this.dialogVisible = true;
        } else { // TODO:
          this.dialogImageUrl = handleServiceFileUrl(file);
          this.dialogVisible = true;
        }
      }
    },
    handleDownload(file) {
      console.log('hy 修改前', file)
      file.address = 'http://211.145.45.81:9000'
      file.path = decodeURIComponent(file.path || file.url)
      console.log('hy 修改后', file)
      handleDownloadFile(file)
    },
    getFileSuffix(path) {
      // 获取最后一个.的位置
      console.log(path)
      if (path) {
        const index = path.lastIndexOf('.');
        return path.substr(index + 1);
      }
      return '';
      // 获取后缀
    },
    handleError() {
      this.$message.error('上传失败，请重试')
    },
    handleSuccess(response, file, fileList) {
      this.fileList = fileList;
      if (isSuccess(response.code)) {
        // this.obj.attr_value.push(`${response.data.address}${response.data.path}`);
        this.obj.attr_value.push({
          ...response.data,
          name: response.data.originalFileName,
        });
      } else {
        this.$message.error(response.msg)
        this.fileList = fileList.filter(item => {
          return item.uid !== file.uid
        });
      }
    },
    async beforeRemove(file, fileList) {
      console.log('beforeRemove', file, fileList);
      let path;
      if (file.response) {
        path = file.response.data.path
      } else {
        path = file.path
      }
      // if (path) {
      //   const delSuccess = await assetClearAssetPic(path).then(({ data }) => {
      //     // return data.code === REQ_OK
      //     return isSuccess(data.code)
      //   })
      //   return !delSuccess ? new Promise((resolve, reject) => {
      //     reject('失败了')
      //   }) : true
      // } else {
      //   return true
      // }
    }
  },
  watch: {
    obj: {
      handler(newValue) {
        if (newValue.attr_value && !newValue.attr_value.length) {
          this.fileList = [];
        }
        this.$emit('update:obj', newValue)
      },
      deep: true
    }
  },
  components: {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.disabled-up-image:hover {
  cursor pointer;
  color #03c1fd;
}

.up-file-cmp_container {
  width 300px

  .el-upload__tip {
    line-height 2
    color #999999
  }
}
</style>
