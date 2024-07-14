import { ref } from "vue";
import { defineStore } from "pinia";

export const useEventStore = defineStore("event", () => {
  // 弹窗的显示状态
  const isShow = ref(false);
  // 改变弹窗的显示状态
  const changeState = (payload) => {
    isShow.value = payload;
  };

  // 坐标位置
  const position = ref([]);
  // 设置坐标位置
  const setPosition = (payload) => {
    position.value = payload;
  };
  return {
    isShow,
    changeState,
    position,
    setPosition,
  };
});
