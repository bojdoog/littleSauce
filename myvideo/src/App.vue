<template>
  <router-view />
</template>

<script setup lang="ts">
import Cookies from "js-cookie";
import { onBeforeMount, onMounted, provide, ref } from "vue";
import { loginByToken } from "./api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import menu from "./router/menu";
const router = useRouter();
const getUserIpAndCity = () => {
  return new Promise((resolve, reject) => {
    // 获取用户 IP 地址
    fetch("https://api64.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipAdress = data.ip;

        // 查询 IP 地址对应的所在地
        fetch(`https://ipapi.co/${ipAdress}/json/`)
          .then((response) => response.json())
          .then((data) => {
            const { country_name, region, city } = data;
            const userPHYAddress = `${region} · ${city} · ${country_name}`;
            resolve({ ipAdress, userPHYAddress });
          })
          .catch((error) => console.error("获取所在地信息时出错:", error));
      })
      .catch((error) => console.error("获取 IP 地址时出错:", error));
  });
};

let isLoading = ref(false);
provide("isLoading", isLoading);
onBeforeMount(() => {
  const token = Cookies.get("USER_TOKEN");
  if (token) {
    loginByToken(token)
      .then(async (res) => {
        if (res.data.code === -1) {
          ElMessage({
            message: res.data.message,
            type: "warning",
            duration: 3000,
          });
        } else {
          let _userInfo = {
            ...res.data.userInfo,
            menu: res.data.menu,
          };
          let userInfo = JSON.stringify(_userInfo);
          Cookies.set("USER_INFO", userInfo);
          isLoading.value = true;
        }
      })
      .catch((err) => {
        console.log(err);
        Cookies.remove("USER_TOKEN");
      });
  } else {
    isLoading.value = true;
  }

  // const routes = menu.map((item) => {
  //   if (item.children && item.children.length > 0) {
  //     item.children.map((item2: any) => {
  //       return {
  //         path: item2.path,
  //         meta: item2.meta,
  //         name: item2.name,
  //         component: () => import(item2.url),
  //       };
  //     });
  //   } else {
  //     return {
  //       path: item.path,
  //       meta: item.meta,
  //       name: item.name,
  //       component: () => import(item.url),
  //     };
  //   }
  // });
  // console.log(routes, "routes");

  // routes.forEach((item: any) => {
  //   console.log(item, "item");

  //   router.addRoute("Main", item);
  // });
  // console.log(router, "router");
});

onMounted(async () => {
  const userAddress: any = await getUserIpAndCity();
  Cookies.set("UserAddress", JSON.stringify(userAddress));
});
</script>

<style lang="scss">
:root {
  --bgcolor: red;
}
html,
body {
  // 全局 不能被用户选中
  // -webkit-user-select: none;
  // -moz-user-select: none;
  // -ms-user-select: none;
  // user-select: none;

  margin: 0;
  padding: 0;
}
</style>
