<template>
  <div class="input-video-info" v-show="store.state.tab.hasUploadVideo">
    <div class="input-frames">
      <div class="line">
        <div class="font1"><span style="color: red">*</span>标题:</div>
        <input type="text" ref="titleInput" />
      </div>
      <div class="line">
        <div class="font1"><span style="color: red">*</span>上传封面:</div>
        <div id="upload-icon" ref="uploadIcon" @click="uploadFile">
          <input
            type="file"
            name=""
            ref="uploadInput"
            @input="handleuploadFiles"
          />
          <!-- <img src="" class="poster" /> -->
        </div>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="file.name"
          placement="top-start"
          v-if="hasPoster"
        >
          <div class="poster-file-name">封面文件名：{{ file.name }}</div>
        </el-tooltip>
      </div>
      <div
        class="submitVideoInfo"
        @click="submitVideoInfo"
        v-html="'上   传'"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { uploadVideoInfo } from "@/api";
import Cookie from "js-cookie";
import { ElMain, ElMessage } from "element-plus";

const route = useRoute();
const store = useStore();
const uploadIcon = ref();
const uploadInput = ref();
const titleInput = ref();
const hasPoster = ref(false);

const uploadFile = () => {
  uploadInput.value.click();
};
let file: any;
let fileInfo;
const handleuploadFiles = () => {
  if (!uploadInput.value.files[0]) {
    hasPoster.value = false;
    return;
  }
  // 展示poster
  hasPoster.value = true;
  // 获取文件夹
  file = uploadInput.value.files[0];
  uploadInput.value.addEventListener("load", () => {
    console.log(111);
  });

  fileInfo = {
    fileName: file.name,
    fileType: file.type,
  };
  if (!/png|jpe?g/i.test(file.type)) {
    alert("上传的封面只能是 png,jpg 的格式");
    uploadInput.value.outerHTML = uploadInput.value.outerHTML;
    return;
  }
};
const emits = defineEmits(["uploadVideoFile"]);
const submitVideoInfo = () => {
  if (titleInput.value.value === "" || !file) {
    alert("标题不能为空,封面必须上传");
    return;
  }
  emits("uploadVideoFile");
};
const _uploadVideoInfo = () => {
  let formData = new FormData();
  const videoInfo = {
    title: titleInput.value.value,
    videoName: route.params.videoName,
    uploadDate: getNowFormatTime(),
    uid: JSON.parse(Cookie.get("USER_INFO")).uid,
  };
  formData.append("file", file);
  formData.append("videoInfo", JSON.stringify(videoInfo));
  uploadVideoInfo(formData)
    .then((res: any) => {
      const { code, msg } = res.data;
      if (code === 0) {
        ElMessage({
          message: msg,
          type: "success",
          duration: 3000,
        });
      } else if (code === -1) {
        ElMessage({
          message: msg,
          type: "error",
          duration: 3000,
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};
defineExpose({ _uploadVideoInfo });
//获取当前日期，格式YYYY-MM-DD
function getNowFormatDay(nowDate: any) {
  var char = "-";
  if (nowDate == null) {
    nowDate = new Date();
  }
  var day = nowDate.getDate();
  var month = nowDate.getMonth() + 1; //注意月份需要+1
  var year = nowDate.getFullYear();
  //补全0，并拼接
  return year + char + completeDate(month) + char + completeDate(day);
}

//获取当前时间，格式YYYY-MM-DD HH:mm:ss
function getNowFormatTime() {
  var nowDate = new Date();
  var colon = ":";
  var h = nowDate.getHours();
  var m = nowDate.getMinutes();
  var s = nowDate.getSeconds();
  //补全0，并拼接
  return (
    getNowFormatDay(nowDate) +
    " " +
    completeDate(h) +
    colon +
    completeDate(m) +
    colon +
    completeDate(s)
  );
}

//补全0
function completeDate(value: number) {
  return value < 10 ? "0" + value : value;
}
</script>

<style lang="scss" scoped>
.input-video-info {
  margin-top: 20px;
  width: 800px;
  height: 1000px;
  // background-color: aquamarine;
  .input-frames {
    display: flex;
    flex-direction: column;
    align-items: center;
    // margin-left: 50px;
    // background-color: antiquewhite;
    height: 1000px;
    .line {
      box-sizing: border-box;
      width: 800px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30px;
      position: relative;
      margin-top: 30px;
      .font1 {
        font: 30px/1 Tahoma, Helvetica, Arial, "\5b8b\4f53", sans-serif;
        line-height: 40px;
        margin-right: 60px;
      }
      input {
        width: 550px;
        height: 40px;
        font-size: 25px;
        padding: 0 12px;
        border: none;
        outline: none;
        border-radius: 10px;
        background-color: rgba(227, 222, 222, 0.642);
        box-shadow: 1px 0px 22px 0px rgb(58, 57, 57);
      }
    }
    #upload-icon {
      cursor: pointer;
      width: 100px;
      height: 100px;
      position: relative;
      background-color: rgba(227, 222, 222, 0.642);
      box-shadow: 1px 0px 22px 0px rgb(58, 57, 57);
      &:before,
      &:after {
        content: "";
        position: absolute;
        z-index: -1;
        background: #090909;
      }
      &:before {
        left: 50%;
        width: 2%;
        margin-left: -1%;
        margin-top: 10%;
        height: 80%;
      }
      &:after {
        top: 50%;
        height: 2%;
        margin-top: -1%;
        margin-left: 10%;
        width: 80%;
      }
      input[type="file"] {
        display: none;
      }
      .poster {
        position: absolute;
        width: 100px;
        height: 100px;
      }
    }
    .poster-file-name {
      margin-left: 50px;
      width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .box-item {
        width: 200px;
      }
    }
  }
  .submitVideoInfo {
    margin-top: 100px;
    width: 200px;
    height: 60px;
    text-align: center;
    font-size: 28px;
    line-height: 60px;
    border-radius: 20px;
    background-color: rgb(150, 162, 189);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s linear;
    &:hover {
      background-color: rgba(53, 98, 203, 0.832);
    }
  }
}
</style>