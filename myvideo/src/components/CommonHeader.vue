<template>
  <div class="header-container">
    <div></div>
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
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import Cookie from "js-cookie";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import envMap from "@/config/app.config";
let resource_src = ref("");
const router = useRouter();
const route = useRoute();
let userInfo: any = reactive({});
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
onMounted(() => {
  userInfo = JSON.parse(Cookie.get("USER_INFO"));
  if (!userInfo.headsculpture_src && route.name === "Home") {
    ElMessage({
      message: "您还没有设置头像",
      type: "warning",
      duration: 3000,
      offset: 360,
    });
  }
  resource_src.value = envMap["resource"];
  console.log(resource_src);
});
</script>

<style lang="scss">
.header-container {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
</style>