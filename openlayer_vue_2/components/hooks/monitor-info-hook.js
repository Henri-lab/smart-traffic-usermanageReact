import { useMainStore } from "@/stores";
import { Query } from "@/utils/query-map-gis";
import { ElMessage } from "element-plus";
const $store = useMainStore();
export function monitorInfoHook() {
  function OpenMonitor(map) {
    function MonitorInfo(e) {
      $store.setMonitorPopup = true;
      let position = e.coordinate;
      Query.queryByPnt({
        position,
        service: {
          name: "guanggu-doc",
          layerId: 3,
        },
        success: querySuccess,
      });
    }
    function querySuccess(data) {
      // 获取当前点击的点是否存在要素, 并返回
      if (data.TotalCount === 0) {
        popup.setPosition(position);
        ElMessage({
          message: "当前点无要素，请重新选择",
          type: "error",
          grouping: true,
          duration: 1000,
        });
        return;
      }
      var format = new Zondy.Format.PolygonJSON();
      //将MapGIS要素JSON反序列化为ol.Feature类型数组
      var feature = format.read(data)[0];
      if (feature) {
        $(".title").html(feature.values_.values_["编号"]);
        $(".position").html(feature.values_.values_["位置"]);
        $(".video")[0].src = "/src/assets/videos/video.mp4";
      }
      var position = feature.getGeometry().getCoordinates()[0];
      popup.setPosition(position);
      //添加关闭按钮的单击事件（隐藏popup）
      $(".popup-closer").on("click", function () {
        //未定义popup位置
        popup.setPosition(undefined);
        //失去焦点
        $(".popup-closer").blur();
        return false;
      });
      $(".关闭监控").on("click", function () {
        //未定义popup位置
        popup.setPosition(undefined);
        //失去焦点
        $(".popup-closer").blur();
        map.un("click", MonitorInfo);
        return false;
      });
    }
    const popup = new ol.Overlay({
      //要转换成overlay的HTML元素
      element: $(".popup")[0],
      //当前窗口可见
      autoPan: true,
      //Popup放置的位置
      positioning: "bottom-center",
      //是否应该停止事件传播到地图窗口
      stopEvent: true,
      autoPanAnimation: {
        //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
        duration: 250,
      },
    });
    map.addOverlay(popup);
    map.on("click", MonitorInfo);
  }
  return { OpenMonitor };
}
