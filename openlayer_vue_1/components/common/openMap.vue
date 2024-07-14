<template>
  <div id="map"></div>
</template>
<script setup>
import { app } from "@/main.js";
import { onMounted, ref } from "vue";
import { gaode_image, gaode_vector } from "../../plugins/Layer.js";
let map = null;

onMounted(() => {
  map = new ol.Map({
    target: "map",
    layers: [gaode_image, gaode_vector],
    view: new ol.View({
      center: [114.3, 30.5],
      zoom: 13,
      projection: "EPSG:4326",
    }),
  });
  app.config.globalProperties.$map = map;
  map.addLayer(layer);
  map.addLayer(docLayer);
});

const gaode = new ol.layer.Tile({
  title: "高德地图",
  source: new ol.source.XYZ({
    url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
    wrapX: false,
    crossOrigin: "Anonymous",
  }),
});

//加载路网矢量图
const docLayer = new Zondy.Map.Doc("", "guanggu", {
  // ip: "localhost",
  // port: 6163
  crossOrigin: "Anonymous",
});

let source = new ol.source.Vector({});
let layer = new ol.layer.Vector({
  source,
});
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
/* :deep(.ol-control button) {
  background-color: #c9e59e;
} */
/* 导航控件 */
:deep(.ol-zoom-extent) {
  top: 10em;
  left: 0.5em;
}
:deep(.ol-control button) {
  background-color: yellowgreen;
}
:deep(.ol-zoom) {
  top: 6em;
}

:deep(.ol-zoomslider) {
  top: 12em !important;
  background-color: #652e8080;
}

:deep(.ol-zoomslider:hover) {
  cursor: pointer;
}
:deep(.ol-overviewmap) {
  position: fixed;
  bottom: 0px;
  left: 0px !important;
}
/* 全屏控件 */
:deep(.ol-full-screen) {
  top: 4em;
  left: 0.5em;
}
/* 比例尺控件 */
:deep(.ol-scale-line) {
  bottom: 2em;
  left: 0.5em;
}
</style>
