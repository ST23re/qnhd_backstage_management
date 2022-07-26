<template>
  <div id="root">
    <!-- <transition-group name="ani1"> -->
    <div id="page0" class="diyScrollbar" v-if="currentPage == 'page0'">
      <div class="Box1">
        <div class="BlueBtn" @click="currentPage = 'page1'">创建新公告</div>
      </div>
      <div class="Box2">
        <div class="Title_s_left">历史公告</div>
        <div class="TitlesBox">
          <div class="NoticeTitle">公告标题</div>
          <div class="Poster">发送人</div>
          <div class="PostTime">发送时间</div>
          <div class="DeleteBtn"></div>
        </div>
        <div
          v-for="(item, index) in historyNotice_list"
          :key="item.id"
          class="ItemBox"
        >
          <a
            class="NoticeTitle_Info"
            href=""
            @click.prevent="
              currentPage = 'page2';
              currentIndex = index;
            "
            ><FullView :content='item.title' /></a
          >
          <div class="Poster_Info">
            <FullView :content='item.sender' />
          </div>
          <div class="PostTime_Info">
            <FullView :content='item.created_at.split("T")[0].replace(/-/g, "/")' />
          </div>
          <a class="DeleteBtn flexCenter" href="" @click.prevent="DeleteNotice(index)"
            >删除</a
          >
        </div>
      </div>
    </div>
    <div id="page1" class="diyScrollbar" v-if="currentPage == 'page1'">
      <div class="NoticeTitleSet FlexBoth">
        <div class="title">公告标题:</div>
        <input
          type="text"
          placeholder="请输入标题 (必填)"
          v-model="val_title"
        />
      </div>
      <div class="PublisherSet FlexBoth">
        <div class="title">发布人员:</div>
        <input
          type="text"
          placeholder="录入发布人 (必填)"
          v-model="val_sender"
        />
      </div>

      <div class="FlexBoth">
        <div class="title">发布时间:</div>
        <!-- <el-date-picker
                  v-model="val_time"
                  size="mini"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="new Date().getTime()">
                  </el-date-picker> -->
        <input type="text" disabled placeholder="" v-model="val_timeComputed" />
      </div>

      <div class="ContentSet FlexBoth">
        <div class="title">报告正文:</div>
        <!-- <mavon-editor
          class="myEditor"
          placeholder="请输入正文 (必填)"
          v-model:value="val_markdown"
          fontSize="14px"
          ref="md"
          @imgAdd="handleEditorImgAdd"
          @imgDel="handleEditorImgDel"
        /> -->
        <MdEditor
          toolbarsExclude="['link', 'mermaid', 'katex', 'github']"
          v-model="val_markdown"
          @onUploadImg="handleEditorImgAdd"
          ref="md"
          placeholder="请输入正文 (必填)"
          class="myEditor"
          fontSize="14px"
        />
      </div>
      <div class="UrlSet FlexBoth">
        <div class="title">url:</div>
        <input type="text" placeholder="非必填" v-model="val_url" />
      </div>
      <div class="FlexAround">
        <!-- <div class="Btn_publish" @click="PublishNotice">发布</div> -->
        <el-button
          class="Btn_publish"
          type="primary"
          @click="PublishNotice"
          :loading="elBtn_load"
          >发布</el-button
        >
        <div class="Btn_cancle" @click="currentPage = 'page0'">取消</div>
      </div>
    </div>
    <div id="page2" class="diyScrollbar" v-if="currentPage == 'page2'">
      <div class="NoticeTitleSet FlexBoth">
        <div class="title">公告标题:</div>
        <input
          type="text"
          placeholder="请修改标题 (必填)"
          v-model="val_title"
        />
      </div>
      <div class="PublisherSet FlexBoth">
        <div class="title">发布人员:</div>
        <input
          type="text"
          placeholder="更改发布人 (必填)"
          v-model="val_sender"
        />
      </div>

      <div class="FlexBoth">
        <div class="title">发布时间:</div>
        <!-- <el-date-picker
                  v-model="val_time"
                  size="mini"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="new Date().getTime()">
                  </el-date-picker> -->
        <input type="text" disabled placeholder="" v-model="val_time" />
      </div>

      <div class="ContentSet FlexBoth">
        <div class="title">报告正文:</div>
        <!-- <mavon-editor
          class="myEditor"
          placeholder="请输入正文 (必填)"
          v-model:value="val_markdown"
          fontSize="14px"
          ref="md"
          @imgAdd="handleEditorImgAdd"
          @imgDel="handleEditorImgDel"
        /> -->
        <MdEditor
          toolbarsExclude="['link', 'mermaid', 'katex', 'github']"
          v-model="val_markdown"
          @onUploadImg="handleEditorImgAdd"
          ref="md"
          placeholder="请输入正文 (必填)"
          class="myEditor"
          fontSize="14px"
        />
      </div>
      <div class="UrlSet FlexBoth">
        <div class="title">url:</div>
        <input type="text" placeholder="非必填" v-model="val_url" />
      </div>
      <div class="FlexAround">
        <div class="Btn_publish btn" @click="EditNotice">修改公告并保存</div>
        <div class="Btn_delete btn" @click="DeleteNotice(currentIndex)">删除</div>
        <div class="Btn_cancle btn" @click="currentPage = 'page0'">取消</div>
      </div>
    </div>
    <!-- </transition-group> -->
    <!-- <transition name="opacity">
          <div class="dingzi" v-if="currentPage=='page1'|| currentPage=='page2'"></div>
      </transition> -->
  </div>
</template>

<script>
import * as Vue from "vue";
import {
  notice_delete,
  notice_notices,
  notice_modify,
  notice_notice,
} from "../api/api";
import axios from "axios";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import FullView from "../components/FullView.vue"
// let Myindex,id

export default {
  name: "NoticeControl",
  components: {
    MdEditor,
    FullView
  },
  data() {
    return {
      currentIndex: "",
      currentPage: "page0",
      historyNotice_list: [],
      val_title: "",
      val_sender: "",
      val_markdown: "",
      val_url: "",
      val_time: "",
      elBtn_load: false,
    };
  },
  methods: {
    handleEditorImgDel() {
      console.log(9);
    },
    handleEditorImgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append("images", $file);
      //   formdata.append("token", localStorage.getItem('token'))
      axios({
        url: "https://www.zrzz.site:7015/upload/image",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        if (res.code === 200) {
          let url =
            "https://www.zrzz.site:7015/download/thumb/" + res.data.urls[0];
          this.$refs.md.$img2Url(pos, url);
        }
        console.log(res);
      });
    },
    EditNotice() {
      notice_modify({
        id: this.historyNotice_list[this.currentIndex].id,
        sender: this.val_sender,
        title: this.val_title,
        content: this.val_markdown,
        url: this.val_url,
      }).then((v) => {
        this.$message.success("修改成功");
        this.currentPage = "page0";
      });
    },
    PublishNotice() {
      this.elBtn_load = true;
      notice_notice({
        sender: this.val_sender,
        title: this.val_title,
        content: this.val_markdown,
        url: this.val_url,
      }).then((v) => {
        this.$message.success("发布成功");
        this.currentPage = "page0";
        this.elBtn_load = false;
      });
    },
    DeleteNotice(index) {
      notice_delete({
        id: this.historyNotice_list[index].id,
        //   token: localStorage.getItem('token')
      }).then((v) => {
        this.$message.success("删除成功");
        this.historyNotice_list.splice(index, 1);
        this.currentPage = "page0";
      });
    },
  },
  watch: {
    currentPage(newer) {
      if (newer == "page0") {
        this.val_title = "";
        this.val_sender = "";
        this.val_markdown = "";
        this.val_url = "";
        this.val_time = "";
        notice_notices().then((v) => {
          this.historyNotice_list = v.list;
          // v.total
        });
      } else if (newer == "page1") {
        this.val_time = new Date().getTime();
      } else if (newer == "page2") {
        this.val_title = this.historyNotice_list[this.currentIndex].title;
        this.val_sender = this.historyNotice_list[this.currentIndex].sender;
        this.val_markdown = this.historyNotice_list[this.currentIndex].content;
        this.val_url = this.historyNotice_list[this.currentIndex].url;
        this.val_time = new Date(
          this.historyNotice_list[this.currentIndex].created_at
        );
      }
    },
  },
  computed: {
    val_timeComputed() {
      return new Date(this.val_time);
    },
  },
  mounted() {
    notice_notices().then((v) => {
      // console.log(v)
      this.historyNotice_list = v.list;
      // v.total
    });
  },
};
</script>

<style scoped>
#root {
  width: 100%;
  height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
#page0,
#page1,
#page2 {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  position: absolute;
  transform-origin: 38px 32px;
  overflow: auto;
}
#page0 > .Box1 {
  height: 60px;
  border-bottom: solid 1.5px #ddd;
  padding: 0 40px;
  display: flex;
  align-items: center;
}
#page0 > .Box2 {
  flex: 1;
  padding: 0 40px;
  overflow: auto;
}
.BlueBtn {
  color: white;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 5px;
  box-shadow: 2px 2px 2px #aaaaaa66;
  background-color: rgb(50, 128, 180);
}
.BlueBtn:hover {
  cursor: pointer;
  background-color: rgba(50, 128, 180, 0.88);
}
.BlueBtn:active {
  cursor: pointer;
  background-color: rgb(36, 102, 146);
}
.Title_s_left {
  padding: 12px 8px;
  font-weight: 600;
  font-size: 14px;
  color: #444;
}
.TitlesBox {
  position: relative;
  background-color: #eee;
  width: 100%;
  height: 44px;
  border-radius: 6px;
  display: flex;
  align-items: center;
}
.TitlesBox > div,
.ItemBox > * {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
.NoticeTitle,
.NoticeTitle_Info {
  /* left: 14%; */
  flex: 1.7;
  overflow: hidden;
  padding-left: 16px;
}
.Poster,
.Poster_Info {
  /* left: 46%; */
  flex: 1;
  overflow: hidden;
  padding-left: 16px;
}
.PostTime,
.PostTime_Info {
  /* left: 70%; */
  flex: 1;
  overflow: hidden;
  padding-left: 16px;
}
.DeleteBtn {
  /* left: 90%; */
  flex: .6;
  color: rgb(210, 20, 20);
  padding-left: 16px;
}
.flexCenter{
  display: flex;
  justify-content: center;
}
.ItemBox {
  position: relative;
  width: 100%;
  height: 48px;
  border-bottom: solid 1.2px #ccc;
  display: flex;
  align-items: center;
}
.ItemBox:hover {
  background-color: #f7f7f7;
}
.NoticeTitle_Info {
  color: rgb(70, 155, 191);
}

.ani1-enter-active,
.ani1-leave-active {
  transition: all 0.6s;
}
.ani1-enter,
.ani1-leave-to {
  opacity: 0;
  transform: rotate3d(0, 0, 1, 60deg);
}
.ani1-enter-to,
.ani1-leave {
  opacity: 1;
  transform: rotate3d(0, 0, 0, 0deg);
}
#page1,
#page2 {
  padding: 30px 50px;
  background-color: white;
  box-sizing: border-box;
}
.FlexBoth {
  display: flex;
  align-items: center;
  margin: 10px;
}
.FlexBoth > .title {
  font-size: 14px;
  color: #444;
  margin-right: 6px;
  font-weight: 600;
}
.FlexBoth > input {
  height: 28px;
  width: 60%;
  padding: 0;
  border-radius: 4px;
  box-sizing: border-box;
  border: solid 1px rgb(220, 223, 230);
  outline: none;
  padding-left: 10px;
}
.FlexBoth > input::-webkit-input-placeholder {
  color: rgb(201, 204, 212);
}
.el-date-editor.el-input {
  width: 200px !important;
}
.ContentSet {
  flex-direction: column;
}
.ContentSet > .title {
  align-self: flex-start;
  margin-bottom: 12px;
}
.myEditor {
  width: 98%;
}
.diyScrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
}
.diyScrollbar::-webkit-scrollbar {
  width: 0px;
  background-color: rgba(0, 0, 0, 0.1);
}
.FlexAround {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin: 28px 0;
}
.Btn_publish {
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 36px;
  border-radius: 4px;
  transition: all 0.2s;
  background-color: rgb(70, 155, 191);
  box-shadow: 0px 0px 4px 0px #bbb;
  max-width: 40% !important;
  user-select: none;
}
.Btn_publish:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
  color: rgb(255, 240, 240);
  background-color: rgba(110, 210, 221, 0.9);
}
.Btn_publish:active {
  transform: scale(1.1, 1.1);
  color: rgb(255, 240, 240);
  background-color: rgb(104, 202, 212);
}
.btn{
  max-width: 20%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100px;
  padding: 0;
  white-space: nowrap;
}
.Btn_delete {
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.2s;
  background-color: rgb(208, 39, 39);
  box-shadow: 0px 0px 4px 0px #bbb;
  user-select: none;
}
.Btn_delete:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
  color: rgb(255, 240, 240);
  background-color: rgb(215, 56, 56);
}
.Btn_delete:active {
  transform: scale(1.1, 1.1);
  color: rgb(255, 240, 240);
  background-color: rgb(202, 49, 49);
}
.Btn_cancle {
  color: #232323;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 36px;
  border-radius: 4px;
  transition: all 0.2s;
  background-color: #ddd;
  box-shadow: 0px 0px 4px 0px #bbb;
  user-select: none;
}
.Btn_cancle:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
}
.Btn_cancle:active {
  transform: scale(1.1, 1.1);
}
.dingzi {
  background: url(../assets/dingzi.png) center center / 90% no-repeat;
  height: 60px;
  width: 60px;
  opacity: 0.9;
  position: absolute;
  top: 0;
  left: 0;
}
.opacity-enter-active,
.opacity-leave-active {
  transition: all 0.6s;
}
.opacity-enter,
.opacity-leave-to {
  opacity: 0;
}
.opacity-enter-to,
.opacity-leave {
  opacity: 1;
}
</style>
