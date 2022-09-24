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
                <el-icon style="margin-right: 5px"><Document /></el-icon>
                <span>用户发帖记录</span>
              </div>
              <div style="flex: 1"></div>
              <button
                class="filter-btn btn-ori modify"
                style="width: auto; padding: 0 10px 0 4px"
                @click="is_batch = true"
                v-if="!is_batch && !condition_now_post"
              >
                <el-icon class="icon"><CopyDocument color="#ffffff" /></el-icon
                >批量
              </button>
              <el-popconfirm
                :title="`确认删除这${batchList.length}个帖子？`"
                @confirm="dialog('删除原因')"
                :icon="InfoFilled"
                icon-color="#626AEF"
              >
                <template #reference>
                  <button
                    class="filter-btn btn-ori modify-oppo"
                    style="width: auto; padding: 0 10px; color: #f56c6c"
                    :style="{
                      cursor: batchList.length == 0 ? 'not-allowed' : 'pointer',
                    }"
                    :disabled="batchList.length == 0"
                    v-if="is_batch"
                  >
                    <el-icon style="margin-right: 3px"
                      ><Delete color="#f56c6c"
                    /></el-icon>
                    删除
                  </button>
                </template>
              </el-popconfirm>
              <button
                class="filter-btn btn-ori modify-oppo"
                style="width: auto; padding: 0 15px"
                @click="cancelBatch"
                v-if="is_batch"
              >
                取消
              </button>
              <div class="select-header" v-if="!is_batch">
                <div class="block" :style="block_style1"></div>

                <div
                  class="select-button"
                  @click="
                    (block_style1.left = '0%'),
                      (text_color1.color = 'white'),
                      (text_color2.color = '#606266'),
                      (condition_now_post = 0)
                  "
                >
                  <span :style="text_color1">全部</span>
                </div>
                <div
                  class="select-button"
                  @click="
                    (block_style1.left = '50%'),
                      (text_color1.color = '#606266'),
                      (text_color2.color = 'white'),
                      (condition_now_post = 1)
                  "
                >
                  <span :style="text_color2">已删</span>
                </div>
              </div>
            </div>
          </template>
          <el-scrollbar
            :max-height="scrollbarHeight"
            v-loading.lock="showLoadPosts"
          >
            <div
              v-infinite-scroll="loadMorePosts"
              :infinite-scroll-immediate="false"
              :infinite-scroll-distance="60"
            >
              <el-timeline>
                <el-timeline-item
                  :timestamp="handleTime(post.created_at)"
                  placement="top"
                  v-for="post in postList"
                  :key="post.id"
                >
                  <el-card>
                    <div style="display: flex">
                      <div
                        class="operate"
                        style="margin: -6px 6px 0 -6px"
                        v-if="is_batch"
                      >
                        <el-checkbox
                          v-model="post.chosen"
                          :disabled="post.is_deleted"
                          @change="(val: boolean) => handleBatch(val, post.id)"
                        />
                      </div>
                      <div>
                        <div
                          class="jump-to-detail"
                          @click="() => detail(post.id, 0)"
                        >
                          {{ post.title }}
                        </div>
                        <p class="ellipsis">{{ post.content }}</p>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
                <!-- <div class="pagination-wrapper">
                <div class="pagination">
                  <el-pagination
                    background
                    layout="prev,pager,next"
                    :total="total_num1"
                    :pager-count="5"
                    small
                    hide-on-single-page
                    @current-change="pageHandler_post"
                  />
                </div>
              </div> -->
              </el-timeline>
              <div class="loadmore" v-if="loadMorePostsTip">
                {{ loadMorePostsTip }}
              </div>
              <div class="loadmore" v-else-if="!postList.length">
                --- 暂无记录 ---
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
      <div :class="box_isMobile" v-if="!isMobile || isUserCriti">
        <el-card class="box-card">
          <template #header>
            <div class="header-wrapper">
              <div class="card-header">
                <el-icon class="icon" style="margin-right: 5px"
                  ><ChatDotRound
                /></el-icon>
                <span>用户评论记录</span>
              </div>
              <div style="flex: 1"></div>
              <div class="select-header">
                <div class="block" :style="block_style2"></div>
                <div
                  class="select-button"
                  @click="
                    (block_style2.left = '0%'),
                      (text_color1_.color = 'white'),
                      (text_color2_.color = '#606266'),
                      (condition_now_criti = 0)
                  "
                >
                  <span :style="text_color1_">全部</span>
                </div>
                <div
                  class="select-button"
                  @click="
                    (block_style2.left = '50%'),
                      (text_color1_.color = '#606266'),
                      (text_color2_.color = 'white'),
                      (condition_now_criti = 1)
                  "
                >
                  <span :style="text_color2_">已删</span>
                </div>
              </div>
            </div>
          </template>
          <el-scrollbar
            :max-height="scrollbarHeight"
            v-loading.lock="showLoadFloors"
          >
            <div
              v-infinite-scroll="loadMoreFloors"
              :infinite-scroll-immediate="false"
              :infinite-scroll-distance="60"
            >
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
                      {{
                        criti.content?.trim().length ? criti.content : "[图片]"
                      }}
                    </div>
                  </el-card>
                </el-timeline-item>
                <!-- <div class="pagination-wrapper">
                <div class="pagination">
                  <el-pagination
                    background
                    layout="prev,pager,next"
                    :total="total_num2"
                    :pager-count="5"
                    small
                    hide-on-single-page
                    @current-change="pageHandler_criti"
                  />
                </div>
              </div> -->
              </el-timeline>
              <div class="loadmore" v-if="loadMoreFloorsTip">
                {{ loadMoreFloorsTip }}
              </div>
              <div class="loadmore" v-else-if="!critiList.length">
                --- 暂无记录 ---
              </div>
            </div>
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
          <!-- <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <CircleClose />
                </el-icon>
                历史删帖次数
              </div>
            </template>
            {{ user_detail.deleted_num }}
          </el-descriptions-item> -->
        </el-descriptions>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="drawer = false">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
  <el-dialog
    v-model="showDialog"
    :width="dialogTitle == '删除原因' ? '330px' : '300px'"
    center
    draggable
  >
    <template #title="{ titleId, titleClass }">
      <div class="dialog-header">
        <h4 :id="titleId" :class="titleClass">
          <text style="margin-left: 10px">{{ dialogTitle }}</text>
        </h4>
      </div>
    </template>
    <div v-if="dialogTitle == '删除原因'" class="delete">
      <el-radio-group v-model="deleteReason">
        <el-radio v-for="reason in GlobalData.reasons" :label="reason" />
        <el-radio :label="customizedReason" class="custom">
          <el-input
            v-model="customizedReason"
            placeholder="自定义原因"
            @focus="chooseCustom"
            @input="chooseCustom"
          />
        </el-radio>
      </el-radio-group>
    </div>
    <div v-else>hahahaha</div>
    <template #footer>
      <span class="dialog-footer" v-if="dialogTitle == '删除原因'">
        <el-button @click="showDialog = false" style="border: 1px solid #dcdfe6"
          >取消</el-button
        >
        <el-button @click="batchDel" type="primary">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import {
  ArrowLeftBold,
  View,
  // CircleClose,
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
  CopyDocument,
  InfoFilled,
  Delete,
} from "@element-plus/icons-vue";
import {
  getUserPosts,
  getUserCriti,
  getUserDetail,
  getBlockedNum,
  deletePost,
} from "@/api/api";
import router from "@/router";
import { useGlobalData, usePost, User_detail } from "@/store";
import { ElMessage } from "element-plus";
interface Post_history {
  uid: string;
  type: string;
  page_disable: string;
  page?: string;
  page_size?: string;
  page_base?: string;
}
interface Criti_historty {
  uid: string;
  type: string;
  page_disable: string;
  page?: string;
  page_size?: string;
  page_base?: string;
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

var userPostsQuery = reactive({
  uid,
  type: 0,
  page: 1,
  page_size: 20,
  page_disable: 0,
});
var userFloorsQuery = reactive({
  uid,
  type: 0,
  page: 1,
  page_size: 20,
  page_disable: 0,
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
});
var text_color2 = reactive({
  color: "#606266",
});
var text_color1_ = reactive({
  color: "white",
});
var text_color2_ = reactive({
  color: "#606266",
});
var block_style1 = reactive({
  left: "0%",
});
var block_style2 = reactive({
  left: "0%",
});
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
  // getUserPosts(user_deletedPost).then((res: any) => {
  //   console.log(res);
  //   user_detail.deleted_num = res.list.length;
  // });
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
function showUserPosts() {
  showLoadPosts.value = true;
  getUserPosts(userPostsQuery).then((res: any) => {
    if (res.list.length) {
      res.list.forEach((post: any) =>
        postList.push({ ...post, chosen: false })
      );
      if (res.list.length < userPostsQuery.page_size)
        loadMorePostsTip.value = "--- 没有更多记录 ---";
    }
    showLoadPosts.value = false;
  });
}
function showUserFloors() {
  showLoadFloors.value = true;
  getUserCriti(userFloorsQuery).then((res: any) => {
    if (res.list.length) {
      res.list.forEach((criti: any) => critiList.push(criti));

      if (res.list.length < userFloorsQuery.page_size)
        loadMoreFloorsTip.value = "--- 没有更多记录 ---";
    }
    showLoadFloors.value = false;
  });
}
var showLoadPosts = ref<boolean>(false);
var showLoadFloors = ref<boolean>(false);
var loadMorePostsTip = ref<string>("");
var loadMoreFloorsTip = ref<string>("");
function loadMorePosts() {
  loadMorePostsTip.value = "";
  if (postList.length == userPostsQuery.page * 20) {
    userPostsQuery.page++;
    showUserPosts();
  } else loadMorePostsTip.value = "--- 没有更多记录 ---";
}
function loadMoreFloors() {
  loadMoreFloorsTip.value = "";
  if (critiList.length == userFloorsQuery.page * 20) {
    userFloorsQuery.page++;
    showUserFloors();
  } else loadMoreFloorsTip.value = "--- 没有更多记录 ---";
}

var dialogTitle = ref<string>("");
var showDialog = ref<boolean>(false);
var is_batch = ref<boolean>(false);
var batchList = ref<number[]>([]);
var customizedReason = ref<string>("");
var deleteReason = ref<string | null>("");
function dialog(title: string) {
  dialogTitle.value = title;
  if (title == "删除原因") deleteReason.value = null;
  showDialog.value = true;
}
function chooseCustom() {
  deleteReason.value = customizedReason.value;
}
function handleBatch(val: boolean, itemId: number) {
  if (!val) {
    let index = batchList.value?.indexOf(itemId) as number;
    batchList.value?.splice(index, 1);
  } else batchList.value?.push(itemId);
  console.log(batchList.value);
}
function cancelBatch() {
  is_batch.value = false;
  batchList.value = [];
  postList.forEach((post) => (post.chosen = false));
}
function refresh() {
  postList.length = 0;
  userPostsQuery.page = 1;
  loadMorePostsTip.value = "";
  userPostsQuery.type = 0;
  showUserPosts();
}
function batchDel() {
  if (deleteReason.value == null) ElMessage.warning("请选择一个删除原因！");
  else if (!deleteReason.value.length)
    ElMessage.warning("自定义原因不能为空！");
  else {
    let i,
      flag = false;
    for (i = batchList.value.length - 1; i >= 0; i--) {
      deletePost({ id: batchList.value[i], reason: deleteReason.value });
      if (i == 0) {
        ElMessage.success("批量删除成功！");
        flag = true;
      }
    }
    if (!flag) ElMessage.error("批量删除失败，请稍后重试");
    batchList.value = [];
    is_batch.value = false;
    showDialog.value = false;
    setTimeout(() => {
      refresh();
    }, 100);
  }
}

function adjustScrollHeight() {
  setTimeout(() => {
    let searchHeight = search.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - searchHeight - 190;
  }, 50);
}
watch(condition_now_post, (newVal) => {
  postList.length = 0;
  userPostsQuery.page = 1;
  loadMorePostsTip.value = "";
  if (newVal) {
    userPostsQuery.type = 1;
    showUserPosts();
  } else {
    userPostsQuery.type = 0;
    showUserPosts();
  }
});
watch(condition_now_criti, (newVal) => {
  critiList.length = 0;
  userFloorsQuery.page = 1;
  loadMoreFloorsTip.value = "";
  if (newVal) {
    userFloorsQuery.type = 1;
    showUserFloors();
  } else {
    userFloorsQuery.type = 0;
    showUserFloors();
  }
});
window.addEventListener("resize", () => adjustScrollHeight());
onMounted(() => {
  adjustScrollHeight();
  showUserPosts();
  showUserFloors();
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

  .header-wrapper {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    .select-header {
      padding: 2px 3px;
      position: relative;
      display: flex;
      background-color: #f4f4f5;
      box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
      border-radius: 8px;
      transform: scale(1); //加上这个会让文字显示在最顶层
    }

    .block {
      position: absolute;
      border-radius: 8px;
      background-color: #005187;
      height: 100%;
      width: 50%;
      z-index: -1;
      left: 0%;
      transform: translateY(-2px);
      transition: all 0.7s;
    }
    .select-button {
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
.modify {
  height: 30.8px;
  margin: 0 10px;
}
.modify-oppo {
  height: 30.8px;
  margin: 0 7px;
  background-color: #f4f4f5;
  color: #005187;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  .pagination {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }
}
.loadmore {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #005187;
}
.dialog-header {
  h4 {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 18px;
  }
}
.delete {
  .el-radio-group {
    display: block;
    .el-radio {
      margin-bottom: 15px;
    }
  }
  .custom {
    width: 100%;
    padding: 5px 0;
    margin: -5px 0;
    transform: translateY(10px);
    .el-input {
      width: 250px;
    }
  }
}
</style>
<style lang="less">
.el-switch__core {
  border: 1px solid #005187 !important;
  background-color: #005187 !important;
}
.operate {
  .el-checkbox__inner {
    border: 1px solid #b2b2b2;
    background-color: #f4f4f5;
  }
}
.el-radio {
  margin-right: 10px;
  .el-radio__inner {
    border: 1px solid #dcdfe6;
  }
}
.delete {
  .el-radio__label {
    white-space: pre-line;
  }
}
</style>
