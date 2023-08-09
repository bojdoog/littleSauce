<template>
  <div>
    <div class="appHeader">
      <div class="left-content"></div>
      <div class="right-content">
        <el-dropdown trigger="click" @command="handleClick">
          <img
            :src="
              userInfo.headsculpture_src
                ? resource_src + userInfo.headsculpture_src
                : require('@/assets/noHeadsculpture.jpg')
            "
            alt="头像"
            class="user"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="appBody">
      <div class="bodyLeft">
        <Video />
      </div>
      <div class="bodyRight"><AuthorInfo /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import { onMounted, reactive, ref } from "vue";
import Video from "./components/video.vue";
import Cookie from "js-cookie";
import envMap from "@/config/app.config";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import AuthorInfo from "./components/AuthorInfo.vue";
let userInfo: any = reactive({});
let resource_src = ref(envMap["resource"]);
const router = useRouter();
onMounted(() => {
  userInfo = JSON.parse(Cookie.get("USER_INFO"));
});
const handleClick = (command: string) => {
  if (command === "logout") {
    router.push({ name: "Login" });
    ElMessage({
      message: "退出登陆成功",
      type: "success",
      duration: 3000,
    });
  }
};
</script>

<style lang="scss">
.appHeader {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: lavender;
  padding: 0 30px;
  .left-content {
    cursor: pointer;
  }
  .right-content {
    el-dropdown {
      cursor: pointer;
    }
  }
}
.user {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.appBody {
  width: 100%;
  display: flex;
  justify-content: center;
  .bodyLeft {
    width: 720px;
  }
  .bodyRight {
    width: 400px;
    margin-left: 30px;
  }
}
</style>