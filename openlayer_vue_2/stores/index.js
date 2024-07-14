import { ref } from "vue";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const type = ref(""); //身份类型
  const setMonitorPopup = ref(false); //监控弹窗显示
  return {
    type,
    setMonitorPopup,
  };
});
