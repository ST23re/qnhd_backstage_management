<template>
  <div class="page">
    <div class="search" ref="search">
      <div class="search-input">
        <el-input v-model="department_query.name" placeholder="搜索部门" :clearable="true"
          @keyup.enter="searchDepartments" />
      </div>
      <div class="search-icon" @click="searchDepartments">
        <el-icon color="white" class="icon">
          <Search />
        </el-icon>
      </div>
    </div>
    <div class="operate" ref="operate">
      <button class="operate-button" @click="dialogFormVisible = true">
        <el-icon>
          <Plus />
        </el-icon>
        <span>新增分区</span>
      </button>
    </div>
    <div class="department-list">
      <el-scrollbar :max-height="scrollbarHeight">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="department in department_list" :key="department.id" :name="department.id">
            <template #title>
              <div class="department-tag">
                <div class="department-title">
                  <el-popconfirm title="确定删除该部门吗？" @confirm="deleteDepartment()" @cancel="refuse()">
                    <template #reference>
                      <el-icon class="header-icon" @click="department_delete.id = String(department.id)">
                        <circle-close />
                      </el-icon>
                    </template>
                  </el-popconfirm>
                   {{ department.name }}
                </div>
                <div class="easy-description">
                  {{ department.introduction }}
                </div>
              </div>
            </template>
            <div class="department-introduction">
              {{ department.introduction }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
    <el-dialog v-model="dialogFormVisible" top="30vh" center>
      <el-form :model="department_add" ref="form">
        <el-form-item prop="name" label="部门名称:" :rules="{
          required: true,
          message: '部门名称不能为空',
          trigger: 'blur',
        }">
          <el-input v-model="department_add.name" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="部门介绍:" :rules="{
          required: true,
          message: '部门介绍不能为空',
          trigger: 'blur',
        }">
          <el-input v-model="department_add.introduction" autocomplete="off" placeholder="请输入">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="refuseDepartment()">取消</el-button>
          <el-button type="primary" @click="createDepartment()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search, Plus, CircleClose } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDepartments, postDepartments, deleteDepartments } from "@/api/api";
import { useGlobalData } from "@/store";
interface Department {
  id: number,
  name: string,
  introduction?: string | null,
}
interface Department_query {
  name?: string,
}
interface Department_add {
  name: string,
  introduction: string | null,
}
interface Department_delete {
  id: string,
}
const activeName = ref('1');
const GlobalData = useGlobalData();
var department_query = reactive<Department_query>({});
var department_list = reactive<Department[]>([]);
var department_add = reactive<Department_add>({
  name: '',
  introduction: '',
})
var department_delete = reactive<Department_delete>({
  id: '',
})
var scrollbarHeight = ref<number>(0);
var search = ref<HTMLElement>();
var operate = ref<HTMLElement>();
var dialogFormVisible = ref<Boolean>(false);
function showDepartments() {
  department_list.length = 0;
  getDepartments(department_query).then((res: any) => {
    console.log(res)
    res.list.forEach((item: any) => {
      department_list.push(item);
    })
  })
}
function createDepartment() {
  postDepartments(department_add).then((res: any) => {
    dialogFormVisible.value = false;
    ElMessage({
      showClose: true,
      message: '创建成功',
      type: 'success',
      duration: 1000,
    })
    showDepartments();
  })
}
function refuseDepartment() {
  dialogFormVisible.value = false;
  ElMessage({
    message: '取消操作',
    duration: 1000,
  });
  department_add.name = '';
  department_add.introduction = '';
}
const deleteDepartment = () => {
  deleteDepartments(department_delete).then((res: any) => {
    ElMessage({
      showClose: true,
      message: '删除部门成功',
      type: 'success',
      duration: 1000,
    })
    showDepartments();
  })
}
const refuse = () => {
  ElMessage({
    type: 'info',
    message: '取消操作',
    duration: 1000,
  })
}
function adjustScrollHeight() {
  setTimeout(() => {
    let searchHeight = search.value?.clientHeight as number;
    let operateHeight = operate.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - searchHeight - operateHeight - 10;
  }, 50);
}
function searchDepartments() {
  showDepartments();
}
watch(department_query, (newVal) => {
  if (newVal.name == '') {
    showDepartments();
  }
})
window.addEventListener("resize", () => adjustScrollHeight())
onMounted(() => {
  adjustScrollHeight();
  showDepartments();
})
</script>

<style lang="less" scoped>
.search {
  display: flex;
  margin: 2px 8px;
  padding: 1.5px;
  border: 2px solid #005187;
  background-color: #005187;
  border-radius: 8px;

  .search-input {
    flex-grow: 1;
    outline: none;
  }

  .search-icon {
    display: flex;
    flex-shrink: 0;
    color: white;
    align-self: center;
    width: 48px;
    font-size: 20px;
    cursor: pointer;

    .icon {
      position: relative;
      left: 14px;
    }
  }
}

.operate {
  display: flex;
  margin: 4px 8px;

  .operate-button {
    padding: 8px;
    color: white;
    background-color: #005187;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    font-size: 16px;
    box-shadow: 0px 0px 1px rgb(0, 0, 0, 0.3);
  }

  :hover {
    background-color: rgb(46, 101, 133);
  }
}

.department-list {
  margin: 4px 8px;

  .department-tag {
    display: flex;
    justify-content: space-between;

    .department-title {
      font-size: 16px;
      margin-right: 20px;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      white-space: nowrap;
      /*设置不换行显示，全部显示完全 */
    }

    .easy-description {
      color: gray;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }

  .department-introduction {
    font-size: 16px;
    color: gray;
  }
}

.header-icon {
  color: rgb(210, 79, 79);

  :hover {
    transform: scale(1.1);
  }
}
</style>
