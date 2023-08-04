<template>
  <div id="mainPart">
    <div class="videoTitle">
      <h1 class="title">{{ title }}</h1>
      <div class="videoInfo">
        <span class="item">
          <img class="video_card_icon" src="@/assets/smallTV.png" />
          <span class="video_card_text">{{ views }}</span>
        </span>
        <span class="item">
          <img class="video_card_icon" src="@/assets/barrage.png" />
          <span class="video_card_text">{{ barrages }}</span>
        </span>
        <span class="item">{{ date }}</span>
        <span class="item">
          <img class="video_card_icon" src="@/assets/ban.png" />
          <span class="video_card_text">未经作者授权，禁止转载</span></span
        >
      </div>
    </div>
    <!-- ------------------------------------------------------------------------------------------------------------------------------------------- -->
    <!-- 以下为视频栏 -->
    <div
      class="player"
      v-loading="loading"
      :element-loading-text="
        loading === 1 ? '正在加载视频信息' : '正在加载视频数据'
      "
    >
      <video
        @mousemove="showControls"
        @mouseout="closeControls"
        :src="video_src"
        ref="video"
        @click="playBtnfn"
        @loadstart="loadstart($event)"
        @durationchange="durationchange($event)"
        @loadedmetadata="loadedmetadata($event)"
        @loadeddata="loadeddata($event)"
        @canplay="getVidDur($event)"
        @timeupdate="videoPlay"
        @play="play"
        @ended="() => (isEnd = true)"
        @keyup="keyword($event)"
        @progress="waitingLoading"
        @error="videoErr($event)"
      ></video>
      <div class="isEnd" v-show="isEnd">
        <div class="endInfo" @click="replay">
          <el-icon size="40px" color="white"><VideoPlay /></el-icon
          ><span class="fontEnd">重新播放</span>
        </div>
      </div>
      <div class="dm-container"></div>
      <!-- 控制条 -->
      <div
        class="controls"
        @mouseover="showIcon"
        @mouseout="visibleIcon"
        @mousemove="openControls"
        ref="controls"
        v-show="isShowControl"
      >
        <div class="progress-box" @mousedown="skip($event)">
          <div class="progress-box2">
            <!-- 总进度 -->
            <div class="progress" ref="mainProgress">
              <div class="buffer-progress" ref="bufferProgress"></div>
              <!-- 当前进度 -->
              <div class="curr-progress" ref="currProgress"></div>
              <div
                class="progress-thumb-icon"
                ref="progressThumbIcon"
                v-show="isShowIcon"
                @mousedown.stop="mouseDown($event)"
                @click.stop
                draggable="false"
              >
                <el-icon class="icon-thumb-suger" :size="20" color="#409EFC"
                  ><Sugar
                /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="controls-bottom">
          <div class="controls-left">
            <div class="switch controls-item" @click="playBtnfn" ref="playBtn">
              <el-icon v-if="isOpen && !isEnd" size="30px" color="white"
                ><VideoPause
              /></el-icon>
              <el-icon v-else-if="!isOpen && !isEnd" size="30px" color="white"
                ><CaretRight
              /></el-icon>
              <el-icon size="30px" color="white" v-else><VideoPlay /></el-icon>
            </div>
            <div class="time controls-item">
              <span class="curr-time" ref="currTime">00:00</span>/<span
                class="total-Time"
                ref="totalTime"
                >00:00</span
              >
            </div>
          </div>
          <div class="controls-middle">
            <span class="send-dm controls-item" v-show="isFullScreen">
              <div class="sendDmInput">
                <div class="sendDmIcon">
                  <el-icon size="22" class="Ship-icon"><Ship /></el-icon>
                </div>
                <input
                  class="bpx-player-dm-input"
                  placeholder="发个友善的弹幕见证当下"
                />
              </div>
              <div class="sendDmButton">发送</div>
            </span>
          </div>
          <div class="controls-right">
            <div
              class="playbackrate controls-item"
              @mouseover="showPlaybackrateMenu"
              @mouseleave="visPlaybackrateMenu"
            >
              倍速
            </div>
            <ul
              class="playbackrate-menu"
              ref="playbackrateMenu"
              @mouseover="openPlaybackrateMenu"
              @mouseleave="closePlaybackrateMenu"
            >
              <li
                v-for="item in speedList"
                :key="item.speed"
                class="playbackrate-menu-item"
                :data-playbackRate="item.speed"
              >
                {{ item.speed }}x
              </li>
            </ul>
            <div
              class="soundsBtn controls-item"
              @click="openOrCloseSounds"
              @mouseover="showSounds"
              @mouseleave="visSounds"
            >
              <el-icon size="30px" color="#fff"><Headset /></el-icon>
            </div>
            <div
              class="soundsModel"
              ref="soundsModel"
              v-show="isShowSoundsModel"
              @mouseover="openSounds"
              @mouseleave="closeSounds"
            >
              <div>{{ soundsVal }}</div>
              <input
                ref="soundsInput"
                type="range"
                min="0"
                max="100"
                v-model="soundsVal"
                @input="handleSoundsInput"
              />
            </div>
            <div class="fullScreen controls-item">
              <el-icon
                size="30px"
                color="white"
                @click="changeScreenSize"
                v-if="!isFullScreen"
                ><FullScreen
              /></el-icon>
              <el-icon
                size="30px"
                color="white"
                @click="changeScreenSize"
                v-else
                ><Connection />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 以上为视频 -->
    <!-- -------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- 视频下面的一栏 -->
    <frameUnderVideo
      :barrages="barrages"
      :sendDmVideoDuration="sendDmVideoDuration"
      @getDuration="getDuration"
      @sendDmInfo="receiveDmInfo"
    />
  </div>
</template>

<script setup>
import frameUnderVideo from "./frameUnderVideo.vue";
import http from "../../../utils/request";
import {
  ref,
  watch,
  onMounted,
  nextTick,
  createElementBlock,
  reactive,
} from "vue";
import { useRoute } from "vue-router";
import envMap from "@/config/app.config";
import { _speedList } from "../config";

const route = useRoute();
var tTime = 0;
let isOpen = ref(false);
const video = ref();
const playBtn = ref();
const totalTime = ref();
const currTime = ref();
const bufferProgress = ref();
const currProgress = ref();
const progressThumbIcon = ref();
let isEnd = ref(false);
const controls = ref();
let isFullScreen = ref(false);
let isDrug = ref(false);
let playbackrateMenu = ref();
let playbackrateMenuItem;
let title = ref();
let views = ref();
let barrages = ref();
let date = ref();
let isShowSoundsModel = ref(false);
let isShowControl = ref(false);
const soundsModel = ref();
const soundsInput = ref();
let soundsVal = ref(localStorage.getItem("soundsVal") || "100");
const video_src = ref();
let loading = ref(1);

const mainProgress = ref();
let sendDmVideoDuration = ref();

const speedList = reactive([..._speedList]);

let progressWidthString;
let progressWidthNumber;

let dmInfo;

let resource_src = envMap["resource"];

const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

// 点击音量喇叭触发
const openOrCloseSounds = () => {
  soundsVal.value = soundsVal.value === "0" ? "100" : "0";
};
// 拨动音量条
const handleSoundsInput = () => {
  soundsVal.value = soundsInput.value.value;
};
// 对soundVal监听，以实现改变音量和音量条
watch(soundsVal, (newValue, oldValue) => {
  video.value.volume = newValue / 100;
  document.querySelector(".soundsModel").querySelector("input").value =
    newValue;
  localStorage.setItem("soundsVal", soundsVal.value);
});

http
  .get(`/video/info?video_id=${route.query.video_id}`)
  .then(function (res) {
    loading.value = 2;
    // 处理成功情况
    console.log(res.data.data, "111");
    video_src.value = resource_src + res.data.videoInfo.video_src;
    views.value = res.data.videoInfo.views;
    barrages.value = res.data.videoInfo.barrages;
    title.value = res.data.videoInfo.title;
    document.title = title.value;
    date.value = res.data.videoInfo.date;
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
  .then(function () {
    // 总是会执行
  });

http.get(`/video/dmInfo?video_id=${route.query.video_id}`).then((res) => {
  console.log(res.data.data, "555");
  dmInfo = res.data.data;
  dmInfo.forEach((e) => {
    e.isSend = false;
  });
  barrages.value = res.data.barragesNum.barragesNum;
});

const playBtnfn = () => {
  if (!isEnd.value) {
    const dmboxs = document.querySelectorAll(".dmbox");
    console.log(dmboxs, "dmboxs");
    if (isOpen.value) {
      isOpen.value = false;
      dmboxs.forEach((dmbox) => {
        dmbox.style.animationPlayState = "paused";
      });
    } else {
      isOpen.value = true;
      dmboxs.forEach((dmbox) => {
        dmbox.style.animationPlayState = "";
      });
    }
  } else {
    replay();
  }
};
const keyword = (e) => {
  console.log(e);
};
watch(isOpen, (newValue, oldValue) => {
  if (newValue === true) {
    video.value.play();
  } else {
    video.value.pause();
  }
});
let isShowIcon = ref(false);
let downX;
let moveX;

let isMove = 0;
//点击进度条，再象征意义的拖动thumbicon
const skip = (e) => {
  if (isEnd.value) {
    replay();
    isEnd.value = false;
  }
  downX = document.querySelector(".player").offsetLeft;
  // 移动中
  document.onmousemove = (e) => {
    isDrug.value = true;
    isMove = 1;
    moveX = e.clientX - downX;
    currProgress.value.style.width = moveX + "px";
    progressThumbIcon.value.style.left =
      (moveX / progressWidthNumber) * progressWidthNumber - 10 > 0
        ? (moveX / progressWidthNumber) * progressWidthNumber - 20 + "px"
        : -10 + "px";
  };
  // 移动完成
  document.onmouseup = () => {
    document.onmousemove = null;
    if (isMove === 0) return;
    video.value.currentTime =
      (moveX / progressWidthNumber) * video.value.duration;
    document.onmouseup = null;
    isMove = 0;
    isDrug.value = false;
  };
  video.value.currentTime =
    (e.offsetX / progressWidthNumber) * video.value.duration;
  let value = video.value.currentTime / tTime;
  currProgress.value.style.width = value * 100 + "%";
  progressThumbIcon.value.style.left =
    value * progressWidthNumber - 10 > 0
      ? value * progressWidthNumber - 20 + "px"
      : -10 + "px";
  isOpen.value = true;
  // 跳转时，把全部的dmbox清除掉,
  // 在跳转后的时间点，之后没发送的弹幕还会继续发送
  const dmboxArr = document.querySelectorAll(".dmbox");
  const dmContainer = document.querySelector(".dm-container");
  if (dmboxArr.length > 0) {
    dmboxArr.forEach((e) => {
      dmContainer.removeChild(e);
    });
  }
  dmInfo.forEach((e) => {
    if (e.duration > video.value.currentTime) {
      e.isSend = false;
    } else if (video.value.currentTime - e.duration > 0) {
      e.isSend = true;
    }
  });
};

// 直接拖动thumbicon
const mouseDown = (e) => {
  downX = document.querySelector(".player").offsetLeft;
  // 移动中
  document.onmousemove = (e) => {
    isDrug.value = true;
    moveX = e.clientX - downX;
    currProgress.value.style.width = moveX + "px";
    progressThumbIcon.value.style.left =
      (moveX / progressWidthNumber) * progressWidthNumber - 10 > 0
        ? (moveX / progressWidthNumber) * progressWidthNumber - 20 + "px"
        : -10 + "px";
  };
  // 移动完成
  document.onmouseup = () => {
    if (isEnd.value) {
      replay();
      isEnd.value = false;
    }
    video.value.currentTime =
      (moveX / progressWidthNumber) * video.value.duration;
    console.log(moveX, progressWidthNumber, "video.value.currentTime");
    document.onmousemove = null;
    document.onmouseup = null;
    isDrug.value = false;
  };
};

const showIcon = () => {
  isShowIcon.value = true;
};
const visibleIcon = () => {
  isShowIcon.value = false;
  controls.value.style.opacity = 0;
};

const loadstart = (e) => {
  console.log("开始请求数据", e._vts);
};
const durationchange = (e) => {
  console.log("提示视频的时长已改变", e._vts);
};
const loadedmetadata = (e) => {
  console.log("提示视频的元数据已加载", e._vts);
};
const loadeddata = (e) => {
  console.log("提示当前帧的数据是可用的", e._vts);
};
const videoErr = (e) => {
  console.log("视频出错了");
  console.log(e);
};
// 视频加载完毕，canplay时间调用
const getVidDur = async (e) => {
  loading.value = 0;
  // 设置自动播放;
  video.value.play();
  isOpen.value = true;
  console.log("提示该视频已准备好开始播放", e._vts);
  isShowControl.value = true;
  // 等待dom更新后
  await nextTick();
  progressWidthString = window.getComputedStyle(mainProgress.value).width;
  progressWidthNumber = progressWidthString.slice(0, -2);
  // video.value.play();
  tTime = video.value.duration;
  console.log("totoalTime==>", tTime);

  //          将总秒数 转换成 时分秒的格式：00:00
  //            分钟
  var m = Math.floor(tTime / 60);
  //            秒
  var s = Math.floor(tTime % 60);

  //            把数据格式转成 00:00：00
  m = m >= 10 ? m : "0" + m;
  s = s >= 10 ? s : "0" + s;

  totalTime.value.innerHTML = m + ":" + s;
};

// 缓冲进度，当视频播放到一定位置时，再次进行缓冲并调用此函数
const waitingLoading = () => {
  console.log("缓冲中...");
  // length 为缓冲区数量
  let length = video.value.buffered.length;
  // 获取到的值是最后一个缓冲区的时间位置
  let end = video.value.buffered.length && video.value.buffered.end(length - 1);
  let value = end / tTime;
  bufferProgress.value.style.width = value * 100 + "%";
  // console.log("缓冲时长", "buffered", length, "end", end);
};
const configDM = (dmbox, dmInfo) => {
  dmbox.className = "dmbox";
  dmbox.innerHTML = `${dmInfo.barrage}`;
  dmbox.title = `${dmInfo.barrage}`;
  let videoHeight = video.value.offsetHeight;
  // 随机生成dmbox具顶部的问题
  let _TOP = (Math.random() / 2) * videoHeight;
  _TOP = _TOP - (_TOP % 40);
  dmbox.style.top = _TOP + "px";
  const dmContainer = document.querySelector(".dm-container");
  dmContainer.appendChild(dmbox);
  // 弹幕存在的时间
  let dmDuration = 4;
  dmbox.style.setProperty("--duration", `${dmDuration}s`);
  // 监听动画，在动画进行中的一些操作
  dmbox.addEventListener("animationend", () => {
    // 获取到具体的某个dmBox,然后移除掉
    dmContainer.removeChild(dmbox);
    // 用if (removeDmbox)的原因，是在弹幕的duration里可能调用了skip提前把dmbox去掉了
    // if (removeDmbox) {
    //   dmContainer.removeChild(dmbox);
    // }
  });
};
const addAnimationRule = (dmbox) => {
  let videoWidth = video.value.offsetWidth;
  let dmboxWidth = getComputedStyle(dmbox, null)["width"];
  dmboxWidth = parseFloat(dmboxWidth.slice(0, -2));
  // 用来操作keyframe
  const runkeyframes = `@keyframes dm{0%{right: -${dmboxWidth}px}100%{right: ${
    videoWidth + dmboxWidth
  }px}}`;
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.sheet.insertRule(runkeyframes, 0);
};
// 视频播放时，一直调用
const videoPlay = () => {
  // 操作弹幕
  dmInfo.forEach((dmInfo) => {
    // video.value.currentTime-dmInfo.duration>4
    while (video.value.currentTime >= dmInfo.duration && !dmInfo.isSend) {
      const dmbox = document.createElement("div");
      configDM(dmbox, dmInfo);
      // 添加动画规则 keyframes
      addAnimationRule(dmbox);
      // 是否发送标记位
      dmInfo.isSend = true;
    }
  });
  //            获取视频当前播放的时间
  //           console.log(video.currentTime);
  //            当前播放时间
  let cTime = video.value.currentTime;
  //           把格式转成00:00
  //            分钟
  var m = Math.floor(cTime / 60);
  //            秒
  var s = Math.floor(cTime % 60);

  //            把数据格式转成00：00
  m = m >= 10 ? m : "0" + m;
  s = s >= 10 ? s : "0" + s;

  //            显示出当前时间
  currTime.value.innerHTML = m + ":" + s;

  //            改变进度条的宽度： 当前时间/总时间
  let value = cTime / tTime;

  if (!isDrug.value) {
    currProgress.value.style.width = value * 100 + "%";
    progressThumbIcon.value.style.left =
      value * progressWidthNumber - 10 > 0
        ? value * progressWidthNumber - 20 + "px"
        : -10 + "px";
  }
};
// 重新播放
const replay = () => {
  video.value.currentTime = 0;
  video.value.play();
  dmInfo.forEach((e) => {
    e.isSend = false;
  });
  isEnd.value = false;
  const dmboxArr = document.querySelectorAll(".dmbox");
  const dmContainer = document.querySelector(".dm-container");
  if (dmboxArr.length > 0) {
    dmboxArr.forEach((e) => {
      dmContainer.removeChild(e);
    });
  }
};

// 获取视频当前时间,用来让别的组件发 发送弹幕请求
const getDuration = () => {
  sendDmVideoDuration.value = video.value.currentTime.toFixed(1);
};
// 添加弹幕
const receiveDmInfo = (dmInfo) => {
  const dmbox = document.createElement("div");
  // 配置弹幕信息
  configDM(dmbox, dmInfo);
  // 标注这是刚发的弹幕
  dmbox.style.border = "3px solid #00a1d6";
  // 添加动画规则 keyframes
  addAnimationRule(dmbox);
};

// 处理视频结束时弹幕状态
watch(isEnd, (newValue, oldValue) => {
  const dmboxs = document.querySelectorAll(".dmbox");
  if (newValue) {
    dmboxs.forEach((dmbox) => {
      dmbox.style.animationPlayState = "paused";
    });
  } else {
    dmboxs.forEach((dmbox) => {
      dmbox.style.animationPlayState = "";
    });
  }
});
// 设置全局键盘监听事件
const _addEventListener = () => {
  document.addEventListener("keydown", (event) => {
    console.log(event, "keyword");
    if (event.code === "Space") {
      playBtnfn();
    } else if (event.code === "KeyF") {
      changeScreenSize();
    } else if (event.code === "ArrowUp") {
      soundsVal.value = `${soundsVal.value - 0 + 10}`;
      if (soundsVal.value > 100) {
        soundsVal.value = 100;
      }
    } else if (event.code === "ArrowDown") {
      soundsVal.value = `${soundsVal.value - 10}`;
      if (soundsVal.value < 0) {
        soundsVal.value = 0;
      }
    }
  });
};
// 解除全局键盘监听事件
const _removeEventListener = () => {
  document.removeEventListener("keydown", () => {
    console.log("移除监听成功");
  });
};
const changeVideoPlaybackRate = () => {
  // 所有li倍速框的集合数组
  playbackrateMenuItem = document.querySelectorAll(".playbackrate-menu-item");
  // 全局定义上一次点击
  let lastClick = 1.0;
  playbackrateMenuItem.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.backgroundColor = "#312f2fad";
    });
    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "#1f2021e4";
    });
    // 给每个速度如2x，1.25x都赋予具体实现
    item.addEventListener("click", () => {
      if (lastClick) {
        const changeSpeedItem = document.querySelector(
          `li[data-playbackRate='${lastClick}']`
        );
        changeSpeedItem.style.color = "#fff";
      }
      video.value.playbackRate = item.getAttribute("data-playbackRate");
      item.style.color = "#00AEEC";
      lastClick = item.getAttribute("data-playbackRate");
    });
  });
  const initSpeedItem = document.querySelector(
    `li[data-playbackRate='${lastClick}']`
  );
  initSpeedItem.style.color = "#00AEEC";
};

onMounted(async () => {
  // 设置全局键盘监听事件
  _addEventListener();
  // 控制视频速度变化
  changeVideoPlaybackRate();
  // 初始化是设置视频音量
  video.value.volume = soundsVal.value / 100;
});

let timeout;
const showControls = () => {
  controls.value.style.opacity = 1;
  video.value.style.cursor = "default";
  if (timeout) {
    clearTimeout(timeout);
  }
  if (isFullScreen.value) {
    timeout = setTimeout(async () => {
      console.log(controls);
      controls.value.style.opacity = 0;
      video.value.style.cursor = "none";
      timeout = null;
    }, 2000);
  } else {
    timeout = setTimeout(async () => {
      console.log(controls);
      controls.value.style.opacity = 0;
      video.value.style.cursor = "none";
      timeout = null;
    }, 1400);
  }
};

const closeControls = () => {
  controls.value.style.opacity = 0;
  video.value.style.cursor = "none";
};
const openControls = () => {
  if (timeout) {
    clearTimeout(timeout);
  }
  controls.value.style.opacity = 1;
  video.value.style.cursor = "default";
};

// 全屏,小屏切换
const changeScreenSize = () => {
  const player = document.querySelector(".player");
  if (!isFullScreen.value) {
    player.requestFullscreen();
  } else {
    document.webkitExitFullscreen();
  }
  isFullScreen.value = !isFullScreen.value;
  // 切换大小屏时清除掉弹幕
  const dmboxArr = document.querySelectorAll(".dmbox");
  const dmContainer = document.querySelector(".dm-container");
  if (dmboxArr.length > 0) {
    dmboxArr.forEach((e) => {
      dmContainer.removeChild(e);
    });
  }
};

window.onresize = () => {
  if (document.fullscreenElement) {
    console.log("进入全屏");
    isFullScreen.value = true;
    progressWidthString = window.getComputedStyle(mainProgress.value).width;
    progressWidthNumber = progressWidthString.slice(0, -2);
  } else {
    console.log("退出全屏");
    isFullScreen.value = false;
    progressWidthString = window.getComputedStyle(mainProgress.value).width;
    progressWidthNumber = progressWidthString.slice(0, -2);
  }
};

// 倍速播放设置
let timeoutShowPlaybackrateMenu;
const showPlaybackrateMenu = () => {
  if (timeoutShowPlaybackrateMenu) {
    clearTimeout(timeoutShowPlaybackrateMenu);
  }
  playbackrateMenu.value.style.display = "block";
};
const visPlaybackrateMenu = () => {
  timeoutShowPlaybackrateMenu = setTimeout(() => {
    playbackrateMenu.value.style.display = "none";
    timeoutShowPlaybackrateMenu = null;
  }, 300);
};
const openPlaybackrateMenu = () => {
  if (timeoutShowPlaybackrateMenu) {
    clearTimeout(timeoutShowPlaybackrateMenu);
  }
};
const closePlaybackrateMenu = () => {
  timeoutShowPlaybackrateMenu = setTimeout(() => {
    playbackrateMenu.value.style.display = "none";
    timeoutShowPlaybackrateMenu = null;
  }, 300);
};

// 控制音量条显示
let timeoutShowSounds;
const showSounds = () => {
  if (timeoutShowSounds) {
    clearTimeout(timeoutShowSounds);
  }
  isShowSoundsModel.value = true;
};
const visSounds = () => {
  timeoutShowSounds = setTimeout(() => {
    isShowSoundsModel.value = false;
    timeoutShowSounds = null;
  }, 300);
};
const openSounds = () => {
  if (timeoutShowSounds) {
    clearTimeout(timeoutShowSounds);
  }
};
const closeSounds = () => {
  timeoutShowSounds = setTimeout(() => {
    isShowSoundsModel.value = false;
    timeoutShowSounds = null;
  }, 300);
};
</script>

<style lang="scss" scoped>
.videoTitle {
  width: 720px;
  height: 80px;
  .title {
    font-size: 20px;
    font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei,
      sans-serif;
    font-weight: 500;
    line-height: 28px;
    margin-bottom: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .videoInfo {
    color: rgba(46, 44, 44, 0.5);
    .item {
      margin-right: 12px;
      .video_card_icon {
        width: 20px;
        height: 20px;
        transform: translate(0, 3px);
      }
      .video_card_text {
        font-size: 16px;
        line-height: 20px;
        margin-left: 3px;
      }
    }
  }
}
::v-deep .el-loading-mask {
  background-color: #ffffff00;
  .el-loading-spinner {
    margin-top: -35px;
    .circular {
      width: 70px;
      height: 70px;
    }
  }
}
.player {
  width: 720px;
  height: 360px;
  background: #000;
  background-size: auto 100%;
  position: relative;
  .dm-container {
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    ::v-deep .dmbox {
      cursor: pointer;
      pointer-events: auto;
      position: absolute;
      display: inline-block;
      line-height: 40px;
      font-size: 26px;
      height: 40px;
      color: #fff !important;
      animation: dm var(--duration) linear 0s normal;
      &:hover {
        // 鼠标经过暂停动画
        animation-play-state: paused;
      }
    }
  }
  .isEnd {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.7;
    .endInfo {
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 150px;
      transform: translate(-75px, -22px);
      display: flex;
      justify-content: center;
      .fontEnd {
        position: relative;
        top: 5px;
        margin-left: 5px;
        color: white;
        font-size: 25px;
        line-height: 30px;
      }
    }
  }
  video {
    width: 100%;
    height: 100%;
    display: block;
    margin: 0 auto;
  }
  // &:hover .controls {
  //     opacity: 1;
  //     transition: opacity 1s linear;
  // }
  .controls {
    display: flex;
    background: linear-gradient(
      to bottom,
      rgba(10, 1, 1, 0) 10%,
      rgba(9, 9, 0, 0.814)
    );
    opacity: 0;
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0px;
    transition: opacity 0.3s linear;
    .progress-box {
      cursor: pointer;
      position: absolute;
      height: 20px;
      bottom: 40px;
      left: 0px;
      right: 0px;
      padding: 0 12px;
      box-sizing: border-box;
      .progress-box2 {
        position: relative;
        width: 100%;
        .progress {
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: aliceblue;
          bottom: -10px;
          transition: height 0.2s linear;
          &:hover {
            height: 6px;
          }
          .buffer-progress {
            position: absolute;
            height: 100%;
            background-color: #4e5052a4;
          }
          .curr-progress {
            position: absolute;
            height: 100%;
            background-image: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%);
          }
          .progress-thumb-icon {
            // background-color: red;
            cursor: pointer;
            top: -8px;
            left: -10px;
            position: absolute;
            // display: none;
            .icon-thumb-suger {
              transform: translate(5px, 1px);
            }
          }
        }
      }
    }
    .controls-item {
      position: absolute;
      bottom: 5px;
      opacity: 0.75;
      &:hover {
        opacity: 2;
      }
    }
    .controls-bottom {
      position: absolute;
      bottom: 0px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .controls-left {
        position: relative;
        width: 180px;
        .switch {
          left: 14px;
          cursor: pointer;
        }
        .time {
          left: 52px;
          line-height: 38px;
          font-size: 20px;
          color: white;
        }
      }
      .controls-middle {
        position: relative;
        flex-grow: 1;
        margin: 0px 150px;
        .send-dm {
          // position: absolute;
          bottom: 10px;
          height: 30px;
          display: flex;
          align-items: center;
          width: 100%;
          .sendDmInput {
            position: relative;
            display: inline-block;
            width: 100%;
            height: 100%;
            .sendDmIcon {
              position: relative;
              display: inline-block;
              width: 30px;
              height: 100%;
              border-bottom-left-radius: 15%;
              border-top-left-radius: 15%;
              background-color: #ced1d6;
              text-align: center;
              .Ship-icon {
                position: absolute;
                bottom: 5px;
                left: 8px;
              }
            }
            input {
              position: absolute;
              width: calc(100% - 30px);
              height: 100%;
              box-sizing: border-box;
              padding: 0 10px;
              border: none;
              outline: none;
              background-color: #ced1d6;
            }
          }
          .sendDmButton {
            cursor: pointer;
            display: inline-block;
            width: 60px;
            height: 100%;
            border-radius: 0%;
            background-color: #00a1d6;
            color: #fff;
            border-bottom-right-radius: 15%;
            border-top-right-radius: 15%;
            font-size: 13px;
            line-height: 30px;
            text-align: center;
          }
        }
      }
      .controls-right {
        height: 40px;
        width: 300px;
        position: relative;
        right: 0px;
        .soundsBtn {
          right: 95px;
          font-size: 20px;
        }
        .soundsModel {
          position: absolute;
          bottom: 55px;
          right: 95px;
          width: 30px;
          height: 100px;
          color: #fff;
          background: #1f2021e4;
          text-align: center;
          div {
            font-size: 12px;
            line-height: 25px;
          }
          input {
            width: 75px;
            height: 3px;
            transform-origin: 0% 100%;
            transform: rotate(-90deg);
            position: absolute;
            top: 90%;
            left: 50%;
          }
          input[type="range"]::-webkit-slider-thumb {
            width: 12px;
            height: 12px;
          }
        }
        .playbackrate {
          text-align: center;
          width: 80px;
          bottom: 13px;
          right: 150px;
          font-size: 20px;
          color: #fff;
        }
        .playbackrate-menu {
          display: none;
          padding: 0;
          margin: 0;
          position: absolute;
          bottom: 55px;
          right: 150px;
          list-style-type: none;
          .playbackrate-menu-item {
            height: 30px;
            line-height: 30px;
            text-align: center;
            width: 80px;
            font-size: 16px;
            color: #fff;
            background: #1f2021e4;
            cursor: pointer;
          }
        }
        .fullScreen {
          right: 22px;
        }
      }
    }
  }
}
</style>