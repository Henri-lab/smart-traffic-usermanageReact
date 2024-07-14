<template>
    <div>
        <div class="home">
            <div class="container">
                <div class="otherUser">
                    <h3 @click="goUserLogon()">普通用户登录 </h3>
                    <h3 @click="goTrafficGuidance()">交通管理员员登录</h3>
                </div>
                <h1 class="title">光谷智慧交通管理平台</h1>

                <div class="form-container">
                    <h2>管理员登录</h2>
                    <div class="form-group">
                        <label>管理员账号</label>

                        <input type="text" name="username" placeholder="请输入账号">
                    </div>
                    <div class="form-group">
                        <label>管理员登录密码</label>
                        <input type="password" name="password" placeholder="请输入密码">
                    </div>

                    <button type="submit">登录</button>
                    <button type="submit">注册新用户</button>
                    <button type="submit">修改密码</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref, getCurrentInstance, watch } from "vue";
const $router = useRouter()
const goAdministrator = () => {
    $router.push("/Administrator");
};
const goUserLogon = () => {
    $router.push("/");
};
const goTrafficGuidance = () => {
    $router.push("/TrafficGuidance");
};
const goChangePassword = () => {
    $router.push("/ChangePassword");
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container .title {
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    padding: 100PX;

    color: #ffffff;

    text-shadow: 2px 2px 2px #000000;

}

.container .otherUser {
    position: absolute;
    top: 6%;
    left: 85%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    height: 50px;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    border-radius: 5px;
}

.home {
    width: 100%;
    height: 100vh;
    padding: 0%;
    background: url('../pic/dlbj.jpg');
    background-size: cover;
}

.form-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    padding: 10px 40px;
    margin: 50px 0 0 0;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    box-shadow: 6px 7px 31px 0px rgba(0, 0, 0, 0.75);
}

.form-container h2 {
    text-align: center;
    margin: 30px 0 30px 0;
}

.form-container input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: none;
}
</style>