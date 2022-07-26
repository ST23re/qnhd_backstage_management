<template>
  <div class="page">
    <div class="filter" style="display: flex" v-if="!shrinkPager">
      <button
        class="filter-btn btn-ori"
        style="width: auto; padding: 0 10px"
        @click="filter.sort == 0 ? (filter.sort = 1) : (filter.sort = 0)"
      >
        <text :class="{ white: filter.sort == 0 }">次数最多</text>
        <text style="width: 20px"></text>
        <text :class="{ white: filter.sort == 1 }">时间最近</text>
        <div
          class="decro"
          :style="{ left: filter.sort == 0 ? '0' : '50%' }"
        ></div>
      </button>
      <button
        class="filter-btn btn-ori"
        style="width: auto; padding: 0 10px"
        @click="filter.solved == 1 ? (filter.solved = 2) : (filter.solved = 1)"
      >
        <text :class="{ white: filter.solved == 1 }">未处理</text>
        <text style="width: 20px"></text>
        <text :class="{ white: filter.solved == 2 }">已处理</text>
        <div
          class="decro"
          :style="{ left: filter.solved == 1 ? '0' : '50%' }"
        ></div>
      </button>
      <div class="input">
        <el-input
          v-model="keyWord"
          placeholder="搜索举报内容"
          :clearable="true"
          @keyup.enter="filter.content = keyWord"
        />
        <div class="icon-holder" @click="filter.content = keyWord">
          <el-icon><Search color="#ffffff" /></el-icon>
        </div>
      </div>
      <button
        class="filter-btn btn-ori adjust"
        style="width: auto; padding: 0 13px 0 7px"
        @click="is_batch = true"
        v-if="!is_batch && filter.solved != 2"
      >
        <el-icon class="icon"><CopyDocument color="#ffffff" /></el-icon>
        批量操作
      </button>
      <button
        class="filter-btn btn-ori"
        style="width: auto; padding: 0 10px"
        v-if="is_batch"
      >
        <el-checkbox
          v-model="checkPage"
          @change="handleCheckPage"
          :indeterminate="is_uncertain"
          >全选页</el-checkbox
        >
      </button>
      <el-popconfirm
        :title="`确认将这${batchList.length}个举报对应内容删除？`"
        @confirm="dialog('删除原因', null)"
        :icon="InfoFilled"
        icon-color="#626AEF"
      >
        <template #reference>
          <button
            class="filter-btn btn-ori"
            style="color: #f56c6c; width: auto; padding: 0 10px"
            :style="{
              cursor: batchList.length == 0 ? 'not-allowed' : 'pointer',
            }"
            :disabled="batchList.length == 0"
            v-if="is_batch"
          >
            <el-icon style="margin-right: 3px"
              ><Delete color="#f56c6c"
            /></el-icon>
            删除内容
          </button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        :title="`确认将这${batchList.length}个举报置为已处理？`"
        @confirm="batchSolveReports"
        :icon="InfoFilled"
        icon-color="#626AEF"
      >
        <template #reference>
          <button
            class="filter-btn btn-ori"
            style="color: #005187; width: auto; padding: 0 10px"
            :style="{
              cursor: batchList.length == 0 ? 'not-allowed' : 'pointer',
            }"
            :disabled="batchList.length == 0"
            v-if="is_batch && filter.solved == 1"
          >
            <img
              style="width: 16px; margin-right: 3px"
              src="../assets/report_solved.svg"
              alt=""
            />
            置为已处理
          </button>
        </template>
      </el-popconfirm>
      <button
        class="filter-btn btn-ori"
        style="width: auto; padding: 0 10px"
        @click="cancelBatch"
        v-if="is_batch"
      >
        取消
      </button>
    </div>
    <div class="filter" style="display: block" v-else>
      <div class="input">
        <el-input
          v-model="keyWord"
          placeholder="搜索举报内容"
          :clearable="true"
          @keyup.enter="filter.content = keyWord"
        />
        <div class="icon-holder" @click="filter.content = keyWord">
          <el-icon><Search color="#ffffff" /></el-icon>
        </div>
      </div>
      <div style="display: flex">
        <button
          class="filter-btn btn-ori"
          style="width: auto; padding: 0 10px"
          @click="filter.sort == 0 ? (filter.sort = 1) : (filter.sort = 0)"
          v-if="!is_batch"
        >
          <text :class="{ white: filter.sort == 0 }">次数多</text>
          <text style="width: 18px"></text>
          <text :class="{ white: filter.sort == 1 }">时间近</text>
          <div
            class="decro"
            :style="{ left: filter.sort == 0 ? '0' : '50%' }"
          ></div>
        </button>
        <button
          class="filter-btn btn-ori"
          style="width: auto; padding: 0 10px"
          @click="
            filter.solved == 1 ? (filter.solved = 2) : (filter.solved = 1)
          "
          v-if="!is_batch"
        >
          <text :class="{ white: filter.solved == 1 }">未处理</text>
          <text style="width: 18px"></text>
          <text :class="{ white: filter.solved == 2 }">已处理</text>
          <div
            class="decro"
            :style="{ left: filter.solved == 1 ? '0' : '50%' }"
          ></div>
        </button>
        <div style="flex: 1"></div>
        <button
          class="filter-btn btn-ori adjust"
          style="width: auto; padding-right: 12px"
          @click="is_batch = true"
          v-if="!is_batch && filter.solved != 2"
        >
          <el-icon class="icon"><CopyDocument color="#ffffff" /></el-icon>
          批量
        </button>
        <button
          class="filter-btn btn-ori"
          style="width: auto; padding: 0 10px"
          v-if="is_batch"
        >
          <el-checkbox
            v-model="checkPage"
            @change="handleCheckPage"
            :indeterminate="is_uncertain"
            >全选页</el-checkbox
          >
        </button>
        <el-popconfirm
          :title="`确认将这${batchList.length}个举报对应内容删除？`"
          @confirm="dialog('删除原因', null)"
          :icon="InfoFilled"
          icon-color="#626AEF"
        >
          <template #reference>
            <button
              class="filter-btn btn-ori"
              style="color: #f56c6c; width: auto; padding: 0 10px"
              :style="{
                cursor: batchList.length == 0 ? 'not-allowed' : 'pointer',
              }"
              :disabled="batchList.length == 0"
              v-if="is_batch"
            >
              <el-icon style="margin-right: 3px"
                ><Delete color="#f56c6c"
              /></el-icon>
              删除内容
            </button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          :title="`确认将这${batchList.length}个举报置为已处理？`"
          @confirm="batchSolveReports"
          :icon="InfoFilled"
          icon-color="#626AEF"
        >
          <template #reference>
            <button
              class="filter-btn btn-ori"
              style="color: #005187; width: auto; padding: 0 10px"
              :style="{
                cursor: batchList.length == 0 ? 'not-allowed' : 'pointer',
              }"
              :disabled="batchList.length == 0"
              v-if="is_batch && filter.solved == 1"
            >
              <img
                style="width: 16px; margin-right: 3px"
                src="../assets/report_solved.svg"
                alt=""
              />
              已处理
            </button>
          </template>
        </el-popconfirm>
        <button
          class="filter-btn btn-ori"
          style="width: auto; padding: 0 12px"
          @click="cancelBatch"
          v-if="is_batch"
        >
          取消
        </button>
      </div>
    </div>

    <div class="list" v-if="!shrinkPager">
      <div class="bar">
        <div style="flex: 3">次数</div>
        <div style="flex: 18">内容性质</div>
        <div style="flex: 6">最近举报于</div>
        <div style="flex: 22">举报原因</div>
        <div style="flex: 6">操作</div>
      </div>
      <div style="height: 3px; width: 100%" v-if="showLoad"></div>
      <div
        style="height: calc(100vh - 162px); z-index: 2 !important"
        v-loading.lock="showLoad"
      >
        <el-scrollbar style="height: 100%" v-show="reportsFiltered.list.length">
          <div
            v-for="report in reportsFiltered.list"
            :key="report.type == 1 ? report.post_id : report.floor_id"
            class="report"
            @click="detail(report)"
          >
            <div class="times" style="flex: 3">
              <div class="holder">
                {{ report.times }}
              </div>
            </div>
            <div class="nature" style="flex: 18">
              <div class="abstract ellipsis-2">{{ report.abstract }}</div>
              <div style="display: flex; align-items: center">
                <div class="type">
                  {{ report.type == 1 ? "帖子" : "评论" }}
                </div>
                <div :class="['status', report.is_deleted ? 'red' : 'green']">
                  <img
                    :src="
                      report.is_deleted
                        ? getImgSrc('point_red.svg')
                        : getImgSrc('point_green.svg')
                    "
                    alt="·"
                  />
                  {{ report.is_deleted ? "已删除" : "未删除" }}
                </div>
                <div
                  :class="['status', report.commentable ? 'green' : 'red']"
                  v-if="!report.is_deleted"
                >
                  <img
                    :src="
                      report.commentable
                        ? getImgSrc('point_green.svg')
                        : getImgSrc('point_red.svg')
                    "
                    alt="·"
                  />
                  {{ report.commentable ? "可评论" : "禁评论" }}
                </div>
              </div>
            </div>
            <div class="updated" style="flex: 6">
              {{ report.updated_at }}
            </div>
            <div
              class="reasons"
              style="flex: 22"
              @click.stop="
                report.reasons.length > 3
                  ? dialog('举报原因', report)
                  : detail(report)
              "
            >
              <div class="ellipsis-3">
                <div
                  v-for="(item, index) in report.reasons"
                  :key="`${index}.${item.reporter_uid}`"
                  class="reason"
                >
                  <text>{{ item.reason }}</text>
                  <text>uid: {{ item.reporter_uid }}</text>
                </div>
              </div>
              <button
                class="btn-ori"
                style="color: #005187; background-color: transparent"
                v-if="report.reasons.length > 3"
              >
                查看全部
              </button>
            </div>
            <div
              class="operate"
              style="flex: 6; flex-direction: column"
              @click.stop="() => {}"
              v-if="!is_batch"
            >
              <div v-if="!report.is_deleted">
                <el-popconfirm
                  :title="`确认删除对应${report.type == 1 ? '帖子' : '评论'}?`"
                  @confirm="dialog('删除原因', report)"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                >
                  <template #reference>
                    <button
                      class="filter-btn btn-ori modify"
                      style="color: #f56c6c"
                    >
                      <el-icon style="margin-right: 3px; font-size: 16px"
                        ><Delete color="#f56c6c"
                      /></el-icon>
                      {{ `删${report.type == 1 ? "帖子" : "评论"}` }}
                    </button>
                  </template>
                </el-popconfirm>
              </div>
              <div class="unsolved" v-if="!report.solved">
                <el-popconfirm
                  title="确认将该举报置为已处理？"
                  @confirm="
                    solveHandler(
                      report.type,
                      report.type == 1 ? report.post_id : report.floor_id
                    )
                  "
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                >
                  <template #reference>
                    <button class="filter-btn btn-ori modify">
                      <img
                        style="width: 16px; margin-right: 3px"
                        src="../assets/report_solved.svg"
                        alt=""
                      />
                      已处理
                    </button>
                  </template>
                </el-popconfirm>
              </div>
              <div class="solved" v-else>
                <img src="../assets/report_solved_bg.svg" alt="" />
              </div>
            </div>
            <div class="operate" style="flex: 6" @click.stop="() => {}" v-else>
              <el-checkbox
                v-model="report.chosen"
                @change="(val: boolean) => handleBatch(val, report.type, report.type == 1 ? report.post_id : report.floor_id)"
              />
            </div>
          </div>
          <div class="pagination">
            <div style="flex: 1" />
            <div class="total" v-if="_reports.list.length > 10">
              共计: {{ _reports.list.length }}条
            </div>

            <el-pagination
              background
              layout="prev, pager, next"
              :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              :current-page.sync="page"
              @update:current-page.sync="pageHandler"
              :total="_reports.list.length"
              :hide-on-single-page="true"
              :small="shrinkPager"
              :pager-count="shrinkPager ? 5 : 7"
            />
          </div>
        </el-scrollbar>
        <div class="dataTip" v-show="!showLoad && !reportsFiltered.list.length">
          <img src="../assets/void.svg" alt="~" />
          <div class="tip">--- 暂无相关数据 ---</div>
        </div>
      </div>
    </div>
    <div class="list" v-else>
      <div
        style="height: calc(100vh - 159px); z-index: 2 !important"
        v-loading.lock="showLoad"
      >
        <el-scrollbar style="height: 100%" v-show="reportsFiltered.list.length">
          <div
            v-for="report in reportsFiltered.list"
            :key="report.type == 1 ? report.post_id : report.floor_id"
            class="report_shrink"
            @click="detail(report)"
          >
            <div class="holder">
              {{ report.times }}
            </div>

            <div class="abstract">
              <div class="title">摘要：</div>
              <div class="ellipsis-2">{{ report.abstract }}</div>
            </div>

            <div class="status" style="display: flex; align-items: center">
              <div class="title">性质：</div>
              <div class="type">
                {{ report.type == 1 ? "帖子" : "评论" }}
              </div>
              <div :class="['status', report.is_deleted ? 'red' : 'green']">
                <img
                  :src="
                    report.is_deleted
                      ? getImgSrc('point_red.svg')
                      : getImgSrc('point_green.svg')
                  "
                  alt="·"
                />
                {{ report.is_deleted ? "已删除" : "未删除" }}
              </div>
              <div
                :class="['status', report.commentable ? 'green' : 'red']"
                v-if="!report.is_deleted"
              >
                <img
                  :src="
                    report.commentable
                      ? getImgSrc('point_green.svg')
                      : getImgSrc('point_red.svg')
                  "
                  alt="·"
                />
                {{ report.commentable ? "可评论" : "禁评论" }}
              </div>
            </div>
            <div class="updated">
              <div class="title">更新：</div>
              <div>{{ report.updated_at }}</div>
            </div>
            <div class="reasons">
              <div class="title">原因：</div>
              <div>
                <div class="ellipsis-3">
                  <div
                    v-for="(item, index) in report.reasons"
                    :key="`${index}.${item.reporter_uid}`"
                    class="reason"
                  >
                    <text>{{ item.reason }}</text>
                    <text>uid: {{ item.reporter_uid }}</text>
                  </div>
                </div>
                <button
                  class="btn-ori"
                  style="
                    color: #005187;
                    background-color: transparent;
                    padding: 0 10px;
                    transform: translateX(-10px);
                  "
                  @click.stop="dialog('举报原因', report)"
                  v-if="report.reasons.length > 3"
                >
                  查看全部
                </button>
              </div>
            </div>
            <div class="operate" @click.stop="() => {}" v-if="!is_batch">
              <div style="flex: 1"></div>
              <div v-if="!report.is_deleted">
                <el-popconfirm
                  :title="`确认删除对应${report.type == 1 ? '帖子' : '评论'}?`"
                  @confirm="dialog('删除原因', report)"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                >
                  <template #reference>
                    <button
                      class="filter-btn btn-ori"
                      style="
                        color: #f56c6c;
                        background-color: transparent;
                        box-shadow: none;
                        width: auto;
                      "
                    >
                      <el-icon style="margin-right: 3px; font-size: 16px"
                        ><Delete color="#f56c6c"
                      /></el-icon>
                      {{ `删除${report.type == 1 ? "帖子" : "评论"}` }}
                    </button>
                  </template>
                </el-popconfirm>
              </div>

              <div class="unsolved" v-if="!report.solved">
                <el-popconfirm
                  title="确认将该举报置为已处理？"
                  @confirm="
                    solveHandler(
                      report.type,
                      report.type == 1 ? report.post_id : report.floor_id
                    )
                  "
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                >
                  <template #reference>
                    <button
                      class="filter-btn btn-ori"
                      style="
                        background-color: transparent;
                        width: auto;
                        box-shadow: none;
                      "
                    >
                      <img
                        style="width: 16px; margin-right: 3px"
                        src="../assets/report_solved.svg"
                        alt=""
                      />
                      已处理
                    </button>
                  </template>
                </el-popconfirm>
              </div>
              <div class="solved" v-else>
                <img src="../assets/report_solved_bg.svg" alt="" />
              </div>
            </div>
            <div class="operate" @click.stop="() => {}" v-else>
              <div style="flex: 1"></div>
              <el-checkbox
                v-model="report.chosen"
                @change="(val: boolean) => handleBatch(val, report.type, report.type == 1 ? report.post_id : report.floor_id)"
                >勾选</el-checkbox
              >
            </div>
          </div>
          <div class="pagination">
            <div
              class="total"
              style="padding: 0 0 0 15px"
              v-if="_reports.list.length > 10"
            >
              共计: {{ _reports.list.length }}条
            </div>
            <div style="flex: 1" />
            <el-pagination
              background
              layout="prev, pager, next"
              :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              :current-page.sync="page"
              @update:current-page.sync="pageHandler"
              :total="_reports.list.length"
              :hide-on-single-page="true"
              :small="shrinkPager"
              :pager-count="shrinkPager ? 5 : 7"
            />
          </div>
        </el-scrollbar>
        <div class="dataTip" v-show="!showLoad && !reportsFiltered.list.length">
          <img src="../assets/void.svg" alt="~" />
          <div class="tip">--- 暂无相关数据 ---</div>
        </div>
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
          <text>{{ dialogTitle }}</text>
        </h4>
      </div>
    </template>
    <div class="reasons-all" v-if="dialogTitle == '举报原因'">
      <div v-for="item in _report?.reasons" class="holder">
        <div v-for="(l, i) in item.reason.split('')" :key="i">{{ l }}</div>
        <div class="info">uid: {{ item.reporter_uid }}</div>
      </div>
    </div>
    <div v-else-if="dialogTitle == '删除原因'" class="delete">
      <el-radio-group v-model="deleteReason">
        <el-radio v-for="reason in GlobalData.reasons" :label="reason" />
      </el-radio-group>
    </div>
    <template #footer>
      <span class="dialog-footer" v-if="dialogTitle == '删除原因'">
        <el-button @click="showDialog = false" style="border: 1px solid #dcdfe6"
          >取消</el-button
        >
        <el-button
          @click="is_batch ? batchDeleteConts() : deleteHandler()"
          type="primary"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { getReports, solveReport, deletePost, deleteFloor } from "@/api/api";
import { useRouter } from "vue-router";
import { useGlobalData, usePost, Reports_query } from "@/store";
import { timeFromNow, cTime } from "@/utils/time";
import {
  Search,
  CopyDocument,
  InfoFilled,
  Delete,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const GlobalData = useGlobalData();
const postParam = usePost();
type Reason = {
  reason: string;
  reporter_uid: number;
};
type Report = {
  type: number;
  post_id: number;
  floor_id: number;
  abstract: string; //content
  sender_uid: number;
  is_deleted: boolean;
  commentable: boolean;
  solved: boolean;
  updated_at: string;
  date: number;
  times: number;
  reasons: Reason[];
  chosen: boolean;
};
type ReportsFilter = {
  sort: number;
  solved: number;
  content: string;
};
type BatchItem = {
  type: number;
  id: number;
};
const page_size: number = 500;
var page_for_rp = ref<number>(1);
var rp_finished = ref<boolean>(false);
var page_for_rf = ref<number>(1);
var rf_finished = ref<boolean>(false);
var keyWord = ref<string>("");
var page = ref<number>(1);
var filter = ref<ReportsFilter>({
  sort: 0, // 0 => times; 1 => date;
  solved: 1, // 0 => all; 1 => unsolved; 2 => solved;
  content: "",
});
var reports = reactive({
  list: <Report[]>[],
  total: <number>0,
});
var _reports = reactive({
  list: <Report[]>[],
});
var reportsFiltered = reactive({
  list: <Report[]>[],
});
var checkPage = ref<boolean>(false);
var is_batch = ref<boolean>(false);
var batchList = ref<BatchItem[]>([]);
var deleteReason = ref<string>("");
var showLoad = ref<boolean>(false);

onMounted(() => {
  let ql = Object.keys(postParam.reports_query).length;
  if (ql) {
    let obj = postParam.reports_query as Reports_query;
    let { sort, solved, content } = obj;
    filter.value.sort = sort;
    filter.value.solved = solved;
    filter.value.content = content;
    page.value = obj.page;
    postParam.$patch((state) => {
      state.reports_query = {};
    });
    showLoad.value = true;
    getReports_post();
    getReports_floor();
  } else {
    showLoad.value = true;
    getReports_post();
    getReports_floor();
  }
});

var is_uncertain = computed(() => {
  let flag = reportsFiltered.list.length;
  if (flag) {
    reportsFiltered.list.forEach((report) => {
      let item = createBatchItem(report);
      let index = getBatchItemIndex(item);
      if (index == -1) flag--;
    });
    checkPage.value = flag == reportsFiltered.list.length;
    return flag > 0 && flag < reportsFiltered.list.length;
  } else return false;
});
var shrinkPager = computed(() => {
  return GlobalData.width < 500;
});

watch([rp_finished, rf_finished], (newVal) => {
  if (newVal[0] && newVal[1]) filterHandler();
});

watch(filter.value, () => {
  showLoad.value = true;
  batchList.value = [];
  _reports.list = [];
  reportsFiltered.list = [];
  page.value = 1;
  filterHandler();
});

function refresh() {
  showLoad.value = true;
  page_for_rp.value = 1;
  page_for_rf.value = 1;
  page.value = 1;
  rp_finished.value = false;
  rf_finished.value = false;
  reports.list = [];
  reports.total = 0;
  getReports_post();
  getReports_floor();
}
function filterHandler() {
  let params = filter.value;
  switch (params.sort) {
    case 0:
      sortReports(reports.list, "times");
      break;
    case 1:
      sortReports(reports.list, "date");
      break;
  }
  switch (params.solved) {
    case 0:
      _reports.list = deep(
        reports.list.filter(
          (report) => report.abstract.indexOf(params.content) != -1
        )
      );
      break;
    case 1:
      _reports.list = deep(
        reports.list.filter(
          (report) =>
            !report.solved && report.abstract.indexOf(params.content) != -1
        )
      );
      break;
    case 2:
      _reports.list = deep(
        reports.list.filter(
          (report) =>
            report.solved && report.abstract.indexOf(params.content) != -1
        )
      );
      break;
  }
  getPageData();
}
function deep(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function getReports_post() {
  rp_finished.value = false;
  getReports({ type: 1, page: page_for_rp.value, page_size }).then(
    (res: any) => {
      for (let i = 0; i < res.list.length; i++) {
        let item = res.list[i];
        let lastReport = item.reports.slice(-1)[0];
        let { created_at, floor_id, post_id, solved, type } = lastReport;
        reports.list.push({
          type,
          post_id,
          floor_id,
          abstract: item.post.content,
          sender_uid: item.post.uid,
          is_deleted: item.post.is_deleted,
          commentable: item.post.commentable,
          solved,
          updated_at: timeFromNow(created_at),
          date: cTime(created_at),
          times: item.reports.length,
          reasons: getReasons(item.reports),
          chosen: false,
        });
        reports.total++;
      }
      if (res.total >= page_size) {
        page_for_rp.value++;
        getReports_post();
      } else rp_finished.value = true;
    }
  );
}
function getReports_floor() {
  rf_finished.value = false;
  getReports({ type: 2, page: page_for_rf.value, page_size }).then(
    (res: any) => {
      for (let i = 0; i < res.list.length; i++) {
        let item = res.list[i];
        let lastReport = item.reports.slice(-1)[0];
        let { created_at, floor_id, post_id, solved, type } = lastReport;
        reports.list.push({
          type,
          post_id,
          floor_id,
          abstract: item.floor.content,
          sender_uid: item.floor.uid,
          is_deleted: item.floor.is_deleted,
          commentable: item.floor.commentable,
          solved,
          updated_at: timeFromNow(created_at),
          date: cTime(created_at),
          times: item.reports.length,
          reasons: getReasons(item.reports),
          chosen: false,
        });
        reports.total++;
      }
      if (res.total >= page_size) {
        page_for_rf.value++;
        getReports_floor();
      } else rf_finished.value = true;
    }
  );
}
function getReasons(arr: any) {
  let reasons: Reason[] = [];
  arr.forEach((item: any) => {
    reasons.push({
      reason: item.reason,
      reporter_uid: item.uid,
    });
  });
  return reasons;
}
function getImgSrc(name: string) {
  const path = `/src/assets/${name}`;
  const modules = import.meta.globEager("/src/assets/*");
  return modules[path].default;
}
function sortReports(arr: any, key: string) {
  //从大到小
  return arr.sort(function (a: any, b: any) {
    var xx = a[key];
    var xy = b[key];
    return xx > xy ? -1 : xx < xy ? 1 : 0;
  });
}

function getPageData() {
  reportsFiltered.list = deep(
    _reports.list.filter(
      (report, index) =>
        index >= (page.value - 1) * 10 && index < page.value * 10
    )
  );
  showLoad.value = false;
}
function pageHandler(newPage: number) {
  page.value = newPage;
  getPageData();
  if (is_batch.value) {
    reportsFiltered.list.forEach((report) => {
      let item = createBatchItem(report);
      let index = getBatchItemIndex(item);
      if (index != -1) report.chosen = true;
    });
  }
}
function createBatchItem(report: Report) {
  return <BatchItem>{
    type: report.type,
    id: report.type == 1 ? report.post_id : report.floor_id,
  };
}
function getBatchItemIndex(item: BatchItem) {
  let index: number = -1;
  for (let i = 0; i < batchList.value.length; i++)
    if (
      batchList.value[i].type == item.type &&
      batchList.value[i].id == item.id
    )
      index = i;
  return index;
}
function handleCheckPage(val: boolean) {
  if (!val)
    reportsFiltered.list.forEach((report) => {
      report.chosen = false;
      let item = createBatchItem(report);
      let index = getBatchItemIndex(item);
      if (index != -1) batchList.value?.splice(index, 1);
    });
  else
    reportsFiltered.list.forEach((report) => {
      report.chosen = true;
      let item = createBatchItem(report);
      let index = getBatchItemIndex(item);
      if (index == -1) batchList.value?.push(item);
    });
}
function handleBatch(val: boolean, type: number, id: number) {
  let item: BatchItem = { type, id };
  if (!val) {
    let index = getBatchItemIndex(item);
    batchList.value?.splice(index, 1);
  } else batchList.value?.push(item);
  console.log(batchList.value);
}
function cancelBatch() {
  is_batch.value = false;
  batchList.value = [];
  reportsFiltered.list.forEach((report) => (report.chosen = false));
}

function solveHandler(type: number, id: number) {
  solveReport({ type, id }).then(() => refresh());
}
function batchSolveReports() {
  let i,
    flag = false;
  for (i = batchList.value.length - 1; i >= 0; i--) {
    solveReport(batchList.value[i]);
    if (i == 0) {
      ElMessage.success("批处理成功！");
      flag = true;
    }
  }
  if (!flag) ElMessage.error("批处理失败，请稍后重试");
  batchList.value = [];
  is_batch.value = false;
  refresh();
}
function deleteHandler() {
  if (!deleteReason.value.length) ElMessage.warning("请选择一个删除原因！");
  else {
    if (_report.value?.type == 1)
      deletePost({
        id: _report.value.post_id,
        reason: deleteReason.value,
      }).then(() => {
        showDialog.value = false;
        refresh();
      });
    else if (_report.value?.type == 2)
      deleteFloor({
        floor_id: _report.value.floor_id,
        reason: deleteReason.value,
      }).then(() => {
        showDialog.value = false;
        refresh();
      });
  }
}
function batchDeleteConts() {
  if (!deleteReason.value.length) ElMessage.warning("请选择一个删除原因！");
  else {
    let i,
      flag = false;
    for (i = batchList.value.length - 1; i >= 0; i--) {
      let item = batchList.value[i];
      if (item.type == 1)
        deletePost({ id: item.id, reason: deleteReason.value });
      else deleteFloor({ floor_id: item.id, reason: deleteReason.value });
      if (i == 0) {
        ElMessage.success("批量删除成功！");
        flag = true;
      }
    }
    if (!flag) ElMessage.error("批量删除失败，请稍后重试");
    batchList.value = [];
    is_batch.value = false;
    showDialog.value = false;
    refresh();
  }
}

var showDialog = ref<boolean>(false);
var dialogTitle = ref<string>("");
var _report = ref<any>({});
function dialog(title: string, obj: any) {
  _report.value = obj;
  dialogTitle.value = title;
  if (title == "删除原因") deleteReason.value = "";
  showDialog.value = true;
}

function detail(report: Report) {
  console.log(report);
  postParam.$patch((state) => {
    state.reports_query = { ...filter.value, page: page.value };
    state.prosecuted_post_id = report.post_id;
    state.prosecuted_floor_id = report.floor_id;
  });
  router.push({ path: "/detail", query: { id: report.post_id } });
}
</script>

<style lang="less" scoped>
.bar {
  display: flex;
  height: 37px;
  margin: 0 20px;
  align-items: center;
  text-align: center;
  background-color: #f4f4f5;
  // color: #005187;
  box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
  border-radius: 5px 5px 0 0;
  font-size: 15px;
  font-weight: bold;
}
.report {
  display: flex;
  margin: 0 15px;
  padding: 0 5px;
  .times,
  .nature,
  .updated,
  .reasons,
  .operate {
    font-size: 14px;
    padding: 10px 0;
    border: 1px solid #ebeef5;
  }
  .abstract {
    font-size: 16px;
    // font-weight: 600;
    margin-bottom: 8px;
  }
  .times,
  .updated,
  .operate {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .nature,
  .reasons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }
  .times {
    .holder {
      width: 20px;
      height: 20px;
      background-color: #f56c6c;
      border-radius: 50%;
      color: white;
      line-height: 20px;
      text-align: center;
    }
  }
  .nature,
  .updated,
  .reasons {
    padding: 10px;
  }
  .solved {
    img {
      width: 42px;
    }
  }
  .reasons {
    line-height: 25px;
    align-items: center;
    text-align: center;
    .reason {
      text:first-child {
        // font-weight: 600;
        margin-right: 10px;
      }
    }
  }
  .type {
    color: #005187;
    font-weight: bold;
  }
  .type,
  .status {
    margin-right: 8px;
  }
  .status {
    img {
      width: 10px;
      transform: scale(2);
    }
  }
}
.reasons-all {
  .holder {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    color: black;
    line-height: 25px;
    .info {
      margin-left: 10px;
      color: #989898;
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 15px 15px 20px 0;
  .total {
    padding: 0 10px;
  }
}
.filter {
  padding: 15px 15px 10px;
  box-sizing: border-box;
  border-radius: 8px;
  user-select: none;
  flex-wrap: wrap;
  .input {
    flex: 1;
    min-width: 100px;
    margin: 5px;
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
.filter-btn {
  width: 100px;
  height: 37px;
  box-shadow: 1px 1px 3px rgba(125, 159, 204, 0.5);
  background-color: #f4f4f5;
  margin: 5px 10px 5px 5px;
  border-radius: 8px;
  font-size: 14px;
  .icon {
    font-size: 16px;
    margin: 0 5px;
  }
}
.filter-btn:last-child {
  margin-right: 5px;
}
.btn-ori {
  font-size: 14px;
  color: #606266;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  cursor: pointer;
  text {
    transition: all 0.5s;
  }
}
.modify {
  width: 100%;
  margin: 0;
  padding: 1px 10px;
  color: #005187;
  background-color: transparent;
  box-shadow: none;
}
.adjust {
  color: white;
  background-color: #005187;
}
.decro {
  position: fixed;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: #005187;
  border-radius: 8px;
  transition: all 0.5s;
  z-index: -1;
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
.green {
  color: #67c23a;
}
.red {
  color: #f56c6c;
}
.white {
  color: white;
}
.ellipsis-2 {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.ellipsis-3 {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.delete {
  .el-radio-group {
    display: block;
    .el-radio {
      margin-bottom: 15px;
    }
  }
}
@media all and (max-width: 500px) {
  .filter {
    padding: 15px 10px 0;
    .input {
      height: 33.3px;
      transform: translateY(5%);
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
  .bar {
    margin: 0 15px;
  }
  .total {
    font-size: 14px;
  }
}
.report_shrink {
  margin: 10px 15px;
  padding: 10px 15px 0;
  font-size: 14px;
  line-height: 27px;
  border-top: 2px dashed #f4f4f5;
  transform: scale(1);
  .holder {
    width: 20px;
    height: 20px;
    background-color: #f56c6c;
    border-radius: 50%;
    color: white;
    line-height: 20px;
    text-align: center;
    position: fixed;
    top: 0%;
    left: 0%;
    transform: translate(-35%, -50%);
  }
  .abstract,
  .status,
  .updated,
  .reasons {
    display: flex;
    .title {
      // font-weight: bold;
      flex-shrink: 0;
    }
  }
  .abstract {
    .ellipsis-2 {
      font-weight: bold;
    }
  }
  .status {
    img {
      width: 10px;
      transform: scale(2);
    }
    .type {
      color: #005187;
      font-weight: bold;
      margin-right: 10px;
    }
    .red,
    .green {
      margin-right: 10px;
    }
  }
  .reasons {
    .reason :first-child {
      margin-right: 10px;
      font-weight: bold;
    }
  }
  .operate {
    display: flex;
    align-items: center;
    height: 47px;
    button {
      transform: translate(3px, -5px) scale(0.9);
    }
  }
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
.report,
.report_shrink {
  .el-checkbox__inner {
    border: 1px solid #dcdfe6;
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
