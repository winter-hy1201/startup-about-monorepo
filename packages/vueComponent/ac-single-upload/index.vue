<template>
  <div class="global-image-upload" style="width: 300px" v-loading="loadingImg">
    <div class="disabled-up-image" v-if="disabled" style="position: relative">
      <div class="shade">
        <div class="icon-box">
          <span class="preview" @click="handlePictureCardPreview" v-if="src">
            <i class="el-icon-search" title="查看大图"></i>
          </span>
        </div>
      </div>
      <img
        :style="{
          width: src ? 'auto' : '180px',
          height: src ? '100%' : '130px',
          position: src ? 'static' : 'relative',
          top: src ? '0px' : '-5px',
        }"
        :src="src ? dialogImageUrl : noPhotoSrc"
        alt=""
      />
    </div>
    <div class="ac-image-upload" v-else>
      <el-upload
        :action="imageAction"
        :headers="headers"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        list-type="picture-card"
        :on-success="upload_sure"
        accept="image/jpeg,image/jpg,image/png"
      >
        <div
          style="
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: relative;
          "
        >
          <img
            :style="{
              width: dialogImageUrl !== noPhotoSrc ? 'auto' : '180px',
              height: dialogImageUrl !== noPhotoSrc ? '100%' : '130px',
              position: dialogImageUrl !== noPhotoSrc ? 'static' : 'relative',
              top: dialogImageUrl !== noPhotoSrc ? '0px' : '-5px',
            }"
            :src="src ? dialogImageUrl : noPhotoSrc"
            alt=""
          />
          <div class="shade">
            <div class="icon-box">
              <span
                class="preview"
                @click="handlePictureCardPreview"
                v-if="src"
              >
                <i class="el-icon-search" title="查看大图"></i>
              </span>
              <span class="preview" title="上传">
                <i class="el-icon-plus"></i>
              </span>
            </div>
          </div>
          <label class="upload_status" v-if="src" @click.stop="remove_img">
            <i class="el-icon-upload-success el-icon-close"></i>
          </label>
        </div>
      </el-upload>
    </div>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt=""/>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {isSuccess} from "@/utils";
import noPhoto from "@/assets/no_photo.png";
import {getToken} from "@/utils/auth";

export default {
  name: "ac-upload",
  props: {
    imageAction: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      noPhotoSrc: noPhoto,
      loadingImg: false,
      dialogVisible: false,
      dialogImageUrl: "",
      src: "",
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
    headers() {
      return {
        Authorization: getToken(),
      };
    },
  },
  methods: {
    // 预览图片
    handlePictureCardPreview(event) {
      event.cancelBubble = true;
      this.dialogVisible = true;
    },
    // 上传图片拦截
    beforeAvatarUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error("上传图片大小不能超过 50MB!");
      } else {
        this.loadingImg = true;
      }
      return isLt50M;
    },
    // 上传完毕
    upload_sure(res, file, fileList) {
      this.loadingImg = false;

      if (isSuccess(res.code)) {
        this.$message.success(res.msg);
        this.src = `${res.data.address}${res.data.path}`;
        this.$emit("update:url", [this.src]);
      } else {
        this.$message.error(res.msg);
      }
      this.dialogImageUrl = localStorage.getItem("file_domain") + res.data.path;
    },
    // 删除图片
    remove_img(file, fileList) {
      this.src = "";
      this.dialogImageUrl = "";
      this.$emit("update:url", []);
    },
  },
  watch: {
    url: {
      handler(newValue) {
        if (newValue) {
          this.src = newValue;
          this.dialogImageUrl = newValue;
        }
      },
      immediate: true,
    },
  },
  components: {},
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.disabled-up-image {
  width: 300px;
  height: 120px;
  line-height: 120px;
  border: 1px dashed #d6d9e2;
  background-color: #f5f7fa;
  border-radius: 6px;
  text-align: center;
  color: #c0c4cc;
  cursor: not-allowed;
  box-sizing: border-box;

  .shade {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    font-size: 20px;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.5);
      cursor: not-allowed;

      .icon-box {
        display: block;

        .preview {
          padding: 15px;
          cursor: pointer;

          i {
            color: #ffffff;
            font-size: 22px;
          }
        }
      }
    }
  }
}

.ac-image-upload::after {
  content: '(请选择jpg、jpeg、png格式的图片,小于2M)';
  position: absolute;
  font-size: 10px;
  left: 30px;
  color: #909399;
}

.el-upload {
  position: relative;
}

.ac-image-upload >>> {
  .el-upload--picture-card {
    width: 100%;
    height: 120px;
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
