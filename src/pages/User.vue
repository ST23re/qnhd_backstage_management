<template>
  <div class="page">
    <div class="search" ref="search">
      <div class="search-input">
        <el-input
          placeholder="搜索用户"
          :clearable="true"
        />
      </div>
      <div class="search-icon">
        <el-icon class="icon"><Search/></el-icon>
      </div>
    </div>
    <div class="multiple-box">
      <div class="multiple-button-wrapper">
        <button class="multiple-button">
          <el-icon><CopyDocument/></el-icon>
          <span>批量操作</span>
        </button>
      </div>
      <div class="select-box">
        <div class="condition-box">
          <div class="change-all-condition" :style="block_style"></div>
          <div class="all" @click="block_style.left = '0%',text_normal_color.color = 'white',text_blocked_color.color = 'black',text_banned_color.color = 'black'">
            <span :style="text_normal_color">正常</span>
          </div>
          <div class="blocked" @click="block_style.left = '33.33%',text_normal_color.color = 'black',text_blocked_color.color = 'white',text_banned_color.color = 'black' ">
            <span :style="text_blocked_color">禁言</span>
          </div>
          <div class="banned" @click="block_style.left = '66.66%',text_normal_color.color = 'black',text_blocked_color.color = 'black',text_banned_color.color = 'white'">
            <span :style="text_banned_color">封禁</span>
          </div>
        </div>
        <div class="text-box">
          <span>筛选状态:</span>
        </div>
      </div>
    </div>
    <div class="user-wrapper">
      <div class="user-list-header">
        <transition name="checkbox">
          <input type="checkbox" v-if="false">
        </transition>
        <div class="user-uid-header" ref="header">
          <span>用户uid</span>
        </div>
        <div class="user-condition-header">
          <span>用户状态</span>
        </div>
        <div class="operate-header">
          <span>操作</span>
        </div>
      </div>
      <el-scrollbar :max-height="scrollbarHeight">
        <div class="user-box"
          v-for="user in userList"
          :key="user.id"
        >
          <transition name="checkbox">
            <input type="checkbox" v-if="false">
          </transition>
          <div class="user-uid">
            <span>{{user.id}}</span>
          </div>
          <div class="user-condition">
            <span>{{user.is_blocked ? "禁言" : user.is_banned ? "封禁" : "正常"}}</span>
          </div>
          <div class="operate-list">
            <div class="user-info" v-if="!isMobile">
              <el-button>
                <el-icon><View/></el-icon>
                <span>日志</span>
              </el-button>
            </div>
            <div class="block-user" v-if="!user.is_blocked">
              <el-button>
                <el-icon><Mute/></el-icon>
                <span>禁言</span>
              </el-button>
            </div>
            <div class="has-blocked" v-if="user.is_blocked">
              <span>已禁言</span>
            </div>
            <div class="ban-user" v-if="!isMobile">
              <el-button>
                <el-icon><CircleClose/></el-icon>
                <span>封禁</span>
              </el-button>
            </div>
            <div class="more" v-if="isMobile">
              <el-icon><MoreFilled/></el-icon>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            background
            layout="prev,pager,next"
            v-model:current-page="current_page"
            @current-change="pageHandler"
            :total="total_num"
            :hide-on-single-page="true"
            :small="shrinkPager" 
          />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search,CopyDocument,View,Mute,CircleClose,MoreFilled } from "@element-plus/icons-vue";
import { ref,reactive,onMounted,computed } from "vue";
import { getAllUsers } from "@/api/api";
import { useGlobalData } from "@/store";
interface Users_info{
  id:number,
  nickname:string,
  phone_number:string,
  is_super:boolean,
  is_sch_admin:boolean,
  is_stu_admin:boolean,
  is_user:boolean,
  is_sch_dis_admin:boolean,
  active:boolean,
  is_blocked:boolean,
  bloced_start:string,
  blocked_remain:number,
  blocked_over:string,
  is_banned:boolean
}
interface User_query{
  is_blocked?:string,
  is_banned?:string,
  page?:number,
  page_size?:number,
  page_disabled?:string,
}
const GlobalData = useGlobalData();
var user_query = reactive<User_query>({})
var userList = reactive<Users_info[]>([])//用于存放当页展示的用户
var current_page = ref<number>(1);
var search = ref<HTMLElement>()
var scrollbarHeight = ref<number>(0);
var total_num = ref<number>(0);
var block_style = reactive({
  "left": "0%" 
})
var text_normal_color = reactive({
  "color": "white"
})
var text_blocked_color = reactive({
  "color": "black"
})
var text_banned_color = reactive({
  "color": "black"
})
function showUsers(page?:any){
  userList.length = 0;
  user_query.page = page;
  user_query.page_size = 15;
  current_page = page;
  getAllUsers(user_query).then((res:any)=>{
    console.log(res)
    total_num.value = 50000;
    res.list.forEach(item=>{
      userList.push(item);
    })
  })
}
function pageHandler(page:any){
  showUsers(page);
}
function adjustScrollHeight(){
  setTimeout(()=>{
    let searchHeight = search.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - searchHeight - 127;
    console.log(scrollbarHeight.value)
  },50);
}
var shrinkPager = computed(()=>{
  return GlobalData.width < 490;
})
var isMobile = computed(()=>{
  return GlobalData.width < 606;
})
window.addEventListener("resize",()=>adjustScrollHeight())
onMounted(()=>{
  adjustScrollHeight();
  showUsers(1);
})
</script>

<style lang="less" scoped>
.search{
  display: flex;
  margin: 2px 8px;
  padding: 1.5px;
  border: 2px solid #005187;
  background-color: #005187;
  border-radius: 8px;
  .search-input{
    flex-grow: 1;
    outline: none;
  }
  .search-icon{
    display: flex;
    flex-shrink: 0;
    color: white;
    align-self: center;
    width: 48px;
    font-size: 20px;
    cursor: pointer;
    .icon{
      position: relative;
      left: 14px;
    }
  }
}
.multiple-box{
  display: flex;
  margin: 4px 8px;
  .multiple-button-wrapper{
    flex-grow: 1;
    .multiple-button{
      padding: 8px;
      color: white;
      background-color: #005187;
      border-radius: 5px;
      cursor: pointer;
      border: none;
      font-size: 16px;
      box-shadow: 0px 0px 1px rgb(0, 0, 0,0.3);
    }
    :hover{
      background-color: rgb(46, 101, 133);
    }
  }
  .select-box{
    display: flex;
    flex-direction: row-reverse;
    .text-box{
      margin: 2px 4px;
      font-size: 18px;
      line-height: 32.8px;
    }
    .condition-box{
      box-shadow: 0px 0px 1px rgb(0, 0, 0,0.3);
      position: relative;
      display: flex;
      margin: 4px 0px 4px 8px;
      border: 1px solid black;
      border-radius: 5px;
      .change-all-condition{
        position: absolute;
        border-radius: 5px;
        background-color: #005187;
        height: 100%;
        width: 33.33%;
        z-index: -1;
        left: 0%;
        transition: all 0.7s;
      }
      .all{
        padding: 0 3px;
        font-size: 18px;
        border-right: 1px solid black;
        border-radius: 5px;
        color: white;
        cursor: pointer;
      }
      .blocked{
        padding: 0 3px;
        font-size: 18px;
        border-right: 1px solid black;
        border-radius: 5px;
        cursor: pointer;
      }
      .banned{
        padding: 0 3px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
.user-wrapper{
  margin: 4px 8px;
  .user-list-header{
    display: flex;
    background: linear-gradient(
      to right bottom,
      rgba(238,238,238,0.6),
      rgba(238,238,238,0.3),
      rgba(238,238,238,0.2),
    );
    backdrop-filter: blur(11px);
    -webkit-backdrop-filter: blur(11px);
    border-top: 1px solid rgba(238, 238, 238, 0.8);
    border-left: 1px solid rgba(238, 238, 238, 0.8);
    box-shadow: 0px 0px 1px rgb(0, 0, 0,0.3);
    opacity: 0.9;
    border-radius: 8px 8px 0 0;
    color: rgba(0,0,0,0.5);
    text-shadow: 0.2px 0.2px 0.2px;
    .user-uid-header{
      flex-grow: 1;
      width: 33.33%;
      font-size: 18px;
      text-align: center;
      margin: 3px 0;
      border-right: 1px solid white;
    }
    .user-condition-header{
      flex-grow: 1;
      width: 33.33%;
      font-size: 18px;
      text-align: center;
      margin: 3px 0;
    }
    .operate-header{
      flex-grow: 1;
      width: 33.33%;
      font-size: 18px;
      text-align: center;
      margin: 3px 0;
      border-left: 1px solid white;
    }
  }
  .user-box{
    display: flex;
    padding: 2px 0;
    margin: 1px 0;
    line-height: 32px;
    border-bottom: 1px solid #ebeef5;
    .user-uid{
      flex-grow: 1;
      width: 33.33%;
      text-align: center;
      font-size: 18px;
      border-right: 1px solid #ebeef5;
    }
    .user-condition{
      flex-grow: 1;
      width: 33.33%;
      text-align: center;
      font-size: 18px;
    }
    .operate-list{
      display: flex;
      width: 33.33%;
      flex-grow: 1;
      justify-content: center;
      border-left: 1px solid #ebeef5;
      align-items: center;
      .user-info{
        .el-button{
          border: none;
        }
      }
      .block-user{
        .el-button{
          border: none;
        }
      }
      .ban-user{
        .el-button{
          border: none;
        }
      }
      .has-blocked{
        span{
          color:grey;
          font-size:16px;
          margin:0 15px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .pagination{
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
}
.user-box:hover{
  box-shadow: 0px 0px 3px #c9c9c9;
}
.more{
  .el-icon{
    transform: rotate(90deg);
    cursor: pointer;
  }
}
</style>
