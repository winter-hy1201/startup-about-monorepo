<template>
    <el-form-item
            class="upload-img_container"
            :label="obj.attr_name ? obj.attr_name : ''"
            :prop="prop"
            :rules="rules"
            v-if="obj.is_show"
    >
        <div v-if="obj.is_disabled === 1" style="width: 800px">
            <template v-if="!obj.is_single && urlList.length">
                <div
                        class="disabled-up-image"
                        v-for="(item, index) in urlList"
                        :key="index"
                >
                    <div class="shade">
                        <div class="icon-box">
                          <span
                            class="preview"
                            @click="handlePreview(item, $event)"
                            v-if="item"
                            >
                            <i class="el-icon-search" title="查看大图"></i>
                          </span>
                        </div>
                    </div>
                    <el-image
                      style="width: 122px; height: 122px; border-radius: 6px"
                      :src="item"
                      fit="cover"
                      :preview-src-list="urlList"
                      ></el-image>
                </div>
            </template>
            <template v-else-if="!obj.is_single && !urlList.length">
                <div class="disabled-up-image" style="text-align: center">
                    <i class="el-icon-plus" style="font-size: 28px"></i>
                </div>
            </template>
            <template v-else-if="obj.is_single">
              <div
                class="disabled-up-image single-disabled-up-image"
                v-if="obj.is_disabled === 1"
                >
                <div class="shade">
                  <div class="icon-box">
                    <span
                      class="preview"
                      @click="handlePreview(imgHeader + obj.attr_value, $event)"
                      v-if="obj.attr_value"
                      >
                      <i class="el-icon-search" title="查看大图"></i>
                    </span>
                  </div>
                </div>
                <img
                  :style="{
                  width: obj.attr_value ? 'auto' : '180px',
                  height: obj.attr_value ? '100%' : '130px',
                  position: obj.attr_value ? 'static' : 'relative',
                  top: obj.attr_value ? '0px' : '-5px',
                  }"
                  :src="obj.attr_value ? imgHeader + obj.attr_value : noImage"
                  alt=""
                  />
              </div>
            </template>
        </div>
        <ac-image-upload
                :is-batch="obj.is_batch"
                v-else
                v-loading="loadingImg"
                :multiple="obj.is_single === 0"
                :ref="prop"
                :url="obj.attr_value"
                :isRequested="true"
                :image-max-num="obj.is_single === 0 ? obj.photo_max_num : 1"
                @delUrl="deleteUrl"
                @onSuccess="handleSuccess"
        ></ac-image-upload>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img style="width: 100%; margin: 0 auto" :src="dialogImageUrl" alt=""/>
        </el-dialog>
    </el-form-item>
</template>

<script type="text/ecmascript-6">
import {isSuccess} from "@/utils";
import {formsUpload} from '@/api/common'
import noPhoto from "@/assets/no_photo.png";

export default {
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    prop: {
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
      // obj: this.compObj,
      noImage: noPhoto,
      rules: {
        required: this.obj.is_required === 1 && !this.obj.noValidator,
        validator: this.obj["validator"],
        trigger: "change",
      },
      loadingImg: false,
      dialogVisible: false,
      dialogImageUrl: "",
      imgHeader: localStorage.getItem("file_domain") || '',
      firstIn: true,
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
    // 拼接地址
    urlList() {
      if (!this.obj.is_single) {
        if (Array.isArray(this.obj.attr_value) && this.obj.attr_value.length) {
          return this.obj.attr_value.map((item) => {
            // return this.imgHeader + item;
            return item;
          });
        }
        return [];
      } else {
        return [];
      }
    },
  },
  methods: {
    // 上传
    handleSuccess(val) {
      if (this.obj.is_single) {
        // 单张上传原本是string类型，现在改为数组
        this.obj.attr_value = [`${val.response.data.address}${val.response.data.path}`];
      } else {
        this.obj.attr_value.push(`${val.response.data.address}${val.response.data.path}`);
      }
    },
    // 删除对应的v-model值(safari兼容)
    deleteUrl(val, list) {
      console.log(val, list);
      if (this.obj.is_single) {
        this.obj.attr_value = "";
      } else {
        if (val.response) {
          const { response: { data: { address, path } } } = val;
          this.obj.attr_value = this.obj.attr_value.filter((item) => {
            return item !== `${address}${path}`;
          });
        } else {
          this.obj.attr_value = this.obj.attr_value.filter((item) => {
            return val.url.indexOf(item) === -1;
          });
        }
      }
    },
    // 预览
    handlePreview(item, event) {
      event.cancelBubble = true;
      if (item) {
        this.dialogVisible = true;
        this.dialogImageUrl = item;
      }
    },
  },
  watch: {
    obj: {
      handler(newValue) {
        this.$emit("update:obj", newValue);
      },
      deep: true,
    },
  },
  components: {},
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.upload-img_container >>> {
  .el-form-item__content {
    line-height: normal;
  }
}

.disabled-up-image {
  position: relative;
  display: inline-block;
  margin: 0 13.5px 8px 0;
  width: 120px;
  height: 120px;
  line-height: 120px;
  border: 1px dashed #d6d9e2;
  background-color: #f5f7fa;
  border-radius: 6px;
  color: #c0c4cc;
  cursor: not-allowed;
  box-sizing: content-box;

  &.single-disabled-up-image {
    width: 300px;
    text-align: center;
  }

  &:nth-child(6n) {
    margin-right: 0;
  }

  .shade {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    border-radius: 6px;
    cursor: default;
    text-align: center;
    color: #fff;
    font-size: 20px;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
    z-index: 99;

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
</style>
