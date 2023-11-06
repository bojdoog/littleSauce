<template>
  <div class="common-layout" v-if="isLoading">
    <el-container>
      <el-aside width="auto"><CommonAside /></el-aside>
      <el-container>
        <el-header class="header"><CommonHeader /></el-header>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>
  
<script lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
import { inject } from "vue";
export default {
  components: {
    CommonAside,
    CommonHeader,
  },
  setup() {
    let isLoading = inject("isLoading");
    console.log(isLoading);

    return { isLoading };
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
</style>