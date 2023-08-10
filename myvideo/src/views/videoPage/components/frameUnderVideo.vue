<template>
  <div class="frameUnderVideo">
    <div class="innnerframeUnderVideo">
      <el-skeleton :rows="1" v-if="props.barrages === -1">
        <template #template>
          <el-skeleton-item
            style="width: 165px; height: 24px; margin-right: 140px"
            variant="react"
        /></template>
      </el-skeleton>
      <div class="font-dm" v-else>
        已装填&nbsp;{{ props.barrages + sendDmNum }}&nbsp;条弹幕
      </div>
      <div class="send-dm">
        <div class="sendDmInput">
          <div class="sendDmIcon">
            <el-icon size="22" class="Ship-icon"><Ship /></el-icon>
          </div>
          <input
            class="bpx-player-dm-input"
            placeholder="发个友善的弹幕见证当下"
            ref="inputDm"
          />
        </div>
        <div class="sendDmButton" @click="sendDm">发送</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { sendDmToServer } from "@/api";
import { useRoute } from "vue-router";

const props = defineProps({
  barrages: {
    type: Number,
    default: -1,
  },
  sendDmVideoDuration: {
    type: Number,
  },
});

let barrages = props.barrages;
let sendDmNum = ref(0);
const inputDm = ref();

const route = useRoute();
const emit = defineEmits(["getDuration", "sendDmInfo"]);

const getDate = () => {
  const curDura = new Date();
  let Month = formatDate(curDura.getMonth() + 1); // 月份从 0 开始，所以需要 +1
  let day = formatDate(curDura.getDate());
  let Hour = formatDate(curDura.getHours());
  let Minute = formatDate(curDura.getMinutes());
  return `${Month}-${day} ${Hour}:${Minute}`;
};
const formatDate = (val: number) => {
  return val >= 10 ? val : "0" + val;
};

const sendDm = async () => {
  sendDmNum.value++;
  await emit("getDuration");
  let dmInfo = {
    video_id: route.query.video_id,
    barrage: inputDm.value.value,
    duration: props.sendDmVideoDuration,
    date: getDate(),
  };
  emit("sendDmInfo", dmInfo);
  sendDmToServer(dmInfo).then(() => {
    inputDm.value.value = null;
  });
};
defineExpose({ sendDm });
</script>

<style lang="scss" scoped>
.frameUnderVideo {
  position: relative;
  display: flex;
  align-items: center;
  width: 720px;
  height: 50px;
  box-shadow: 1px 0px 22px 0px rgba(220, 213, 213, 0.5);
  .innnerframeUnderVideo {
    padding: 0 12px;
    display: flex;
    width: auto;
    color: #61666d;
    .font-dm {
      line-height: 50px;
      margin-right: 140px;
      width: 165px;
    }
    .send-dm {
      display: flex;
      align-items: center;
      .sendDmInput {
        position: relative;
        display: inline-block;
        width: 300px;
        height: 30px;
        .sendDmIcon {
          position: relative;
          display: inline-block;
          width: 30px;
          height: 30px;
          border-bottom-left-radius: 15%;
          border-top-left-radius: 15%;
          background-color: #ced1d6;
          text-align: center;
          .Ship-icon {
            position: absolute;
            bottom: 5px;
            left: 8px;
          }
        }
        input {
          position: absolute;
          width: 270px;
          height: 30px;
          box-sizing: border-box;
          padding: 0 10px;
          border: none;
          outline: none;
          background-color: #ced1d6;
        }
      }
      .sendDmButton {
        cursor: pointer;
        display: inline-block;
        width: 60px;
        height: 30px;
        border-radius: 0%;
        background-color: #00a1d6;
        color: #fff;
        border-bottom-right-radius: 15%;
        border-top-right-radius: 15%;
        font-size: 13px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>