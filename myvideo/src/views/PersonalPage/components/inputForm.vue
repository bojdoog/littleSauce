<template>
  <div class="dvBJ">
    <div class="form">
      <div class="title-line">
        <svg class="close-icon" width="20px" height="20px" @click="closeForm">
          <path d="M0 0 L18 18" stroke="red" stroke-width="3" />
          <path d="M18 0 L0 18" stroke="red" stroke-width="3" />
        </svg>
      </div>
      <div class="username describe-word">
        昵称：<input
          type="text"
          v-model="usernameVal"
          class="input-item"
          placeholder="请输入昵称"
        />
      </div>
      <div class="personal-profile describe-word">
        个人简介：<textarea v-model="profile"></textarea>
      </div>
      <div class="headsculpture describe-word">
        头像：
        <div
          class="no-info-tip"
          style="top: 70px"
          v-html="headsculpture_src ? '点击头像上传' : '*暂无,点击头像上传'"
        ></div>
        <img
          :src="
            headsculpture_src
              ? sourceSrc + headsculpture_src
              : require('@/assets/noHeadsculpture.jpg')
          "
          width="100"
          height="100"
          @click="uploadImg"
          ref="headsculpture"
        />
        <input
          type="file"
          style="display: none"
          ref="inputFile"
          @change="chooseFiles"
        />
      </div>
      <div class="change-info-btn" @click="submitInfo">提交</div>
    </div>
  </div>
</template>

<script setup>
import config from "@/config/app.config";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { updateUserInfo } from "@/api";
const props = defineProps({
  initFormData: {
    type: Object,
    default: {
      uid: -1,
    },
  },
});
const emits = defineEmits(["closeForm", "updateInfo"]);
const closeForm = () => {
  emits("closeForm");
};
const sourceSrc = ref(config["resource"]);
const usernameVal = ref(props.initFormData.username);
const profile = ref(props.initFormData.profile);
const userInfo = reactive(props.initFormData);
const headsculpture_src = ref(userInfo.headsculpture_src);
const inputFile = ref();
const headsculpture = ref();
let formData = new FormData();
let file;
const uploadImg = () => {
  inputFile.value.click();
};
const chooseFiles = () => {
  file = inputFile.value.files[0];
  if (!file) return;
  const objectURL = URL.createObjectURL(file);
  headsculpture.value.src = objectURL;
  formData.append("file", file);
  formData.append("filename", file.name);
};
const submitInfo = () => {
  if (
    !file &&
    usernameVal.value === props.initFormData.username &&
    profile.value === props.initFormData.profile
  ) {
    ElMessage({
      message: "你没有修改任何信息",
      type: "warning",
      duration: 3000,
    });
    emits("closeForm");
    return;
  }
  formData.append("username", usernameVal.value);
  formData.append("profile", profile.value);
  updateUserInfo(formData).then((res) => {
    const { code } = res.data;
    if (code === 0) {
      ElMessage({
        message: "修改个人信息成功",
        type: "success",
        duration: 3000,
      });
      emits("updateInfo");
      emits("closeForm");
    }
  });
};
onMounted(() => {
  formData.append("uid", props.initFormData.uid);
  if (props.initFormData.uid === -1) {
    ElMessage({
      message: "获取用户初始信息失败,3秒后关闭表单",
      type: "error",
      duration: 3000,
    });
    setTimeout(() => {
      emits("closeForm");
    }, 3000);
  }
});
</script>

<style lang="scss" scoped>
.dvBJ {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.296);
  top: 0px;
}
.describe-word {
  font: bold 24px/40px Arial;
  color: #3f3d3d;
}
.no-info-tip {
  font: normal 12px Georgia, serif;
  color: #ff4400;
  position: absolute;
}
.input-item {
  outline: none;
  font-size: 18px;
  font-weight: 600;
  box-sizing: border-box;
  padding: 0 10px;
  height: 40px;
  border-radius: 15px;
  border: 3px solid #3f3d3d;
}

@keyframes initForm {
  0% {
    transform: translate(-250px, -500px);
  }
  100% {
    transform: translate(-250px, -250px);
  }
}

.form {
  position: fixed;
  left: 50%;
  transform: translate(-250px, -250px);
  width: 500px;
  height: 550px;
  top: 50%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: initForm 0.4s ease-in-out;
  .title-line {
    width: 470px;
    height: 30px;
    border-bottom: 1px dotted #087bb0;
    position: relative;
    .close-icon {
      cursor: pointer;
      position: absolute;
      right: 5px;
      top: 6px;
    }
  }
  .username {
    margin-top: 30px;
    height: 40px;
    width: 420px;
    display: flex;
    justify-content: flex-end;
    input {
      width: 300px;
      &::placeholder {
        font-weight: 600;
        color: #2b2a2a8b;
        letter-spacing: 0px;
        font-size: 15px;
      }
    }
  }
  .personal-profile {
    margin-top: 30px;
    height: 150px;
    width: 420px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    textarea {
      padding: 5px 10px 5px 10px;
      box-sizing: border-box;
      outline: none;
      resize: none;
      font: normal 18px Arial, sans-serif;
      width: 300px;
      height: 150px;
      border-radius: 5px;
      background-color: #f2f2f2;
      border: 3px solid #3f3d3d;
      &::-webkit-scrollbar {
        // 滚动图的宽
        width: 10px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #217ed0be;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background-color: #d3dce6;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      }
    }
  }
  .headsculpture {
    position: relative;
    margin-top: 30px;
    width: 320px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      cursor: pointer;
      margin-left: 80px;
    }
  }
  .change-info-btn {
    margin-top: 40px;
    width: 150px;
    height: 50px;
    background-color: #5f9f9f;
    font: italic 600 26px/50px Georgia, serif;
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
}
</style>