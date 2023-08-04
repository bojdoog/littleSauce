<template>
  <div class="verify-row">
    <div>
      <span class="describe-text"><span style="color: red">*</span>验证：</span>
      <input
        type="text"
        placeholder="请输入验证码"
        class="input-val"
        v-model.trim="yanzhen"
        @blur="isRight"
      />
    </div>
    <canvas ref="canvas" class="canvas" @click="handleCanvas"> </canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
const yanzhen = ref(""); //输入框双向绑定的值
const true_code = ref(""); //正确的验证码
const yanzhen_arr = reactive([]); //只用于传参，并且数组长度不能「多于」下面验证码遍历的次数，不然最终得到的true_code会有问题
//比如下面是4个验证码，可以是[1,2,3,4]及以下，但是不能是[1，2，3，4，5]， 因为5无法被替换
const canvas = ref();
const isPassVerify = ref();
const emits = defineEmits(["showVerifyWarning"]);
const isRight = () => {
  isPassVerify.value = yanzhen.value === true_code.value;
  emits("showVerifyWarning", isPassVerify.value);
};
defineExpose({ isPassVerify });
const draw = (show_num: string[]) => {
  var canvas_width = canvas.value.clientWidth;
  var canvas_height = canvas.value.clientHeight;
  var context = canvas.value.getContext("2d"); //获取到canvas画图
  canvas.value.width = canvas_width;
  canvas.value.height = canvas_height;
  var sCode = "abbcdefghijklmnopqrstuvwxyzABCEFGHJKLMNPQRSTWXYZ1234567890";
  var aCode = sCode.split("");
  var aLength = aCode.length; //获取到数组的长度

  //4个验证码数
  for (var i = 0; i <= 3; i++) {
    var j = Math.floor(Math.random() * aLength); //获取到随机的索引值
    var deg = (Math.random() * 30 * Math.PI) / 180; //产生0~30之间的随机弧度
    var txt = aCode[j]; //得到随机的一个内容
    show_num[i] = txt.toLowerCase(); // 依次把取得的内容放到数组里面
    var x = 10 + i * 20; //文字在canvas上的x坐标
    var y = 20 + Math.random() * 8; //文字在canvas上的y坐标
    context.font = "bold 23px 微软雅黑";

    context.translate(x, y);
    context.rotate(deg);

    context.fillStyle = randomColor();
    context.fillText(txt, 0, 0);

    context.rotate(-deg);
    context.translate(-x, -y);
  }
  //验证码上显示6条线条
  for (var i = 0; i <= 5; i++) {
    context.strokeStyle = randomColor();
    context.beginPath();
    context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
    context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
    context.stroke();
  }
  //验证码上显示31个小点
  for (var i = 0; i <= 30; i++) {
    context.strokeStyle = randomColor();
    context.beginPath();
    var x = Math.random() * canvas_width;
    var y = Math.random() * canvas_height;
    context.moveTo(x, y);
    context.lineTo(x + 1, y + 1);
    context.stroke();
  }

  //最后把取得的验证码数组存起来，方式不唯一
  var num = show_num.join("");
  // console.log(num);
  true_code.value = num;
};
//得到随机的颜色值
const randomColor = () => {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
};
//canvas点击刷新
const handleCanvas = () => {
  draw(yanzhen_arr);
};
onMounted(() => {
  draw(yanzhen_arr);
});
</script>

<style lang="scss" scoped>
.describe-text {
  font-size: 18px;
}
.verify-row {
  width: 320px;
  height: 50px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.canvas {
  width: 120px;
  height: 50px;
  float: right;
  margin-right: 1%;
  display: block;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.input-val {
  font-size: 18px;
  width: 120px;
  height: 38px;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 0 10px;
  outline: none;
  margin-right: 10px;
  &::placeholder {
    font-weight: 600;
    color: #2b2a2a8b;
    letter-spacing: 0px;
    font-size: 15px;
    transform: translate(0px, -1px);
  }
}
</style>