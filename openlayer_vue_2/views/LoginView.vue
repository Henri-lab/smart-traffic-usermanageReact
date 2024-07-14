<template>
  <div class="bg">
    <!-- 标题 -->
    <div class="title">
      <div class="word">
        <span class="span">光谷智慧交通</span>
        <i @click="show" class="icon"></i>
      </div>
    </div>
    <!-- 登录注册框 -->
    <div class="box animate__animated animate__fadeInUp" v-show="isShowBox">
      <!-- 图标 -->
      <div class="icon"></div>
      <!-- tab -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="普通用户" name="common"></el-tab-pane>
        <el-tab-pane label="交管人员" name="traffic"></el-tab-pane>
        <el-tab-pane label="超级管理员" name="admin"></el-tab-pane>
      </el-tabs>
      <!-- 内容 -->
      <div class="form">
        <div class="username">
          <span>用户名：</span>
          <el-input v-model="username" placeholder="用户名" class="input" />
        </div>
        <div class="password">
          <span>密码：</span>
          <el-input
            v-model="password"
            placeholder="密码"
            class="input"
            type="password"
          />
        </div>
      </div>
      <!-- 功能按钮 -->
      <div class="btns">
        <el-button type="info" @click="login">登录</el-button>
        <el-button type="info" @click="register">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { RegisterHttp, LoginHttp, EditPasswordHttp } from "@/api/user.js";
import { useMainStore } from "@/stores";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const store = useMainStore();
const router = useRouter();
const isShowBox = ref(false); //是否展示登录注册框
const activeName = ref("common"); //默认选择tab
const type = ref("common"); //身份默认common
const username = ref("");
const password = ref("");
const remerber = ref(false);

//自动记住上次登录信息
onMounted(() => {
  //查看之前是否登录过
  const u = localStorage.getItem("username");
  //保留之前登录信息
  if (u) {
    username.value = u;
    password.value = localStorage.getItem("password");
    type.value = localStorage.getItem("type");
    activeName.value = type.value;
  }
});
//点击向上箭头
function show() {
  //样式改变
  $(".title").css("top", "-200px");
  //登录注册框出现
  setTimeout(() => {
    isShowBox.value = true;
  }, 500);
}
//切换tab
const handleClick = (tab, event) => {
  //获取身份
  type.value = tab.props.name;
  //清空用户名密码
  username.value = "";
  password.value = "";
};
//注册
async function register() {
  //接口
  if (username.value != "" && password.value != "" && type.value != "") {
    const data = await RegisterHttp({
      username: username.value,
      password: password.value,
      type: type.value,
    });
    if (data.code == 200) {
      ElMessage({
        message: "注册成功",
        type: "success",
      });
    } else {
      ElMessage.error(data.msg);
      //清空
      username.value = "";
      password.value = "";
    }
  } else {
    ElMessage({
      message: "请输入完整信息",
      type: "warning",
    });
  }
}
//登录
async function login() {
  if (username.value != "" && password.value != "" && type.value != "") {
    const data = await LoginHttp({
      username: username.value,
      password: password.value,
      type: type.value,
    });
    if (data.code == 200) {
      ElMessage({
        showClose: true,
        message: "登录成功",
        type: "success",
        onClose: () => {
          //路由跳转
          router.push("/home"); //点击关闭按钮进入map
        },
      });
      //把type存入pinia
      store.type = type.value;
      //把token存入localStorage
      localStorage.setItem("token", data.token);
      //把用户名密码身份存入localStorage
      localStorage.setItem("username", username.value);
      localStorage.setItem("password", password.value);
      localStorage.setItem("type", type.value);
    } else {
      //显示后端传来的错误信息
      ElMessage.error(data.msg);
      //清空
      username.value = "";
      password.value = "";
    }
  } else {
    ElMessage({
      message: "请输入完整信息",
      type: "warning",
    });
  }
}
</script>

<style lang="scss" scoped>
.bg {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  font-family: "华文行楷";
  background-image: url("@/assets/images/bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .title {
    position: relative;
    top: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 170px;
    background-color: rgba($color: #ead7a3, $alpha: 0.5);
    transition: all 0.5s;
    .word {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 86vw;
      height: 100%;
      opacity: 0.8;
      background-color: rgba($color: #b0b0b0, $alpha: 0.5);
      text-align: center;
      transition: all 0.5s;
      .span {
        font-size: 90px;
        letter-spacing: 17px;
        text-align: center;
        color: #080607;
      }
      .icon {
        display: block;
        position: relative;
        top: 0;
        left: 10px;
        width: 64px;
        height: 54px;
        background-image: url("@/assets/images/up.svg");
        background-size: cover;
        transition: all 0.5s;
        &:hover {
          top: -15px;
        }
        &:hover > .title {
          height: 10px;
        }
      }
    }
  }
  .box {
    padding: 10px;
    margin: 0 auto;
    width: 500px;
    height: 410px;
    border-radius: 10px;
    background-color: rgba($color: #fff, $alpha: 0.5);
    ::v-deep(.el-tabs__item) {
      padding: 0 30px;
      margin: 0 27px;
      width: 100px;
      font-size: 20px;
    }
    ::v-deep(.el-tabs__active-bar) {
      width: 130px !important;
      left: -44px !important;
    }
    .icon {
      display: block !important;
      width: 100px;
      height: 100px;
      border-radius: 10px;
      margin: 5px auto 15px;
      background-image: url("@/assets/images/bg1.jpg");
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0.86;
    }
    .form {
      display: flex;
      justify-items: center;
      flex-direction: column;
      gap: 30px;
      margin: 30px 10px 10px;
      width: 90%;
      div {
        display: flex;
        justify-items: center;
        align-items: center;
        span {
          flex: 1;
          text-align: center;
          font-size: 19px;
        }
        .input {
          flex: 3.3;
        }
      }
    }

    .btns {
      display: flex;
      justify-items: center;
      align-items: center;
      margin: 40px 20px 0;
      button {
        flex: 1;
        border-radius: 15px;
      }
    }
  }
}
</style>
