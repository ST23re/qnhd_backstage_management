<template>
  <div class="page">
    <div class="operate-box" ref="search">
      <div class="button-box">
        <el-button type="primary" class="goback-button" @click="goback">
          <el-icon>
            <ArrowLeftBold />
          </el-icon>
          <span>返回上页</span>
        </el-button>
        <el-button type="primary" class="openbox-button" @click="openBox">
          <el-icon>
            <View />
          </el-icon>
          <span>用户开盒</span>
        </el-button>
      </div>
      <div class="select-box" v-if="isMobile">
        <div class="user-post">
          <span style="fontSize: 14px;">发帖</span>
        </div>
        <div class="mobile-select">
          <el-switch v-model="isUserCriti" class="ml-2"
            style="--el-switch-on-color: rgb(108, 231, 231); --el-switch-off-color: rgb(108, 231, 231)" />
        </div>
        <div class="user-critisize">
          <span style="fontSize: 14px;">
            评论
          </span>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div :class="box_isMobile" v-if="!isUserCriti">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <el-icon><Document/></el-icon>
              <span>用户发帖记录</span>
            </div>
          </template>
          <el-scrollbar :max-height="scrollbarHeight">
            <el-timeline>
              <el-timeline-item :timestamp="handleTime(post.created_at)" placement="top" v-for="post in postList"
                :key="post.id">
                <el-card>
                  <a href="???">{{ post.title }}</a>
                  <p>{{ post.content }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-scrollbar>
        </el-card>
      </div>
      <div :class="box_isMobile" v-if="!isMobile||isUserCriti">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <el-icon class="icon"><ChatDotRound/></el-icon>
              <span>用户评论记录</span>
            </div>
          </template>
          <el-scrollbar :max-height="scrollbarHeight">
            <el-timeline>
              <el-timeline-item :timestamp="handleTime(criti.created_at)" placement="top" v-for="criti in critiList"
                :key="criti.id">
                <el-card>
                  <a href="??">{{ criti.content }}</a>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { ArrowLeftBold, View, User,UserFilled,Iphone,Location,Tickets,OfficeBuilding,Message,Male,Female,Postcard,Reading,School,Star,ChatDotRound,Document} from "@element-plus/icons-vue";
import { getUserPosts, getUserCriti, getUserDetail } from "@/api/api";
import router from '@/router';
import { useGlobalData } from "@/store";
interface Post_history {
  uid: string,
  type: string,
  page_disable: string,
  page?: string,
  page_size?: string,
  page_base?: string,
}
interface User_detail {
  avatar?: string,
  campus?: string,
  department?: string,
  email?: string,
  gender?: string,
  idNumber?: string,
  major?: string,
  nickname?: string,
  realname?: string,
  role?: string,
  stuType?: string,
  telephone?: string,
  token?: string,
  userNumber?: string
}
const GlobalData = useGlobalData();
const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})
var user_detail = reactive<User_detail>({})
var search = ref<HTMLElement>();
var isUserCriti = ref<boolean>(false);
var postList = reactive<any[]>([]);
var critiList = reactive<any[]>([]);
var scrollbarHeight = ref<number>(0);
var drawer = ref<boolean>(false);
var uid = computed(() => {
  return router.currentRoute.value.query.uid
})
var post_history = reactive({
  uid: uid.value,
  type: '0',
  page_disable: '1',
})
var criti_history = reactive({
  uid: uid.value,
  type: '0',
  page_disable: '1',
})
var size = computed(()=>{
  if(GlobalData.width > 650){
    return 650;
  }else{
    return '100';
  }
})
var isMobile = computed(()=>{
  return GlobalData.width < 967;
})
var box_isMobile = ref({
  'mobile-box':isMobile,
  'not-mobile-box':true,
  get 'not-mobilbe-box'(){
    return !isMobile;
  }
})
function goback() {
  router.go(-1);
}
function openBox() {
  drawer.value = true;
  getUserDetail({ "uid": uid.value }).then((res: any) => {
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
  })
}
function handleTime(time: string) {
  return JSON.stringify(new Date(time))
    .replace(/["Z]/g, "")
    .split("T")[0] + '  ' +
    JSON.stringify(new Date(time))
      .replace(/["Z]/g, "")
      .split("T")[1]
      .split(".")[0]
}
function adjustScrollHeight() {
  setTimeout(() => {
    let searchHeight = search.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - searchHeight - 140;
  }, 50);
}
window.addEventListener("resize", () => adjustScrollHeight())
onMounted(() => {
  adjustScrollHeight();
  getUserPosts(post_history).then((res: any) => {
    res.list.forEach((post: any) => {
      postList.push(post);
    })
  })
  getUserCriti(criti_history).then((res: any) => {
    res.list.forEach((criti: any) => {
      critiList.push(criti);
    })
  })
})
</script>

<style lang="less" scoped>
.operate-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 8px;

  .button-box {
    margin-left: 8px;

    .goback-button {
      background-color: rgb(0, 81, 135);
    }

    .openbox-button {
      background-color: rgb(0, 81, 135);
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
  .not-mobile-box {
    width: 48%;
    height: 80%;
  }

  .mobile-box{
    width: 96%;
    height: 80%;
  }
}
</style>
