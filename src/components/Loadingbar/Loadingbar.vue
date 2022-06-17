<template>
  <div class="wrapper">
    <div class="bar" ref="bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
let speed = ref<number>(1);
let bar = ref<HTMLElement>();
let timer = ref<number>(0);

const startLoading = () => {
  let dom = bar.value as HTMLElement;
  dom.style.height = "2px";
  speed.value = 1;
  timer.value = window.requestAnimationFrame(function fn() {
    if (speed.value < 90) {
      speed.value += 1;
      dom.style.width = speed.value + "%";
      timer.value = window.requestAnimationFrame(fn);
    } else {
      speed.value = 1;
      window.cancelAnimationFrame(timer.value);
    }
  });
};
const endLoading = () => {
  let dom = bar.value as HTMLElement;
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      speed.value = 100;
      dom.style.width = speed.value + "%";
    });
    setTimeout(() => {
      dom.style.height = "0";
    }, 300);
  }, 200);
};

defineExpose({
  startLoading,
  endLoading,
});
</script>

<style lang="less" scoped>
.wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  height: 2px;
  .bar {
    height: 0;
    width: 0;
    background-image: linear-gradient(#0b6490, #208aaa, #40a3b4);
  }
}
</style>
