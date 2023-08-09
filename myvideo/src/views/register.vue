<template>
  <div class="dvBJ">
    <div class="register-box">
      <div class="icon-svg">
        <svg
          width="50"
          height="50"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="zhuzhan-icon"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="account-row input-item">
        <span class="describe-text"
          ><span style="color: red">*</span>账号：</span
        >
        <input
          type="email"
          @blur="verifyAccount"
          placeholder="输入账号"
          v-model="accountVal"
        />
      </div>
      <div class="password-row input-item">
        <span class="describe-text"
          ><span style="color: red">*</span>密码：</span
        ><input
          type="password"
          @input="triggerConfirm"
          @blur="verifyPassword"
          ref="password"
          v-model="passwordVal"
          placeholder="请输入密码"
        />
      </div>
      <div class="confirm-password-row input-item">
        <span class="describe-text" style="font-size: 15px"
          ><span style="color: red">*</span>确认密码：</span
        >
        <input
          type="password"
          @input="triggerConfirm"
          v-model="confirmPasswordVal"
          placeholder="再次确认"
        />
      </div>
      <div class="username-row input-item">
        <span class="describe-text"
          ><span style="color: red">*</span>用户名：</span
        ><input
          type="text"
          placeholder="输入你想要的用户名"
          v-model="usernameVal"
          @blur="verifyUserName"
        />
      </div>
      <VerifyCode ref="verifyCode" @showVerifyWarning="showVerifyWarning" />
      <div class="bottom-btn">
        <div class="handle-register btn-item" @click="_handleRegister">
          注册
        </div>
        <div class="go-to-login btn-item" @click="goToLogin">去登录</div>
      </div>
      <div
        class="warning-text"
        style="top: 235px; left: 125px"
        v-show="passwordWrong"
      >
        密码不能为空
      </div>
      <div
        class="warning-text"
        style="top: 305px; left: 125px"
        v-show="ConfirmPWWrong"
      >
        两次输入的密码不一致
      </div>
      <div
        class="warning-text"
        style="top: 445px; left: 95px"
        v-show="isShowVerifyWrong"
      >
        验证码错误
      </div>
      <div
        class="warning-text"
        style="top: 375px; left: 125px"
        v-show="usernameStatus === -1 || usernameStatus === 2"
        v-html="usernameStatus === -1 ? '用户名已存在' : '用户名不能为空'"
      ></div>
      <div
        class="warning-text"
        style="top: 165px; left: 125px"
        v-show="accountStatus === -1 || accountStatus === 2"
        v-html="accountStatus === -1 ? '账号已存在' : '账号不能为空'"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface loginInfo {
  account: string;
  password: string;
}
import { onMounted, ref, watch } from "vue";
import VerifyCode from "@/components/VerifyCode.vue";
import {
  verifyUsername,
  _verifyAccount,
  handleRegister,
  loginAndGetInfo,
} from "@/api";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";

const router = useRouter();
const usernameVal = ref("");
const usernameStatus = ref(0);
const passwordVal = ref("");
const confirmPasswordVal = ref("");
const accountVal = ref("");
const ConfirmPWWrong = ref(false);
const accountStatus = ref(0);
const passwordWrong = ref(false);

// 用户名
const verifyUserName = () => {
  if (!usernameVal.value.length) {
    // 2是提示不能为空
    usernameStatus.value = 2;
  } else {
    verifyUsername({ unVerifyUsername: usernameVal.value }).then((res) => {
      usernameStatus.value = res.data.status;
    });
  }
};
// 密码验证
const verifyPassword = () => {
  passwordWrong.value = !passwordVal.value.length;
};
// 二次输入密码
const triggerConfirm = () => {
  ConfirmPWWrong.value = !(passwordVal.value === confirmPasswordVal.value);
};
// 账号
const verifyAccount = () => {
  if (!accountVal.value.length) {
    // 2是提示不能为空
    accountStatus.value = 2;
  } else {
    _verifyAccount({ unVerifyAccount: accountVal.value }).then((res) => {
      accountStatus.value = res.data.status;
    });
  }
};
// 验证码dom
const verifyCode = ref();
const isShowVerifyWrong = ref(false);
const showVerifyWarning = (isPassVerify: boolean) => {
  isShowVerifyWrong.value = !isPassVerify;
};
const goToLogin = () => {
  router.push("login");
};
const _handleRegister = () => {
  if (
    usernameStatus.value === 1 &&
    passwordVal.value.length > 0 &&
    !ConfirmPWWrong.value &&
    accountStatus.value === 1 &&
    verifyCode.value.isPassVerify
  ) {
    const personalInfo = {
      username: usernameVal.value,
      password: passwordVal.value,
      account: accountVal.value,
    };
    handleRegister(personalInfo).then((res) => {
      if (res.data.code === 0) {
        ElMessage({
          message: `注册成功，请等待2秒钟后将跳转`,
          type: "success",
          duration: 3000,
        });
        const loginInfo: loginInfo = {
          account: accountVal.value,
          password: passwordVal.value,
        };
        // 执行登录
        setTimeout(() => {
          handleLogin(loginInfo);
        }, 2000);
      }
    });
  } else if (usernameStatus.value === -1) {
    ElMessage({
      message: "用户名已存在",
      type: "error",
      duration: 3000,
    });
  } else if (accountStatus.value === -1) {
    ElMessage({
      message: "账号已存在",
      type: "error",
      duration: 3000,
    });
  } else if (ConfirmPWWrong.value) {
    ElMessage({
      message: "二次输入密码错误",
      type: "error",
      duration: 3000,
    });
  } else if (
    accountVal.value.length === 0 ||
    passwordVal.value.length === 0 ||
    confirmPasswordVal.value.length === 0 ||
    usernameVal.value.length === 0
  ) {
    ElMessage({
      message: "必填项不能为空",
      type: "error",
      duration: 3000,
    });
  } else if (!verifyCode.value.isPassVerify) {
    ElMessage({
      message: "验证码错误",
      type: "error",
      duration: 3000,
    });
  }
};
const handleLogin = (loginInfo: loginInfo) => {
  loginAndGetInfo(loginInfo).then((res) => {
    if (res.data.code === -1) {
      ElMessage({
        message: res.data.message,
        type: "warning",
        duration: 3000,
      });
    } else {
      if (res.data.status === 200) {
        Cookie.set("USER_TOKEN", res.data.token);
        let _userInfo = {
          ...res.data.userInfo,
          menu: res.data.menu,
        };
        let userInfo = JSON.stringify(_userInfo);
        Cookie.set("USER_INFO", userInfo);
        router.push({ name: "Home" });
        ElMessage({
          message:
            res.data.message +
            "，用户 " +
            res.data.userInfo.username +
            "，欢迎您",
          type: "success",
          duration: 3000,
        });
      } else if (res.data.status === 401) {
        ElMessage({
          message: res.data.message,
          type: "error",
          duration: 3000,
        });
      }
    }
  });
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
@mixin inputPlaceholder {
  font-weight: 600;
  color: #2b2a2a8b;
  letter-spacing: 0px;
  font-size: 15px;
  transform: translate(0px, -1px);
}
.dvBJ {
  width: 100vw;
  height: 100vh;
}
.register-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-200px, -300px);
  width: 400px;
  height: 600px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #087bb0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .warning-text {
    position: absolute;
    font-size: 12px;
    color: red;
  }
}
.icon-svg {
  margin-top: 40px;
}
.describe-text {
  width: 90px;
  text-align: center;
  font-size: 18px;
}
.input-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.username-row {
  width: 320px;
  height: 50px;
  margin-top: 20px;
  input {
    outline: none;
    box-sizing: border-box;
    width: 230px;
    height: 38px;
    padding: 0 10px;
    border-radius: 10px;
    font-size: 18px;
    &::placeholder {
      @include inputPlaceholder();
    }
  }
}
.password-row {
  width: 320px;
  height: 50px;
  margin-top: 20px;
  input {
    outline: none;
    box-sizing: border-box;
    width: 230px;
    height: 38px;
    padding: 0 10px;
    border-radius: 10px;
    font-size: 18px;
    letter-spacing: 5px;
    &::placeholder {
      @include inputPlaceholder();
    }
  }
}
.confirm-password-row {
  width: 320px;
  height: 50px;
  margin-top: 20px;
  input {
    outline: none;
    box-sizing: border-box;
    width: 230px;
    height: 38px;
    padding: 0 10px;
    border-radius: 10px;
    font-size: 18px;
    letter-spacing: 5px;
    &::placeholder {
      @include inputPlaceholder();
    }
  }
}
.account-row {
  width: 320px;
  height: 50px;
  margin-top: 20px;
  input {
    outline: none;
    box-sizing: border-box;
    width: 230px;
    height: 38px;
    padding: 0 10px;
    border-radius: 10px;
    font-size: 18px;
    &::placeholder {
      @include inputPlaceholder();
    }
  }
}
.bottom-btn {
  margin-top: 40px;
  width: 320px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  .btn-item {
    font-size: 20px;
    cursor: pointer;
    width: 120px;
    height: 50px;
    border-radius: 20px;
    text-align: center;
    line-height: 50px;
    border: 1px solid;
  }
  .handle-register {
    color: #fff;
    background-color: rgba(14, 154, 201, 0.7568627451);
  }
  .go-to-login {
    color: #00000089;
  }
}
</style>