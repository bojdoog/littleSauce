<template>
  <div class="userPage">
    <div class="echarts1" ref="echarts1" v-if="isShowViews"></div>
    <div class="dvBJ" v-show="isShowViews">
      <div class="close-views" @click="closeViews">x</div>
    </div>
    <div class="personal-page" v-if="userInfo">
      <div class="change-info-btn" @click="alterUserInfo">修改个人信息</div>
      <div class="show-views-btn" @click="handleViews">播放量统计</div>
      <div class="row-item font1">
        昵称：
        <span style="color: #ff7f00">{{ userInfo.username }}</span>
        <span style="color: #ff6ec7; padding-left: 30px" v-if="userInfo.isAdmin"
          >(管理员)</span
        >
      </div>
      <div
        class="row-item font1"
        :style="userInfo.profile ? '' : '  text-decoration: none;'"
      >
        个人简介： <span style="color: #ff7f00">{{ userInfo.profile }}</span>
        <div class="no-info-tip" v-if="!userInfo.headsculpture_src">*暂无</div>
      </div>
      <div class="headsculpture-row row-item">
        <div
          class="font-touxiang font1"
          :style="userInfo.headsculpture_src ? '' : '  text-decoration: none;'"
        >
          头像：
          <div class="no-info-tip" v-if="!userInfo.headsculpture_src">
            *暂无，当前为默认头像
          </div>
        </div>
        <img
          :src="
            userInfo.headsculpture_src
              ? sourceSrc + userInfo.headsculpture_src
              : require('@/assets/noHeadsculpture.jpg')
          "
          width="100"
          height="100"
        />
      </div>
      <div class="row-item font1">
        登录IP：
        <span style="color: #ff7f00">{{ userIp }}</span>
      </div>
      <div class="row-item font1">
        所属地：
        <span style="color: #ff7f00">{{ userCity }}</span>
      </div>
    </div>
    <InputForm
      @closeForm="closeForm"
      :initFormData="initFormData"
      v-if="showInputForm"
      @updateInfo="updateInfo"
    />
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import Cookies from "js-cookie";
import config from "@/config/app.config";
import { getUserInfo } from "@/api";
import { ElMessage } from "element-plus";
import InputForm from "./components/inputForm.vue";
import bus from "@/bus";
import * as echarts from "echarts";

const userCity = ref();
const userIp = ref();
let userInfo = ref();
const sourceSrc = ref(config["resource"]);
const showInputForm = ref(false);
let initFormData = reactive({});
const echarts1 = ref();
const videoViews = ref();
const isShowViews = ref(false);
let options;

const _getUserInfo = () => {
  let { uid } = JSON.parse(Cookies.get("USER_INFO"));
  return new Promise((resolve, reject) => {
    getUserInfo({ uid })
      .then((res) => {
        const _userInfo = res.data.userInfo;
        videoViews.value = [...res.data.videoViews];
        initFormData = { ..._userInfo };
        resolve(_userInfo);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
};

const alterUserInfo = () => {
  showInputForm.value = true;
};

const closeForm = () => {
  showInputForm.value = false;
};

const handleViews = async () => {
  if (videoViews.value.length <= 0) {
    ElMessage({ message: "您还没有视频作品", type: "warning", duration: 3000 });
    return;
  }
  isShowViews.value = true;
  await nextTick();
  const _echarts1 = echarts.init(echarts1.value, "dark");
  _echarts1.setOption(options);
};

const closeViews = () => {
  isShowViews.value = false;
};

const updateInfo = async () => {
  userInfo.value = await _getUserInfo();
  ElMessage({
    message: "刷新更改后的数据",
    type: "success",
    duration: 3000,
  });
  let _userInfo = JSON.parse(Cookies.get("USER_INFO"));
  _userInfo = {
    ..._userInfo,
    headsculpture_src: userInfo.value.headsculpture_src,
    profile: userInfo.value.profile,
    username: userInfo.value.username,
  };
  Cookies.set("USER_INFO", JSON.stringify(_userInfo));
  bus.emit("updateHeadsculpture");
};

onMounted(async () => {
  userInfo.value = await _getUserInfo();
  ElMessage({
    message: "获取用户信息成功",
    type: "success",
    duration: 3000,
  });
  const { ipAdress, userPHYAddress } = JSON.parse(Cookies.get("UserAddress"));
  userCity.value = userPHYAddress;
  userIp.value = ipAdress;
  await nextTick();
  videoViews.value.sort((a: any, b: any) => b.views - a.views);
  videoViews.value.splice(5);
  videoViews.value.sort((a: any, b: any) => a.id - b.id);
  const title = videoViews.value.map((item: any) => item.videoTitle);
  const views = videoViews.value.map((item: any) => item.views);
  options = {
    backgroundColor: {
      type: "radial",
      x: 0.3,
      y: 0.3,
      r: 0.8,
      colorStops: [
        {
          offset: 0,
          color: "#29bdd9",
        },
        {
          offset: 1,
          color: "#000000",
        },
      ],
    },
    title: {
      text: "您的热门视频播放量",
      textStyle: {
        color: "#99FFFF", // 设置标题文本颜色为红色
        fontSize: 18, // 设置标题文本大小为18px
        fontWeight: "bold", // 设置标题文本加粗
      },
    },
    tooltip: {},
    xAxis: {
      data: [...title],
      axisLabel: {
        formatter: function (value: any) {
          // 设置最大宽度，单位可以根据需要进行调整
          var maxWidth = 10;
          var formattedValue = value;

          // 判断文本宽度是否超过最大宽度
          if (value.length > maxWidth) {
            // 截取文本并添加省略号
            formattedValue = value.substring(0, maxWidth - 2) + "...";
          }

          // 返回格式化后的文本
          return formattedValue;
        },
        // interval: 0, // 强制显示所有的标签文本
        rotate: 0, // 设置倾斜角度，以便更好地显示长文本
      },
    },
    yAxis: {
      axisLabel: {
        textStyle: {
          color: "#FF77FF", // 设置字体颜色为红色
        },
      },
    },
    series: [
      {
        name: "播放量",
        type: "line",
        data: [...views],
        itemStyle: {
          color: "#99FFFF", // 设置柱子颜色为蓝色
        },
        label: {
          show: true,
          color: "#FF7744", // 设置字体颜色为红色
        },
      },
    ],
  };
});

onUnmounted(() => {
  showInputForm.value = false;
});
</script>

<style lang="scss" scoped>
.dvBJ {
  z-index: 5;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.296);
  top: 0px;
  .close-views {
    position: absolute;
    font-size: 28px;
    color: #fff;
    cursor: pointer;
    left: 1290px;
    top: 50px;
  }
}
.echarts1 {
  z-index: 10;
  height: 500px;
  width: 1200px;
  position: absolute;
  top: 50px;
  left: 50px;
  // transform: translate(-250px, -250px);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: initForm 0.4s ease-in-out;
}
.userPage {
  height: 100%;
  width: 100%;
  position: relative;
}
.font1 {
  color: #ebc79e;
  font: italic 700 1.5em Georgia, serif;
  text-decoration: underline;
  text-decoration-color: #5f9f9f;
  text-underline-offset: 8px;
}
.no-info-tip {
  margin-top: 10px;
  font: normal 16px Georgia, serif;
  color: #ff4400;
  position: absolute;
}
.personal-page {
  position: relative;
  width: 800px;
  padding: 70px 0 0 120px;
  .change-info-btn {
    position: absolute;
    right: 0px;
    top: 150px;
    width: 250px;
    height: 80px;
    background-color: #5f9f9f;
    font: italic 600 30px/80px Georgia, serif;
    border-radius: 20px;
    color: #fff;
    text-align: center;
    box-shadow: 0 0 25px #087bb0;
    cursor: pointer;
    transition: background-color 0.2s linear;
    &:hover {
      background-color: #85dcdc;
    }
  }
  .show-views-btn {
    position: absolute;
    right: 0px;
    top: 350px;
    width: 250px;
    height: 80px;
    background-color: #793bd0;
    font: italic 600 30px/80px Georgia, serif;
    border-radius: 20px;
    color: #fff;
    text-align: center;
    box-shadow: 0 0 25px #674696;
    cursor: pointer;
    transition: background-color 0.2s linear;
    &:hover {
      background-color: #b58eec;
    }
  }
  .row-item {
    line-height: 60px;
    margin-bottom: 30px;
  }
  .headsculpture-row {
    display: flex;
    align-items: center;
    .font-touxiang {
      width: 180px;
      margin-right: 50px;
    }
    img {
      border: 5px dotted #ff7f00;
      margin-right: 20px;
    }
  }
}
</style>