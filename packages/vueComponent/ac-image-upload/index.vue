<template>
  <div class="ac-image-upload" :style="{ width: width }">
    <el-upload
      v-if="multiple"
      :limit="imageMaxNum"
      multiple
      :action="defaultAction"
      :headers="headers"
      :data="upData"
      list-type="picture-card"
      accept="image/jpeg,image/jpg,image/png"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-exceed="onExceed"
      :file-list="urlList"
    >
      <i v-if="multiple" class="el-icon-plus"></i>
    </el-upload>
    <el-upload
      class="single-img-upload"
      v-else
      :disabled="disabled"
      :action="defaultAction"
      list-type="picture-card"
      :headers="headers"
      :data="upData"
      accept="image/jpeg,image/jpg,image/png"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
    >
      <div
        @click="uploadClick"
        style="overflow: hidden; width: 100%; height: 100%; position: relative"
      >
        <img
          :style="{
            width: !isImgUpload ? 'auto' : '180px',
            height: !isImgUpload ? '100%' : '130px',
            position: !isImgUpload ? 'static' : 'relative',
            top: !isImgUpload ? '0px' : '-5px',
          }"
          :src="url ? dialogImageUrl : noPhotoSrc"
          alt=""
        />
        <div class="shade">
          <div class="icon-box">
            <span class="preview" @click="handlePreview" v-if="!isImgUpload">
              <i class="el-icon-search" title="查看大图"></i>
            </span>
            <span class="preview" title="上传">
              <i class="el-icon-plus"></i>
            </span>
          </div>
        </div>
        <label
          class="upload_status"
          v-if="!isImgUpload"
          @click.stop="deleteUrl"
        >
          <i class="el-icon-upload-success el-icon-close"></i>
        </label>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <div
        class="box-card"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        "
      >
        <img style="max-width: 100%" :src="dialogImageUrl" alt=""/>
      </div>
    </el-dialog>
    <div style="font-size: 12px; color: #999999">
      <div style="color: red" v-if="isBatch">*批量编辑图片将清空原有图片</div>
      <span v-if="imageMaxNum > 1"> 默认第一张图片为主图；</span
      >可上传jpg、jpeg、png文件，且单张不超过50M
    </div>
  </div>
</template>
<script>
import {getToken} from "@/utils/auth";
import {isSuccess} from "@/utils";
import noPhoto from "@/assets/no_photo.png";

export default {
  props: {
    width: {
      type: String,
      default: "800px",
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    url: {
      type: [Array, String],
      default() {
        return [];
      },
    },
    isRequested: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "",
    },
    imageMaxNum: {
      type: Number,
      default: 1,
    },
    multiple: Boolean,
    isBatch: Boolean,
  },
  data() {
    return {
      dialogImageUrl: noPhoto,
      noPhotoSrc: noPhoto,
      dialogVisible: false,
      upData: {
        type: "image",
      },
      src: "",
      urlList: [],
      imgHeader: localStorage.getItem("file_domain") || "",
    };
  },
  computed: {
    defaultAction() {
      return this.action || "/api/forms/upload";
    },
    headers() {
      return {
        Authorization: getToken(),
      };
    },
    // 判断只允许单张上传图片时，图片是否已经上传
    isImgUpload() {
      return this.dialogImageUrl === this.noPhotoSrc;
    },
  },
  created() {
    if (this.multiple) {
      this.urlList = this.url.map((item) => {
        return {
          name: "file",
          url: this.imgHeader + item,
        };
      });
    } else if (this.url) {
      this.dialogImageUrl = this.imgHeader + this.url;
    }
  },
  mounted() {
  },
  methods: {
    // 最大上传张数
    onExceed(file, fileList) {
      this.$message.warning(`上传图片不超过${this.imageMaxNum}张`);
    },
    // 删除
    handleRemove(file, fileList) {
      this.$emit("delUrl", file, fileList);
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 阻止upload的自己上传，进行再操作
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        // 图片大小大于2MB
        this.$message.error("上传图片大小不能超过 50MB!");
        return false;
      }
    },
    uploadClick() {
      this.$emit("onClick");
    },
    // 只允许上传单张图片时删除 图片
    deleteUrl() {
      this.dialogImageUrl = noPhoto;
      this.$emit("delUrl");
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file);
      if (this.multiple) {
        this.$emit("onSuccess", file);
      } else {
        if (isSuccess(response.code)) {
          this.dialogImageUrl = file.url;
          this.$emit("onSuccess", file);
        } else {
          this.dialogImageUrl = noPhoto;
          this.$message.error(response.msg);
        }
      }
    },
    handlePreview(event) {
      event.cancelBubble = true;
      if (this.dialogImageUrl !== noPhoto) {
        this.dialogVisible = true;
      }
    },
  },
  watch: {
    isRequested: {
      handler() {
        this.urlList = this.url.map((item) => {
          return {
            name: "file",
            url: localStorage.getItem("file_domain") + item,
          };
        });
      },
      deep: true,
      immediate: true,
    },
    // 如果传进来的url为空，那么清空已经存在的图片
    url(val) {
      if (val && !val.length) {
        this.urlList = [];
      }
      // else {
      //   this.urlList = val.map((item) => {
      //     if (typeof item === "string") {
      //       return {
      //         name: "file",
      //         url: this.imgHeader + item,
      //       };
      //     } else {
      //       return {
      //         name: "file",
      //         url:
      //           this.imgHeader +
      //           `${decodeURIComponent(item.address)}${decodeURIComponent(
      //             item.path
      //           )}`,
      //       };
      //     }
      //   });
      // }
    },
  },
};
</script>
<style rel="stylesheet/stylus" lang="stylus" scoped>
.ac-image-upload::after {
  content: '';
  position: absolute;
  font-size: 10px;
  color: #909399;
}

.el-upload {
  position: relative;
}

.ac-image-upload >>> {
  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 122px;
      height: 122px;
      margin: 0 13.5px 8px 0;

      &:nth-child(6n) {
        margin-right: 0;
      }
    }
  }

  .single-img-upload {
    .el-upload--picture-card {
      margin-bottom: 8px;
      width: 300px;
      height: 122px;
      line-height: 122px;
      border: 1px dashed #d6d9e2;
      box-sizing: border-box;
    }
  }

  .el-upload--picture-card {
    margin-bottom: 8px;
    width: 122px;
    height: 122px;
    line-height: 122px;
    border: 1px dashed #d6d9e2;
    box-sizing: border-box;
  }

  .upload_status {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #e0e0e0;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

    .el-icon-upload-success {
      position: absolute;
      font-size: 12px;
      margin-top: 11px;
      left: 15px;
      color: #000;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }
  }

  .shade {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }

    .icon-box {
      display: block;

      .preview {
        padding: 15px;
        cursor: pointer;

        i {
          color: #fff;
          font-size: 22px;
        }
      }
    }
  }
}
</style>
