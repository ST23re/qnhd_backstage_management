<template>
  <div class="page">
    <div class="filter" ref="filter">
      <div class="input">
        <el-input
          v-model="posts_query.content"
          placeholder="搜索帖子 | #MPid"
          :clearable="true"
          @keyup.enter="showPosts"
        />
        <div class="icon-holder">
          <el-icon @click="showPosts"><Search color="#ffffff" /></el-icon>
        </div>
      </div>
      <div style="display: flex">
        <el-popover placement="right" :width="180" v-model:visible="visible">
          <template #reference>
            <el-button @click="visible = !visible" class="filter-btn">
              <el-icon class="icon"><Filter color="#ffffff" /></el-icon>
              {{ visible ? "隐藏" : "筛选条件" }}
            </el-button>
          </template>
          <div style="display: flex; flex-wrap: wrap">
            <div class="filter-item">
              <text>分区 :</text>
              <el-select
                v-model="posts_query.type"
                style="width: 90px"
                @change="filterHandler"
              >
                <el-option
                  v-for="_type in GlobalData.postTypes"
                  :label="_type.shortname"
                  :value="_type.id"
                />
              </el-select>
            </div>
            <div class="filter-item" v-if="posts_query.type === 1">
              <text>部门 :</text>
              <el-select
                v-model="posts_query.department_id"
                style="width: 115px"
                @change="filterHandler"
              >
                <el-option
                  v-for="dep in GlobalData.departments"
                  :label="dep.name"
                  :value="dep.id"
                />
              </el-select>
            </div>
            <div class="filter-item" v-if="posts_query.type === 1">
              <text>状态 :</text>
              <el-select
                v-model="posts_query.solved"
                style="width: 90px"
                @change="filterHandler"
              >
                <el-option
                  v-for="item in GlobalData.solved"
                  :label="item.text"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="filter-item">
              <text>排序 :</text>
              <el-select
                v-model="sort_mode"
                style="width: 115px"
                @change="sortHandler"
              >
                <el-option
                  v-for="sort in GlobalData.sortMode"
                  :label="sort.text"
                  :value="sort.id"
                />
              </el-select>
            </div>
            <div class="filter-item">
              <text>标签 :</text>
              <el-select
                v-model="posts_query.etag"
                style="width: 90px"
                @change="filterHandler"
              >
                <el-option
                  v-for="item in GlobalData.eTag"
                  :label="item.text"
                  :value="item.id"
                />
              </el-select>
            </div>
            <div class="filter-item">
              <text>更多 :</text>
              <el-select
                v-model="status"
                style="width: 90px"
                @change="statusHandler"
              >
                <el-option
                  v-for="item in GlobalData.status"
                  :label="item.text"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
        </el-popover>
        <!-- <div style="flex: 1"></div> -->
        <el-button class="filter-btn"
          ><el-icon class="icon"><CopyDocument color="#ffffff" /></el-icon
          >批量操作</el-button
        >
      </div>
    </div>
    <el-scrollbar :max-height="scrollbarHeight">
      <div
        v-for="post in posts"
        :key="post.id"
        class="post"
        @click="detail(post)"
      >
        <div>
          <div class="title">
            <div class="ellipsis">
              <text>{{ post.title }}</text>
            </div>
            <div :class="['etag', post.e_tag]" v-if="post.e_tag">
              <text>{{
                post.e_tag == "recommend"
                  ? "加精"
                  : post.e_tag == "theme"
                  ? "活动"
                  : "置顶"
              }}</text>
            </div>
          </div>
          <div class="date">
            <text>{{ post.created_at }}</text>
            <text class="pt">#{{ postType(post.type) }}</text>
          </div>
        </div>
        <div style="flex: 1"></div>
        <div class="fav">
          <el-icon><Star /></el-icon>
          <text>{{ post.fav_count }}</text>
        </div>
        <div class="like">
          <img src="../assets/likes.svg" alt="" /><text>{{
            post.like_count
          }}</text>
        </div>
        <div class="comment">
          <el-icon><ChatLineRound /></el-icon
          ><text>{{ post.comment_count }}</text>
        </div>
        <div class="operate">
          <el-button color="#ffffff"
            ><text style="color: #005187"
              ><el-icon><CollectionTag /></el-icon>标签</text
            ></el-button
          >
          <el-button color="#ffffff"
            ><text style="color: #005187"
              ><el-icon><Switch /></el-icon>移动</text
            ></el-button
          >
          <div class="more">
            <el-dropdown trigger="click">
              <el-icon><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :disabled="false"
                    ><text style="width: 100%; text-align: center">开盒</text>
                  </el-dropdown-item>
                  <el-dropdown-item>用户日志</el-dropdown-item>
                  <el-dropdown-item divided
                    ><text style="width: 100%; text-align: center">删除</text>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="pagination">
        <div style="flex: 8"></div>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          :current-page.sync="posts_query.page"
          @update:current-page.sync="pageHandler"
          :total="posts_total"
          :hide-on-single-page="true"
          :small="shrinkPager"
          :pager-count="shrinkPager ? 5 : 7"
        />
        <div style="flex: 1"></div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { getPosts } from "@/api/api";
import { ref, reactive, onMounted, computed, watch } from "vue";
import cTime from "@/utils/time";
import { useGlobalData } from "@/store";
import {
  Search,
  Star,
  ChatLineRound,
  Switch,
  CollectionTag,
  MoreFilled,
  Filter,
  CopyDocument,
} from "@element-plus/icons-vue";

const GlobalData = useGlobalData();
interface Post {
  id: number;
  created_at: string;
  uid: number;
  type: number;
  campus: number;
  solved: number;
  title: string;
  content: string;
  nickname: string;
  fav_count: number;
  like_count: number;
  rating: number;
  value: number;
  e_tag: string;
  tag: null | {
    id: number;
    name: string;
  };
  floors: null;
  comment_count: number;
  image_urls: string[];
  department: null | {
    id: number;
    name: string;
    introduction: string;
  };
  commentable: boolean;
  is_deleted: boolean;
}
interface Posts_query {
  type: number; //0为所有1为校务，其他类型从帖子类型接口获取
  search_mode: number; //0为按照创建时间，1为按照更新时间
  solved?: number | null; //0为未分发1为已回复2为已解决3为已分发
  department_id?: number | null; //增加限定内容-获取某个部门下的帖子，当type为1的时候使用
  content?: string | null; //搜索帖子内容 包括标题和内容
  tag_id?: number | null; //tag的id
  etag?: string; //筛选etag帖子
  value_mode?: number; //0默认1不将置顶帖额外排序2只看置顶
  commentable?: number | null; //为0获取无法评论的，为1获取可评论的，默认不区分
  is_deleted?: number; //1为获取删除的 默认获取未删除的
  page_disable?: number; //传1关闭分页
  page?: number; //页数, 从1开始 默认为1
  page_size?: number; //页面大小，默认为10
  page_base?: number; //从第n个开始获取
}
var posts = reactive<Post[]>([]);
var posts_total = ref<number>(0);
var posts_query = reactive<Posts_query>({
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
});
var sort_mode = ref<number>(0);
var status = ref<number>(0);
function showPosts(info?: string) {
  getPosts(posts_query).then((res: any) => {
    if (info !== "loadmore") posts.length = 0;
    posts_total.value = res.total;
    res.list.forEach((post: Post) => {
      let created_at = cTime(post.created_at);
      posts.push({ ...post, created_at });
    });
    console.log(res);
  });
}
var filter = ref<HTMLElement>();
var visible = ref<boolean>(false);
var scrollbarHeight = ref<number>(0);
function filterHandler() {
  posts_query.page = 1;
  if (posts_query.type !== 1) {
    posts_query.department_id = null;
    posts_query.solved = null;
  }
  showPosts();
  adjustScrollHeight();
}
function sortHandler() {
  switch (sort_mode.value) {
    case 0:
      posts_query.search_mode = 1;
      posts_query.value_mode = 0;
      break;
    case 1:
      posts_query.search_mode = 1;
      posts_query.value_mode = 1;
      break;
    case 2:
      posts_query.search_mode = 0;
      posts_query.value_mode = 1;
      break;
  }
  filterHandler();
}
function statusHandler() {
  switch (status.value) {
    case 0:
      posts_query.commentable = null;
      posts_query.is_deleted = 0;
      break;
    case 1:
      posts_query.commentable = null;
      posts_query.is_deleted = 1;
      break;
    case 2:
      posts_query.commentable = 1;
      posts_query.is_deleted = 0;
      break;
    case 3:
      posts_query.commentable = 0;
      posts_query.is_deleted = 0;
      break;
  }
  filterHandler();
}
function pageHandler(page: number) {
  posts_query.page = page;
  showPosts();
}
function postType(type: number) {
  return GlobalData.postTypes.filter((pt) => pt.id === type)[0]?.shortname;
}
function handleBatch(e: any) {
  console.log(e);
}
function detail(post: Post) {
  console.log(post);
}
function adjustScrollHeight() {
  setTimeout(() => {
    let filterHeight = filter.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - filterHeight - 50;
  }, 50);
}
onMounted(() => {
  adjustScrollHeight();
  showPosts();
});
var shrinkPager = computed(() => {
  return GlobalData.width < 500;
});
window.addEventListener("resize", () => adjustScrollHeight());
</script>

<style lang="less" scoped>
.post {
  border-top: 1px dashed hwb(222 92% 4%);
  margin: 0px 10px;
  padding: 5px 8px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  .title {
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    .etag {
      flex-shrink: 0;
      height: 20px;
      margin: 0 10px 0 8px;
      font-size: 14px;
      padding: 0 5px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      text {
        line-height: 20px;
        color: white;
      }
    }
  }
  .date {
    font-size: 14px;
    .pt {
      margin-left: 8px;
      color: #afafaf;
    }
  }
  .fav,
  .like,
  .comment {
    display: flex;
    align-items: center;
    margin: 0 5px;
    color: #005187;
    font-size: 14px;
    img {
      width: 14px;
    }
    text {
      margin: 0 3px;
      color: black;
    }
  }
  .comment {
    margin-right: 10px;
  }
  .operate {
    margin-left: 8px;
    display: flex;
    .el-button {
      width: 50px;
      color: white;
      border-radius: 8px;
    }
    text {
      display: flex;
      align-items: center;
    }
    .more {
      font-size: 14px;
      cursor: pointer;
      margin: 0 8px 0 6px;
      transform: rotate(90deg);
      opacity: 0.8;
    }
  }
}
.filter {
  padding: 5px 10px 0;
  margin-bottom: 3px;
  border-radius: 8px;
  // background-color: rgb(239, 239, 239);
  user-select: none;
  .input {
    flex: 1;
    margin: 10px 5px 5px;
    padding: 2.5px;
    min-width: 270px;
    background-color: #005187;
    box-shadow: 0 0 2px #7e9fcb;
    border-radius: 8px;
    display: flex;
    .icon-holder {
      flex-grow: 0;
      flex-shrink: 0;
      width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      * {
        transform: scale(1.1);
      }
    }
  }
  &-item {
    margin: 5px 3px;
    padding: 2.3px;
    background-color: #005187;
    box-shadow: 0 0 2px #7e9fcb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    text {
      font-size: 14px;
      margin: 0 4px 0 8px;
      color: white;
    }
  }
  .batch {
    margin: 3px;
    border-radius: 6px;
    .btn {
      height: 38px;
    }
    text {
      font-size: 14px;
      margin: 0 4px 0 8px;
      color: white;
    }
  }
}
.filter-btn {
  width: 110px;
  height: 37px;
  background-color: #005187;
  box-shadow: 1px 1px 2px rgba(125, 159, 204, 0.5);
  margin: 5px 5px 0;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  .icon {
    margin-right: 5px;
    font-size: 16px;
  }
}
.pagination {
  display: flex;
  justify-content: center;
  position: relative;
  margin: 15px 0 10px;
}
.top {
  background-image: linear-gradient(to right bottom, #ef6947, #cf4624);
  box-shadow: 0 0 1px #cf4624;
  opacity: 0.8;
}
.recommend {
  background-image: linear-gradient(to right bottom, #e9aa22, #eb8d2e);
  box-shadow: 0 0 1px #eb8d2e;
  opacity: 0.8;
}
.theme {
  background-image: linear-gradient(to right bottom, #4096e3, #3b60ec);
  box-shadow: 0 0 1px #3b60ec;
  opacity: 0.8;
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
  .post {
    .fav,
    .like,
    .comment {
      display: none;
    }
  }
  .filter-btn {
    transform: scale(0.9) translateX(-5.5px);
    margin-right: -5.5px;
  }

  .filter-item {
    transform: scale(0.9);
  }
}
@media all and (max-width: 370px) {
  .pt {
    display: none;
  }
}
</style>
<style lang="less">
.filter {
  .el-input__inner {
    border-radius: 6px;
  }
}
.el-pager {
  .is-active {
    background: #005187 !important;
  }
}
</style>
