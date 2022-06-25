<template>
  <div class="page">
    <div class="filter" ref="filter">
      <div class="input">
        <el-input
          v-model="tags_query.name"
          placeholder="搜索Tag"
          :clearable="true"
          @keyup.enter="showTags"
        />
        <div class="icon-holder">
          <el-icon @click="showTags"><Search color="#ffffff"/></el-icon>
        </div>
      </div>
    </div>
    <el-scrollbar :max-height="scrollbarHeight">
        <div
          v-for="tag in tagsList"
          :key="tag.id??tag.tag_id"
          class="tag"
        >
          <div class="title">
            <div class="top"> 
              <div class="ellipsis">
                <text>{{tag.name}}</text>
              </div>
              <div class="isHotTag" :class="tag.point?'hot_tag':'no_hot_tag'">
                <text>{{tag.point?"热榜":""}}</text>
              </div>
              <div v-if="tag.point" class="hot_tag isHotTag">
                <text>{{"热度: "+String(tag?.point)}}</text>
              </div>
            </div>
            <div class="bottom">
              <text>{{"#id: "+(tag.id??tag.tag_id)}}</text>
            </div>
          </div>
          <div class="operate">
            <el-button :disabled="!tag.point">
              <text :style="tag.point?'color:red;':'color:grey;'">
                <el-icon><Warning/></el-icon>撤去热搜
              </text>
            </el-button>
            <el-button>
              <text style="color:red">
                <el-icon><Delete/></el-icon>删除Tag
              </text>
            </el-button>
            <div class="more">
              <el-dropdown trigger="click">
                <el-icon><MoreFilled/></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <text style="width:100%;text-align:center">开盒</text>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                      <text style="width:100%;text-align">空降热搜</text>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
</template>
<script setup lang="ts">
import { getHotTags,getNormalTags } from "@/api/api";
import { reactive,onMounted,ref, computed } from "vue";
import { Search,Warning,Delete,MoreFilled } from "@element-plus/icons-vue";
import { useGlobalData } from "@/store";
interface Tags{
  tag_id?:string,
  id?:string,
  point?:number,
  name:string
}
interface Tags_query{
  name:string,
}
const GlobalData = useGlobalData();
var tags_query = reactive<Tags_query>({
  name:'',
})
type EChartsOption = proxy.$echarts.EChartsOption;
var option: EChartsOption;
/* option = reactive({
   tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
}) */
/* const { proxy } = getCurrentInstance()
const charts = ref<HTMLElement>(); */
var filter = ref<HTMLElement>();
var tags_total = ref<number>(0)
var tagsList = reactive<Tags[]>([])//目前被显示的tag列表
var dumpTagsList = reactive<Tags[]>([])//存储所有tag
var filterList = reactive<Tags[]>([])//经搜索过滤出来的新的总列表
var hotTagList = reactive<Tags[]>([])
var isHot = ref<boolean>(true)
var total_num = ref<number>(0)
var hotTag_num = ref<number>(0)
var scrollbarHeight = ref<number>(0);
var reverse_index = ref<number>(0);
var current_page = ref<number>(1);
var last_page = ref<number>(0);
var last_page_num = ref<number>(0);
function showTags(page:number){
  if(tags_query.name === ""&&page === 1){
    getHotTags().then((res:any)=>{
      console.log(res.total);//有热榜总数total属性
      hotTag_num.value = res.total;
      tagsList.length = 0;
      hotTagList.length = 0;
      res.list.forEach(item=>{
        tagsList.push(item)
        hotTagList.push(item.tag_id)
      })
      let diffVal:number = 10 - hotTag_num.value;
      getNormalTags(tags_query).then((res:any)=>{//ps:非热榜中tag与热榜中的tag有重复
        console.log(res);
        total_num.value = res.total;
        if(res.total%10!=0){
          last_page.value = (res.total-res.total%10)/10 + 1;  
          last_page_num.value = res.total%10;
        }else{
          last_page.value = res.total/10;
        }
        dumpTagsList.length = 0;
        res.list.forEach(item=>{
          dumpTagsList.push(item);
        })
        dumpTagsList = res.list.filter(item=>{
          return !hotTagList.includes(item.id);
        })
        reverse_index.value = dumpTagsList.length -1;
        for(let i=0;i<diffVal;i++){
          tagsList.push(dumpTagsList[reverse_index.value]);
          reverse_index.value--;
        }
      })
    })
  }else if(tags_query.name === ""&&page !== 1){
    let temp:number = reverse_index.value - (page-2)*10;
    tagsList.length = 0;
    if(page!==last_page.value){
      for(let i=0;i<10;i++){
        tagsList.push(dumpTagsList[temp]);
        temp--;
      }
    }else{
      for(let i=0;i<last_page_num.value;i++){
        tagsList.push(dumpTagsList[temp]);
        temp--;
      }
    }
  }
}
function pageHandler(page:number){
  console.log(page);
  showTags(page);
}
function adjustScrollHeight(){
  setTimeout(()=>{
    let filterHeight = filter.value?.clientHeight as number;
    scrollbarHeight.value = GlobalData.height - filterHeight - 50;
  },50)
}
onMounted(()=>{
/*   var pieHotTags = proxy.$echarts.init(charts.value)
  pieHotTags.setOption(option); */
  adjustScrollHeight();
  showTags(1);
})
var shrinkPager = computed(()=>{
  return GlobalData.width < 490;
})
window.addEventListener("resize",()=>adjustScrollHeight());
</script>

<style lang="less" scoped>
.tag{
  border-bottom: 1px solid #ebeef5;
  margin: 3px 10px;
  padding: 5px 8px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content:space-between;
  .title{
    font-size: 18px;
    font-weight: 500;
    flex-direction:column;
/*     display: flex; */
    align-items: center;
    .top{
      display:flex;
      justify-content:space-between;
    }
    .isHotTag{
      flex-shrink: 0;
      height: 20px;
      margin: 0 10px 0 8px;
      font-size: 14px;
      padding: 0 5px;
      border-radius: 4px;
      align-self: center;
      text{
        line-height: 20px;
        color: white;
      }
    }
    .bottom{
      font-size: 14px;
      color:#afafaf;
    }
  }
  .operate{
    display: flex;
    .el-button{
      width: 70px;
      color: white;
      border-radius: 8px;
      border: 0;
    }
    text{
      display: flex;
      align-items: center;
    }
    .more{
      font-size: 14px;
      cursor: pointer;
      margin: 0 8px 0 6px;
      transform: rotate(90deg);
      opacity: 0.8;
    }
  }
}
.hot_tag {
  background-image: linear-gradient(to right bottom, #f35932, #cf4624);
  box-shadow: 0 0 1px #cf4624;
  opacity: 0.8;
}
.tag:hover{
  box-shadow: 0px 0px 3px #c9c9c9;
}
.filter{
  padding: 5px 10px 0;
  margin-bottom: 3px;
  border-radius: 8px;
  user-select: none;
  .input{
    flex: 1;
    margin: 3px;
    padding: 2.5px;
    min-width: 270px;
    background-color: #005187;
    box-shadow: 0 0 2px #7e9fcb;
    border-radius: 8px;
    display: flex;
    .icon-holder{
      flex-grow: 0;
      flex-shrink: 0;
      width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      *{
        transform: scale(1.1);
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: center;
  position: relative;
  margin: 10px 0;
}
.ellipsis{
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
