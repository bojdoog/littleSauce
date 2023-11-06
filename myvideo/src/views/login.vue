<template>
  <div class="container">
    <div class="inner-container" @input="aboutLoginBtn">
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
      <div class="enter-account">
        <span>账号</span
        ><input
          type="text"
          placeholder="请输入账号"
          v-model="accountVal"
          ref="accountFrame"
        />
      </div>
      <div class="enter-password">
        <span>密码</span
        ><input
          type="password"
          placeholder="请输入密码"
          v-model="passwordVal"
          ref="passwordFrame"
        />
        <div class="is-show-password">
          <svg
            data-v-911eaac8
            width="25"
            height="25"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="showPassword"
          >
            <path
              data-v-911eaac8
              fill-rule="evenodd"
              clip-rule="evenodd"
              :d="[isShowPassword ? showPassW : closePassW]"
              fill="#9499A0"
            ></path>
          </svg>
        </div>
      </div>
      <div class="register-and-login">
        <div class="login" @click="loginFn" ref="login">登录</div>
        <div class="register" @click="registerFn">注册</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { loginAndGetInfo, uploadIpAddress } from "@/api";
import { ElMessage } from "element-plus";
import Cookie from "js-cookie";

const router = useRouter();
const accountVal = ref();
const passwordVal = ref();
const accountFrame = ref();
const passwordFrame = ref();
const login = ref();
const isShowPassword = ref(false);
const showPassW =
  "M2.11069 9.43732C3.21647 7.77542 5.87904 4.58331 9.89458 4.58331C13.8801 4.58331 16.6483 7.72502 17.8345 9.4049C18.0905 9.76747 18.0905 10.2325 17.8345 10.5951C16.6483 12.2749 13.8801 15.4166 9.89458 15.4166C5.87904 15.4166 3.21647 12.2245 2.11069 10.5626C1.88009 10.2161 1.88009 9.7839 2.11069 9.43732ZM9.89458 3.33331C5.19832 3.33331 2.20919 7.03277 1.07001 8.74489C0.560324 9.51091 0.560323 10.4891 1.07001 11.2551C2.20919 12.9672 5.19832 16.6666 9.89458 16.6666C14.5412 16.6666 17.6368 13.0422 18.8556 11.3161C19.4168 10.5213 19.4168 9.4787 18.8556 8.68391C17.6368 6.95774 14.5412 3.33331 9.89458 3.33331ZM7.29165 9.99998C7.29165 8.50421 8.50421 7.29165 9.99998 7.29165C11.4958 7.29165 12.7083 8.50421 12.7083 9.99998C12.7083 11.4958 11.4958 12.7083 9.99998 12.7083C8.50421 12.7083 7.29165 11.4958 7.29165 9.99998ZM9.99998 6.04165C7.81385 6.04165 6.04165 7.81385 6.04165 9.99998C6.04165 12.1861 7.81385 13.9583 9.99998 13.9583C12.1861 13.9583 13.9583 12.1861 13.9583 9.99998C13.9583 7.81385 12.1861 6.04165 9.99998 6.04165Z";
const closePassW =
  "M17.5753 6.85456C17.7122 6.71896 17.8939 6.63806 18.0866 6.63806C18.7321 6.63806 19.0436 7.42626 18.5748 7.87006C18.1144 8.30554 17.457 8.69885 16.6478 9.03168L18.1457 10.5296C18.2101 10.5941 18.2613 10.6706 18.2962 10.7548C18.331 10.839 18.349 10.9293 18.349 11.0204C18.349 11.1116 18.331 11.2019 18.2962 11.2861C18.2613 11.3703 18.2101 11.4468 18.1457 11.5113C18.0812 11.5757 18.0047 11.6269 17.9205 11.6618C17.8363 11.6967 17.746 11.7146 17.6548 11.7146C17.5637 11.7146 17.4734 11.6967 17.3892 11.6618C17.305 11.6269 17.2284 11.5757 17.164 11.5113L15.3409 9.68819C15.2898 9.63708 15.247 9.57838 15.2141 9.51428C14.4874 9.71293 13.6876 9.87122 12.8344 9.98119C12.8363 9.99011 12.8381 9.99908 12.8397 10.0081L13.2874 12.5472C13.315 12.7266 13.2713 12.9098 13.1656 13.0573C13.0598 13.2049 12.9005 13.3052 12.7217 13.3367C12.5429 13.3683 12.3589 13.3285 12.2091 13.2259C12.0592 13.1234 11.9555 12.9663 11.9202 12.7882L11.4725 10.2491C11.4645 10.2039 11.4611 10.1581 11.4621 10.1125C10.9858 10.1428 10.4976 10.1586 10.0002 10.1586C9.57059 10.1586 9.14778 10.1468 8.73362 10.1241C8.73477 10.1656 8.7322 10.2074 8.72578 10.249L8.27808 12.7881C8.24612 12.9694 8.14345 13.1306 7.99265 13.2362C7.84186 13.3418 7.65528 13.3831 7.47398 13.3512C7.29268 13.3192 7.1315 13.2166 7.0259 13.0658C6.9203 12.915 6.87892 12.7284 6.91088 12.5471L7.35858 10.008C7.35877 10.007 7.35896 10.0061 7.35915 10.0052C6.50085 9.90284 5.6941 9.75191 4.95838 9.56025C4.93012 9.60634 4.89634 9.64933 4.85748 9.68819L3.03438 11.5113C2.96992 11.5757 2.8934 11.6269 2.80918 11.6618C2.72496 11.6967 2.63469 11.7146 2.54353 11.7146C2.45237 11.7146 2.36211 11.6967 2.27789 11.6618C2.19367 11.6269 2.11714 11.5757 2.05268 11.5113C1.98822 11.4468 1.93709 11.3703 1.90221 11.2861C1.86732 11.2019 1.84937 11.1116 1.84937 11.0204C1.84937 10.9293 1.86732 10.839 1.90221 10.7548C1.93709 10.6706 1.98822 10.5941 2.05268 10.5296L3.49373 9.08855C2.6197 8.744 1.91247 8.33062 1.42559 7.87006C0.956591 7.42636 1.26799 6.63816 1.91359 6.63816C2.10629 6.63816 2.28789 6.71896 2.42489 6.85456C2.70009 7.12696 3.19529 7.45886 3.98459 7.77796C5.54429 8.40856 7.73699 8.77016 10.0001 8.77016C12.2632 8.77016 14.4558 8.40856 16.0156 7.77796C16.8049 7.45886 17.3001 7.12696 17.5753 6.85456Z";
onMounted(() => {
  if (!accountVal.value && !passwordVal.value) {
    login.value.style.opacity = "0.4";
    login.value.style.cursor = "not-allowed";
  }
});
const aboutLoginBtn = () => {
  if (!accountVal.value || !passwordVal.value) {
    login.value.style.opacity = "0.4";
    login.value.style.cursor = "not-allowed";
  } else if (accountVal.value && passwordVal.value) {
    login.value.style.opacity = "1";
    login.value.style.cursor = "pointer";
    login.value.addEventListener("mouseover", () => {
      login.value.style.backgroundColor = "#08b5eedf";
    });
    login.value.addEventListener("mouseleave", () => {
      login.value.style.backgroundColor = "#0e9ac9c1";
    });
  }
};
const loginFn = () => {
  if (accountVal.value && passwordVal.value) {
    let loginInfo = {
      account: accountVal.value,
      password: passwordVal.value,
    };
    loginAndGetInfo(loginInfo)
      .then((res) => {
        if (res.data.code === -1) {
          ElMessage({
            message: res.data.message,
            type: "warning",
            duration: 3000,
          });
        } else {
          const expires = new Date(Date.now() + 5 * 60 * 1000);
          Cookie.set("USER_TOKEN", res.data.token, { expires: expires });
          Cookie.set("refersh_Token", res.data.refreshToken, { expires: 7 });
          let _userInfo = {
            ...res.data.userInfo,
            menu: res.data.menu,
          };
          let userInfo = JSON.stringify(_userInfo);
          Cookie.set("USER_INFO", userInfo);
          router.push({ name: "Home" });

          let userAddress = JSON.parse(Cookie.get("UserAddress"));
          uploadIpAddress({
            ...userAddress,
            date: Date(),
            userInfo: res.data.userInfo,
          })
            .then((res) => {
              console.log(res.data, "uploadIpAddress");
            })
            .catch((e) => {
              console.log(e, "uploadIpAddress");
            });
          ElMessage({
            message:
              res.data.message +
              "，用户 " +
              res.data.userInfo.username +
              " 欢迎回来",
            type: "success",
            duration: 3000,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

const registerFn = () => {
  router.push({ name: "Register" });
};
const showPassword = () => {
  isShowPassword.value = !isShowPassword.value;
  if (isShowPassword.value) {
    passwordFrame.value.type = "text";
  } else {
    passwordFrame.value.type = "password";
  }
};
</script>

<style lang="scss" scoped>
@mixin inputSpan {
  font-weight: 600;
  text-align: center;
  display: inline-block;
  height: 40px;
  width: 60px;
  font-size: 15px;
  line-height: 40px;
  background-color: #fff;
}
@mixin inputFrame {
  height: 40px;
  width: 250px;
  border: none;
  outline: none;
  padding: 0 15px;
  font-size: 20px;
  line-height: 24px;
  box-sizing: border-box;
}
@mixin inputPlaceholder {
  font-weight: 600;
  color: #2b2a2a8b;
  letter-spacing: 0px;
  font-size: 15px;
  transform: translate(0px, -1px);
}

html,
body {
  margin: 0;
  padding: 0;
}
.container {
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-350px, -225px);
  width: 700px;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: rgba(192, 183, 183, 0.242);
  .inner-container {
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #087bb0;
    width: 400px;
    height: 350px;
    // background-color: rgba(83, 83, 85, 0.216);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .icon-svg {
      margin-top: 50px;
    }
    .enter-account {
      margin-top: 20px;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(60, 60, 60, 0.611);
      display: flex;
      justify-content: center;
      span {
        @include inputSpan();
      }
      input {
        @include inputFrame();
      }
      input::placeholder {
        @include inputPlaceholder();
      }
    }
    .enter-password {
      margin-bottom: 20px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(60, 60, 60, 0.611);
      display: flex;
      justify-content: center;
      span {
        @include inputSpan();
      }
      input {
        @include inputFrame();
        letter-spacing: 10px;
        width: 200px;
      }
      input::placeholder {
        @include inputPlaceholder();
      }
      .is-show-password {
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          cursor: pointer;
        }
      }
    }
    .register-and-login {
      width: 311px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      .register {
        width: 140px;
        height: 40px;
        border: 1px solid rgba(60, 60, 60, 0.611);
        text-align: center;
        line-height: 40px;
        font-size: 25px;
        border-radius: 10px;
        cursor: pointer;
      }
      .login {
        width: 140px;
        height: 40px;
        background-color: #0e9ac9c1;
        text-align: center;
        line-height: 40px;
        font-size: 25px;
        color: #fff;
        border-radius: 10px;
        // transition: background-color 0.2s linear;
      }
    }
  }
}
</style>