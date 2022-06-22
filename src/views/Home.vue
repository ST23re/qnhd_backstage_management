<template>
  <div id="Home">
    <Navbar />
  </div>
</template>

<script setup lang="ts">
import { getDepartments, getPostTypes } from "@/api/api";
import { onMounted } from "vue";
import { useGlobalData } from "@/store";

const GlobalData = useGlobalData();
onMounted(() => {
  getPostTypes({}).then((res: any) => {
    res.list.forEach((type: any) => {
      GlobalData.postTypes.push(type);
    });
  });
  getDepartments({}).then((res: any) => {
    res.list.forEach((department: any) => {
      GlobalData.departments.push(department);
    });
  });
});
</script>

<style lang="less" scoped></style>
