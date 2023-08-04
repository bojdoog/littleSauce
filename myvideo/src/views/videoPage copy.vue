<template>
    <div
        class="player"
        @dragover.prevent="dragOver($event)"
        @drop="drop($event)"
    >
        <video
            :src="route.params.video_id"
            ref="video"
            @click="playBtnfn"
            @onMousemove="move"
        ></video>
        <div class="isEnd" v-if="isEnd">
            <div class="endInfo" @click="replay">
                <el-icon size="40px" color="white"><VideoPlay /></el-icon
                ><span class="fontEnd">重新播放</span>
            </div>
        </div>

        <!-- 控制条 -->
        <div class="controls">
            <!-- 总进度 -->
            <div class="progress" @mouseover="showIcon" @mouseout="visibleIcon">
                <!-- 当前进度 -->
                <div class="curr-progress" ref="currProgress">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="progress-thumb-icon"
                        @dragstart="dragStart($event)"
                        v-show="isShowIcon"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
            </div>
            <div class="switch" @click="playBtnfn" ref="playBtn">
                <el-icon v-if="isOpen && !isEnd" size="40px" color="white"
                    ><VideoPause
                /></el-icon>
                <el-icon v-else-if="!isOpen && !isEnd" size="40px" color="white"
                    ><CaretRight
                /></el-icon>
                <el-icon size="40px" color="white" v-else
                    ><VideoPlay
                /></el-icon>
            </div>
            <div class="time">
                <span class="curr-time" ref="currTime">00:00</span>/<span
                    class="total-Time"
                    ref="totalTime"
                    >00:00</span
                >
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted, nextTick, createElementBlock } from "vue";
    import { useRoute } from "vue-router";
    import { VideoPause, VideoPlay, CaretRight } from "@element-plus/icons-vue";
    const route = useRoute();
    var tTime = 0;
    const isOpen = ref(false);
    const video = ref();
    const playBtn = ref();
    const totalTime = ref();
    const currTime = ref();
    const currProgress = ref();
    const progressThumbIcon = ref();

    const isEnd = ref(false);

    const move = (ev, val) => {
        console.log(val);
    };
    const playBtnfn = () => {
        if (!isEnd.value) {
            isOpen.value = !isOpen.value;
        } else {
            replay();
        }
    };
    watch(isOpen, (newValue, oldValue) => {
        if (newValue === true) {
            video.value.play();
        } else {
            video.value.pause();
        }
    });

    var imgOffsetX;
    var imgOffsetY;
    // 移动开始
    const dragStart = (e) => {};
    // 移动中
    const dragOver = (e) => {
        console.log(e.offsetX);
        e.dataTransfer.getData("Text");
    };
    // 移动完成
    const drop = (e) => {
        console.log(e.offsetX, "3333");
        video.value.currentTime = ((e.offsetX - 10) / 700) * video.value.duration;
    };

    let isShowIcon = ref(false);
    const showIcon = () => {
        isShowIcon.value = true;
    };
    const visibleIcon = () => {
        isShowIcon.value = false;
    };
    setTimeout(() => {
        tTime = video.value.duration;
        console.log(tTime);

        //          将总秒数 转换成 时分秒的格式：00:00
        //            分钟
        var m = Math.floor(tTime / 60);
        //            秒
        var s = Math.floor(tTime % 60);

        //            console.log(h);
        //            console.log(m);
        //            console.log(s);

        //            把数据格式转成 00:00：00
        m = m >= 10 ? m : "0" + m;
        s = s >= 10 ? s : "0" + s;

        console.log(m);
        console.log(s);
        //            显示出来
        console.log(totalTime.value);
        totalTime.value.innerHTML = m + ":" + s;

        video.value.ontimeupdate = function () {
            //            获取视频当前播放的时间
            //           console.log(video.currentTime);
            //            当前播放时间
            var cTime = video.value.currentTime;
            //           把格式转成00:00
            //            分钟
            var m = Math.floor(cTime / 60);
            //            秒
            var s = Math.floor(cTime % 60);

            //            把数据格式转成00：00
            m = m >= 10 ? m : "0" + m;
            s = s >= 10 ? s : "0" + s;

            //            显示出当前时间
            currTime.value.innerHTML = m + ":" + s;

            //            改变进度条的宽度： 当前时间/总时间
            var value = cTime / tTime;

            currProgress.value.style.width = value * 100 + "%";
        };

        video.value.addEventListener("ended", () => {
            //结束
            console.log("播放结束");
            isEnd.value = true;
        });
    }, 500);
    onMounted(() => {});
    const replay = () => {
        video.value.play();
        isEnd.value = false;
    };
</script>

<style lang="scss" scoped>
    .player {
        width: 720px;
        height: 360px;
        margin: 10px auto;
        border: 1px solid #000;
        background: #000;
        background-size: auto 100%;
        position: relative;
        border-radius: 20px;
        .isEnd {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 720px;
            height: 360px;
            background: #000;
            opacity: 0.7;
            border-radius: 20px;
            .endInfo {
                cursor: pointer;
                position: absolute;
                left: 50%;
                top: 50%;
                width: 150px;
                transform: translate(-75px, -22px);
                display: flex;
                justify-content: center;
                .fontEnd {
                    position: relative;
                    top: 5px;
                    margin-left: 5px;
                    color: white;
                    font-size: 25px;
                    line-height: 30px;
                }
            }
        }
        video {
            height: 100%;
            display: block;
            margin: 0 auto;
            cursor: pointer;
        }
        .controls {
            width: 700px;
            height: 80px;
            // background-color: red;
            // opacity: 0.3;
            position: absolute;
            bottom: 0px;
            left: 10px;
            border-radius: 10px;
            .progress {
                position: absolute;
                width: 100%;
                height: 3px;
                background-color: aliceblue;
                bottom: 55px;
                transition: height 0.2s linear;
                &:hover {
                    height: 6px;
                }
                .curr-progress {
                    position: absolute;
                    height: 100%;
                    background-color: aqua;
                }
                .progress-thumb-icon {
                    float: right;
                    // top: -8px;
                    // position: absolute;
                    // display: none;
                }
            }
            .switch {
                position: absolute;
                bottom: 3px;
                left: 5px;
                cursor: pointer;
            }
            .time {
                position: absolute;
                bottom: 7px;
                left: 50px;
                font-size: 30px;
                color: white;
            }
        }
    }
</style>