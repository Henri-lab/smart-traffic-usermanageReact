import { getRoadHttp } from "@/api/road";
import { useRoadStore } from "../../stores/roadDialog.js";
export const roadConditionHook = () => {
  const roadStore = useRoadStore();
  // 审核路况
  const checkRoad = async () => {
    const res = await getRoadHttp();
    // 所有路况数据
    roadStore.getRoadList(res.data);
    // 初始列表数据（分页第一页）
    roadStore.changeTableList(res.data.slice(0, 5));
    //弹窗
    roadStore.changeState(true);
  };
  //上报路况
  const reportRoad = () => {
    //显示组件
    roadStore.setReportShow(true);
  };
  return {
    checkRoad,
    reportRoad,
  };
};
