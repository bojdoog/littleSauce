<template>
  <div class="input-video-info" v-show="store.state.tab.hasUploadVideo">
    <div class="input-frames">
      <div class="line">
        <div class="font1"><span style="color: red">*</span>标题:</div>
        <input type="text" ref="titleInput" placeholder="请输入标题" />
      </div>
      <div class="line">
        <div class="font1"><span style="color: red">*</span>上传封面:</div>
        <div
          class="upload-icon"
          ref="uploadIcon"
          @click="uploadFile"
          v-if="!hasPoster"
        >
          <div class="row item"></div>
          <div class="column item"></div>
          <input
            type="file"
            name=""
            ref="uploadInput"
            @change="handleuploadFiles"
          />
        </div>
        <img
          alt="封面"
          @click="uploadFile"
          ref="imgPoster"
          class="img-poster"
          v-else
        />
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
import { computed, nextTick, ref } from "vue";
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
const imgPoster = ref();

const uploadFile = () => {
  uploadInput.value.click();
};
let file: any;
let fileInfo;
const handleuploadFiles = async () => {
  if (!uploadInput.value.files[0]) {
    hasPoster.value = false;
    return;
  }
  // 展示poster
  hasPoster.value = true;
  // 获取文件夹
  file = uploadInput.value.files[0];

  const objectURL = URL.createObjectURL(file);
  await nextTick();
  imgPoster.value.src = objectURL;

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
const submitVideoInfo = () => {
  if (titleInput.value.value === "" || !file) {
    alert("标题不能为空,封面必须上传");
    return;
  }
  if (!store.state.tab.completeVideoUpload) {
    alert("请等待视频上传完成再提交");
    return;
  }
  _uploadVideoInfo();
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
          message: `${msg}，即将刷新网页`,
          type: "success",
          duration: 3000,
        });
        setTimeout(() => {
          location.reload();
        }, 2000);
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
        color: #505050;
        width: 550px;
        height: 40px;
        font-size: 22px;
        padding: 0 15px;
        border: none;
        outline: none;
        border-radius: 10px;
        background-color: rgb(247, 206, 175);
        box-shadow: 10px 10px 20px rgb(229, 157, 103);
        &::placeholder {
          font-size: 18px;
          color: #898989;
        }
      }
    }
    .upload-icon {
      cursor: pointer;
      width: 150px;
      height: 80px;
      position: relative;
      background-color: rgb(247, 206, 175);
      box-shadow: 10px 10px 20px rgb(229, 157, 103);
      .item {
        position: absolute;
        background-color: #fff;
      }
      .row {
        top: 38px;
        left: 10px;
        width: 130px;
        height: 4px;
      }
      .column {
        top: 5px;
        left: 73px;
        width: 4px;
        height: 70px;
      }
      input[type="file"] {
        display: none;
      }
    }
    .img-poster {
      width: 150px;
      height: 80px;
      border-radius: 5%;
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