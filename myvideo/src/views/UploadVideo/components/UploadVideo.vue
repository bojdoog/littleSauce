<template>
  <div class="upload-video">
    <div id="upload-icon" ref="uploadIcon" @click="uploadFile">
      <input type="file" name="" ref="uploadInput" @input="showInput" />
    </div>
    <div class="upload-progress" v-if="store.state.tab.hasUploadVideo">
      <div class="fileName">视频文件名：{{ file.name }}</div>
      <div class="progress">{{ upLoadProgress }}</div>
    </div>
    <div class="describe" v-else>请上传视频</div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { uploadVideo } from "@/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import http from "@/utils/request";
import envMap from "@/config/app.config";
import { ElMessage } from "element-plus";

const store = useStore();
const router = useRouter();

const file = ref();
const uploadIcon = ref();
const uploadInput = ref();
const isUploading = ref(false);
const uploadFile = () => {
  uploadInput.value.click();
};

let upLoadProgress = ref("");
let formData = new FormData();
let unauditedVideo_src: string;
const emits = defineEmits(["unloadVideoInfo"]);

const showInput = () => {
  if (!uploadInput.value.files[0]) return;
  file.value = uploadInput.value.files[0];
  if (!/mp4/i.test(file.value.type)) {
    alert("上传的视频只能是 mp4 的格式");
    uploadInput.value.outerHTML = uploadInput.value.outerHTML;
    return;
  }
  router.push({ params: { videoName: file.value.name } });
  7;
  store.commit("changeHasUploadVideo", true);
};

const handleuploadFiles = () => {
  // 打开输入信息框
  store.commit("openInputVideoInfo");
  // if (!/(PNG|JPG|JPRG)/i.test(file.type))
  isUploading.value = true;

  formData.append("file", file.value);
  formData.append("uid", JSON.parse(Cookie.get("USER_INFO")).uid);
  // 把文件发给服务器
  http({
    url: "/upload/uploadVideo",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: function (progressEvent: any) {
      console.log(progressEvent, "progressEvent");
      //原生获取上传进度的事件
      if (progressEvent.lengthComputable) {
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        upLoadProgress.value =
          (progressEvent.loaded / progressEvent.total) * 100 + "%"; //实时获取上传进度
      }
    },
  }).then((res: any) => {
    const { code, msg } = res.data;
    if (code === 0) {
      ElMessage({
        message: msg,
        type: "success",
        duration: 3000,
      });
      emits("unloadVideoInfo");
    } else if (code === -1) {
      ElMessage({
        message: msg,
        type: "error",
        duration: 3000,
      });
    }
  });
};
defineExpose({ handleuploadFiles });

// 获取文件大小
function getfilesize(size: number) {
  //把字节转换成正常文件大小
  if (!size) return "";
  var num = 1024.0; //byte
  if (size < num) return size + "B";
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "KB"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}

//
function getObjectURL(file: any) {
  let url = null;
  if (window.createObjectURL != undefined) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  }
  return url;
}
onBeforeMount(() => {
  store.commit("changeHasUploadVideo", false);
});
onMounted(() => {});
</script>

<style lang="scss" scoped>
.describe {
  position: absolute;
  top: 105px;
  width: 100px;
  text-align: center;
  color: rgb(255, 179, 0);
}
.upload-video {
  position: relative;
  display: flex;
  justify-content: flex-start;
  width: 800px;
  #upload-icon {
    cursor: pointer;
    width: 100px;
    height: 100px;
    position: relative;
    background-color: rgba(227, 222, 222, 0.642);
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
  }
  .upload-progress {
    width: 700px;
    height: 100px;
    background-color: rgba(255, 228, 196, 0.475);
    .fileName {
      margin: 10px 0px 0px 10px;
      font-size: 20px;
    }
  }
}
</style>