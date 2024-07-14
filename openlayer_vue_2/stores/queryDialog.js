import { ref } from "vue";
import { defineStore } from "pinia";
import { filterDataByPermission } from "@/filters/event-query"
export const queryDialogStore = defineStore("query", () => {
  const isDialogShow = ref(false)
  let tableData = ref([])
  let totalData = ref(0)
  let heatLayerData = ref(null)
  // 弹窗框的显隐控制
  function setDialogShow(val) {
    isDialogShow.value = val
  }
  // 列表数据渲染的处理
  function setData(val) {
    tableData.value = []
    heatLayerData.value = val
    totalData.value = val.TotalCount
    tableData.value = filterDataByPermission(localStorage.getItem("type"), val)
  }
  return {
    isDialogShow,
    tableData,
    setDialogShow,
    setData,
    totalData,
    heatLayerData  
  }
})