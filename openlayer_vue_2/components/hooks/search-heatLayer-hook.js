import { ref, inject, onMounted } from "vue";
import { queryDialogStore } from "@/stores/queryDialog";

export const searchHeatLayerHook = () => {
  let map = ref(null);
  const store = queryDialogStore();
  let heatMapLayer = new ol.layer.Heatmap({
    source: new ol.source.Vector(),
    /* 模糊 */
    blur: 3,
    /* 半径 */
    radius: 10,
    name: "heatlayer",
  });
  let features;
  onMounted(() => {
    map = inject("$map");

    map.addLayer(heatMapLayer);
  });
  function addHeatLayer() {
    heatMapLayer.getSource().clear();
    //初始化Zondy.Format.PolygonJSON类
    var format = new Zondy.Format.PolygonJSON();
    //将MapGIS要素JSON反序列化为ol.Feature类型数组
    features = format.read(store.heatLayerData);
    heatMapLayer.getSource().addFeatures(features);
  }
  function removeHeatLayer() {
    const layers = map.getLayers().array_;
    //找到线图层和裁剪图层
    const heatlayer = layers.find((item) => {
      return item.get("name") == "heatlayer";
    });
    // heatMapLayer.getSource().clear();
    map.removeLayer(heatlayer);
    // console.log(heatMapLayer,map, 9999);
  }
  return { addHeatLayer, removeHeatLayer };
};
