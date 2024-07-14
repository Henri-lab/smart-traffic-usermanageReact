<template>
  <!-- //这是是事件查询 1先拉框-画笔-2.弹窗-弹出事件数据
  //搜索查询--1.输入框-2.搜索按钮-3.搜索结果 -->

  <el-sub-menu index="2">
    <template #title>事件管理</template>
    <el-menu-item index="2-1" @click="activeDraw()">事件查询</el-menu-item>
    <el-menu-item index="2-2" @click="deactiveDraw()">关闭查询</el-menu-item>
  </el-sub-menu>
  <QueryEventPopup v-show="$queryEvent.isShow"></QueryEventPopup>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import QueryEventPopup from "./QueryEventPopup.vue";
import { createDraw } from "@/utils/createDraw";
import img from "@/assets/坐标点.png";
import { usePopupStore } from "@/stores/index";
import { Query } from "@/utils/Query.js";
const $queryEvent = usePopupStore();
/* //传递给子组件函数
provide("msg", deactiveDraw); */
let resArray = ref([]);
const randerArray = ref([]);
const elementDate = ref([]); //element数据
const elementBool = ref(false);
const elementListBool = ref(true);
let GeoData = ref({});
let $map = null;
let source = null;
let layer = null;

defineExpose({
  /* deactiveDraw, */
});
//设置标注高亮图层
let marker_source = new ol.source.Vector({
  features: [],
});
const style = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 30],
    anchorOrigin: "top-right",
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    offsetOrigin: "top-right",
    // zindex:10000,
    /* offset:[-10,0], */
    //图标缩放比例
    scale: 1,
    //透明度
    opacity: 0.75,
    //图标的url
    src: img,
  }),
});
let marker_layer = new ol.layer.Vector({
  source: marker_source,
  style: style,
});
//创建画笔数据源
source = new ol.source.Vector({});
layer = new ol.layer.Vector({ source });
const { proxy } = getCurrentInstance();
$map = proxy.$map;
//将地图加载到全局

onMounted(() => {
  const { proxy } = getCurrentInstance();
  $map = proxy.$map;

  /* $map.addLayer(layer); */
  /* $map.addLayer(marker_layer); */
});
const service = {
  name: "guanggu",
  layerId: 2,
};
//创建画笔
const queryDraw = createDraw({
  source,
  type: "Box",
});
//查询事件
const activeDraw = () => {
  //添加图层
  $map.addLayer(layer);
  $map.addLayer(marker_layer);
  console.log(marker_layer, "marker_layer");
  //激活画笔
  $map.addInteraction(queryDraw);
  //监听画笔开始事件;
  queryDraw.on("drawstart", () => {
    //清空画笔数据源
    source.clear();
    //清空marker 图层
    /* $map.removeLayer(marker_layer); */
    //清空marker数据源 清空数据源  刷新加载图层页面
    marker_source.clear();
  });
  //监听画笔移动事件
  queryDraw.on("drawmove", () => {});
  //监听画笔结束事件
  queryDraw.on("drawend", (evt) => {
    /* $map.addLayer(marker_layer); */
    /*  map.removeLayer(layer); //移除画笔图层?????
    let geom = e.feature.getGeometry();
    queryEventStore.setGeom(geom); */
    /* //几何图形包含关系判断 */
    elementBool.value = true;
    // let position = getCoordinate(evt.feature);
    let geometry = evt.feature.getGeometry();
    /* 1、查询要素的查询结构 */
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    // let pointObj = new Zondy.Object.Point2D(position[0], position[1]);
    // pointObj.nearDis = 1; //必选参数--点的搜索半径
    var geomObj = new Zondy.Object.Polygon();
    geomObj.setByOL(geometry);
    /* 2、设置查询的规则 */
    var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true,
    });

    /* 3、设置查询参数 */
    source.clear();
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: geomObj, //key-code
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });
    /* 4、调用查询服务 */
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId
    );
    queryParam.pageIndex = 0;
    queryParam.recordNumber = 100;
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(querySuccess);
  });

  //查询到数据之后进行数据渲染-popup弹窗
};
// let GeoData = ref([]);
function querySuccess(data) {
  resArray = [];
  randerArray.value = data.SFEleArray;
  //console.log("查询成功", randerArray.value);
  $queryEvent.dataList = data.SFEleArray;
  //console.log("查询结果", $queryEvent.dataList);
  $queryEvent.setShow();
  /*--------设置marker-------*/
  //将MapGIS要素JSON反序列化为ol.Feature类型数组
  var format = new Zondy.Format.PolygonJSON();
  resArray = format.read(data);
  /* if (resArray) {
      GeoData.value = new ol.format.GeoJSON().writeFeaturesObject(resArray);
    } else {
      return;
    } */
  marker_source.addFeatures(resArray);
  marker_layer.setSource(marker_source);
}

//关闭查询
const deactiveDraw = () => {
  //移除画笔 移除画笔图层  数据源 移除marker图层  数据源
  $map.removeInteraction(queryDraw);
  $map.removeLayer(layer);
  marker_source.clear();
  $map.removeLayer(marker_layer);
  source.clear();
  $queryEvent.setHide();
  console.log("关闭查询");
};
</script>

<style lang="scss" scoped></style>
