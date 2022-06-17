<template>
  <div>
    <Navbar></Navbar>
    <div>arr {{ msg }}</div>
    <div>obj {{ obj }}</div>
    <div>{{ message }}</div>
    <button @click="changeSurface">surface</button>
    <button @click="changeDeep">deep</button>
    <!-- <div>
     <input type="text" v-model="firstName" />
    <input type="text" v-model="lastName" />
    <div>{{ name }}</div> 
    <input id="ipt" type="text" v-model="msg1" />
    <input type="text" v-model="msg2" />
    <button @click="stopWatch">stop listening</button>
      </div>-->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { reactive, shallowReactive } from "vue";

const count = ref(0);
type O = {
  list: string[];
};
let msg = reactive<O>({
  list: ["vue3", "ts", "vite", "pinia"],
});
let obj = reactive({
  name: "st23",
  age: "20",
});
// setTimeout(() => {
//   msg.list = [];
// }, 1000);
let message = shallowReactive({
  title: "title",
  nav: {
    foo: "foo",
    bar: "bar",
  },
});
const changeSurface = () => {
  message.title = "changed title";
};
const changeDeep = () => {
  message.nav.foo = "changed foo";
  console.log(message);
};
// // import { computed, ref } from "vue";
// // let firstName = ref("");
// // let lastName = ref("");
// // const name = computed(() => {
// //   return firstName.value + "---" + lastName.value;
// // });
// import { ref, watchEffect } from "vue";
// let msg1 = ref<string>("");
// let msg2 = ref<string>("");

// const stop = watchEffect(
//   (oninvalidate) => {
//     let ipt: HTMLInputElement = document.querySelector(
//       "#ipt"
//     ) as HTMLInputElement;
//     console.log(ipt, msg1.value);
//     oninvalidate(() => {
//       console.log("before"); // 先被执行
//     });
//   },
//   {
//     flush: "post",
//     onTrigger(e) {
//       debugger;
//     },
//   }
// );
// const stopWatch = () => stop();
</script>

<style lang="less" scoped></style>

<template>
  <div>
    <div>I'm navigation bar.</div>
    <div>{{ Info.nickname }}</div>
    <button @click="change">changeState</button>
  </div>
</template>

<script setup lang="ts">
import { useInfo } from "@/store";
import { storeToRefs } from "pinia";
const Info = useInfo();

const change = () => {
  // //way 1 [directly]
  // Info.nickname = "st23re";
  // //way 2 [directly, object]
  // Info.$patch({
  //   nickname: "st23re",
  //   authority: "super",
  // });
  //way 3 [deal with logical issues]
  Info.$patch((state) => {
    if (Info.nickname === "st23re") state.nickname = "ST23";
  });
  // //way 4 (seldom used) must modify the whole data
  // Info.$state = {
  //   nickname: "ST23",
  //   authority: "super!",
  // };
  // //way 5 [through actions]
  // Info.setInfo({
  //   nickname: "ST23",
  //   authority: "super",
  // });
};
const reset = () => {
  Info.$reset();
};
Info.$subscribe(
  (args, state) => {
    // 当变动时触发
    console.log(args, state);
  },
  {
    detached: true, // true的话组件被销毁后依然存活
    deep: true, // 类比watch的deep
    flush: "post",
  }
);
Info.$onAction((args) => {
  // 当调用actions时触发
  args.after(() => {
    // 类比watchEffect的oninvalidate 'before'
    console.log(args);
  });
  console.log(args); // 先
}, true); // true的话组件被销毁后依然存活
//在pinia中直接解构不具有响应式，解决方法：
const { nickname, auth } = storeToRefs(Info);
console.log(nickname, auth);
</script>

<style lang="less" scoped></style>
