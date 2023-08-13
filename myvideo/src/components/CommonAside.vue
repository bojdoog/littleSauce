<template>
  <div class="aside">
    <h3 class="main-title">
      li<span style="color: #7093db">ttl</span>e<span style="color: #ff1cae"
        >Sa</span
      >uce<span style="color: #ff7f00">☆</span>
    </h3>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item
        v-for="item in noChildren"
        :key="item.name"
        :index="item.name"
        @click="skip(`${item.name}`)"
        ref="menuItem"
      >
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <template #title>{{ item.label }}</template>
      </el-menu-item>
      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.name"
        :index="item.name"
        @click="skip(`${item.name}`)"
      >
        <template #title>
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="childItem in item.children"
            :key="childItem.name"
            :index="childItem.name"
            >{{ childItem.name }}</el-menu-item
          >
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  Menu as IconMenu,
  House,
  VideoPlay,
  User,
  UserFilled,
} from "@element-plus/icons-vue";
import * as ElIconModules from "@element-plus/icons"; //导入所有element icon图标
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Cookie from "js-cookie";
const router = useRouter();
const store = useStore();

onMounted(() => {});

const userInfo = JSON.parse(Cookie.get("USER_INFO"));
const routeInfo = userInfo.menu;

const hasChildren = routeInfo.filter((item: any) => item.children);
const noChildren = routeInfo.filter((item: any) => !item.children);
console.log(noChildren, hasChildren, "dd");

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const skip = (name: string) => {
  router.push({ name: `${name}` });
};
</script>

<style lang="scss" scoped>
::v-deep .el-asidee {
  overflow: visible;
}
.aside {
  .main-title {
    text-align: center;
    font: italic 700 1.5em Georgia, serif;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-menu {
    height: 700px;
  }
}
</style>
