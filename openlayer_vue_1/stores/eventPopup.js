import { ref } from "vue";
import { defineStore } from "pinia";

export const usePopupStore = defineStore("event-popup", () => {
  // 弹窗的显示状态
  const isShow = ref(false);
  // 改变弹窗的显示状态
  const setIsShow = (payload) => {
    isShow.value = payload;
  };
  //弹窗的标题
  const title = ref("");
  //设置弹窗的标题
  const setTitle = (payload) => {
    title.value = payload;
  }
  //数据数组
  const dataList = ref([]);
  // 设置数据数组的变化
  const setDataList = (payload) => {
    dataList.value = payload;
  };
  // 坐标位置
  const position = ref([]);
  // 设置坐标位置
  const setPosition = (payload) => {
    position.value = payload;
  };
  //是否打开更新按钮
  const isUpdate = ref(false);
  //事件属性信息
  const attrInfo = ref({});
  //事件状态修改缓存
  const updateStatus =ref("")
  return {
    isShow,
    setIsShow,
    position,
    setPosition,
    dataList,
    setDataList,
    title,
    setTitle,
    isUpdate,
    attrInfo,
    updateStatus
  };
});
