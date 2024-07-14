<template>
  <!-- 这个是地图控件和切换图层的功能-->

  <!-- 添加鼠标显示坐标值 -->
  <div id="mouse-position" placeholder="坐标"></div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useQueryEventStore } from "@/stores/queryEventDialog";

/* 地图控件 */
onMounted(() => {
  const { proxy } = getCurrentInstance(); //key-code
  const $map = proxy.$map;
  /* 地图导航控件 */
  const navControl = new ol.control.ZoomToExtent({
    extent: [100, 30, 140, 30],
  });
  $map.addControl(navControl);
  /* zoomslider */
  const zoomslider = new ol.control.ZoomSlider();
  $map.addControl(zoomslider);

  /* 比例尺 */
  const scaleLineControl = new ol.control.ScaleLine({
    /* 设置比例尺单位,degrees,imperial,us,nautical,metric */
    units: "metric",
  });
  $map.addControl(scaleLineControl);

  /* 鼠标显示坐标值*/
  const mousePositionControl = new ol.control.MousePosition({
    /* 坐标格式 */
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: "EPSG:4326",
    /* 坐标信息显示样式类名,默认是'ol-mouse-position' */
    className: "custom-mouse-position",
    target: document.getElementById("mouse-position"),
    undefinedHTML: "&nbsp",
  });
  $map.addControl(mousePositionControl);

  /* 全屏控件 */
  const fullScreen = new ol.control.FullScreen();
  $map.addControl(fullScreen);
});
</script>

<style scoped>
#mouse-position {
  position: absolute;
  bottom: 0.5em;
  z-index: 100;
  left: 5.1em;
  transform: translateX(-50%);
  width: 150px;
  height: 20px;
  background-color: #b0c0d2;
  text-align: center;
  line-height: 20px;
  color: black;
}
</style>
