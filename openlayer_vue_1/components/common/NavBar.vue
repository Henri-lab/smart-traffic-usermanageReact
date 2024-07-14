<template>
  <!-- 这个是顶部导航栏 -->
  <!-- <div class="h-6" /> -->

  <!-- <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64"
    text-color="#fff" active-text-color="#ffd04b"> -->
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="111">
      <i class="iconfont icon-gongjiaoche"></i>
      光谷智慧交通系统
    </el-menu-item>
    <el-menu-item index="2" @click="handleClickRoad">实时路况</el-menu-item>
    <el-menu-item index="3">查看公告</el-menu-item>
    <!-- <el-menu-item index="4">报告路况</el-menu-item> -->
    <el-menu-item index="8" @click="ToolboxSwitch">工具箱</el-menu-item>
    <query-event></query-event>
    <el-sub-menu class="userInformation" index="9">
      <template #title>个人信息</template>
      <el-menu-item index="2-1" @click="goChangePassword"
        >修改密码</el-menu-item
      >
      <el-menu-item index="2-2" @click="goUserLogon()">切换用户</el-menu-item>
      <el-menu-item index="2-3" @click="goUserLogon()">退出登录</el-menu-item>
    </el-sub-menu>
    <!-- 这是搜索查询框 -->
    <query-search></query-search>
    <!-- <el-select
      v-model="value"
      placeholder="查询事件"
      size="large"
      style="width: 180px; margin-top: 10px; margin-left: 8px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select> -->
  </el-menu>
</template>

<script setup>
import QueryEvent from "./QueryEvent.vue";
import QuerySearch from "./QuerySearch.vue";
import { onMounted, ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { queryHighLayer } from "../../mapgis-api/HightLine.js";
import { useStore } from "@/stores/index.js";
const $store = useStore();
const $router = useRouter();
// 导入pinia

// 全局变量地图
let $map = null;
onMounted(() => {
  const { proxy } = getCurrentInstance();
  $map = proxy.$map;
});
/* 2, 点击导航栏index1实时路况 */
let { hightLinelayer } = queryHighLayer(); //实时路况加载
// 控制实时路况图层是否显示
var lear = false;

// 打开实时路况图层
const openCondition = () => {
  $map.addLayer(hightLinelayer);
};
// 关闭实时路况图层
const closeCondition = () => {
  $map.removeLayer(hightLinelayer);
};
// 控制实时路况高亮图层是否显示的点击事件
const handleClickRoad = () => {
  lear = !lear;
  // clearAllEvent();
  if (lear == true) {
    openCondition();
  } else {
    closeCondition();
  }
};

const activeIndex = ref("1");
const activeIndex2 = ref("1");

const value = ref("");

//路由跳转部分

//跳转到修改密码页面
const goChangePassword = () => {
  $router.push("/ChangePassword");
};

//跳转到普通用户界面
const goUserLogon = () => {
  $router.push("/");
};

//这里是工具  功能
const ToolboxSwitch = () => {
  console.log("工具箱");
  if ($store.isShow) {
    $store.isShow = false;
  } else {
    $store.isShow = true;
  }
};
</script>

<style scoped>
.nav-bar {
  z-index: 999;
  position: fixed;
  width: 100%;
  height: 60px;
  background-color: pink;
  top: 0;
  left: 0;
}

span {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.userInformation {
  position: absolute;
  right: 0%;
  margin: 0;
  padding: 0;
}
</style>
