<template>
  <div class="totalPage">
    <div class="upload-video-area">
      <uploadVideo />
      <inputVideoInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UploadVideo from "./components/UploadVideo.vue";
import InputVideoInfo from "./components/InputVideoInfo.vue";
</script>

<style lang="scss" scoped>
.totalPage {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-left: 8vw;
  margin-top: 8vh;
  .upload-video-area {
    align-self: flex-start;
  }
}
</style>