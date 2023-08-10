<template>
  <div class="total-module">
    <div class="authorInfo-row" v-if="uInfoloading">
      <img
        class="authorHeadsculpture"
        :src="
          userInfo.headsculpture_src
            ? resource_src + userInfo.headsculpture_src
            : require('@/assets/noHeadsculpture.jpg')
        "
        alt="头像"
      />
      <div class="authorInfo">
        <div class="author-profile-area">
          <div class="author-name">{{ userInfo.username }}</div>
          <el-tooltip
            class="box-item"
            effect="light"
            :content="userInfo.profile"
            placement="bottom-start"
            :offset="8"
          >
            <div
              class="author-profile"
              v-html="
                userInfo.profile
                  ? '个人简介：' + userInfo.profile
                  : '这个人还没有简介欸'
              "
            ></div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="dm-list-area" v-if="dmInfoLoading">
      <div class="dm-describe">
        <div class="dm-duration-desc">时间</div>
        <div class="dm-context-desc">弹幕内容</div>
        <div class="dm-date-desc">发送时间</div>
      </div>
      <div class="dm-list">
        <div class="dm-info-row" v-for="item in dmInfo" :key="item.id">
          <div class="dm-duration">{{ item.duration }}</div>
          <el-tooltip
            class="box-item"
            effect="light"
            :content="item.barrage"
            placement="right-start"
            :offset="8"
          >
            <div class="dm-context">{{ item.barrage }}</div>
          </el-tooltip>
          <div class="dm-date">{{ item.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserInfo } from "@/api";
import { fa } from "element-plus/es/locale";
import Cookies from "js-cookie";
import { onMounted, reactive, ref } from "vue";
import envMap from "@/config/app.config";
import http from "@/utils/request";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";

let resource_src = ref(envMap["resource"]);
const userInfo = ref();
const uInfoloading = ref(false);
const dmInfoLoading = ref(false);
const route = useRoute();
let dmInfo = ref();
const _getUserInfo = () => {
  let { uid } = JSON.parse(Cookies.get("USER_INFO"));
  return new Promise((resolve, reject) => {
    getUserInfo({ uid })
      .then((res) => {
        const _userInfo = res.data.userInfo;
        resolve(_userInfo);
        uInfoloading.value = true;
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
};

const getDmInfo = () => {
  return new Promise((resolve, reject) => {
    http
      .get(`/video/dmInfo?video_id=${route.query.video_id}`)
      .then((res: any) => {
        const _dmInfo = res.data.data;
        _dmInfo.forEach((e: any) => {
          const { duration } = e;
          var m: string | number = Math.floor(duration / 60);
          //            秒
          var s: string | number = Math.floor(duration % 60);

          //            把数据格式转成 00:00：00
          m = m >= 10 ? m : "0" + m;
          s = s >= 10 ? s : "0" + s;
          e.duration = m + ":" + s;
        });
        dmInfoLoading.value = true;
        resolve(_dmInfo);
      })
      .catch((e: any) => {
        reject(e);
      });
  });
};

onMounted(async () => {
  try {
    userInfo.value = await _getUserInfo();
    dmInfo.value = await getDmInfo();
  } catch (e) {
    ElMessage({
      message: "获取作者信息失败",
      type: "error",
      duration: 3000,
    });
  }
});
</script>

<style scoped lang="scss">
.dm-list-area {
  margin-top: 21px;
  width: 340px;
  height: 410px;
  box-shadow: 5px 0px 15px #b8eded;
  .dm-describe {
    height: 25px;
    margin-bottom: 10px;
    display: flex;
    font-size: 12px;
    .dm-duration-desc {
      width: 42px;
      text-align: center;
      margin: 10px 0 0 15px;
    }
    .dm-context-desc {
      margin: 10px 0 0 25px;
      width: 150px;
    }
    .dm-date-desc {
      width: 67.93px;
      margin: 10px 0 0 20px;
    }
  }
  .dm-list {
    height: 375px;
    overflow: auto;
    &::-webkit-scrollbar {
      // 滚动图的宽
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background-color: #9ef0f098;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      background-color: #fff;
    }
    .dm-info-row {
      display: flex;
      margin-bottom: 5px;
      font-size: 12px;
      color: #6d6d6d;
      .dm-duration {
        text-align: center;
        width: 42px;
        margin-left: 15px;
        cursor: pointer;
      }
      .dm-context {
        margin-left: 25px;
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .dm-date {
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
}
.authorInfo-row {
  margin-top: 12px;
  display: flex;
  .authorHeadsculpture {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .authorInfo {
    margin-left: 20px;
    .author-profile-area {
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .author-name {
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font: normal 18px/20px Arial;
      }
      .author-profile {
        width: 250px;
        font: normal 12px/16px Arial;
        color: #787878;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 控制显示的行数 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis; /* 显示省略号 */
      }
    }
  }
}
</style>