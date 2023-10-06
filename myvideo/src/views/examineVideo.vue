<template>
  <div class="container">
    <div class="naudited-videos">
      <div
        v-for="item in unauditedVideoInfoArr"
        :key="item.id"
        :style="`background: url(${envAddress}${item.poster_src}) no-repeat;background-size:100% 100%;`"
        class="naudited-video shadow"
        @click="openUnauditedVideo(item.id, item.video_src)"
      >
        <div class="shadow">
          {{ item.title }}
        </div>
        <div class="date-font">
          {{ item.date }}
        </div>
      </div>
    </div>
    <div class="examine-module">
      <video :src="videoSrc" controls class="video" ref="video"></video>
      <div class="handle-btn">
        <div class="pass btn-item" @click="canPass">通过</div>
        <div class="refuse btn-item" @click="refuse">驳回</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { auditedVideo, getUnauditedVideo } from "@/api";
import { onMounted, ref } from "vue";
import envMap from "@/config/app.config";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
let unauditedVideoInfoArr = ref<any>();
const videoSrc = ref("");
const video = ref();
const envAddress = ref(envMap["resource"]);

const getfile = () => {
  return new Promise((resolve, reject) => {
    getUnauditedVideo()
      .then((res: any) => {
        resolve(res.data.unauditedVideoInfo);
      })
      .catch((e) => {
        console.log("获取未审核视频信息失败了", e);
        reject(e);
      });
  });
};

const canPass = () => {
  let tTime = video.value.duration;
  //          将总秒数 转换成 时分秒的格式：00:00
  //            分钟
  var m: number | string = Math.floor(tTime / 60);
  //            秒
  var s: number | string = Math.floor(tTime % 60);

  //            把数据格式转成 00:00：00
  m = m >= 10 ? m : "0" + m;
  s = s >= 10 ? s : "0" + s;

  let formatTime = m + ":" + s;

  auditedVideo({
    isPass: true,
    video_id: route.query.video_id,
    duration: formatTime,
  }).then(async (res: any) => {
    ElMessage({
      message: "审核通过",
      type: "success",
      duration: 3000,
    });
    // 视频审核通过后 重新调一次
    unauditedVideoInfoArr.value = await getfile();
    videoSrc.value = "";
  });
};
const refuse = () => {
  auditedVideo({ isPass: false, video_id: route.query.video_id })
    .then(async (res: any) => {
      ElMessage({
        message: "驳回视频",
        type: "warning",
        duration: 3000,
      });
      // 删除视频后 重新调一次
      unauditedVideoInfoArr.value = await getfile();
      videoSrc.value = "";
    })
    .catch((e) => {
      ElMessage({
        message: e,
        type: "error",
        duration: 3000,
      });
    });
};
const openUnauditedVideo = (id: number, _videoSrc: string) => {
  videoSrc.value = envMap["resource"] + _videoSrc;
  router.push({ query: { video_id: id } });
};

onMounted(async () => {
  unauditedVideoInfoArr.value = await getfile();
  if (unauditedVideoInfoArr.value.length > 0) {
    videoSrc.value = unauditedVideoInfoArr.value[0].video_src;
    router.push({ query: { video_id: unauditedVideoInfoArr.value[0].id } });
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 50px 0 0 50px;
  .naudited-videos {
    margin: 30px 0px 60px 30px;
    width: 1100px;
    height: 180px;
    border: 1px solid #3937377a;
    overflow-y: scroll;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    &::-webkit-scrollbar {
      // 滚动图的宽
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: #217ed0be;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      border-radius: 5px;
      background-color: #d3dce6;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }
    .naudited-video {
      cursor: pointer;
      position: relative;
      margin: 20px;
      width: 300px;
      height: 160px;
      border: 1px solid #3937377a;
      color: #00e1ff;
      // background-size: contain;
      background-size: 10% 10%;
      border-radius: 10px;
      &:hover .shadow {
        opacity: 0;
      }
      &:hover .date-font {
        opacity: 0;
      }
      .shadow {
        height: 40%;
        background-image: linear-gradient(
          to bottom,
          #000000cd,
          #00000063,
          #00000010
        );
        transition: opacity 0.5s;
      }
      .date-font {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background-color: #00000072;
        transition: opacity 0.3s;
      }
    }
  }
  .examine-module {
    width: 1090px;
    height: 360px;
    display: flex;
    justify-content: space-between;
    margin-left: 30px;
    .video {
      width: 720px;
      background: #000;
      height: 100%;
    }
    .handle-btn {
      position: relative;
      height: 100%;
      width: 370px;
      .btn-item {
        position: absolute;
        left: 120px;
        width: 150px;
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        font-weight: 600;
        border-radius: 20px;
        cursor: pointer;
        border: 0;
        letter-spacing: 3px;
        text-align: center;
      }
      .pass {
        top: 70px;
        background-color: #7beb90;
        color: #fff;
        transition: background-color 0.2s linear;
        &:hover {
          background-color: #16a130;
        }
      }
      .refuse {
        top: 220px;
        background-color: #e98f8f;
        color: #3d3d3d;
        transition: background-color 0.2s linear;
        &:hover {
          background-color: #c71212;
        }
      }
    }
  }
}
</style>