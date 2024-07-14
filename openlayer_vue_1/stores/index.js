import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {
    //工具箱显示状态
  const isShow = ref(false)
  return { isShow }
})


export const useMainStore = defineStore("main", () => {
  const type = ref(""); //身份类型
  const setMonitorPopup = ref(false); //监控弹窗显示
  return {
    type,
    setMonitorPopup,
  };
});

export const usePopupStore = defineStore('popup', () => {
    //数据数组
  const dataList = ref([]);
  // 设置数据数组的变化
  const setDataList = (e) => {
    dataList.value = e;
  };
  //控制弹窗是否显示
  const isShow = ref(false);
  // 设置弹窗隐藏
  const setHide = () => {
    isShow.value = false;
  };
  // 设置弹窗显示
  const setShow = () => {
    isShow.value = true;
  };
  return { dataList,setDataList,isShow,setShow,setHide }
  //关闭查询
  const deactiveDraw =()=>{
    
  }
})
