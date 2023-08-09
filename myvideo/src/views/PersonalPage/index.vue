<template>
  <div class="userPage">
    <div class="personal-page" v-if="userInfo">
      <div class="change-info-btn" @click="alterUserInfo">修改个人信息</div>
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
import { onMounted, onUnmounted, reactive, ref } from "vue";
import Cookies from "js-cookie";
import config from "@/config/app.config";
import { getUserInfo } from "@/api";
import { ElMessage } from "element-plus";
import InputForm from "./components/inputForm.vue";
import bus from "@/bus";

const userCity = ref();
const userIp = ref();
let userInfo = ref();
const sourceSrc = ref(config["resource"]);
const showInputForm = ref(false);
let initFormData = reactive({});

const _getUserInfo = () => {
  let { uid } = JSON.parse(Cookies.get("USER_INFO"));
  return new Promise((resolve, reject) => {
    getUserInfo({ uid })
      .then((res) => {
        const _userInfo = res.data.userInfo;
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
  console.log(_userInfo, "_userInfo");
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
});

onUnmounted(() => {
  showInputForm.value = false;
});
</script>

<style lang="scss" scoped>
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
  width: 700px;
  padding: 70px 0 0 120px;
  .change-info-btn {
    position: absolute;
    right: 0px;
    bottom: 120px;
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