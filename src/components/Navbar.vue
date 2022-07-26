<template>
  <div id="Nav" ref="nav">
    <div :class="['vertical', isHide ? 'move' : '']" ref="ver">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        :router="true"
        @select="handleSelect"
      >
        <div :class="['header', isCollapse ? 'collapse' : 'extend']">
          <img src="../assets/logo.png" alt="" />
          <div v-show="!isCollapse" style="margin-left: 8px">
            求实论坛管理后台
          </div>
        </div>
        <el-divider />
        <el-scrollbar :max-height="barHeight">
          <el-sub-menu index="1" v-if="Info.is_super">
            <template #title>
              <el-icon><SetUp /></el-icon>
              <span v-show="!isCollapse">高级</span>
            </template>
            <el-menu-item-group>
              <template #title><span>Message</span></template>
              <el-menu-item index="/notice">公告管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template #title><span>Sensitive</span></template>
              <el-menu-item index="/tag">tag 话题管理</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template #title><span>Others</span></template>
              <el-sub-menu index="1-3">
                <template #title><span>更多</span></template>
                <el-menu-item index="/department">校务 | 部门管理</el-menu-item>
                <el-menu-item index="/dispatch">权限分配</el-menu-item>
                <el-menu-item index="/game">游戏管理</el-menu-item>
              </el-sub-menu>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="/report">
            <el-icon><Warning /></el-icon>
            <template #title>举报受理</template>
          </el-menu-item>
          <el-menu-item index="/content">
            <el-icon><document /></el-icon>
            <template #title>内容管理</template>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><Avatar /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/record">
            <el-icon><List /></el-icon>
            <template #title>操作日志</template>
          </el-menu-item>
          <el-menu-item index="/info">
            <el-icon><InfoFilled /></el-icon>
            <template #title>个人信息</template>
          </el-menu-item>
        </el-scrollbar>
      </el-menu>
    </div>
    <div style="flex: 1">
      <div class="horizontal" ref="hor">
        <div class="show" @click="collapseClick">
          <el-icon class="icon" v-if="isCollapse"><Expand /></el-icon>
          <el-icon class="icon" v-else><Fold /></el-icon>
        </div>
        <div class="route-tip">
          <text class="title">{{ $route.meta.title }}</text>
          <text
            :class="['name', inAnimate ? 'animate' : '']"
            @animationend="inAnimate = false"
            ><text class="seperator">/</text>{{ $route.name }}</text
          >
        </div>
        <div style="flex: 1"></div>
        <div
          class="switch"
          @click="switchToSchoolAffairs"
          v-if="Info.auth === 'double'"
        >
          <img src="../assets/change.svg" alt="" />
        </div>
        <el-dropdown
          ref="dropdown1"
          trigger="contextmenu"
          style="margin-right: 15px"
        >
          <el-button
            class="el-dropdown-link"
            @click="dropdownClick"
            v-show="showAuth"
            >{{ Info.nickname }}</el-button
          >
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <text style="color: #606266 !important">{{
                  Info.auth === "double"
                    ? Info.is_super
                      ? "超级管理员"
                      : "校管、学管"
                    : "学生管理员"
                }}</text></el-dropdown-item
              >
              <el-dropdown-item divided @click="exit"
                ><text style="width: 100%; text-align: center"
                  >退出登录</text
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="page-view-holder">
        <router-view />
        <!-- 嵌套路由 -->
      </div>
    </div>
    <div id="mask" v-show="showMask"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useInfo, useGlobalData } from "@/store";
import router from "@/router";
import { getToken, removeToken } from "@/utils/cookies";
import {
  Document,
  Menu as IconMenu,
  SetUp,
  Avatar,
  Expand,
  Fold,
  Warning,
  List,
  InfoFilled,
} from "@element-plus/icons-vue";

const route = useRoute();
const Info = useInfo();
const GlobalData = useGlobalData();

const isCollapse = ref(false);
const isHide = ref(false);

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};

const inAnimate = ref<boolean>(false);
const handleSelect = () => {
  if (GlobalData.width <= 720) isHide.value = true;
  inAnimate.value = true;
};
const dropdown1 = ref();

function dropdownClick() {
  dropdown1.value.handleOpen();
}

function collapseClick() {
  setTimeout(() => {
    if (!isHide.value) {
      isCollapse.value = !isCollapse.value;
      if (isCollapse.value) document.body.setAttribute("class", "icon-arrow");
      else document.body.removeAttribute("class");
    } else {
      isCollapse.value = false;
      isHide.value = false;
    }
  }, 50);
}

const exit = () => {
  removeToken();
  router.push("/login");
};

const nav = ref<HTMLElement>();
const ver = ref<HTMLElement>();
const hor = ref<HTMLElement>();
var hor_width = ref<number>(0);
function handleResize() {
  GlobalData.width = nav.value?.clientWidth as number;
  GlobalData.height = nav.value?.clientHeight as number;
  hor_width.value = hor.value?.clientWidth as number;
  isHide.value = GlobalData.width <= 720;
}
onMounted(() => handleResize());
window.addEventListener("resize", () => handleResize());
window.addEventListener("click", (e) => {
  let target = e.target as HTMLElement;
  if (GlobalData.width <= 720 && !isHide.value)
    if (!ver.value?.contains(target)) isHide.value = true;
});
const showMask = computed(() => {
  return GlobalData.width <= 720 && !isHide.value;
});
const barHeight = computed(() => {
  return `${GlobalData.height - 52}px`;
});
const showAuth = computed(() => {
  return hor_width.value > 500;
});

const switchToSchoolAffairs = () => {
  window.location.href = `http://pamaforce.xyz/admin-beta/#/login?token=${getToken()}`;
};
</script>

<style lang="less" scoped>
#Nav {
  height: 100vh;
  display: flex;
}
.vertical {
  transition: all ease-in-out 0.3s;
  overflow: hidden;
  * {
    background-color: rgb(0, 81, 135);
  }
}
.move {
  transform: translateX(-210px);
}
.header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  img {
    height: 32px;
  }
}
.extend {
  width: 210px;
}
.collapse {
  width: 64px;
}
.horizontal {
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  user-select: none;
  .show {
    margin: 0 15px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .icon {
    font-size: 20px;
  }
  .route-tip {
    font-size: 18px;
    line-height: 50px;
    margin-left: 15px;
    .title {
      color: #303133;
    }
    .seperator {
      font-size: 16px;
      color: #c0c4cc;
      margin: 0 5px 0 8px;
    }
  }
  .name {
    display: inline !important;
    color: #97a8be;
  }
  .switch {
    width: 50px;
    height: 50px;
    img {
      width: 50px;
      height: 50px;
      transform: scale(0.4);
    }
    cursor: pointer;
  }
}
.el-dropdown-link {
  font-size: 18px;
}
#mask {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9;
}
@media all and (max-width: 720px) {
  .vertical {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
  }
}
.animate {
  animation: slid 0.5s;
}
@keyframes slid {
  from {
    opacity: 0;
    margin-left: -5px;
  }
  to {
    opacity: 1;
    margin-left: 0;
  }
}
.page-view-holder {
  .page {
    height: calc(100vh - 50px);
    overflow: hidden;
  }
}
.el-divider {
  margin: 0;
  border-top: 1px solid #015e9c;
}
</style>
<style lang="less">
.el-menu-vertical-demo,
.el-menu-vertical-demo:not(.el-menu--collapse) {
  height: 100vh;
  border: none;
  user-select: none;
}
.el-menu-vertical-demo {
  width: 64px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 210px;
}
.el-menu-item,
.el-sub-menu__title {
  color: white;
}
.el-menu-item:hover {
  background-color: rgb(0, 73, 128);
}
.el-sub-menu__title:hover,
.el-menu-item-group__title:hover {
  background-color: rgb(0, 81, 135);
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.el-menu--popup {
  background-color: rgb(0, 81, 135) !important;
  * {
    background-color: rgb(0, 81, 135) !important;
  }
}
</style>
<style scoped>
.el-button {
  height: 50px;
  border-radius: 0;
  background-color: rgba(0, 0, 0, 0) !important;
  border: none;
  color: #606266 !important;
}
.el-button:hover {
  color: #606266;
  background-color: rgba(238, 238, 238, 0.5) !important;
}
</style>
