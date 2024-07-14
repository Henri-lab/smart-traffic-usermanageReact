import { useEventStore } from "@/stores/addEventDialog";
import { ElMessage } from "element-plus";
export const addEventHook = () => {
  const eventStore = useEventStore();
  // 添加事件
  const addEvent = (map) => {
    // 提示信息
    ElMessage({
      message: "点击地图具体位置添加事件",
      type: "info",
      duration: 1500,
    });

    // 创建画笔数据源
    const source = new ol.source.Vector({});
    const layer = new ol.layer.Vector({
      source,
    });
    // map.addLayer(layer);
    // 创建画笔
    const draw = new ol.interaction.Draw({
      source,
      type: "Point",
    });
    map.addInteraction(draw);
    draw.on("drawend", (e) => {
      let position = e.feature.getGeometry().getCoordinates();
      // 设置坐标
      eventStore.setPosition(position);
      // 显示弹窗
      eventStore.changeState(true);
    });
  };

  return { addEvent };
};
