<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    background-color="Navy"
    text-color="#fff"
    active-text-color="OrangeRed"
  >
    <el-menu-item index="111">
      <i class="iconfont icon-gongjiaoche"></i>
      智慧交通系统
    </el-menu-item>
    <el-menu-item index="2" @click="handleClickRoad">实时路况</el-menu-item>
    <el-menu-item index="3" @click="video">视频监控</el-menu-item>
    <!-- 交通事件查询 -->
    <TrafficQueryEvent></TrafficQueryEvent>
    <el-menu-item index="5">发布公告</el-menu-item>
    <el-menu-item index="8">路况信息</el-menu-item>
    <el-menu-item index="6" @click="ToolboxSwitch">工具箱</el-menu-item>
    <div class="flex gap-4 mb-4 items-center">
      <el-input
        v-model="input1"
        style="width: 200px"
        size="large"
        placeholder="Please Input"
        :suffix-icon="Search"
        @keyup.enter="search()"
      />
    </div>
    <el-sub-menu class="userInformation" index="10">
      <template #title>个人信息</template>
      <el-menu-item index="10-1" @click="goChangePassword"
        >修改密码</el-menu-item
      >
      <el-menu-item index="10-2" @click="goUserLogon()">切换用户</el-menu-item>
      <el-menu-item index="10-3" @click="goUserLogon()">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { useRouter } from "vue-router";
import { queryHighLayer } from "../../mapgis-api/HightLine.js";
import { monitorInfoHook } from "../hooks/monitor-info-hook.js";
import { Query } from "../../mapgis-api/Query.js";
import { onMounted, ref, getCurrentInstance } from "vue";
import { setLineStyle } from "@/ol-utils/index.js";
import { Search } from "@element-plus/icons-vue";
import TrafficQueryEvent from "../../components/traffic/TrafficQueryEvent.vue";
import { useStore } from "@/stores/index.js";
const $store = useStore();
// import { queryEventHook } from "../hooks/query-event-hook.js";
// 引入路由
const $router = useRouter();
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
//视频监控
const { OpenMonitor } = monitorInfoHook();
const video = () => {
  OpenMonitor($map);
};
// 清空其他图层
const clearAllEvent = () => {
  $map.getOverlays().clear();
  closeCondition();
};

//  导航窗口菜单索引值
const activeIndex = ref("1");
const activeIndex2 = ref("1");
// 输入框的值
const input1 = ref("");
const search = () => {
  // 打印输入框里面的输入值
  console.log(input1._value);
};

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

::v-deep .el-input {
  margin-top: 10px;
  margin-left: 80px;
  /* 修改文本颜色 */
}
</style>
