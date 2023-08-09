<template>
  <router-view />
</template>

<script setup lang="ts">
import Cookies from "js-cookie";
import { onMounted } from "vue";

interface userAddress {
  ipAdress: string;
  userPHYAddress: string;
}

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
            console.log(`IP 地址: ${ipAdress}`);
            resolve({ ipAdress, userPHYAddress });
          })
          .catch((error) => console.error("获取所在地信息时出错:", error));
      })
      .catch((error) => console.error("获取 IP 地址时出错:", error));
  });
};
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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  margin: 0;
  padding: 0;
}
</style>
