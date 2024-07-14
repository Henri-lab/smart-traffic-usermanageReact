<template>
  <div id="map"></div>
</template>
<script setup>
import { onMounted,onUnmounted } from "vue";
import { app } from "../main";
import { gcj02Mecator } from "@/utils/map";
// 高德矢量
const gaode_vector = new ol.layer.Tile({
  title: "高德矢量",
  source: new ol.source.XYZ({
    url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&scl=1&style=7&x={x}&y={y}&z={z}",
    // 瓦片加载前，进行滤镜调色
    tileLoadFunction: function(imageTile, src) {
      let img = new Image()
      // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function () {
          let canvas = document.createElement('canvas')
          let w = img.width
          let h = img.height
          canvas.width = w
          canvas.height = h
          let context = canvas.getContext('2d')
          context.willReadFrequently = true
          context.filter = 'brightness(80%)' //滤镜亮度设置
          context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
          let imageData = context.getImageData(0, 0, w, h);
          for (let i = 0; i < imageData.height; i++) {
              for (let j = 0; j < imageData.width; j++) {
                  var x = (i * 4) * imageData.width + (j * 4);
                  //关键代码
                  //运用图像学公式，设置灰度值
                  const gray = imageData.data[x] * 0.3 + imageData.data[x + 1] * 0.59 + imageData.data[x + 2] * 0.11
                  imageData.data[x] = gray;
                  imageData.data[x + 1] = gray;
                  imageData.data[x + 2] = gray;
                  // 设置为深蓝色
                  // imageData.data[x] = 55 - gray
                  // imageData.data[x + 1] = 255 - gray
                  // imageData.data[x + 2] = 305 - gray
              }
          }
          context.putImageData(imageData, 0, 0);
          imageTile.getImage().src = canvas.toDataURL('image/png')
      }
      img.src = src
    },
    wrapX: false,
    crossOrigin: "Anonymous", //实现下载功能必须设置数据源跨域
    projection: gcj02Mecator()
  }),
});
// 高德影像
const gaode_image = new ol.layer.Tile({
  title: "高德影像",
  source: new ol.source.XYZ({
    url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}",
    wrapX: false,
    crossOrigin: "Anonymous",
    projection: gcj02Mecator()
  }),
});
var docLayer = new Zondy.Map.Doc("", "guanggu-doc", {
  ip: "localhost",
  port: 6163,
  crossOrigin: "Anonymous",
});
onMounted(() => {
  var map = new ol.Map({
    target: "map",
    // layers: [tdt_vector,tdt_w_vector, docLayer],
    layers: [gaode_image,gaode_vector, docLayer],
    view: new ol.View({
      projection: "EPSG:4326",
      center: [114.38, 30.5],
      zoom: 9,
    }),
  });
  map.getView().animate({
    center: [114.38, 30.5],
    zoom: 13,
    duration: 1000,
  });
  //注册全局map
  app.provide("$map", map);
});
</script>
<style scoped>
#map {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
