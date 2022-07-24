<template>
  <div class="page">
    <div class="filter" ref="search">
      <div class="input-shrink">
        <el-input
          placeholder="uid 搜索用户 ..."
          :clearable="true"
          v-model="user_search.uid"
          @keyup.enter="showOneUser"
        />
        <div class="icon-holder" @click="showOneUser">
          <el-icon class="icon">
            <Search color="#ffffff" />
          </el-icon>
        </div>
      </div>
      <div class="multiple-box">
        <div class="multiple-button-wrapper">
          <button
            class="btn-ori filter-btn"
            @click="checkbox_show = !checkbox_show"
          >
            <el-icon style="margin-right: 3px" v-show="!checkbox_show">
              <CopyDocument color="#ffffff" />
            </el-icon>
            <el-icon style="margin-right: 3px" v-show="checkbox_show">
              <DArrowLeft color="#ffffff" />
            </el-icon>
            <span v-show="!checkbox_show">批量操作</span>
            <span v-show="checkbox_show">取消操作</span>
          </button>
          <button
            class="btn-ori filter-btn"
            v-show="checkbox_show"
            @click="createMultiple"
          >
            <el-icon style="margin-right: 3px"
              ><Mute color="#ffffff"
            /></el-icon>
            <span>禁言</span>
          </button>
          <button
            class="btn-ori filter-btn"
            v-show="checkbox_show"
            @click="cleanMultiple"
          >
            <el-icon style="margin-right: 3px"
              ><Delete color="#ffffff"
            /></el-icon>
            <span>清空</span>
          </button>
        </div>
        <div class="select-box" v-show="!checkbox_show">
          <div class="condition-box">
            <div class="change-all-condition" :style="block_style"></div>
            <div
              class="all"
              @click="
                (block_style.left = '0%'),
                  (text_normal_color.color = 'white'),
                  (text_blocked_color.color = 'black'),
                  (text_banned_color.color = 'black'),
                  (condition_now = 0),
                  showUsers(0, 1)
              "
            >
              <span :style="text_normal_color">全部</span>
            </div>
            <div
              class="blocked"
              @click="
                (block_style.left = '33.3%'),
                  (text_normal_color.color = 'black'),
                  (text_blocked_color.color = 'white'),
                  (text_banned_color.color = 'black'),
                  (condition_now = 1),
                  showUsers(1, 1)
              "
            >
              <span :style="text_blocked_color">禁言</span>
            </div>
            <div
              class="banned"
              @click="
                (block_style.left = '66.66%'),
                  (text_normal_color.color = 'black'),
                  (text_blocked_color.color = 'black'),
                  (text_banned_color.color = 'white'),
                  (condition_now = 2),
                  showUsers(2, 1)
              "
            >
              <span :style="text_banned_color">封禁</span>
            </div>
          </div>
        </div>
      </div>
      <div class="input">
        <el-input
          placeholder="uid 搜索用户 ..."
          :clearable="true"
          v-model="user_search.uid"
          @keyup.enter="showOneUser"
        />
        <div class="icon-holder" @click="showOneUser">
          <el-icon class="icon">
            <Search color="#ffffff" />
          </el-icon>
        </div>
      </div>
    </div>

    <div class="user-wrapper">
      <div class="user-list-header">
        <transition name="checkbox">
          <input
            type="checkbox"
            v-if="checkbox_show"
            class="checkbox"
            v-model="checkbox_allSelected"
          />
        </transition>
        <div class="user-uid-header" ref="header">
          <span>用户昵称</span>
        </div>
        <div class="user-condition-header">
          <span>用户状态</span>
        </div>
        <div class="operate-header">
          <span>操作</span>
        </div>
      </div>
      <el-scrollbar :max-height="scrollbarHeight">
        <div
          class="user-box"
          v-for="user in userList"
          :key="user.id"
          :style="
            user.is_blocked || user.is_banned
              ? 'background-color:rgba(221,100,100,.3);'
              : 'background-color:white;'
          "
        >
          <transition name="checkbox">
            <input
              type="checkbox"
              v-if="checkbox_show"
              class="checkbox"
              v-model="user.checkedBtn"
              @change="calCheckedNum"
            />
          </transition>
          <div class="user-info">
            <div class="user-nickname">
              <span>{{ user.nickname }}</span>
            </div>
            <div class="user-uid">
              <span>{{ "uid: " + user.id }}</span>
            </div>
          </div>
          <div class="user-condition">
            <div class="is-blocked">
              <span>{{
                user.is_blocked ? "禁言" : user.is_banned ? "封禁" : "正常"
              }}</span>
            </div>
            <div class="blocked-info" v-if="user.is_blocked && !isMobile">
              <span>{{
                handleTime(user.bloced_start, user.blocked_over)
              }}</span>
            </div>
          </div>
          <div class="operate-list">
            <div
              class="block-user"
              v-if="!(user.is_blocked || user.is_banned)"
              @click="
                (dialogFormVisible1 = true),
                  (user_blocked.uid = String(user.id))
              "
            >
              <el-button>
                <el-icon>
                  <Mute color="red" />
                </el-icon>
                <span>禁言</span>
              </el-button>
            </div>
            <div class="has-blocked" v-if="user.is_blocked || user.is_banned">
              <span>已禁言</span>
            </div>
            <div class="more">
              <el-dropdown trigger="click">
                <el-icon>
                  <MoreFilled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <div
                      @click="
                        (user_diary.uid = String(user.id)),
                          (user_diary.condition = user.is_blocked),
                          (user_diary.phone_number = Number(user.phone_number)),
                          (user_diary.blocked_time = handleTime(
                            user.bloced_start,
                            user.blocked_over
                          )),
                          enterUserRecord()
                      "
                    >
                      <el-dropdown-item>
                        <el-icon>
                          <View />
                        </el-icon>
                        <text style="width: 100%; text-align: center"
                          >查看日志</text
                        >
                      </el-dropdown-item>
                    </div>
                    <div
                      @click="
                        (user_uid.uid = String(user.id)), refreshNickname()
                      "
                    >
                      <el-dropdown-item divided>
                        <el-icon>
                          <RefreshRight />
                        </el-icon>
                        <text style="width:100%;text-align">重置昵称</text>
                      </el-dropdown-item>
                    </div>
                    <div
                      @click="
                        (dialogFormVisible2 = true),
                          (user_banned.uid = String(user.id))
                      "
                    >
                      <el-dropdown-item divided>
                        <el-icon>
                          <CircleClose />
                        </el-icon>
                        <text style="width:100%;text-align">封禁用户</text>
                      </el-dropdown-item>
                    </div>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="pagination">
          <div style="flex: 1"></div>
          <el-pagination
            background
            layout="prev,pager,next"
            v-model:current-page="current_page"
            pager-count="5"
            @current-change="pageHandler"
            :total="total_num"
            :hide-on-single-page="true"
            :small="shrinkPager"
          />
        </div>
      </el-scrollbar>
    </div>
    <el-dialog v-model="dialogFormVisible1" top="30vh" center>
      <el-form :model="user_blocked" ref="form">
        <el-form-item
          prop="day"
          label="禁言天数:"
          :rules="{
            required: true,
            message: '禁言天数不能为空',
            trigger: 'blur',
          }"
        >
          <el-select v-model="user_blocked.last" placeholder="请选择禁言天数">
            <el-option label="One day" value="1" class="Select"></el-option>
            <el-option label="Three days" value="3" class="Select"></el-option>
            <el-option label="One week" value="7" class="Select"></el-option>
            <el-option label="Two weeks" value="14" class="Select"></el-option>
            <el-option
              label="Three weeks"
              value="21"
              class="Select"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="reason"
          label="禁言原因:"
          :rules="{
            required: true,
            message: '禁言原因不能为空',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="user_blocked.reason"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="refuseBlocked()">取消</el-button>
          <el-button type="primary" @click="createBlocked()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogFormVisible2" top="30vh" center>
      <el-form :model="user_banned" ref="form">
        <el-form-item
          prop="reason"
          label="封禁原因:"
          :rules="{
            required: true,
            message: '封禁原因不能为空',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="user_banned.reason"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="refuseBanned()">取消</el-button>
          <el-button type="primary" @click="createBanned()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  Search,
  CopyDocument,
  View,
  Mute,
  CircleClose,
  MoreFilled,
  RefreshRight,
  DArrowLeft,
  Delete,
} from "@element-plus/icons-vue";
import { ref, reactive, onMounted, computed, watch } from "vue";
import {
  getAllUsers,
  resetNickname,
  postBlocked,
  postBanned,
  getOneUser,
} from "@/api/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { useGlobalData } from "@/store";
import router from "@/router/index";
interface Users_info {
  id: number;
  nickname: string;
  phone_number: string;
  checkedBtn: boolean;
  is_super: boolean;
  is_sch_admin: boolean;
  is_stu_admin: boolean;
  is_user: boolean;
  is_sch_dis_admin: boolean;
  active: boolean;
  is_blocked: boolean;
  bloced_start: string;
  blocked_remain: number;
  blocked_over: string;
  is_banned: boolean;
}
interface User_query {
  is_blocked?: number;
  is_banned?: number;
  page?: number;
  page_size?: number;
  page_disabled?: string;
}
interface User_uid {
  uid: string;
}
interface User_blocked {
  uid: string;
  last: string;
  reason: string;
}
interface User_banned {
  uid: string;
  reason: string;
}
interface User_search {
  uid: string;
}
interface User_diary {
  //传递到用户日志里的信息
  uid: string;
  phone_number: number | null;
  condition: boolean;
  blocked_time: string;
}
const GlobalData = useGlobalData();
var user_query = reactive<User_query>({});
var userList = reactive<Users_info[]>([]); //用于存放当页展示的用户
var user_uid = reactive<User_uid>({
  uid: "",
});
var user_search = reactive<User_search>({
  uid: "",
});
var user_diary = reactive<User_diary>({
  uid: "",
  phone_number: null,
  condition: false,
  blocked_time: "",
});
var user_blocked = reactive<User_blocked>({
  uid: "",
  last: "",
  reason: "",
});
var user_banned = reactive<User_banned>({
  uid: "",
  reason: "",
});
var current_page = ref<number>(1);
var search = ref<HTMLElement>();
var scrollbarHeight = ref<number>(0);
var total_num = ref<number>(0);
var condition_now = ref<number>(0); //0表示全部,1表示禁言,2表示封禁
var checkbox_show = ref<boolean>(false);
var dialogFormVisible1 = ref<boolean>(false);
var dialogFormVisible2 = ref<boolean>(false);
var checkbox_allSelected = ref<boolean>(false);
var multipleSelection = reactive<Users_info[]>([]);
var isMul_flag = ref<number>(0);
var block_style = reactive({
  left: "0%",
});
var text_normal_color = reactive({
  color: "white",
});
var text_blocked_color = reactive({
  color: "black",
});
var text_banned_color = reactive({
  color: "black",
});
function showUsers(condition: number, page?: any) {
  userList.length = 0;
  user_query.page = page;
  user_query.page_size = 15;
  current_page.value = page;
  user_query.is_blocked = 0;
  user_query.is_banned = 0;
  if (condition === 1) {
    user_query.is_blocked = 1;
  } else if (condition === 2) {
    user_query.is_banned = 1;
  }
  getAllUsers(user_query).then((res: any) => {
    if (condition === 0) {
      total_num.value = 50000; //全部情况下暂时没有total总数的接口，所以先写成这样,其他两个状态有total属性
    } else {
      total_num.value = res.total;
    }
    res.list = res.list.map((item: any) => {
      return {
        ...item,
        checkedBtn: false,
      };
    });
    res.list.forEach((item: any) => {
      userList.push(item);
    });
    console.log(userList);
  });
}
function showOneUser() {
  total_num.value = 0;
  let search_type = Number(user_search.uid);
  if (typeof search_type == "number") {
    getOneUser(user_search).then((res: any) => {
      console.log(res);
      userList.length = 0;
      userList.push(res.user);
    });
  } else if (isNaN(search_type)) {
    userList.length = 0; //这里为搜索昵称,暂时不能写,数据量太大
  }
}
function createMultiple() {
  if (multipleSelection.length != 0) {
    isMul_flag.value = 1;
    dialogFormVisible1.value = true;
  }
}
function calCheckedNum() {
  multipleSelection = [];
  userList.forEach((item: any) => {
    if (item.checkedBtn) {
      multipleSelection.push(item);
    }
  });
}
function pageHandler(page: any) {
  showUsers(condition_now.value, page);
}
function refreshNickname() {
  resetNickname(user_uid).then((res: any) => {
    ElMessage({
      showClose: true,
      message: "重置昵称成功",
      type: "success",
      duration: 1000,
    });
    showUsers(0, current_page.value);
  });
}
function createBlocked() {
  if (!isMul_flag.value) {
    postBlocked(user_blocked).then((res: any) => {
      console.log(res);
      dialogFormVisible1.value = false;
      ElMessage({
        showClose: true,
        message: "禁言成功",
        type: "success",
        duration: 1000,
      });
      user_blocked.last = "";
      user_blocked.reason = "";
      showUsers(0, current_page.value);
    });
  } else {
    let len = multipleSelection.length;
    for (let i = 0; i < len; i++) {
      user_blocked.uid = String(multipleSelection[i].id);
      postBlocked(user_blocked).then((res: any) => {
        console.log(res);
      });
    }
    dialogFormVisible1.value = false;
    ElMessage({
      showClose: true,
      message: "禁言成功",
      type: "success",
      duration: 1000,
    });
    user_blocked.last = "";
    user_blocked.reason = "";
    checkbox_show.value = false;
    isMul_flag.value = 0;
    showUsers(0, current_page.value);
  }
}
function refuseBlocked() {
  dialogFormVisible1.value = false;
  ElMessage({
    message: "取消操作",
    duration: 1000,
  });
  user_blocked.uid = "";
  user_blocked.last = "";
  user_blocked.reason = "";
}
function createBanned() {
  postBanned(user_banned).then((res: any) => {
    console.log(res);
    dialogFormVisible2.value = false;
    ElMessage({
      showClose: true,
      message: "封禁成功",
      type: "success",
      duration: 1000,
    });
    showUsers(current_page.value);
  });
}
function refuseBanned() {
  dialogFormVisible2.value = false;
  ElMessage({
    message: "取消操作",
    duration: 1000,
  });
  user_banned.uid = "";
  user_banned.reason = "";
}
function adjustScrollHeight() {
  setTimeout(() => {
    let searchHeight = search.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - searchHeight - 96;
  }, 50);
}
function enterUserRecord() {
  router.push({
    path: "/diary",
    query: {
      uid: user_diary.uid,
    },
  });
}
function cleanMultiple() {
  userList.forEach((element: any) => {
    element.checkedBtn = false;
  });
  checkbox_allSelected.value = false;
  multipleSelection = [];
}
function handleTime(start: string, over: string) {
  if (start != "" && over != "") {
    return (
      JSON.stringify(new Date(start)).replace(/["Z]/g, "").split("T")[0] +
      JSON.stringify(new Date(start))
        .replace(/["Z]/g, "")
        .split("T")[1]
        .split(".")[0] +
      "——" +
      JSON.stringify(new Date(over)).replace(/["Z]/g, "").split("T")[0] +
      JSON.stringify(new Date(over))
        .replace(/["Z]/g, "")
        .split("T")[1]
        .split(".")[0]
    );
  } else {
    return "0";
  }
}
watch(user_search, (newVal) => {
  if (newVal.uid == "") {
    showUsers(0, 1);
  }
});
watch(checkbox_allSelected, (newVal) => {
  if (newVal) {
    userList.forEach((element: any) => {
      element.checkedBtn = true;
      multipleSelection = userList;
    });
  } else {
    userList.forEach((element: any) => {
      element.checkedBtn = false;
      multipleSelection = [];
    });
  }
});
var shrinkPager = computed(() => {
  return GlobalData.width < 490;
});
var isMobile = computed(() => {
  return GlobalData.width < 1160;
});
window.addEventListener("resize", () => adjustScrollHeight());
onMounted(() => {
  adjustScrollHeight();
  showUsers(0, 1);
});
</script>

<style lang="less" scoped>
.filter {
  padding: 15px 10px 5px;
  border-radius: 8px;
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  .input,
  .input-shrink {
    flex: 1;
    margin: 5px;
    // min-width: 270px;
    height: 37px;
    background-color: #f4f4f5;
    box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
    border-radius: 8px;
    display: flex;
    .icon-holder {
      flex-grow: 0;
      flex-shrink: 0;
      width: 54px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #005187;
      cursor: pointer;
      * {
        transform: scale(1.1);
      }
    }
  }
  .input-shrink {
    display: none;
  }
}
.multiple-box {
  display: flex;

  .multiple-button-wrapper {
    display: flex;
    .multiple-button {
      height: 37px;
      padding: 8px 13px;
      color: white;
      background-color: #005187;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      font-size: 16px;
      box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
    }
  }

  .select-box {
    display: flex;
    flex-direction: row-reverse;

    .text-box {
      margin: 2px 4px;
      font-size: 18px;
      line-height: 32.8px;
    }

    .condition-box {
      box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
      position: relative;
      display: flex;
      border: none;
      outline: none;
      border-radius: 8px;
      height: 37px;
      background-color: #f4f4f5;
      transform: scale(1);
      margin: 5px;
      .change-all-condition {
        position: fixed;
        border-radius: 8px;
        background-color: #005187;
        height: 100%;
        width: 33.33%;
        z-index: -1;
        left: 0%;
        transition: all 0.7s;
      }

      .all {
        border: none;
        outline: none;
        padding: 0px 12px;
        font-size: 14px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .blocked {
        border: none;
        outline: none;
        padding: 0px 12px;
        font-size: 14px;
        border-radius: 8px;
        color: #606266;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .banned {
        border: none;
        outline: none;
        padding: 0px 12px;
        border-radius: 8px;
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.user-wrapper {
  margin: 5px 15px;

  .user-list-header {
    display: flex;
    height: 37px;
    align-items: center;
    text-align: center;
    background-color: #f4f4f5;
    box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
    border-radius: 5px 5px 0 0;
    font-size: 15px;
    font-weight: bold;

    .user-uid-header {
      flex-grow: 1;
      width: 33.33%;
      font-size: 15px;
      text-align: center;
      margin: 3px 0;
      border-right: 1px solid white;
    }

    .user-condition-header {
      flex-grow: 1;
      width: 33.33%;
      font-size: 15px;
      text-align: center;
      margin: 3px 0;
    }

    .operate-header {
      flex-grow: 1;
      width: 33.33%;
      font-size: 15px;
      text-align: center;
      margin: 3px 0;
      border-left: 1px solid white;
    }
  }

  .user-box {
    display: flex;
    padding: 2px 0;
    margin: 1px 0;
    line-height: 32px;
    border-bottom: 1px solid #ebeef5;

    .user-info {
      flex-grow: 1;
      width: 33.33%;
      text-align: center;
      font-size: 15px;
      border-right: 1px solid #ebeef5;
      display: flex;
      flex-direction: column;
      .user-uid {
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(175, 175, 175);
        .id-icon {
          position: relative;
          left: -1px;
          top: 1.5px;
        }
      }
    }

    .user-condition {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      width: 33.33%;
      align-self: center;
      text-align: center;
      font-size: 14px;
      .blocked-info {
        font-size: 14px;
        line-height: 14px;
        color: rgb(175, 175, 175);
      }
    }

    .operate-list {
      display: flex;
      width: 33.33%;
      flex-grow: 1;
      justify-content: center;
      border-left: 1px solid #ebeef5;
      align-items: center;

      .block-user {
        .el-button {
          border: none;
          color: rgb(210, 79, 79);
          background-color: transparent;
        }
      }

      .has-blocked {
        span {
          color: grey;
          font-size: 16px;
          margin: 0 15px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin: 10px;
  }
}

.more {
  .el-icon {
    transform: rotate(90deg);
    cursor: pointer;
    height: 32px;
  }
}
/* .checkbox-enter-active,
.checkbox-leave-active {
  transition: margin 0.6s;
} */
.checkbox-enter,
.checkbox-leave-to {
  margin-left: -30px !important;
  margin-right: 0px !important;
}

.checkbox-enter-to,
.checkbox-leave {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.filter-btn {
  width: auto;
  height: 37px;
  box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
  background-color: #005187;
  margin: 5px;
  padding: 0 10px;
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
@media all and (max-width: 400px) {
  .filter {
    padding: 10px 7px 0;
    .input {
      display: none;
    }
    .input-shrink {
      display: flex;
    }
  }
  .filter {
    .input,
    .input-shrink {
      height: 33.3px;
    }
    .icon-holder {
      width: 45px !important;
    }
  }
  .filter-btn,
  .condition-box {
    transform: scale(0.9) translateX(-5%) !important;
    margin-right: -5px;
  }
  .filter-btn:last-child {
    margin-right: 0;
  }
}
</style>
<style lang="less">
.filter {
  .el-input__inner {
    border-radius: 8px;
    box-shadow: none !important;
    background-color: #f4f4f5;
    height: inherit !important;
  }
}
</style>
