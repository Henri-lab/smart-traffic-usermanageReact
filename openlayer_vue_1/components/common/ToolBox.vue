<template>
  <div class="tool-box">
    <button id="btn2" @click="activeDraw()">测量长度</button>
    <button id="btn3" @click="measureArea()">测量面积</button>
    <button id="btn1" @click="clearDraw()">取消测量</button>
    <button id="btn4" @click="exportData">导出图片</button>
  </div>
</template>

<script setup>
import { createDraw } from "@/utils/createDraw.js";
import { onMounted, ref, getCurrentInstance } from "vue";

//地图变量
let $map = null;

let lineSource = null;
let polygonSource = null;
let lineLayer = null;
let polygonLayer = null;
let lineResult = null;
let areaResult = null;

// 创建画笔数据源--线和面的数据源不同
lineSource = new ol.source.Vector({});
polygonSource = new ol.source.Vector({});

polygonLayer = new ol.layer.Vector({
  source: polygonSource,
});
lineLayer = new ol.layer.Vector({
  source: lineSource,
  // zInedx: 999,
  // style:function(feature){
  //   return new ol.style.Text({
  //     offsetX: 0,
  //     offsetY: 10,
  //     font: "normal 22px 微软雅黑",
  //     text:  area.value,
  //     fill: new ol.style.Fill({
  //       color: "red",
  //     }),
  //   }),

  // }
});
onMounted(() => {
  const { proxy } = getCurrentInstance();
  $map = proxy.$map;
  $map.addLayer(lineLayer);
  $map.addLayer(polygonLayer);
});

//创建画笔
const lineDraw = createDraw({
  type: "LineString",
  /* type: "Box", */
  source: lineSource,
});
const polygonDraw = createDraw({
  source: polygonSource,
  type: "Polygon",
});

//激活线画笔
const activeDraw = () => {
  if (polygonDraw) {
    $map.removeInteraction(polygonDraw);
  }
  $map.addInteraction(lineDraw);
};
//激活面画笔
const measureArea = () => {
  if (lineDraw) {
    $map.removeInteraction(lineDraw);
  }
  $map.addInteraction(polygonDraw);
};

// 监听画笔测量长度
lineDraw.on("drawsmove", (evt) => {
  let feature = evt.feature;
  let line = new ol.format.GeoJSON().writeFeatureObject(feature);
  console.log(line, "line");

  var result = turf.lineDistance(line);
  let lineResult;

  if (result > 1) {
    lineResult = result.toFixed(2) + " km"; // 默认为公里
  } else {
    lineResult = (result * 1000).toFixed(2) + " m"; // 转换为米
  }

  displayMeasurementResult(feature, lineResult);
});

// 显示测量结果的函数
function displayMeasurementResult(feature, lineResult) {
  const txt_style = new ol.style.Style({
    text: new ol.style.Text({
      offsetX: 0,
      offsetY: 10,
      font: "normal 22px 微软雅黑",
      text: lineResult,
      fill: new ol.style.Fill({
        color: "red",
      }),
    }),
    stroke: new ol.style.Stroke({
      color: "#2a82e4",
      width: 10,
    }),
  });

  feature.setStyle(txt_style);
  lineSource.addFeatures([feature]); // 这里使用数组来添加要素
}

lineDraw.on("drawend", (evt) => {
  //console.log(evt.feature, "111");
  let feature = evt.feature;
  let line = new ol.format.GeoJSON().writeFeatureObject(feature);
  console.log(line, "line");
  var result = turf.lineDistance(line);
  if (result > 1) {
    console.log(result.toFixed(2) + "km"); //默认为公里
    //alert("测量结果：" + result.toFixed(2) + "km");
    lineResult = result.toFixed(2) + "km";
    //alert(lineResult);
    //var position = feature.getGeometry().getCoordinates();
    //console.log(position, "position");

    //console.log(position[0], "position[0]");

    //显示测量结果
    const txt_style = new ol.style.Style({
      text: new ol.style.Text({
        offsetX: 0,
        offsetY: 10,
        font: "normal 22px 微软雅黑",
        text: lineResult,
        fill: new ol.style.Fill({
          color: "red",
        }),
      }),
      stroke: new ol.style.Stroke({
        color: "#2a82e4",
        width: 10,
      }),
    });
    feature.setStyle(txt_style);
    lineSource.addFeatures(feature);
  } else {
    lineResult = (result * 1000).toFixed(2) + "m";
    //alert(lineResult);
    //var position = feature.getGeometry().getCoordinates();
    //console.log(position, "position");

    //console.log(position[0], "position[0]");

    //显示测量结果
    const txt_style = new ol.style.Style({
      text: new ol.style.Text({
        offsetX: 0,
        offsetY: 10,
        font: "normal 22px 微软雅黑",
        text: lineResult,
        fill: new ol.style.Fill({
          color: "red",
        }),
      }),
      stroke: new ol.style.Stroke({
        color: "#2a82e4",
        width: 10,
      }),
    });
    feature.setStyle(txt_style);
    lineSource.addFeatures(feature);
  }
});

// 监听画笔 测量面积
polygonDraw.on("drawend", (evt) => {
  lineResult = null;
  let feature = evt.feature;
  // console.log(feature, "feature1111111111111111111");
  //let polygon = new ol.format.GeoJSON().writeFeatureObject(feature);

  let position = feature.getGeometry().getCoordinates();
  var polygon = turf.polygon(position);

  var res = turf.area(polygon);
  if (res / 1000000 > 1) {
    areaResult = (res / 1000000).toFixed(2) + "km²";
  } else {
    areaResult = res.toFixed(2) + "m²";
  }

  // let position = feature.getGeometry().getCoordinates();
  // var polygon = turf.polygon(position);
  // var areaResult = turf.area(polygon).toFixed(2); //平方米
  // console.log(areaResult, "area");

  //显示测量结果
  const txt_style = new ol.style.Style({
    text: new ol.style.Text({
      offsetX: 0,
      offsetY: 10,
      font: "normal 22px 微软雅黑",
      text: areaResult,
      fill: new ol.style.Fill({
        color: "red",
      }),
    }),
    stroke: new ol.style.Stroke({
      color: "#2a82e4",
      width: 10,
    }),
  });
  feature.setStyle(txt_style);
  polygonSource.addFeatures(feature);
});

//清除画笔 清除测量结果
const clearDraw = () => {
  /* $map.removeLayer(lineLayer);
  $map.removeLayer(polygonLayer); */
  lineSource.clear();
  polygonSource.clear();
  /* lineResult = null;
  areaResult = null; */
  $map.removeInteraction(lineDraw);
  $map.removeInteraction(polygonDraw);
};

//导出数据
const exportData = () => {
  $map.once("postcompose", function (event) {
    const canvas = event.context.canvas;
    console.log(canvas);
    canvas.toBlob(function (blob) {
      console.log(blob);
      saveAs(blob, "map.png");
    });
  });
  $map.renderSync();
};
</script>

<style scoped>
.tool-box {
  display: flex;
  flex-direction: column; /* 使得子元素竖着排列 */
  z-index: 999; /* 保证在最上层 */
  position: absolute;
  top: 40%;
  right: 0.5%;
}
.tool-box button {
  width: 80px;
  padding: 5px;
  background-color: #545c64;
  color: #fff;

  /* text-align: justify; */
}

/* #btn1 {
  position: absolute;
  top: 30px;
  left: 70px;
  z-index: 99;
  height: 45px;
  width: 100px;
  flex-flow: wrap;
}

#btn2 {
  position: absolute;
  top: 30px;
  left: 190px;
  z-index: 99;
  height: 45px;
  width: 100px;
  flex-flow: wrap;
}

#btn3 {
  position: absolute;
  top: 30px;
  left: 290px;
  z-index: 99;
  height: 45px;
  width: 100px;
  flex-flow: wrap;
}

#btn4 {
  position: absolute;
  top: 30px;
  left: 390px;
  z-index: 99;
  height: 45px;
  width: 100px;
  flex-flow: wrap;
} */
</style>
