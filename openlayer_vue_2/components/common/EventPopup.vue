<template>
  <!-- Popup -->
  <div class="popup-dialog">
    <div class="title">
      <span>{{ store.title }}</span>
      <!-- <a href="#" id="popup-closer" class="ol-popup-closer"></a> -->
    </div>
    <div class="content">
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item
          align="center"
          :label="item[0]"
          v-for="item in labelList"
        >
          <template #default v-if="item[0] == '事件等级'">
            <el-tag effect="dark" :type="filterTag(item[1])">{{
              filterLevel(item[1])
            }}</el-tag>
          </template>
          <template #default v-else-if="item[0] == '处理状态'">
            <el-tag
              v-if="store.isUpdate == false"
              effect="dark"
              :type="filterStatusTag(item[1])"
              >{{ filterStatus(item[1]) }}</el-tag
            >
            <el-select
              v-else
              v-model="value"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template #default v-else>{{ item[1] }}</template>
        </el-descriptions-item>
      </el-descriptions>
      <div class="update_btns" v-if="store.isUpdate">
        <el-button type="primary" size="small" @click="handleUpdate"
          >更新</el-button
        >
        <el-button type="info" size="small" @click="handleCancal"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, onUnmounted, computed } from "vue";
import {
  filterLevel,
  filterTag,
  filterStatus,
  filterStatusTag,
  filterDataByPermission,
} from "@/filters/event-query";
import { usePopupStore } from "@/stores/eventPopup";
import { updateEventHook } from "@/components/hooks/update-event-hook";
const store = usePopupStore();
let map = ref(null);
const labelList = ref([]);
const { updateEvent, cancalEvent } = updateEventHook();
const value = ref("");
const options = [
  {
    value: "0",
    label: "未处理",
  },
  {
    value: "1",
    label: "已忽略",
  },
  {
    value: "2",
    label: "已处理",
  },
];
let popup;
onMounted(() => {
  map = inject("$map");
  popup = new ol.Overlay({
    //要转换成overlay的HTML元素
    element: document.querySelector(".popup-dialog"),
    //当前窗口可见
    autoPan: true,
    //Popup放置的位置
    positioning: "bottom-left",
    //是否应该停止事件传播到地图窗口
    stopEvent: true,
    autoPanAnimation: {
      //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
      duration: 260,
    },
  });
  // 数据与组件渲染一起
  labelList.value = Object.entries(store.dataList[0]);
  //select框默认值
  value.value = store.dataList[0]["处理状态"];

  popup.setPosition(store.position);
  map.addOverlay(popup);
});
// 组件卸载，删除pop
onUnmounted(() => {
  popup.setPosition(null);
  map.removeOverlay(popup);
  // console.log('删除pop');
});
watch(
  () => store.position,
  (newVal) => {
    if (newVal) {
      //位置改变,数据改变
      labelList.value = Object.entries(store.dataList[0]);
      popup.setPosition(store.position);
    }
  }
);
//事件更新
const handleUpdate = () => {
  updateEvent(store.attrInfo, value.value, map);
};
//事件取消
const handleCancal = () => {
  cancalEvent(map);
};
</script>

<style lang="scss" scoped>
.popup-dialog {
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  border-radius: 10px;
  border: 1px solid #cccccc;
  .title {
    padding: 10px;
    border-radius: 10px 10px 0 0;
    background-color: #f7c12c;
    color: #fff;
    font-family: "微软雅黑";
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
  }
  .content {
    padding: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .update_btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
