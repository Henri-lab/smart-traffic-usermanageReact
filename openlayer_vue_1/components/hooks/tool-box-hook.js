import { inject, onMounted } from "vue";
import { createDraw } from "@/utils/create-draw.js";
import { measure } from "@/utils/measure.js";
export const toolBoxHook = () => {
  let $map = null;
  // 创建画笔数据源
  let drawSource = new ol.source.Vector({});
  let drawLayer = new ol.layer.Vector({
    source: drawSource,
  });
  onMounted(() => {
    $map = inject("$map");
    $map.addLayer(drawLayer);
  });

  // 创建画笔
  const lineDraw = createDraw({ source: drawSource, type: "LineString" });
  const polygonDraw = createDraw({
    source: drawSource,
    type: "Polygon",
  });

  // 测量长度
  const measureLength = () => {
    $map.getInteractions().pop();
    // 激活线画笔
    // map.addInteraction(lineDraw);
    measure({ map: $map, draw: lineDraw });
  };

  // 测量面积
  const measureArea = () => {
    // 移除线画笔
    $map.getInteractions().pop();
    // 激活多边形画笔
    // map.addInteraction(polygonDraw);
    measure({ map: $map, draw: polygonDraw });
  };

  // 全部清除
  const clearAll = () => {
    $map.getOverlays().clear();
    // 清除所有要素
    drawSource.clear();
    // 移除画笔
    $map.removeInteraction(lineDraw);
    $map.removeInteraction(polygonDraw);
  };

  // 导出图片
  const exportImage = () => {
    $map.once("postcompose", function (event) {
      const canvas = event.context.canvas;
      canvas.toBlob(function (blob) {
        // console.log(blob);
        saveAs(blob, "map.png");
      });
    });
    $map.renderSync();
  };
  return { measureLength, measureArea, clearAll, exportImage };
};
