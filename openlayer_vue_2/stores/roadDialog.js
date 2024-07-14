import { ref } from "vue";
import { defineStore } from "pinia";

export const useRoadStore = defineStore("road", () => {
  ///////////////////////////////////////////////////////////////////
  // 路况信息窗的显示状态
  const isShow = ref(false);
  // 改变信息窗的显示状态
  const changeState = (payload) => {
    isShow.value = payload;
  };

  // 初始化所有路况列表数据
  const roadList = ref([]);
  // 获取列表的数据
  const getRoadList = (payload) => {
    roadList.value = payload;
  };

  // 初始化分页列表数据
  const roadTableList = ref([]);
  // 切换分页——更新列表数据
  const changeTableList = (payload) => {
    roadTableList.value = payload;
  };
  /////////////////////////////////////////////////////////////
  //上报路况相关
  const isShowReport = ref(false);
  const setReportShow = (val) => {
    isShowReport.value = val;
  };
  return {
    isShow,
    changeState,
    roadList,
    getRoadList,
    roadTableList,
    changeTableList,
    //////上报路况相关
    isShowReport,
    setReportShow,
  };
});
