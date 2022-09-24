<template>
  <div class="page">
    <div class="filter" ref="filter">
      <div class="input">
        <el-input
          v-model="posts_query.query.content"
          placeholder="搜索帖子 | #MPid"
          :clearable="true"
          @keyup.enter="showPosts"
        />
        <div class="icon-holder" @click="() => showPosts()">
          <el-icon><Search color="#ffffff" /></el-icon>
        </div>
      </div>
      <div style="display: flex" class="btns">
        <el-popover placement="right" :width="180" v-model:visible="visible">
          <template #reference>
            <button
              @click="visible = !visible"
              class="filter-btn btn-ori modify"
              style="width: auto; padding: 0 13px 0 7px"
              v-if="!(shrinkPager && is_batch)"
            >
              <el-icon class="icon"><Filter color="#ffffff" /></el-icon>
              {{ visible ? "隐藏" : "筛选条件" }}
            </button>
          </template>
          <div style="display: flex; flex-wrap: wrap">
            <div class="filter-item">
              <text>分区 :</text>
              <el-select
                v-model="posts_query.query.type"
                style="width: 115px"
                @change="filterHandler"
              >
                <el-option
                  v-for="_type in GlobalData.postTypes"
                  :label="_type.name"
                  :value="_type.id"
                />
              </el-select>
            </div>
            <div class="filter-item" v-if="posts_query.query.type === 1">
              <text>部门 :</text>
              <el-select
                v-model="posts_query.query.department_id"
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
            <div class="filter-item" v-if="posts_query.query.type === 1">
              <text>状态 :</text>
              <el-select
                v-model="posts_query.query.solved"
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
                v-model="posts_query.query.etag"
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
        <button
          class="filter-btn btn-ori modify"
          style="width: auto; padding: 0 13px 0 7px"
          @click="is_batch = true"
          v-if="!is_batch && !posts_query.query.is_deleted"
        >
          <el-icon class="icon"><CopyDocument color="#ffffff" /></el-icon
          >批量操作
        </button>
        <div style="flex: 1" v-if="!(shrinkPager && is_batch)"></div>
        <button
          class="filter-btn btn-ori"
          style="width: auto; padding: 0 10px"
          v-if="is_batch"
        >
          <el-checkbox
            v-model="checkPage"
            :indeterminate="is_uncertain"
            @change="handleCheckPage"
            >全选页</el-checkbox
          >
        </button>

        <el-popconfirm
          :title="`确认删除这${batchList.length}个帖子？`"
          @confirm="dialog(_post, '删除原因')"
          :icon="InfoFilled"
          icon-color="#626AEF"
        >
          <template #reference>
            <button
              class="filter-btn btn-ori"
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
          class="filter-btn btn-ori"
          style="width: auto; padding: 0 10px; color: #005187"
          :style="{
            cursor: batchList.length == 0 ? 'not-allowed' : 'pointer',
          }"
          :disabled="batchList.length == 0"
          @click="batchTrans_start"
          v-if="is_batch"
        >
          <el-icon style="margin-right: 3px"><Switch /></el-icon>
          移动
        </button>
        <button
          class="filter-btn btn-ori"
          style="width: auto; padding: 0 15px"
          @click="cancelBatch"
          v-if="is_batch"
        >
          取消
        </button>
      </div>
    </div>
    <div
      :style="{ height: `${scrollbarHeight}px` }"
      style="z-index: 2 !important"
      v-loading.lock="showLoad"
    >
      <el-scrollbar v-show="posts.length">
        <div
          v-for="post in posts"
          :key="post.id"
          :class="['post', post.is_deleted ? 'is-deleted' : '']"
          @click="detail(post.id)"
        >
          <div style="cursor: pointer">
            <div class="title">
              <div class="ellipsis">
                <text>{{ post.title }}</text>
              </div>
              <div :class="['etag', post.e_tag]" v-if="post.e_tag">
                <text>{{
                  post.e_tag == "recommend"
                    ? "精"
                    : post.e_tag == "theme"
                    ? "活动"
                    : "顶"
                }}</text>
              </div>
            </div>
            <div class="date">
              <text>{{ post.created_at }}</text>
              <text class="pt">#{{ postType(post.type) }}</text>
            </div>
          </div>
          <div style="flex: 1; cursor: pointer"></div>
          <div class="fav">
            <el-icon :size="16"><Star /></el-icon>
            <text>{{ post.fav_count }}</text>
          </div>
          <div class="like">
            <img src="../assets/likes.svg" alt="" /><text>{{
              post.like_count
            }}</text>
          </div>
          <div class="comment" v-if="post.commentable">
            <el-icon :size="16"><ChatLineRound /></el-icon>

            <text>{{ post.comment_count }}</text>
          </div>
          <div class="comment" v-else>
            <img src="../assets/forbid.svg" alt="" />
            <text class="forbid">{{ post.comment_count }}</text>
          </div>
          <div
            class="operate"
            style="margin-right: 6px"
            @click.stop="() => {}"
            v-if="is_batch"
          >
            <el-checkbox
              v-model="post.chosen"
              @change="(val: boolean) => handleBatch(val, post.id)"
            />
          </div>
          <div class="operate" @click.stop="() => {}" v-else>
            <button
              class="btn-ori"
              @click.stop="dialog(post, '标签')"
              v-if="!post.is_deleted"
            >
              <text style="color: #005187"
                ><img src="../assets/etag.svg" alt="" />标签</text
              >
            </button>
            <button
              class="btn-ori"
              @click.stop="dialog(post, '移动分区')"
              v-if="!post.is_deleted"
            >
              <text style="color: #005187"
                ><el-icon style="margin-right: 3px"><Switch /></el-icon
                >移动</text
              >
            </button>
            <div class="more">
              <el-dropdown trigger="click" :hide-on-click="false">
                <el-icon class="icon"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="diary(post.uid)"
                      >用户日志</el-dropdown-item
                    >

                    <el-dropdown-item divided v-if="!post.is_deleted">
                      <button
                        class="dropdown-btn"
                        @click="dialog(post, '删除原因')"
                      >
                        <text style="width: 100%; text-align: center"
                          >删除帖子</text
                        >
                      </button>
                    </el-dropdown-item>
                    <el-dropdown-item v-else>
                      <el-popconfirm
                        title="确认恢复该帖子？"
                        @confirm="
                          deleteHandler('post', post.is_deleted, post.id)
                        "
                        :icon="InfoFilled"
                        icon-color="#626AEF"
                      >
                        <template #reference>
                          <button class="dropdown-btn">
                            <text style="width: 100%; text-align: center"
                              >恢复帖子</text
                            >
                          </button>
                        </template>
                      </el-popconfirm>
                    </el-dropdown-item>
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
            layout="prev, pager, next"
            :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            :current-page.sync="posts_query.query.page"
            @update:current-page.sync="pageHandler"
            :total="posts_total"
            :hide-on-single-page="true"
            :small="shrinkPager"
            :pager-count="shrinkPager ? 5 : 7"
          />
        </div>
      </el-scrollbar>
      <div class="dataTip" v-show="!showLoad && !posts.length">
        <img src="../assets/void.svg" alt="~" />
        <div class="tip">--- 暂无相关数据 ---</div>
      </div>
    </div>
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
          <img
            src="../assets/etag-fill.svg"
            alt=""
            v-if="dialogTitle == '标签'"
          />
          <el-icon v-else-if="dialogTitle == '移动分区'"><Switch /></el-icon>
          <text style="margin-left: 10px">{{ dialogTitle }}</text>
        </h4>
      </div>
    </template>
    <div v-if="dialogTitle == '标签'" class="refine">
      <div class="holder" v-if="_post.e_tag">
        <div style="margin-left: 12px">当前模式：</div>
        <div style="margin-left: 12px">
          {{
            _post.e_tag == "top"
              ? "置顶帖"
              : _post.e_tag == "recommend"
              ? "加精帖"
              : _post.e_tag == "theme"
              ? "活动帖"
              : "null"
          }}
        </div>
      </div>
      <div class="holder" style="justify-content: center" v-else>
        <div>模式：</div>
        <el-radio-group v-model="refineMode">
          <el-radio :label="0">置顶</el-radio>
          <el-radio :label="1">加精</el-radio>
          <el-radio :label="2">活动</el-radio>
        </el-radio-group>
      </div>
      <div v-if="refineMode == 0" class="input">
        <div class="tip">请输入置顶权值，0~30000之内</div>
        <el-input
          v-model="_post.value"
          placeholder="权值 0~30000"
          @keyup.enter="refineHandler(_post.value)"
        />
      </div>
    </div>
    <div v-else-if="dialogTitle == '移动分区'" class="transfer">
      <text>移动到：</text>
      <el-select v-model="transferType" style="width: 120px">
        <el-option
          v-for="_type in GlobalData.postTypes.filter((type) => type.id != 0)"
          :label="_type.shortname"
          :value="_type.id"
          :disabled="_type.id == 1 || _type.id == _post.type"
        />
      </el-select>
    </div>
    <div v-else-if="dialogTitle == '删除原因'" class="delete">
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
      <span class="dialog-footer" v-if="dialogTitle == '标签'">
        <el-button
          @click="refineHandler('cancel')"
          v-if="_post.e_tag"
          style="border: 1px solid #dcdfe6"
          >撤出</el-button
        >
        <el-button
          @click="refineHandler(_post.value)"
          type="primary"
          v-if="!(_post.e_tag == 'recommend' || _post.e_tag == 'theme')"
          >确认</el-button
        >
      </span>
      <span class="dialog-footer" v-else-if="dialogTitle == '移动分区'">
        <el-button @click="transferHandler" type="primary">确认</el-button>
      </span>
      <span class="dialog-footer" v-else-if="dialogTitle == '删除原因'">
        <el-button @click="showDialog = false" style="border: 1px solid #dcdfe6"
          >取消</el-button
        >
        <el-button
          @click="
            is_batch
              ? batchDel()
              : deleteHandler('post', _post.is_deleted, _post.id)
          "
          type="primary"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getPosts,
  setTop,
  setEtag,
  transferPost,
  deletePost,
  recoverPost,
} from "@/api/api";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { timeFromNow } from "@/utils/time";
import { Post, Posts_query, useGlobalData, usePost } from "@/store";
import {
  Search,
  Star,
  ChatLineRound,
  Switch,
  MoreFilled,
  Filter,
  CopyDocument,
  InfoFilled,
  Delete,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const GlobalData = useGlobalData();
var posts = reactive<Post[]>([]);
var _post = ref<Post>({
  id: 0,
  created_at: "",
  uid: 0,
  type: 0,
  campus: 0,
  solved: 0,
  title: "",
  content: "",
  nickname: "",
  user_info: {
    avatar: "",
    level: 0,
    cur_level_point: 0,
    next_level_point: 0,
  },
  fav_count: 0,
  like_count: 0,
  rating: 0,
  value: 0,
  e_tag: "",
  tag: null,
  floors: null,
  comment_count: 0,
  image_urls: [],
  department: null,
  commentable: true,
  is_deleted: false,
  chosen: false,
});
var posts_total = ref<number>(0);
var posts_query = reactive({
  query: <Posts_query>{
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
  },
});
var sort_mode = ref<number>(0);
var status = ref<number>(0);
var showLoad = ref<boolean>(false);

var is_batch = ref<boolean>(false);
var batchList = ref<number[]>([]);

function showPosts(info?: string) {
  showLoad.value = true;
  let str = posts_query.query.content?.trim() as string;
  let is_search_by_id = str.split("")[0] === "#";
  if (is_search_by_id) {
    posts_query.query.content = "";
    let post_id = parseInt(str.split("#MP")[1]);
    detail(post_id);
    showLoad.value = false;
  } else
    getPosts(posts_query.query).then((res: any) => {
      if (info !== "loadmore") posts.length = 0;
      posts_total.value = res.total;
      res.list.forEach((post: Post) => {
        let created_at = timeFromNow(post.created_at);
        let chosen = batchList.value.indexOf(post.id) != -1;
        posts.push({ ...post, created_at, chosen });
      });
      showLoad.value = false;
    });
}
var filter = ref<HTMLElement>();
var visible = ref<boolean>(false);
var scrollbarHeight = ref<number>(0);
function filterHandler() {
  posts_query.query.page = 1;
  if (posts_query.query.type !== 1) {
    posts_query.query.department_id = null;
    posts_query.query.solved = null;
  }
  if (is_batch.value) batchList.value = []; //批量操作过程中如果改变筛选条件，batchList应清空
  showPosts();
}
function sortHandler() {
  switch (sort_mode.value) {
    case 0:
      posts_query.query.search_mode = 1;
      posts_query.query.value_mode = 0;
      break;
    case 1:
      posts_query.query.search_mode = 1;
      posts_query.query.value_mode = 1;
      break;
    case 2:
      posts_query.query.search_mode = 0;
      posts_query.query.value_mode = 1;
      break;
  }
  filterHandler();
}
function statusHandler() {
  switch (status.value) {
    case 0:
      posts_query.query.commentable = null;
      posts_query.query.is_deleted = 0;
      break;
    case 1:
      posts_query.query.commentable = null;
      posts_query.query.is_deleted = 1;
      break;
    case 2:
      posts_query.query.commentable = 1;
      posts_query.query.is_deleted = 0;
      break;
    case 3:
      posts_query.query.commentable = 0;
      posts_query.query.is_deleted = 0;
      break;
  }
  filterHandler();
}
function pageHandler(page: number) {
  posts_query.query.page = page;
  showPosts();
}
function postType(type: number) {
  return GlobalData.postTypes.filter((pt) => pt.id === type)[0]?.shortname;
}

var showDialog = ref<boolean>(false);
var dialogTitle = ref<string>("");
var refineMode = ref<number | null>(0);
var transferType = ref<number | string>(0);
var customizedReason = ref<string>("");
var deleteReason = ref<string | null>("");

var checkPage = ref<boolean>(false);
function handleCheckPage(val: boolean) {
  if (!val)
    posts.forEach((post) => {
      post.chosen = false;
      let index = batchList.value?.indexOf(post.id) as number;
      if (index != -1) batchList.value?.splice(index, 1);
    });
  else
    posts.forEach((post) => {
      post.chosen = true;
      let index = batchList.value?.indexOf(post.id) as number;
      if (index == -1) batchList.value?.push(post.id);
    });
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
  posts.forEach((post) => (post.chosen = false));
}
function batchDel() {
  //if (batchList.value.length == 0) ElMessage.warning("尚未勾选条目！");
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
    dialogClose();
  }
}
function batchTrans_start() {
  dialogTitle.value = "移动分区";
  transferType.value = "*";
  showDialog.value = true;
}

function dialog(post: Post, title: string) {
  _post.value = post;
  dialogTitle.value = title;
  if (title == "标签")
    refineMode.value =
      post.e_tag == "top"
        ? 0
        : post.e_tag == "recommend"
        ? 1
        : post.e_tag == "theme"
        ? 2
        : null;
  else if (title == "移动分区") transferType.value = post.type;
  else if (title == "删除原因") deleteReason.value = null;
  showDialog.value = true;
}
function dialogClose() {
  showDialog.value = false;
  setTimeout(() => {
    filterHandler();
  }, 200);
}
function refineHandler(value: number | string) {
  if (refineMode.value === null) ElMessage.warning("请先选择模式！");
  else {
    if (refineMode.value === 0)
      setTop({
        post_id: _post.value.id,
        value: value == "cancel" ? 0 : value,
      }).then(() => dialogClose());
    else
      setEtag({
        post_id: _post.value.id,
        value: value == "cancel" ? 0 : refineMode.value,
      }).then(() => dialogClose());
  }
}
function transferHandler() {
  if (!is_batch.value) {
    if (transferType.value == _post.value.type)
      ElMessage.warning("帖子分区未改变！");
    else
      transferPost({
        post_id: _post.value.id,
        new_type_id: transferType.value,
      }).then(() => dialogClose());
  } else {
    let i,
      flag = false;
    for (i = batchList.value.length - 1; i >= 0; i--) {
      transferPost({
        post_id: batchList.value[i],
        new_type_id: transferType.value,
      });
      if (i == 0) {
        ElMessage.success("批量移动成功！");
        flag = true;
      }
    }
    if (!flag) ElMessage.error("批量移动失败，请稍后重试");
    batchList.value = [];
    is_batch.value = false;
    dialogClose();
  }
}
function chooseCustom() {
  deleteReason.value = customizedReason.value;
}
function deleteHandler(type: string, is_deleted: boolean, itemId: number) {
  if (type == "post") {
    if (!is_deleted) {
      if (deleteReason.value == null) ElMessage.warning("请选择一个删除原因！");
      else if (!deleteReason.value.length)
        ElMessage.warning("自定义原因不能为空！");
      else
        deletePost({ id: itemId, reason: deleteReason.value }).then(() =>
          dialogClose()
        );
    } else
      recoverPost({
        post_id: itemId,
      }).then(() => dialogClose());
  }
}
function diary(uid: number) {
  router.push({
    path: "/diary",
    query: { uid },
  });
}

const postParam = usePost();
function detail(post_id: number) {
  if (is_batch.value) return;
  else {
    postParam.$patch((state) => {
      state.posts_query = posts_query.query;
    });
    router.push({ path: "/detail", query: { id: post_id } });
  }
}

function adjustScrollHeight() {
  setTimeout(() => {
    let filterHeight = filter.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - filterHeight - 55;
  }, 50);
}
onMounted(() => {
  adjustScrollHeight();
  let ql = Object.keys(postParam.posts_query).length;
  if (ql) {
    posts_query.query = postParam.posts_query as Posts_query;
    postParam.$patch((state) => {
      state.posts_query = {};
    });
    sort_mode.value =
      posts_query.query.search_mode == 1 && posts_query.query.value_mode == 0
        ? 0
        : posts_query.query.search_mode == 1 &&
          posts_query.query.value_mode == 1
        ? 1
        : 2;
    status.value =
      posts_query.query.commentable == null && posts_query.query.is_deleted == 0
        ? 0
        : posts_query.query.commentable == null &&
          posts_query.query.is_deleted == 1
        ? 1
        : posts_query.query.commentable == 1 &&
          posts_query.query.is_deleted == 0
        ? 2
        : 3;
    showPosts();
  } else showPosts();
});
var is_uncertain = computed(() => {
  let flag = posts.length;
  if (flag) {
    posts.forEach((post) => {
      if (batchList.value?.indexOf(post.id) == -1) flag--;
    });
    checkPage.value = flag == posts.length;
    return flag > 0 && flag < posts.length;
  } else return false;
});
var shrinkPager = computed(() => {
  return GlobalData.width < 500;
});
window.addEventListener("resize", () => adjustScrollHeight());
</script>

<style lang="less" scoped>
.post {
  border-top: 1px dashed hwb(222 92% 4%);
  margin: 0px 15px;
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
      padding: 0 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
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
    margin: 0 12px;
    color: #005187;
    font-size: 14px;
    transform: scale(1);
    img {
      width: 16px;
    }
    text {
      margin: 0 4px;
      color: black;
    }
    .forbid {
      color: red;
    }
  }
  .comment {
    margin-right: 15px;
  }
  .operate {
    margin-left: 6px;
    display: flex;
    align-items: center;
    height: 40px;
    transition: all ease-in-out 0.3s;
    img {
      width: 14px;
      margin-right: 3px;
    }
    button {
      width: 54px;
      height: inherit;
      border-radius: 7px;
      background-color: transparent;
      padding: 0;
      margin: 0 7px;
    }
    text {
      display: flex;
      align-items: center;
    }
    .more {
      width: 14px;
      height: 14px;
      cursor: pointer;
      margin: 0 6px;
      opacity: 0.8;
      .icon {
        font-size: 14px;
        transform: rotate(90deg);
      }
    }
  }
}
.filter {
  padding: 15px 10px 5px;
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
  width: 100px;
  height: 37px;
  box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
  background-color: #f4f4f5;
  margin: 5px 5px;
  border-radius: 8px;
  font-size: 14px;
  .icon {
    font-size: 16px;
    margin: 0 5px;
  }
}
.dropdown-btn {
  width: 100%;
  height: 100%;
  padding: 0;
  text-align: center;
  font-size: 14px;
  color: #606266;
  border: none;
  outline: none;
  background-color: transparent;
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
.refine {
  .holder {
    display: flex;
    align-items: center;
  }
  .input {
    margin: 10px 10px 6px;
    .tip {
      margin: 20px 0 15px 0;
      color: grey;
    }
  }
}
.transfer {
  margin: 20px 0;
  display: flex;
  align-items: center;
  text {
    margin: 0 30px 0 20px;
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
.pagination {
  display: flex;
  justify-content: center;
  position: relative;
  margin: 15px 10px 10px 0;
}
.dataTip {
  width: 100%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  user-select: none;
  img {
    width: 160px;
    margin: auto;
  }
  .tip {
    margin: auto;
    margin-top: 30px;
    font-size: 14px;
    letter-spacing: 0.5px;
  }
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
.btn-ori {
  font-size: 14px;
  color: #606266;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.modify {
  color: white;
  background-color: #005187;
}
.ellipsis {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.is-deleted {
  text {
    text-decoration: line-through;
    color: rgb(99, 99, 99);
  }
}
@media all and (max-width: 960px) {
  .post {
    .fav,
    .like,
    .comment {
      margin: 0 5px;
    }
    .operate {
      button {
        margin: 0;
      }
    }
  }
}
@media all and (max-width: 500px) {
  .post {
    .fav,
    .like,
    .comment {
      display: none;
    }
  }
  .post {
    margin: 0px 10px;
  }
  .filter {
    .input {
      height: 33.3px;
    }
    .icon-holder {
      width: 45px !important;
    }
  }
  .filter-btn {
    transform: scale(0.9) translateX(-5%);
    margin-right: -5px;
  }
  .filter-btn:last-child {
    margin-right: 0;
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
    border-radius: 8px;
    box-shadow: none !important;
    background-color: #f4f4f5;
    height: inherit !important;
  }
}
.post {
  .el-checkbox__inner {
    border: 1px solid #dcdfe6;
  }
}
.btns {
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
