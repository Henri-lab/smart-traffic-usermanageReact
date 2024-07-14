import { ref } from "vue";
import { defineStore } from "pinia";

export const useQueryEventStore = defineStore("queryEvent", () => {
  // 弹窗的显示状态
  const isShow = ref(false);
  // 改变弹窗的显示状态
  const changeState = (payload) => {
    isShow.value = payload;
  };

  // 几何信息
  const geom = ref({});
  // 设置几何信息
  const setGeom = (payload) => {
    geom.value = payload;
  };

  // 热力图的状态
  const isOpen = ref(false);
  // 设置热力图的显示状态
  const setHeatLayer = (payload) => {
    isOpen.value = payload;
  };
  return {
    isShow,
    changeState,
    geom,
    setGeom,
    isOpen,
    setHeatLayer,
  };
});
