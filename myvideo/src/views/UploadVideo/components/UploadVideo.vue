<template>
  <div class="upload-video">
    <div
      class="upload-icon"
      ref="uploadIcon"
      @click="uploadFile"
      v-if="!store.state.tab.hasUploadVideo"
    >
      <div class="row item"></div>
      <div class="column item"></div>
    </div>
    <video @click="uploadFile" ref="video" class="videofile" v-else></video>
    <input type="file" name="" ref="uploadInput" @change="showInput" />
    <div class="upload-info" v-if="store.state.tab.hasUploadVideo">
      <div class="fileName">视频文件名：{{ file.name }}</div>
      <div class="upload-progress">
        <div class="cur-progress" ref="curProgress"></div>
        <div class="total-progress"></div>
        <div class="upload-rate">{{ uploadRate }}/100%</div>
      </div>
    </div>
    <div class="describe" v-else>
      请上传视频<br /><span style="font-size: 8px"
        >不要上传大文件视频，因为流量有限呜呜</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
interface fileChunks {
  hash: string;
  chunk: Blob;
}
import { onBeforeMount, onMounted, reactive, ref, nextTick } from "vue";
import { uploadVideo, mergeChunks, checkPoint } from "@/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cookie from "js-cookie";
import http from "@/utils/request";
import envMap from "@/config/app.config";
import { ElMessage } from "element-plus";
import CryptoJS from "crypto-js";

const store = useStore();
const router = useRouter();
let fileChunks = reactive<fileChunks[]>([]);

const file = ref();
const uploadIcon = ref();
const uploadInput = ref();
const isUploading = ref(false);
const uploadFile = () => {
  uploadInput.value.click();
};
const uploadRate = ref(0);
const successNum = ref(0);
let upLoadProgress = ref("");
const curProgress = ref();
const video = ref();
// 得到hash值
function generateSHA1Hash(input: string) {
  const sha1Hash = CryptoJS.SHA1(input).toString();
  return sha1Hash;
}

let _hash = generateSHA1Hash("littleSauce");

let pool: Promise<any>[] = []; //Concurrent pool
let max = 3; //Maximum concurrency
const uploadList = async () => {
  // 所有上传切片的组
  const uploadTasks = [];
  for (let i = 0; i < fileChunks.length; i++) {
    let len = fileChunks.length;
    let item = fileChunks[i];
    let formData = new FormData();
    formData.append("filename", file.value.name.slice(0, -4));
    formData.append("hash", `${item.hash}`);
    formData.append("chunk", item.chunk);

    // 上传分片
    let task = uploadVideo(formData);
    uploadTasks.push(task);
    // 从并发池中移除已经完成的请求
    task.then(() => {
      let index = pool.findIndex((t) => t === task);
      pool.splice(index);
      uploadRate.value = (++successNum.value / len) * 100;
      curProgress.value.style.width = `${uploadRate.value}%`;
    });
    // 把请求放入并发池中，如果已经达到最大并发量
    pool.push(task);
    if (pool.length === max) {
      // 通过一个，才循环继续
      await Promise.race(pool);
    }
  }
  // 等待所有分片上传完成
  await Promise.all(uploadTasks).catch((e: any) => {
    console.log(e);
    ElMessage({
      message: "视频上传失败",
      type: "error",
      duration: 3000,
    });
  });
  ElMessage({
    showClose: true,
    message: "视频上传完成",
    type: "success",
    duration: 8000,
  });
  mergeChunks({
    filename: file.value.name.slice(0, -4),
  })
    .then((res: any) => {
      ElMessage({
        message: res.data.message,
        type: "success",
        duration: 3000,
      });
      // 合并成功后，store存储视频已完成上传
      store.commit("changeCompleteVideoUpload", true);
    })
    .catch((e: any) => {
      ElMessage({
        message: "合并失败",
        type: "error",
        duration: 3000,
      });
    });
};

const showInput = async () => {
  if (!uploadInput.value.files[0]) return;
  file.value = uploadInput.value.files[0];
  if (!/mp4/i.test(file.value.type)) {
    alert("上传的视频只能是 mp4 的格式");
    uploadInput.value.outerHTML = uploadInput.value.outerHTML;
    return;
  }
  await checkPoint({
    filename: file.value.name.slice(0, -4),
  }).then(async (res) => {
    const { message, point, hash } = res.data;
    ElMessage({
      message: message,
      type: "success",
      duration: 3000,
    });
    // 进行分块
    fileChunks = [...sliceFile(file.value, point, hash)];
    router.push({ params: { videoName: file.value.name } });
    initProgress();
    uploadList();
    store.commit("changeHasUploadVideo", true);
    const objectURL = URL.createObjectURL(file.value);
    await nextTick();
    video.value.src = objectURL;
  });
};

const initProgress = async () => {
  await nextTick();
  uploadRate.value = 0;
  successNum.value = 0;
  curProgress.value.style.width = "0%";
};

const sliceFile = (file: File, point: number, fileIndex: number) => {
  let Blob = file.slice(point);
  // 文件分片
  let size = 1024 * 1024 * 5; // 5mb
  let _fileChunks = [];
  let index = fileIndex;
  for (let cur = 0; cur < Blob.size; cur += size) {
    _fileChunks.push({
      hash: `${index++}`,
      chunk: Blob.slice(cur, cur + size),
    });
  }
  return _fileChunks;
};

onBeforeMount(() => {
  store.commit("changeHasUploadVideo", false);
});
onMounted(() => {
  store.commit("changeCompleteVideoUpload", false);
});
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
  .videofile {
    width: 100px;
    height: 100px;
    background-color: #9b9b9b;
  }
  .upload-icon {
    cursor: pointer;
    width: 100px;
    height: 100px;
    position: relative;
    background: linear-gradient(90deg, #09b8dbc3 0%, #29bcd97e 100%);
    .item {
      position: absolute;
      background-color: #fff;
    }
    .row {
      top: 49px;
      left: 10px;
      width: 80px;
      height: 2px;
    }
    .column {
      top: 10px;
      left: 49px;
      width: 2px;
      height: 80px;
    }
    // &:before,
    // &:after {
    //   content: "";
    //   position: absolute;
    //   z-index: -1;
    //   background-color: #000; /* 设置伪元素的背景颜色 */
    // }
    // &:before {
    //   left: 50%;
    //   width: 2%;
    //   margin-left: -1%;
    //   margin-top: 10%;
    //   height: 80%;
    // }
    // &:after {
    //   top: 50%;
    //   height: 2%;
    //   margin-top: -1%;
    //   margin-left: 10%;
    //   width: 80%;
    // }
  }
  input[type="file"] {
    display: none;
  }
  .upload-info {
    position: relative;
    width: 700px;
    height: 100px;
    background: linear-gradient(
      -90deg,
      rgba(131, 210, 234, 0.197) 0%,
      #29bcd97e 100%
    );
    .fileName {
      margin: 18px 0px 0px 28px;
      font-size: 20px;
    }
    .upload-rate {
      position: absolute;
      font: normal 15px Arial;
      top: -20px;
      right: 0px;
    }
    .upload-progress {
      margin: 25px 0 0 30px;
      position: relative;
      height: 5px;
      width: 400px;
      .cur-progress {
        position: absolute;
        // width: 30%;
        background-color: rgb(23, 199, 23);
        transition: width 0.5s ease-in-out;
        height: 100%;
      }
      .total-progress {
        height: 100%;
        width: 100%;
        background-color: #9c9c9c;
      }
    }
  }
}
</style>