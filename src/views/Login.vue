<template>
  <div id="Login">
    <div class="login-holder">
      <div style="text-align: center">
        <div class="title">
          <text class="origin">天津大学</text>求实论坛管理后台
        </div>
        <div class="sub-title">
          Forum Management<text class="origin"> System of TJU</text>
        </div>
      </div>
      <div class="switch-holder">
        <button class="item" @click="mode_isTwt = true">@TWT</button>
        |
        <button class="item" @click="mode_isTwt = false">Super</button>
        <div :class="['decro', mode_isTwt ? 'left' : 'right']"></div>
      </div>
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item prop="user">
          <el-input
            :prefix-icon="Avatar"
            v-model="loginForm.user"
            :placeholder="mode_isTwt ? '请输入天外天账号' : '请输入电话或昵称'"
            :clearable="true"
            :input-style="inputStyle"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Key"
            v-model="loginForm.password"
            placeholder="请输入密码"
            :show-password="true"
            :clearable="true"
            :input-style="inputStyle"
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item class="btn-holder">
          <el-button class="btn" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="twt">
      <img
        src="../assets/twt.svg"
        alt="twt"
        @click="router.push('/about')"
      />TWT Studio 2022
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import router from "@/router";
import { useInfo } from "@/store";
import { setToken } from "@/utils/Cookies";
import { login, login_twt } from "@/api/api";
import Md5 from "@/utils/md5";
import { estimateAuth } from "@/utils/auth";
import { ElMessage, FormInstance, FormItemRule } from "element-plus";
import { Avatar, Key } from "@element-plus/icons-vue";

const mode_isTwt = ref<boolean>(true);

const Info = useInfo();

const handler = (res: any) => {
  if (res) {
    let auth = estimateAuth(res.user);
    console.log(auth);
    if (auth === "double" || auth === "stu-sole") {
      setToken(res.token);
      Info.$patch({ ...res.user, auth });
      ElMessage.success("登录成功");
      router.push("/report");
    } else if (auth === "sch-sole") {
      setToken(res.token);
      window.location.href = `https://qnhdmanage.twt.edu.cn/#/login?token=${res.token}`;
    } else if (auth === "user")
      ElMessage({
        message: "账号无权限",
        type: "error",
        duration: 2000,
        grouping: true,
      });
  }
};

type Form = {
  user: string;
  password: string;
};
type Rules = {
  [key in keyof Form]?: Array<FormItemRule>;
};
const loginForm = reactive<Form>({
  user: "",
  password: "",
});
const rules = reactive<Rules>({
  user: [
    {
      required: true,
      message: "请输入账号",
      type: "string",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      type: "string",
    },
  ],
});

const form = ref<FormInstance>();
const onSubmit = () => {
  // console.log(form.value);
  form.value?.validate((valid) => {
    if (valid) {
      if (mode_isTwt.value)
        login_twt(loginForm).then((res: any) => handler(res));
      else
        login({
          user: loginForm.user,
          password: Md5.Instance.get_md5(loginForm.password),
        }).then((res: any) => handler(res));
    } else
      ElMessage({
        message: "请输入完整信息",
        type: "error",
        grouping: true,
      });
  });
};

const inputStyle = {
  height: "40px",
  lineHeight: "40px",
  backgroundColor: "rgba(0,0,0,0)",
  borderRadius: "8px",
};
</script>

<style lang="less" scoped>
#Login {
  height: 100vh;
  overflow: hidden;
  background-image: url("../assets/bg.jpeg");
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #464646;
  user-select: none;
}
#twt {
  position: absolute;
  bottom: 3%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #eee;
  font-size: 16px;
  opacity: 0.5;
  img {
    width: 75px;
    cursor: pointer;
  }
}
.login-holder {
  width: 480px;
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  .title {
    font-size: 32px;
    color: #363c54;
    letter-spacing: 2px;
  }
  .sub-title {
    margin-top: 15px;
    letter-spacing: 2px;
    word-spacing: 3px;
    font-size: 18px;
  }
  .switch-holder {
    display: flex;
    justify-content: space-evenly;
    margin: 35px auto 25px;
    transform: scale(1);
    .item {
      border: none;
      outline: none;
      background-color: transparent;
      font-size: 14px;
      text-align: center;
    }
    .decro {
      width: 30px;
      height: 2px;
      border-radius: 2px;
      background-color: #363c54;
      position: fixed;
      bottom: -10px;
      transition: all 0.5s;
    }
  }
  .switch-holder :hover {
    color: white;
  }
  .left {
    left: calc(25% - 12px);
  }
  .right {
    left: calc(75% - 12px);
  }
  .btn-holder {
    margin-top: 40px !important;
    .btn {
      margin: auto;
      border-radius: 8px;
      height: 40px;
      width: 200px;
      color: #eee !important;
      border: 1px solid #363c54;
    }
  }
  .btn-holder :hover {
    color: white !important;
  }
}
@media all and (max-width: 600px) {
  .login-holder {
    width: 80%;
    .origin {
      display: none;
    }
  }
}
</style>
<style>
.el-form-item {
  margin-top: 25px;
}
.el-icon {
  transform: scale(1.1);
  color: #363c54;
}
.el-input__inner::placeholder {
  color: rgba(54, 60, 84, 0.8);
  padding: 0 5px;
}
/* 谷歌 */
.el-input__inner::-webkit-input-placeholder {
  color: rgba(54, 60, 84, 0.8);
}
/* 火狐 */
.el-input__inner:-moz-placeholder {
  color: rgba(54, 60, 84, 0.8);
}
/*ie*/
.el-input__inner:-ms-input-placeholder {
  color: rgba(54, 60, 84, 0.8);
}
</style>
<style scoped>
.el-button,
.el-button:focus,
.el-button:hover {
  background-color: #363c54 !important;
}
</style>
