<template>
  <div>
    <el-skeleton
      class="result-skeleton"
      animated
      :count="24"
      :throttle="500"
      v-if="!loading"
    >
      <template #template>
        <div class="video-skeleton-item">
          <el-skeleton-item
            variant="react"
            class="result-skeleton-video"
          ></el-skeleton-item>
          <div class="video-info">
            <el-skeleton-item
              variant="react"
              class="result-skeleton-title"
            ></el-skeleton-item>
            <el-skeleton-item
              variant="react"
              class="result-skeleton-title"
              style="width: 170px; align-self: flex-start"
            ></el-skeleton-item>
            <div class="bottom-row">
              <el-skeleton-item
                variant="react"
                class="result-skeleton-author"
              ></el-skeleton-item
              ><el-skeleton-item
                variant="react"
                class="result-skeleton-date"
              ></el-skeleton-item>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
    <div class="videos" v-else id="videos">
      <div class="everyvideo" v-for="item in showVideoList" :key="item.id">
        <router-link
          target="_blank"
          :to="{ name: 'VideoPage', query: { video_id: item.id } }"
        >
          <div
            class="preview_img_miniVideo"
            @mouseleave="mouseleave(item.id)"
            @mouseenter="mouseenter(item.id)"
            :id="`miniVideo${item.id}`"
          >
            <img
              class="preview_img"
              :src="
                item.preview_src
                  ? resource_src + item.preview_src
                  : resource_src + 'previews/thumb_icon.png'
              "
              :alt="item.title"
              loading="lazy"
            />
            <div class="bgInfo">
              <div class="video_card">
                <div class="video_card_left">
                  <span class="video_card_item">
                    <img class="video_card_icon" src="@/assets/smallTV.png" />
                    <span class="video_card_text">{{ item.views }}</span>
                  </span>
                  <span class="video_card_item">
                    <img class="video_card_icon" src="@/assets/barrage.png" />
                    <span class="video_card_text">{{ item.barragesNum }}</span>
                  </span>
                </div>
                <span class="duration" :id="`duration${item.id}`">{{
                  item.duration
                }}</span>
              </div>
            </div>
          </div>
          <div class="title">{{ item.title }}</div>
        </router-link>
        <div class="autherdate">
          <span>{{ item.username }}</span>
          <span>{{ item.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { videoinfo } from "../../../types/types";
import { useRouter } from "vue-router";
import envMap from "@/config/app.config";
import http from "@/utils/request";
import { reactive, ref, nextTick, onMounted, computed } from "vue";
export default {
  setup() {
    const router = useRouter();
    let videosInfo: videoinfo[] = reactive([]);
    const loading = ref(false);
    const delay = (ms: number) =>
      new Promise((resolve, reject) => setTimeout(resolve, ms));
    // 展示的行数
    const showRowNum = 4;
    // 初始加载的行数
    const startRow = ref(0);
    const endRow = ref(startRow.value + 4);
    const videosNumInRow = ref();
    const showVideoList = computed(() => {
      return videosInfo.slice(0, endRow.value * videosNumInRow.value);
    });
    videosNumInRow.value = computed(() => {
      return videosNumInRow.value === 0 ? 1 : videosNumInRow.value;
    });
    let videos: any;
    http
      .get("/video/allInfo")
      .then(async function (res: any) {
        // 处理成功情况
        loading.value = true;
        res.data.data.forEach((e: any) => {
          e.date =
            e.date.split(" ")[0].split("-")[1] +
            "-" +
            e.date.split(" ")[0].split("-")[2];

          videosInfo.push(e);
        });
        let i = 0;
        res.data.barragesNumArr.forEach((e: any) => {
          videosInfo[i++].barragesNum = e.barragesNum;
        });
        await nextTick();
        videos = document.getElementById("videos");
        const videosWidth = parseFloat(
          window.getComputedStyle(videos).width.slice(0, -2)
        );
        videosNumInRow.value = Math.floor((videosWidth + 30) / 270);
      })
      .catch((e: any) => {
        console.log(e);
      });
    let resource_src = ref("");
    onMounted(async () => {
      computeDivNum();
      scrollLoadData();
      resource_src.value = envMap["resource"];
      setInterval(() => {
        console.log(showVideoList);
      }, 500);
    });
    let video: any;
    let timeout: any;
    const mouseenter = (id: any) => {
      timeout = null;
      timeout = setTimeout(() => {
        const miniVideo: HTMLElement | null = document.getElementById(
          `miniVideo${id}`
        );
        videosInfo.forEach(async (e) => {
          if (e.id === id && !miniVideo?.children[2]) {
            video = document.createElement("video");
            video.src = resource_src.value + e.video_src;
            video.id = `touchVideo${id}`;
            video.preload = "auto";
            video.poster = e.preview_src;
            video.style.objectFit = "cover";
            video.style.width = "100%";
            video.style.height = "100%";
            video.style.borderRadius = "5%";
            video.style.position = "absolute";
            video.style.left = "0px";
            video.style.display = "none";
            miniVideo?.appendChild(video);
            video.style.display = "";
            video.oncanplay = () => {
              video.muted = true;
              video.play();
              video.poster = "";
            };
            video.onended = async () => {
              await delay(3000);
              video.currentTime = 0;
            };
            timeout = null;
          } else if (e.id === id && miniVideo?.children[2]) {
            const videoMini: any = document.getElementById(`touchVideo${id}`);
            videoMini.play();
            videoMini.style.display = "";
            timeout = null;
          }
        });
      }, 300);
    };
    const computeDivNum = () => {
      window.addEventListener("resize", () => {
        if (!videos) return;
        const videosWidth = parseFloat(
          window.getComputedStyle(videos).width.slice(0, -2)
        );
        videosNumInRow.value = Math.floor((videosWidth + 30) / 270);
      });
    };

    let memoryScrollTop = 0;
    const scrollLoadData = () => {
      // 获取滚动容器元素
      const scrollContainer = document.documentElement || document.body;

      // 添加滚轮事件监听器
      scrollContainer.addEventListener("wheel", (e) => {
        if (scrollContainer.scrollTop - 110 < 0) {
          startRow.value = 0;
          endRow.value = showRowNum;
          return;
        }
        if (memoryScrollTop > scrollContainer.scrollTop) return;
        memoryScrollTop = scrollContainer.scrollTop;
        startRow.value = Math.floor((scrollContainer.scrollTop - 110) / 270);
        endRow.value = startRow.value + showRowNum;
      });
    };

    const mouseleave = async (id: string) => {
      if (timeout) {
        clearTimeout(timeout);
      } else {
        const videoMini: any = document.getElementById(`touchVideo${id}`);
        videoMini.style.display = "none";
        await delay(300);
        videoMini.currentTime = 0;
        videoMini.pause();
      }
    };
    return {
      loading,
      videosInfo,
      mouseleave,
      mouseenter,
      resource_src,
      showVideoList,
    };
  },
};
</script>

<style lang="scss" scoped>
.result-skeleton {
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  grid-gap: 30px;
  .video-skeleton-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .result-skeleton-video {
    width: 240px;
    height: 135px;
  }
  .video-info {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 230px;
    .result-skeleton-title {
      margin-top: 5px;
      width: 230px;
      height: 21px;
    }
    .bottom-row {
      margin-top: 10px;
      width: 230px;
      .result-skeleton-author {
        width: 70px;
        height: 21px;
        margin-right: 10px;
      }
      .result-skeleton-date {
        width: 60px;
        height: 21px;
      }
    }
  }
}
.videos {
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  grid-gap: 30px;
  .everyvideo {
    width: 240px;
    height: 220px;
    position: relative;
    .preview_img_miniVideo {
      cursor: pointer;
      position: relative;
      width: 100%;
      height: 135px;
      .preview_img {
        width: 100%;
        height: 100%;
        border-radius: 5%;
      }
      .bgInfo {
        width: 100%;
        height: 100%;
        border-radius: 5%;
        position: absolute;
        left: 0px;
        bottom: 0px;
        background: linear-gradient(
          to bottom,
          rgba(10, 1, 1, 0) 70%,
          rgb(9, 9, 0)
        );
        opacity: 1;
        transition: opacity 0.4s linear;
        &:hover {
          opacity: 0;
        }
        .video_card {
          position: absolute;
          left: 0px;
          bottom: 5px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          color: #ffffff;
          opacity: 0.8;
          font-size: 12px;
          line-height: 15px;
          .video_card_left {
            display: flex;
            justify-content: flex-start;
            .video_card_item {
              margin-left: 10px;
              display: flex;
              justify-content: flex start;
              .video_card_icon {
                width: 14px;
                height: 14px;
              }
              .video_card_text {
                margin-left: 2px;
              }
            }
          }
          .duration {
            margin-right: 10px;
          }
        }
      }
      video {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 5%;
        position: absolute;
        left: 0px;
      }
    }
    .title {
      position: absolute;
      margin-top: 8px;
      color: #18191c;
      transition: color 0.3s linear;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* 指定行数*/
      -webkit-box-orient: vertical;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        color: cornflowerblue;
      }
    }
    .autherdate {
      position: absolute;
      bottom: 10px;
      font-family: inherit;
      font-size: 100%;
      font-weight: 400;
      font-style: normal;
      color: #18191c;
      opacity: 0.5;
      transition: color 0.2s linear;
      cursor: pointer;
      &:hover {
        color: cornflowerblue;
      }
      span {
        margin: 7px;
      }
    }
  }
}
</style>