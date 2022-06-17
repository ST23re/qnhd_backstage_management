<template>
  <div id="About">
    <div class="info-holder">
      <div class="author">
        <img class="auth" src="../assets/auth.jpg" alt="" />
        <div class="info">
          <div class="item"><text>Name:</text> ST23</div>
          <div class="item"><text>Email:</text> ts_lbw@tju.edu.cn</div>
        </div>
      </div>
      <div class="tips">
        <p>
          If there is any problem with this website, please
          <text>email me</text> and you'll be promptly replied!
        </p>
        <p>Thanks sincerely for visiting this website and using our system!</p>
      </div>
      <div class="support-holder">
        <div class="item">
          <text>Technical Support:</text>
        </div>
        <div class="tools">
          <img class="vue" src="../assets/vue.svg" alt="" />+
          <img class="ts" src="../assets/ts.jpg" alt="" />+
          <img class="vite" src="../assets/vite.svg" alt="" />+
          <img class="pinia" src="../assets/pinia.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
#About {
  height: 100vh;
  overflow: hidden;
  background-image: url("../assets/bg.jpeg");
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #464646;
  font-size: 18px;
}
.info-holder {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
}
.author {
  display: flex;
  align-items: center;
  .auth {
    width: 90px;
    border-radius: 50%;
    box-shadow: 2px 2px 8px rgba(54, 60, 84, 0.5);
  }
  .info {
    display: flex;
    flex-direction: column;
    .item {
      margin: 7px 0 7px 10px;
    }
  }
}
.tips {
  padding: 10px;
  line-height: 30px;
  margin-top: 10px;
  // p {
  //   text-indent: 2em;
  // }
}
.support-holder {
  padding: 10px;
  .tools {
    margin-top: 20px;
    display: flex;
    align-items: center;
    font-size: 35px;
    font-weight: bold;
    .vue {
      width: 45px;
    }
    .ts {
      width: 40px;
      border-radius: 5px;
    }
    .vite {
      width: 45px;
    }
    .pinia {
      width: 36px;
    }
  }
}
img {
  margin: 0 10px;
}
text {
  font-weight: bold;
}
@media all and (max-width: 560px) {
  .info-holder {
    width: 93%;
  }
}
</style>
