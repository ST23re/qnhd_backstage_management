<template>
  <div class="page" ref="page">
    <div class="filter" ref="filter">
      <div class="input">
        <el-input
          v-model="tags_query.name"
          placeholder="搜索话题 🔍 ..."
          :clearable="true"
          @keyup.enter="showTags"
        />
        <div class="icon-holder">
          <el-icon @click="showTags">
            <Search color="#ffffff" />
          </el-icon>
        </div>
      </div>
    </div>
    <el-scrollbar :max-height="scrollbarHeight">
      <div
        v-for="tag in tagsList"
        :key="tag.id ?? tag.tag_id"
        class="tag"
        @click="searchTag(tag.id ?? tag.tag_id)"
      >
        <div class="title">
          <div class="top">
            <div class="ellipsis">
              {{ tag.name }}
            </div>
            <div
              class="isHotTag"
              :class="tag.point ? 'hot_tag' : 'no_hot_tag'"
              v-show="!isMobile"
            >
              <text>{{ tag.point ? "热搜" : "" }}</text>
            </div>
            <div v-if="tag.point" style="flex-shrink: 0">
              <font-awesome-icon
                :icon="faFireAlt"
                class="icon"
                style="margin: 0 5px"
                color="rgba(245, 65, 65, 0.915)"
              ></font-awesome-icon>
              <text>{{ tag?.point }}</text>
            </div>
          </div>
          <div class="bottom">
            <text>{{ "#id: " + (tag.id ?? tag.tag_id) }}</text>
          </div>
        </div>

        <div class="operate" @click.stop="() => {}">
          <el-popconfirm
            title="确定将话题撤出热榜？"
            @confirm="clearHot()"
            @cancel="refuse()"
          >
            <template #reference>
              <el-button
                :disabled="!tag.point"
                @click="tags_id.id = Number(tag.tag_id)"
                style="width: auto !important; padding: 0 8px"
              >
                <text :style="{ color: tag.point ? 'red' : 'grey' }">
                  <el-icon style="margin-right: 3px"> <Warning /> </el-icon
                  >{{ isMobile ? "撤出" : "撤出热榜" }}
                </text>
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            title="确定删除该话题？"
            @confirm="deleteTags()"
            @cancel="refuse()"
          >
            <template #reference>
              <el-button
                @click="tags_id.id = Number(tag.tag_id ?? tag.id)"
                style="width: auto !important; padding: 0 8px"
              >
                <text style="color: red">
                  <el-icon style="margin-right: 3px">
                    <Delete color="red" /> </el-icon
                  >删除
                </text>
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            @click="
              (drawer = true),
                (tags_id.id = Number(tag.id ?? tag.tag_id)),
                openBox()
            "
            style="width: auto !important; padding: 0 8px"
            v-show="!isMobile"
          >
            <text style="color: #005187">
              <el-icon style="margin-right: 3px"
                ><View color="#005187" /></el-icon
              >开盒
            </text>
          </el-button>
          <el-button
            @click="
              (dialogFormVisible2 = true),
                (tags_point.id = Number(tag.id ?? tag.tag_id))
            "
            style="width: auto !important; padding: 0 8px"
            v-show="!isMobile"
          >
            <text style="color: #005187">
              <el-icon style="margin-right: 3px"
                ><Plus color="#005187" /></el-icon
              >热度
            </text>
          </el-button>
          <div class="more" v-if="isMobile">
            <el-dropdown trigger="click">
              <el-icon class="icon">
                <MoreFilled />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <div
                    @click="
                      (drawer = true),
                        (tags_id.id = Number(tag.id ?? tag.tag_id)),
                        openBox()
                    "
                  >
                    <el-dropdown-item>
                      <el-icon><View color="grey" /></el-icon>
                      <text style="width: 100%; text-align: center"
                        >用户开盒</text
                      >
                    </el-dropdown-item>
                  </div>
                  <div
                    @click="
                      (dialogFormVisible2 = true),
                        (tags_point.id = Number(tag.id ?? tag.tag_id))
                    "
                  >
                    <el-dropdown-item divided>
                      <el-icon><Plus color="grey" /></el-icon>
                      <span style="width:100%;text-align">增加热度</span>
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
    <el-dialog v-model="dialogFormVisible2" top="30vh" center>
      <el-form :model="tags_point" ref="form">
        <el-form-item
          prop="point"
          label="热度增量:"
          :rules="{
            required: true,
            message: '热度增量不能为空',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="tags_point.point"
            autocomplete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="refuseHot">取消</el-button>
          <el-button type="primary" @click="airbornePoint">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
import {
  getHotTags,
  getNormalTags,
  increaseTagPoint,
  getClearHot,
  getDeleteTags,
  getTagDetail,
} from "@/api/api";
import { reactive, onMounted, ref, computed, watch } from "vue";
import {
  Search,
  Warning,
  Delete,
  MoreFilled,
  User,
  View,
  Plus,
  UserFilled,
  Iphone,
  Location,
  Tickets,
  OfficeBuilding,
  Message,
  Male,
  Female,
  Postcard,
  Reading,
  School,
  Star,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useGlobalData, usePost } from "@/store";
import router from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFireAlt } from "@fortawesome/free-solid-svg-icons/faFireAlt";
library.add(faFireAlt);
interface Tags {
  tag_id?: string;
  id?: string;
  point?: number;
  name: string;
}
interface Tags_query {
  name: string;
}
interface Tags_point {
  id: number | null;
  point: string;
}
interface Tags_pointDelete {
  id: number | null;
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
}
const GlobalData = useGlobalData();
var tags_query = reactive<Tags_query>({
  name: "",
});
var tags_point = reactive<Tags_point>({
  id: null,
  point: "",
});
var tags_id = reactive<Tags_pointDelete>({
  id: null,
});
var user_detail = reactive<User_detail>({});
var filter = ref<HTMLElement>();
var tags_total = ref<number>(0);
var tagsList = reactive<Tags[]>([]); //目前被显示的tag列表
var dumpTagsList = reactive<Tags[]>([]); //存储所有tag
var filterList = reactive<Tags[]>([]); //经搜索过滤出来的新的总列表
var hotTagList = reactive<Tags[]>([]); //存热榜id
var hotTagList_name = reactive<Tags[]>([]); //存热榜name和id
var isHot = ref<boolean>(true);
var total_num = ref<number>(0);
var hotTag_num = ref<number>(0);
var scrollbarHeight = ref<number>(0);
var reverse_index = ref<number>(0);
var current_page = ref<number>(1);
var last_page = ref<number>(0);
var last_page_num = ref<number>(0);
var dialogFormVisible2 = ref<boolean>(false);
var drawer = ref<boolean>(false);
var isMobile = computed(() => {
  return GlobalData.width < 800;
});
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
function showTags(page: number) {
  if (tags_query.name === "" && page === 1) {
    getHotTags().then((res: any) => {
      console.log(res.total); //有热榜总数total属性
      hotTag_num.value = res.total;
      tagsList.length = 0;
      hotTagList.length = 0;
      hotTagList_name.length = 0;
      res.list.forEach((item: any) => {
        tagsList.push(item);
        hotTagList.push(item.tag_id);
        hotTagList_name.push(item);
      });
      let diffVal: number = 10 - hotTag_num.value;
      getNormalTags(tags_query).then((res: any) => {
        //ps:非热榜中tag与热榜中的tag有重复
        console.log(res);
        total_num.value = res.total;
        if (res.total % 10 != 0) {
          last_page.value = (res.total - (res.total % 10)) / 10 + 1;
          last_page_num.value = res.total % 10;
        } else {
          last_page.value = res.total / 10;
        }
        dumpTagsList.length = 0;
        res.list.forEach((item: any) => {
          dumpTagsList.push(item);
        });
        dumpTagsList = res.list.filter((item: any) => {
          return !hotTagList.includes(item.id);
        });
        reverse_index.value = dumpTagsList.length - 1;
        for (let i = 0; i < diffVal; i++) {
          tagsList.push(dumpTagsList[reverse_index.value]);
          reverse_index.value--;
        }
      });
    });
  } else if (tags_query.name === "" && page !== 1) {
    let temp: number = reverse_index.value - (page - 2) * 10;
    tagsList.length = 0;
    console.log(tagsList.length);
    if (
      page !== last_page.value ||
      (page === last_page.value && last_page_num.value == 0)
    ) {
      for (let i = 0; i < 10; i++) {
        tagsList.push(dumpTagsList[temp]);
        temp--;
      }
    } else {
      for (let i = 0; i < last_page_num.value; i++) {
        tagsList.push(dumpTagsList[temp]);
        temp--;
      }
    }
  } else {
    //此处用于搜索
    tagsList.length = 0;
    total_num.value = 0;
    let temp = hotTagList_name.concat(dumpTagsList);
    filterList = temp.filter((tag: any) => {
      return tag.name.indexOf(tags_query.name) !== -1;
    });
    filterList.forEach((tag: any) => {
      tagsList.push(tag);
    });
  }
}
function airbornePoint() {
  increaseTagPoint(tags_point).then((res: any) => {
    dialogFormVisible2.value = false;
    showTags(1);
    tags_point.point = "";
    ElMessage({
      showClose: true,
      message: "增加热度成功",
      type: "success",
      duration: 1000,
    });
  });
}
const clearHot = () => {
  getClearHot(tags_id).then((res: any) => {
    ElMessage({
      showClose: true,
      message: "撤去热搜成功",
      type: "success",
      duration: 1000,
    });
    showTags(1);
  });
};
const refuse = () => {
  ElMessage({
    type: "info",
    message: "取消操作",
    duration: 1000,
  });
};
const deleteTags = () => {
  getDeleteTags(tags_id).then((res: any) => {
    ElMessage({
      showClose: true,
      message: "删除tag成功",
      type: "success",
      duration: 1000,
    });
    if (current_page.value == 1) {
      showTags(1);
    } else {
      dumpTagsList.length = 0;
      getNormalTags(tags_query).then((res: any) => {
        //用于刷新dumpTagsList的值
        res.list.forEach((tag: any) => {
          dumpTagsList.push(tag);
        });
        dumpTagsList = res.list.filter((item: any) => {
          return !hotTagList.includes(item.id);
        });
        showTags(current_page.value);
      });
    }
  });
};
function refuseHot() {
  dialogFormVisible2.value = false;
  ElMessage({
    message: "取消增加热度",
    duration: 1000,
  });
  tags_point.id = null;
  tags_point.point = "";
}
function pageHandler(page: number) {
  console.log(page);
  showTags(page);
}
function openBox() {
  getTagDetail(tags_id).then((res: any) => {
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
}

const postParam = usePost();
const query_init = {
  type: 0,
  search_mode: 1,
  solved: null,
  department_id: null,
  content: "",
  tag_id: null,
  etag: "",
  value_mode: 0,
  commentable: null,
  is_deleted: 0,
};
function searchTag(tag_id: any) {
  postParam.$patch((state) => {
    state.posts_query = { ...query_init, tag_id };
  });
  router.push("/content");
}
function adjustScrollHeight() {
  setTimeout(() => {
    let filterHeight = filter.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - filterHeight - 50;
  }, 50);
}
onMounted(() => {
  /*   var pieHotTags = proxy.$echarts.init(charts.value)
    pieHotTags.setOption(option); */
  adjustScrollHeight();
  showTags(1);
});
var shrinkPager = computed(() => {
  return GlobalData.width < 490;
});
var size = computed(() => {
  if (GlobalData.width > 650) {
    return 650;
  } else {
    return "100";
  }
});
watch(tags_query, (newVal) => {
  if (newVal.name == "") {
    showTags(1);
  }
});
window.addEventListener("resize", () => adjustScrollHeight());
</script>

<style lang="less" scoped>
.tag {
  border-top: 1px dashed hwb(222 92% 4%);
  margin: 3px 10px;
  padding: 5px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  .title {
    font-size: 18px;
    font-weight: 500;
    flex-direction: column;
    /*     display: flex; */
    align-items: center;

    .top {
      display: flex;
      justify-content: space-between;
    }

    .isHotTag {
      flex-shrink: 0;
      height: 20px;
      margin: 0 10px 0 8px;
      font-size: 14px;
      padding: 0 5px;
      border-radius: 4px;
      align-self: center;

      text {
        line-height: 20px;
        color: white;
      }
    }

    .bottom {
      font-size: 14px;
      color: #afafaf;
    }
  }

  .operate {
    display: flex;

    .el-button {
      width: 70px;
      color: white;
      border-radius: 8px;
      border: 0;
      margin-left: 0;
      background-color: transparent !important;
    }
    text {
      display: flex;
      align-items: center;
    }

    .more {
      width: 14px;
      height: inherit;
      cursor: pointer;
      margin: 0 6px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      .icon {
        font-size: 14px;
        transform: rotate(90deg);
      }
    }
  }
}

.hot_tag {
  background-image: linear-gradient(to right bottom, #f35932, #cf4624);
  box-shadow: 0 0 1px #cf4624;
  opacity: 0.8;
}

.filter {
  padding: 15px 10px 0;
  margin-bottom: 3px;
  border-radius: 8px;
  user-select: none;

  .input {
    flex: 1;
    margin: 5px 5px 7px;
    min-width: 270px;
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
}

.pagination {
  display: flex;
  justify-content: center;
  position: relative;
  margin: 10px;
}

.ellipsis {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
@media all and (max-width: 500px) {
  .filter {
    .input {
      height: 33.3px;
    }
    .icon-holder {
      width: 45px !important;
    }
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
