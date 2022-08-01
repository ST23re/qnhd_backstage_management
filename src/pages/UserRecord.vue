<template>
  <div class="page">
    <div class="operate-box" ref="search">
      <div class="button-box">
        <button class="filter-btn btn-ori" @click="goback">
          <el-icon style="margin-right: 3px">
            <ArrowLeftBold color="#ffffff" />
          </el-icon>
          <span>{{ isMobile ? "返回" : "返回上一级" }}</span>
        </button>
        <el-button class="filter-btn btn-ori" @click="openBox">
          <el-icon style="margin-right: 3px">
            <View color="#ffffff" />
          </el-icon>
          <span>用户开盒</span>
        </el-button>
      </div>
      <div class="select-box" v-if="isMobile">
        <div class="user-post">
          <span style="fontsize: 14px">发帖</span>
        </div>
        <div class="mobile-select">
          <el-switch
            v-model="isUserCriti"
            class="ml-2"
            style="
              --el-switch-on-color: rgb(108, 231, 231);
              --el-switch-off-color: rgb(108, 231, 231);
            "
          />
        </div>
        <div class="user-critisize">
          <span style="fontsize: 14px"> 评论 </span>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div :class="box_isMobile" v-if="!isUserCriti">
        <el-card class="box-card">
          <template #header>
            <div class="header-wrapper">
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>用户发帖记录</span>
              </div>
              <div class="select-header">
                <div class="block" :style="block_style1"></div>
                <div class="select-button" @click="
                  (block_style1.left = '0%'),
                  (text_color1.color = 'white'),
                  (text_color2.color = '#606266'),
                  (condition_now_post = 0)
                ">
                  <span :style="text_color1">全部</span>
                </div>
                <div class="select-button" @click="
                  (block_style1.left = '50%'),
                  (text_color1.color = '#606266'),
                  (text_color2.color = 'white'),
                  (condition_now_post = 1)
                ">
                  <span :style="text_color2">已删</span>
                </div>
              </div>
            </div>
          </template>
          <el-scrollbar :max-height="scrollbarHeight">
            <el-timeline>
              <el-timeline-item
                :timestamp="handleTime(post.created_at)"
                placement="top"
                v-for="post in postList"
                :key="post.id"
              >
                <el-card>
                  <div class="jump-to-detail" @click="() => detail(post.id, 0)">
                    {{ post.title }}
                  </div>
                  <p class="ellipsis">{{ post.content }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </div>
      <div :class="box_isMobile" v-if="!isMobile || isUserCriti">
        <el-card class="box-card">
          <template #header>
            <div class="header-wrapper">
              <div class="card-header">
                <el-icon class="icon"><ChatDotRound /></el-icon>
                <span>用户评论记录</span>
              </div>
              <div class="select-header">
                  <div class="block" :style="block_style2"></div>
                  <div class="select-button" @click="
                    (block_style2.left = '0%'),
                    (text_color1_.color = 'white'),
                    (text_color2_.color = '#606266'),
                    (condition_now_criti = 0)
                  ">
                    <span :style="text_color1_">全部</span>
                  </div>
                  <div class="select-button" @click="
                    (block_style2.left = '50%'),
                    (text_color1_.color = '#606266'),
                    (text_color2_.color = 'white'),
                    (condition_now_criti = 1)
                  ">
                    <span :style="text_color2_">已删</span>
                  </div>
              </div>
            </div>
          </template>
          <el-scrollbar :max-height="scrollbarHeight">
            <el-timeline>
              <el-timeline-item
                :timestamp="handleTime(criti.created_at)"
                placement="top"
                v-for="criti in critiList"
                :key="criti.id"
              >
                <el-card>
                  <div
                    class="jump-to-detail"
                    @click="() => detail(criti.post_id, criti.id)"
                  >
                    {{ criti.content }}
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </div>
    </div>
    <el-drawer v-model="drawer" :size="size" :show-close="false">
      <template #title>
        <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                姓名
              </div>
            </template>
            {{ user_detail.realname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Reading />
                </el-icon>
                学号
              </div>
            </template>
            {{ user_detail.userNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle" v-if="user_detail.gender == '男'">
                  <Male />
                </el-icon>
                <el-icon :style="iconStyle" v-if="user_detail.gender == '女'">
                  <Female />
                </el-icon>
                性别
              </div>
            </template>
            {{ user_detail.gender }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <iphone />
                </el-icon>
                电话
              </div>
            </template>
            {{ user_detail.telephone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Message />
                </el-icon>
                邮箱
              </div>
            </template>
            {{ user_detail.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <location />
                </el-icon>
                住址
              </div>
            </template>
            {{ user_detail.campus }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <tickets />
                </el-icon>
                专业
              </div>
            </template>
            <el-tag size="small">{{ user_detail.major }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <office-building />
                </el-icon>
                学院
              </div>
            </template>
            {{ user_detail.department }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Postcard />
                </el-icon>
                身份证号
              </div>
            </template>
            {{ user_detail.idNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <UserFilled />
                </el-icon>
                昵称
              </div>
            </template>
            {{ user_detail.nickname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Star />
                </el-icon>
                身份
              </div>
            </template>
            {{ user_detail.role }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <School />
                </el-icon>
                学生类型
              </div>
            </template>
            {{ user_detail.stuType }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Mute />
                </el-icon>
                历史禁言次数
              </div>
            </template>
            {{ user_detail.blocked_num }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <CircleClose />
                </el-icon>
                历史删帖次数
              </div>
            </template>
            {{ user_detail.deleted_num }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="drawer = false">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed,watch } from "vue";
import {
  ArrowLeftBold,
  View,
  CircleClose,
  User,
  UserFilled,
  Iphone,
  Location,
  Tickets,
  OfficeBuilding,
  Mute,
  Message,
  Male,
  Female,
  Postcard,
  Reading,
  School,
  Star,
  ChatDotRound,
  Document,
} from "@element-plus/icons-vue";
import {
  getUserPosts,
  getUserCriti,
  getUserDetail,
  getBlockedNum,
} from "@/api/api";
import router from "@/router";
import { useGlobalData, usePost } from "@/store";
interface Post_history {
  uid: string;
  type: string;
  page_disable: string;
  page?: string;
  page_size?: string;
  page_base?: string;
}
interface User_detail {
  avatar?: string;
  campus?: string;
  department?: string;
  email?: string;
  gender?: string;
  idNumber?: string;
  major?: string;
  nickname?: string;
  realname?: string;
  role?: string;
  stuType?: string;
  telephone?: string;
  token?: string;
  userNumber?: string;
  blocked_num?: string;
  deleted_num?: string;
}
const GlobalData = useGlobalData();
const iconStyle = computed(() => {
  const marginMap = {
    large: "8px",
    default: "6px",
    small: "4px",
  };
  return {
    marginRight: marginMap.default,
  };
});
var user_detail = reactive<User_detail>({});
var search = ref<HTMLElement>();
var isUserCriti = ref<boolean>(false);
var postList = reactive<any[]>([]);
var critiList = reactive<any[]>([]);
var scrollbarHeight = ref<number>(0);
var drawer = ref<boolean>(false);
var uid = computed(() => {
  return router.currentRoute.value.query.uid;
});
var post_history = reactive({
  uid: uid.value,
  type: "0",
  page_disable: "1",
});
var post_history_deleted = reactive({
  uid: uid.value,
  type: "1",
  page_disable: "1",
});
var criti_history = reactive({
  uid: uid.value,
  type: "0",
  page_disable: "1",
});
var criti_history_deleted = reactive({
  uid: uid.value,
  type: "1",
  page_disable: "1",
});
var user_deletedPost = reactive({
  uid: uid.value,
  type: 1,
  page_disable: 1,
});
var size = computed(() => {
  if (GlobalData.width > 650) {
    return 650;
  } else {
    return "100";
  }
});
var isMobile = computed(() => {
  return GlobalData.width < 967;
});
var box_isMobile = ref({
  "mobile-box": isMobile,
  "not-mobile-box": true,
  get "not-mobilbe-box"() {
    return !isMobile;
  },
});
var text_color1 = reactive({
  color: "white",
})
var text_color2 = reactive({
  color: "#606266",
})
var text_color1_ = reactive({
  color: "white",
})
var text_color2_ = reactive({
  color: "#606266",
})
var block_style1 = reactive({
  left: "0%",
})
var block_style2 = reactive({
  left: "0%",
})
var condition_now_post = ref(0);
var condition_now_criti = ref(0);
function goback() {
  router.go(-1);
}
function openBox() {
  drawer.value = true;
  getUserDetail({ uid: uid.value }).then((res: any) => {
    console.log(res);
    let list = res.detail;
    user_detail.campus = list.campus;
    user_detail.department = list.department;
    user_detail.email = list.email;
    user_detail.gender = list.gender;
    user_detail.idNumber = list.idNumber;
    user_detail.major = list.major;
    user_detail.nickname = list.nickname;
    user_detail.realname = list.realname;
    user_detail.role = list.role;
    user_detail.stuType = list.stuType;
    user_detail.telephone = list.telephone;
    user_detail.userNumber = list.userNumber;
  });
  getBlockedNum({ uid: uid.value }).then((res: any) => {
    console.log(res); //这里面是用户的禁言记录，如果用户现在正在被禁言，就获取第0条然后显示禁言原因
    user_detail.blocked_num = res.total;
  });
  getUserPosts(user_deletedPost).then((res: any) => {
    console.log(res);
    user_detail.deleted_num = res.list.length;
  });
}
function handleTime(time: string) {
  return (
    JSON.stringify(new Date(time)).replace(/["Z]/g, "").split("T")[0] +
    "  " +
    JSON.stringify(new Date(time))
      .replace(/["Z]/g, "")
      .split("T")[1]
      .split(".")[0]
  );
}
function adjustScrollHeight() {
  setTimeout(() => {
    let searchHeight = search.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - searchHeight - 140;
  }, 50);
}
watch(condition_now_post,(newVal)=>{
  if(newVal){
    postList.length = 0;
    getUserPosts(post_history_deleted).then((res: any) => {
      res.list.forEach((post: any) => {
        postList.push(post);
      });
    });
  }else{
    postList.length = 0;
    getUserPosts(post_history).then((res: any) => {
      res.list.forEach((post: any) => {
        postList.push(post);
      });
    });
  }
})
watch(condition_now_criti,(newVal)=>{
  if(newVal){
    critiList.length = 0;
    getUserCriti(criti_history_deleted).then((res: any) => {
      res.list.forEach((criti: any) => {
        critiList.push(criti);
      });
    });
  }else{
    critiList.length = 0;
    getUserCriti(criti_history).then((res: any) => {
      res.list.forEach((criti: any) => {
        critiList.push(criti);
      });
    });
  }
})
window.addEventListener("resize", () => adjustScrollHeight());
onMounted(() => {
  adjustScrollHeight();
  getUserPosts(post_history).then((res: any) => {
    res.list.forEach((post: any) => {
      postList.push(post);
    });
  });
  getUserCriti(criti_history).then((res: any) => {
    res.list.forEach((criti: any) => {
      critiList.push(criti);
    });
  });
});

const postParam = usePost();
function detail(post_id: number, floor_id: number) {
  postParam.$patch((state) => {
    state.user_record_post_id = post_id;
    state.user_record_floor_id = floor_id;
  });
  router.push({
    path: "/detail",
    query: { id: post_id },
  });
}
</script>

<style lang="less" scoped>
.operate-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 8px;

  .button-box {
    display: flex;

    .goback-button {
      background-color: rgb(0, 81, 135);
      height: 37px;
      line-height: 37px;
      border-radius: 8px;
    }

    .openbox-button {
      background-color: rgb(0, 81, 135);
      height: 37px;
      line-height: 37px;
      border-radius: 8px;
    }
  }

  .select-box {
    display: flex;
    margin-right: 8px;
    align-items: center;

    .user-post {
      margin-right: 4px;
    }

    .user-critisize {
      margin-left: 4px;
    }
  }
}

.info-box {
  display: flex;
  justify-content: space-around;

  .header-wrapper{
    display: flex;
    justify-content: space-between;
    .select-header{
      position: relative;
      display: flex;
      background-color: #f4f4f5;
      box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
      border-radius: 8px;
      transform: scale(1);//加上这个会让文字显示在最顶层
    }

    .block{
      position: absolute;
      border-radius: 8px;
      background-color: #005187;
      height: 100%;
      width: 50%;
      z-index: -1;
      left: 0%;
      transition: all 0.7s;
    }
    .select-button{
      border: none;
      border-radius: 8px;
      padding: 3px 7px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .not-mobile-box {
    width: 48%;
    height: 80%;
  }

  .mobile-box {
    width: 96%;
    height: 80%;
  }
}
.jump-to-detail {
  color: #005187;
  text-decoration: underline;
  cursor: pointer;
}
.ellipsis {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.filter-btn {
  width: auto;
  height: 37px;
  box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
  background-color: #005187;
  margin: 5px;
  padding: 0 11px 0 9px;
  border-radius: 8px;
  font-size: 14px;
  .icon {
    font-size: 16px;
    margin: 0 5px;
  }
}
.btn-ori {
  font-size: 14px;
  color: white;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
<style lang="less">
.el-switch__core {
  border: 1px solid #005187 !important;
  background-color: #005187 !important;
}
</style>
