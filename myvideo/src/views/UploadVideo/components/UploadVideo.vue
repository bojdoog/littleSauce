<template>
  <div class="upload-video">
    <div id="upload-icon" ref="uploadIcon" @click="uploadFile">
      <input type="file" name="" ref="uploadInput" @change="showInput" />
    </div>
    <div class="upload-progress" v-if="store.state.tab.hasUploadVideo">
      <div class="fileName">视频文件名：{{ file.name }}</div>
      <div class="progress">{{ upLoadProgress }}</div>
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
import { onBeforeMount, onMounted, reactive, ref } from "vue";
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

let upLoadProgress = ref("");

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
    console.log(i, fileChunks.length, "iiiiiiiiiii");

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
  }).then((res) => {
    const { message, point, hash } = res.data;
    ElMessage({
      message: message,
      type: "success",
      duration: 3000,
    });
    // 进行分块
    fileChunks = [...sliceFile(file.value, point, hash)];
    router.push({ params: { videoName: file.value.name } });
    uploadList();
    store.commit("changeHasUploadVideo", true);
  });
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

const handleuploadFiles = () => {
  // 打开输入信息框
  store.commit("openInputVideoInfo");
  // if (!/(PNG|JPG|JPRG)/i.test(file.type))
  isUploading.value = true;

  // const uploadList = fileChunks.map((item) => {
  //   let formData = new FormData();
  //   formData.append("uid", JSON.parse(Cookie.get("USER_INFO")).uid);
  //   formData.append("filename", file.value.name);
  //   formData.append("hash", `${item.hash}`);
  //   formData.append("chunk", item.chunk);
  //   return http({
  //     method: "POST",
  //     url: "/upload/uploadVideo",
  //     data: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // });

  // Promise.all(uploadList).then(async (res) => {
  //   console.log(res, "res");
  //   await http({
  //     method: "get",
  //     url: "/merge",
  //     params: {
  //       filename: file.value.name,
  //     },
  //   });
  // });

  // 把文件发给服务器
  // http({
  //   url: "/upload/uploadVideo",
  //   method: "POST",
  //   data: formData,
  //   headers: {
  //     "Content-Type": "multipart/form-data",
  //   },
  //   onUploadProgress: function (progressEvent: any) {
  //     console.log(progressEvent, "progressEvent");
  //     //原生获取上传进度的事件
  //     if (progressEvent.lengthComputable) {
  //       //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
  //       //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
  //       upLoadProgress.value =
  //         (progressEvent.loaded / progressEvent.total) * 100 + "%"; //实时获取上传进度
  //     }
  //   },
  // }).then((res: any) => {
  //   const { code, msg } = res.data;
  //   if (code === 0) {
  //     ElMessage({
  //       message: msg,
  //       type: "success",
  //       duration: 3000,
  //     });
  //     emits("unloadVideoInfo");
  //   } else if (code === -1) {
  //     ElMessage({
  //       message: msg,
  //       type: "error",
  //       duration: 3000,
  //     });
  //   }
  // });
};
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