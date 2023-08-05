<template>
  <div class="totalPage">
    <div class="upload-video-area">
      <uploadVideo ref="uploadVideo" @unloadVideoInfo="unloadVideoInfo" />
      <inputVideoInfo
        @uploadVideoFile="uploadVideoFile"
        ref="uploadVideoInfo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UploadVideo from "./components/UploadVideo.vue";
import InputVideoInfo from "./components/InputVideoInfo.vue";
const uploadVideo = ref();
const uploadVideoInfo = ref();
const uploadVideoFile = () => {
  uploadVideo.value.handleuploadFiles();
};
const unloadVideoInfo = () => {
  uploadVideoInfo.value._uploadVideoInfo();
};
</script>

<style lang="scss" scoped>
.totalPage {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-left: 5vw;
  margin-top: 5vh;
  .upload-video-area {
    align-self: flex-start;
  }
}
</style>