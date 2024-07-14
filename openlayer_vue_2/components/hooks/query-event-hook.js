import { createDraw } from "@/utils/create-draw";
import { useQueryEventStore } from "@/stores/queryEventDialog";

export const queryEventHook = () => {
  const queryEventStore = useQueryEventStore();

  // 创建画笔数据源
  const source = new ol.source.Vector({});
  const layer = new ol.layer.Vector({
    source,
  });
  // 创建画笔
  const draw = createDraw({
    source,
    type: "Box",
  });
  // 查询事件
  const activeDraw = (map) => {
    map.addLayer(layer);
    // 激活画笔
    map.addInteraction(draw);
    draw.on("drawstart", () => {
      source.clear();
    });
    draw.on("drawend", (e) => {
      map.removeLayer(layer);
      let geom = e.feature.getGeometry();
      queryEventStore.setGeom(geom);
    });
  };
  // 取消查询
  const deactiveDraw = (map) => {
    // 清除画笔
    // map.getInteractions().pop();
    map.removeInteraction(draw);
    source.clear();
    // 清除热力图
    const heatLayer = map
      .getLayers()
      .array_.find((item) => item.get("name") === "heatLayer");
    if (heatLayer) {
      heatLayer.getSource().clear();
      map.removeLayer(heatLayer);
    }
    // 改变热力图的显示状态
    queryEventStore.setHeatLayer(false);
  };
  return {
    activeDraw, //查询事件
    deactiveDraw, //取消查询
  };
};
