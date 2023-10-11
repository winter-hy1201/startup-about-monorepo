<template>
  <el-form-item :label="obj.attr_name ? obj.attr_name : ''" :prop="prop">
    <!-- v-if="!obj.is_show || obj.is_show === 1" -->
    <div v-if="obj.is_disabled === 1">
      <template v-if="obj.attr_value && obj.attr_value.length">
        <div class="flex items-center" v-for="(file, index) in obj.attr_value" :key="index">
          <i class="el-icon-document mr-10"></i>
          <el-tooltip :content="file.name" placement="top" class="mr-10">
            <div style="width: 70%" class="text-ellipsis">{{ file.name }}</div>
          </el-tooltip>
          <i class="el-icon-view mr-10 cursor-pointer" @click="() => handlePreview(file)"></i>
          <i class="el-icon-download mr-10 cursor-pointer" @click="() => handleDownload(file)"></i>
          <i v-if="obj.is_removable === 1" class="el-icon-delete cursor-pointer" @click="() => handleRemove(file)"></i>
        </div>
      </template>
      <template v-else>
        <div>未上传任何附件</div>
      </template>
    </div>

    <div class="up-file-cmp_container" v-else>
      <!-- :disabled="obj.is_disabled === 1" -->
      <el-upload
        class="upload-demo"
        :action="defaultAction"
        :headers="headers"
        :on-remove="handleRemove"
        :on-preview="handlePreview"
        :before-remove="beforeRemove"
        multiple
        :limit="limit"
        :accept="`.${videoType.join(',.')}`"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :on-error="handleError"
        :on-success="handleSuccess"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip" v-if="showTip">
          <template v-if="true">
            <!-- {{ userInfo.appendix_max_num }} -->
            单个附件不超过50M<br/>
          </template>
          <template v-else>
            <!-- {{ userInfo.appendix_max_num }} -->
            最多上传{{ limit }}个附件，且单个附件不超过50M<br/>
          </template>
        </div>

        <div slot="file" slot-scope="{ file }" class="flex items-center">
          <i class="el-icon-document mr-10"></i>
          <el-tooltip :content="file.name || file.originalFileName || ''" placement="top" class="mr-10">
            <div style="width: 70%" class="text-ellipsis">{{ file.name || file.originalFileName || '' }}</div>
          </el-tooltip>
          <i class="el-icon-view mr-10 cursor-pointer" @click="() => handlePreview(file)"></i>
          <i class="el-icon-download mr-10 cursor-pointer" @click="() => handleDownload(file)"></i>
          <i class="el-icon-delete cursor-pointer" @click="() => handleRemove(file)"></i>
        </div>
      </el-upload>
    </div>

    <ac-dialog title="附件预览" v-if="dialogVisible" :visible.sync="dialogVisible" height="75vh" :showFooter="false">
      <video class="ml-10" :src="dialogVideoUrl" style="width: 100%; height: 100%" controls>
        您的浏览器不支持视频播放
      </video>
    </ac-dialog>
  </el-form-item>
</template>

<script type="text/ecmascript-6">
// import { REQ_OK } from '@/common/js/code';
import {isSuccess} from "@/utils";
import {formsUpload} from "@/api/common";
// import { assetUploadFile, assetClearAssetPic } from '@/api/assetManage'
import {getToken} from '@/utils/auth'
// import { link } from '@/common/js/export'
import {mapGetters} from 'vuex'
import {handleDownloadUrl, handleDownloadFile} from '@/utils/downLoadFile'

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
      dialogVideoUrl: '',
      // 上传视频
      videoType: ["mp4", 'swf', 'mpg', 'mpeg', 'rm', 'ram', "ogg", "flv", "avi", "wmv", "rmvb", "mov"],
    }
  },
  created() {
    this.fileList = this.obj.attr_value
  },
  mounted() {
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    defaultAction() {
      // return this.action || this.$baseUrl + '/asset/uploadappendix'
      return this.action || "/api/forms/upload"
    },
    headers() {
      return {
        Authorization: getToken()
        // Authorization: "yF_6gE11KAAhYSUuv_gjtfYdeEE3kSxWG8__",
      }
    }
  },
  methods: {
    // 上传数量限制
    handleExceed(files, fileList) {
      fileList?.length >= this.limit && this.$message.warning(`最多可上传 ${this.limit} 个附件`)
    },

    // 阻止upload的自己上传，进行再操作
    beforeUpload(file) {
      return this.getTimes(file);
    },

    getTimes(file) {
      let fileTypeFlag = true;
      let fleSizeFlag = true;

      let suffix = file.name.replace(/.+\./, '')
      if (!this.videoType.includes(suffix)) { // 文件类型判断
        this.$message.error('文件类型不正确!')
        fileTypeFlag = false
      }


      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传附件大小不能超过 50MB!')
        fleSizeFlag = false
      }

      const url = URL.createObjectURL(file);
      const audioElement = new Audio(url);
      return new Promise((resolve, reject) => {
        audioElement.addEventListener("loadedmetadata", (event) => {
          const audioDuration = parseInt(audioElement.duration);
          if (fileTypeFlag && fleSizeFlag) {
            if (audioDuration < 15) {
              this.$message.error('上传视频不少于15秒');
            }
          }
          if (audioDuration >= 15 && fileTypeFlag && fleSizeFlag) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      })
    },

    handleRemove(file, fileList) {

      console.log('hy 删除前', 'file', file, 'this.fileList', this.fileList, 'this.obj.attr_value', this.obj.attr_value)

      if (file.response && file.status === 'success') {
        const res = this.obj.attr_value.filter(item => {
          return item.path !== file.response.data.path
        })
        this.obj.attr_value = res
        this.fileList = res
      } else if (file.path) {
        const res = this.obj.attr_value.filter(item => {
          return file.path !== item.path
        })
        this.obj.attr_value = res
        this.fileList = res
      }
      console.log('hy 删除后', 'file', file, 'this.fileList', this.fileList, 'this.obj.attr_value', this.obj.attr_value)

    },

    handlePreview(file) {
      // let http = localStorage.getItem('file_domain')
      if (file.response) {
        if (this.videoType.includes(this.getFileSuffix(file.response.data.path))) {
          this.dialogVideoUrl = handleDownloadUrl(file)
          // this.dialogVideoUrl = `${file.response.data.address}${file.response.data.path}`
          this.dialogVisible = true
        } else {
          // link(`${http}${file.response.data.path}`)
        }
      } else {
        if (this.videoType.includes(this.getFileSuffix(file.path))) {
          this.dialogVideoUrl = handleDownloadUrl(file)
          // this.dialogVideoUrl = `${file.address}${file.path}`
          this.dialogVisible = true
        } else {
          // link(`${http}${file.path}`, false)
        }
      }
    },
    handleDownload(file) {
      handleDownloadFile(file)
    },
    getFileSuffix(path) {
      // 获取最后一个.的位置
      let index = path.lastIndexOf('.')
      // 获取后缀
      let suffix = path.substr(index + 1)
      return suffix
    },
    handleError() {
      this.$message.error('上传失败，请重试')
    },
    handleSuccess(response, file, fileList) {

      console.log('hy 上传成功前', 'file', file, 'this.fileList', this.fileList, 'this.obj.attr_value', this.obj.attr_value, response)
      // if (response.code === REQ_OK) {
      if (isSuccess(response.code)) {
        this.obj.attr_value.push(response.data)
        this.fileList = fileList
      } else {
        this.$message.error(response.msg)
        this.fileList = fileList.filter(item => {
          return item.uid !== file.uid
        })
      }

      console.log('hy 上传成功后', 'file', file, 'this.fileList', this.fileList, 'this.obj.attr_value', this.obj.attr_value)
    },

    async beforeRemove(file, fileList) {
      // let path
      // if (file.response) {
      //   path = file.response.data.path
      // } else {
      //   path = file.path
      // }
      // if (path) {
      //   const delSuccess = await assetClearAssetPic(path).then(({ data }) => {
      //     // return data.code === REQ_OK
      //     return isSuccess(data.code)
      //   })
      //   return !delSuccess ? Promise((resolve, reject) => {
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
          this.fileList = []
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
.page >>>
.disabled-up-image:hover {
  cursor pointer;
  color #5a8dff
}

.up-file-cmp_container {
  width 300px

  .el-upload__tip {
    line-height 2
    color #999999
  }
}
</style>
