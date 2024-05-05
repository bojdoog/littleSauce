<template>
  <div class="common-layout" v-if="isLoading">
    <el-container>
      <el-aside width="auto"><CommonAside /></el-aside>
      <el-container>
        <el-header class="header"><CommonHeader /></el-header>
        <el-main :class="route.path === '/home' ? 'main-bg' : ''"
          ><router-view></router-view
        ></el-main>
      </el-container>
    </el-container>
  </div>
</template>
  
<script lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
import { inject } from "vue";
import { useRoute } from "vue-router";
export default {
  components: {
    CommonAside,
    CommonHeader,
  },
  setup() {
    let isLoading = inject("isLoading");
    const route = useRoute();
    console.log(route.path);

    return { isLoading, route };
  },
};
</script>
  
<style scoped lang="scss">
.header {
  background-color: lavender;
}
::v-deep .el-main {
  position: relative;
  padding: 0px;
}
.main-bg {
  background-image: url("https://pic.616pic.com/bg_w1180/00/05/22/tUOCiFHP0n.jpg");
  background-size: auto auto; /* Auto 宽度和高度 */
  background-repeat: repeat; /* 纵向重复 */
}
</style>