<template>
  <el-menu
    mode="horizontal"
    class="el-menu-demo"
    background-color="#58616C"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <template v-for="(item, index) in menuList">
      <!-- 有二级菜单的情况 -->
      <el-sub-menu
        v-if="item.children && item.children.length > 0"
        :index="item.id.toString()"
        :key="item.id"
      >
        <template #title>
          <i class="iconfont icons" :class="item.icon"></i>
          <span>{{ item.menuName }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.id"
          :index="child.id.toString()"
          :class="child.menuName"
          @click="handleClick(child.menuName)"
        >
          {{ child.menuName }}
        </el-menu-item>
      </el-sub-menu>
      <!-- 没有二级菜单的情况 -->
      <el-menu-item
        v-else
        :index="item.id.toString()"
        :key="index"
        @click="handleClick(item.menuName)"
      >
        <i class="iconfont icons" :class="item.icon"></i>
        {{ item.menuName }}
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
import { queryHighLayer } from "@/utils/query-high-layer";
import { useMainStore } from "@/stores/index";
import { MenuHttp } from "@/api/menu";
import { toolBoxHook } from "../hooks/tool-box-hook";
import { searchEventHook } from "../hooks/search-event-hook";
// 查询事件
import { queryEventHook } from "../hooks/query-event-hook";
import { searchHeatLayerHook } from "../hooks/search-heatLayer-hook";
import { userInfoHook } from "../hooks/user-info-hook";
import { updateEventHook } from "../hooks/update-event-hook";
import { publishNoticeHook } from "../hooks/publish-notice-hook";
import { seeNoticeHook } from "../hooks/see-notice-hook";
import { monitorInfoHook } from "../hooks/monitor-info-hook";
import { addEventHook } from "../hooks/add-event-hook";
let map = null;
let menuList = ref([]);
let { hightLinelayer } = queryHighLayer(); //实时路况加载
const $store = useMainStore();
const { measureLength, measureArea, clearAll, exportImage } = toolBoxHook();
// const { activeDraw, deactiveDraw } = searchEventHook();
const { activeDraw, deactiveDraw } = queryEventHook();
const { removeHeatLayer } = searchHeatLayerHook(); //热力图清除
// 用户管理
const { logOut, userManage, updateInfo } = userInfoHook();
// 路况信息模块
import { roadConditionHook } from "../hooks/road-condition-hook";
const { checkRoad, reportRoad } = roadConditionHook();
const { addEvent } = addEventHook();
//打开事件更新
const { openUpdateEvent } = updateEventHook();
//视频监控
const { OpenMonitor } = monitorInfoHook();
onMounted(() => {
  map = inject("$map");
  getMenuList();
});
async function getMenuList() {
  const res = await MenuHttp($store.type);
  //解决页面刷新后菜单栏数据丢失的问题
  if (res.data) {
    menuList.value = res.data;
    localStorage.setItem("menuList", JSON.stringify(res.data));
  } else {
    menuList.value = JSON.parse(localStorage.getItem("menuList"));
  }
  //动态显示用户名
  menuList.value.forEach((item) => {
    if (item.menuName === "用户名") {
      item.menuName = localStorage.getItem("username");
    }
  });
}
const openCondition = () => {
  map.addLayer(hightLinelayer);
};
const closeCondition = () => {
  map.removeLayer(hightLinelayer);
};
const handleClick = (item) => {
  clearAllEvent();
  switch (item) {
    case "实时路况":
      openCondition();
      break;
    case "关闭路况":
      closeCondition();
      break;
    case "测量距离":
      measureLength();
      break;
    case "测量面积":
      measureArea();
      break;
    case "关闭测量":
      clearAll();
      break;
    case "导出地图":
      exportImage();
      break;
    case "查询事件":
      activeDraw(map);
      break;
    case "取消查询":
      removeHeatLayer();
      deactiveDraw(map);
      break;
    case "退出登录":
      logOut();
      break;
    case "用户管理":
      userManage();
      break;
    case "修改信息":
      updateInfo();
      break;
    case "更新事件状态":
      openUpdateEvent(map);
      break;
    case "发布公告":
      publishNoticeHook(map);
      break;
    case "查看公告":
      seeNoticeHook();
      break;
    case "审核路况":
      checkRoad();
      break;
    case "打开监控":
      OpenMonitor(map);
      break;
    case "添加事件":
      addEvent(map);
      break;
    case "报告路况":
      reportRoad();
      break;
    default:
      break;
  }
};

const clearAllEvent= ()=> {
  map.getOverlays().clear();
  closeCondition()
}
</script>

<style lang="scss" scoped>
.icons {
  margin-right: 5px;
}
</style>
