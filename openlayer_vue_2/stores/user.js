import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const setUserManageShow = ref(false); //用户管理显示
  const allusersData = ref([]); //所有用户信息
  const setUpdateInfoShow = ref(false); //修改信息弹窗显示
  return {
    setUserManageShow,
    allusersData,
    setUpdateInfoShow,
  };
});
