<template>
  <!-- 地图控件 -->
  <div id="control">
    <div class="mouse-position"></div>
    <button class="reset" @click="resetMap"><div class="icon"></div></button>
    <div class="vector"></div>
    <div class="image"></div>
    <!-- 底图切换 -->
    <div class="base-map">
      <el-radio-group v-model="baseMap" style="margin-bottom: 30px">
        <el-radio-button label="gaode_vector">2D平面</el-radio-button>
        <el-radio-button label="gaode_image">卫星影像</el-radio-button>
      </el-radio-group>
    </div>
  </div>
  <!-- 图层目录树 -->
  <button class="catlog" @click="roadCatlog">
    <div></div>
  </button>
  <Transition name="tree">
    <div id="dir_tree" v-show="isShow">
      <h1>图层目录</h1>
      <div class="box"></div>
    </div>
  </Transition>
</template>

<script setup>
import { inject, onMounted, ref, watch } from "vue";
let isShow = ref(false);
let $map = null;
onMounted(() => {
  $map = inject("$map");
  const navControl = new ol.control.ZoomToExtent({
    extent: [100, 30, 140, 30],
  });
  $map.addControl(navControl);
  const zoomslider = new ol.control.ZoomSlider();
  $map.addControl(zoomslider);
  const scaleLineControl = new ol.control.ScaleLine({
    units: "metric",
  });
  $map.addControl(scaleLineControl);
  /* 全屏控件 */
  const fullScreen = new ol.control.FullScreen();
  $map.addControl(fullScreen);
  /* 自定义鼠标事件 */
  $map.on("pointermove", (evt) => {
    let center = evt.coordinate;
    /* $:找到 */
    /* html:innerHTML */
    $(".mouse-position").html(
      `${center[0].toFixed(2)}, ${center[1].toFixed(2)}`
    );
  });
  const overviewMapControl = new ol.control.OverviewMap({
    /* 鹰眼控件样式  */
    className: "ol-overviewmap ol-custom-overviewmap",
    layers: $map.getLayers().array_,
    /* 鹰眼控件展开时功能按钮上的标识(网页的JS的字符编码) */
    collapseLabel: "\u00BB",
    /* 鹰眼控件折叠时功能按钮上的标识(网页的JS的字符编码) */
    label: "\u00AB",
    /* 初始为展开显示方式 */
    collapsed: false,
    view: new ol.View({
      projection: "EPSG:4326",
      minZoom: 7,
      maxZoom: 18,
    }),
  });
  $map.addControl(overviewMapControl);
  /* 目录树 */
  const docCatalog = new Zondy.Catalog.MapDoc({
    docName: "guanggu-doc",
  });
  //解决获取图层写死导致后续加载图层失败问题
  const layers = $map.getLayers().array_;
  let docLayer;
  layers.forEach((item) => {
    if (item.get("name") === "guanggu-doc") {
      docLayer = item;
    }
  });
  docCatalog.getLayersInfo((data) => {
    var children = [];
    data.value.forEach((item) => {
      let { LayerIndex, Name } = item;
      children.push({
        id: LayerIndex,
        label: Name,
      });
    });
    children.forEach((item) => {
      var template = `<div class="layer"><input checked type="checkbox" id="${item.id}" class="input">${item.label}</div>`;
      $(".box").append(template);
    });
  });
  setTimeout(() => {
    $(".box .input").change(function (evt) {
      let checked = evt.target.checked;
      let layerId = evt.target.id;
      docLayer.setLayerStatus(layerId, checked ? "include" : "exclude");
    });
  }, 800);
});
/* 复位 */
const resetMap = () => {
  $map.getView().animate({
    center: [114.38, 30.5],
    zoom: 14,
  });
};

// 底图切换
let baseMap = ref("gaode_vector");
watch(baseMap, (newValue) => {
  // 获取高德矢量图层
  let vectorLayer = $map.getLayers().array_.find((item) => {
    return item.values_.title === "高德矢量";
  });
  if (newValue === "gaode_image") {
    vectorLayer.setOpacity(0);
  } else {
    vectorLayer.setOpacity(1);
  }
});
/* 控制目录树显示隐藏 */
function roadCatlog() {
  isShow.value = !isShow.value;
}
</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
}
.ol-zoom {
  top: unset;
  bottom: 3em;
}
.ol-zoom,
.ol-zoom-extent {
  left: 0.5em;
  background: transparent;
  button {
    background: #edab5c;
  }
}
.ol-zoom-extent {
  top: unset;
  bottom: 0.5em;
}
.ol-zoomslider {
  height: 150px;
  left: 0.5em;
  top: unset;
  bottom: 7em;
  background-color: #edab5c55;
  button {
    background: #1e4359;
  }
}
.ol-scale-line {
  left: unset;
  right: 2.5em;
  background: #edab5c55;
}
.ol-full-screen {
  top: unset;
  bottom: 0.5em;
  button {
    background: #edab5c;
  }
}
.ol-overviewmap {
  bottom: 2.5em;
  top: unset;
  right: 10px;
  left: unset;
}
.ol-overviewmap .ol-overviewmap-map {
  width: 120px;
  height: 120px;
}
.mouse-position {
  position: absolute;
  bottom: 10px;
  left: 50%;
  color: #fff;
  font-size: 14px;
  transform: translateX(-50%);
  background: #3174aa66;
  padding: 5px 10px;
  border-radius: 5px;
}
.reset {
  position: absolute;
  bottom: auto;
  right: 0.8em;
  padding: 1px;
  background: #edab5c;
  appearance: none;
  border: none;
  outline: none;
  border-radius: 2px;
  border: 0.5px solid transparent;
  .icon {
    width: 22px;
    height: 22px;
    background: url("../assets/images/unset1.svg") no-repeat center center;
    background-size: 18px;
    cursor: pointer;
    &:hover {
      background: url("../assets/images/unset2.svg") no-repeat center center;
      background-size: 18px;
      cursor: pointer;
    }
  }
  &:hover {
    border: 0.5px solid #000;
  }
}
.base-map {
  z-index: 100;
  position: absolute;
  bottom: 7.5rem;
  right: 0.5rem;
}
.el-radio-group {
  flex-direction: column;
  gap: 1.25rem;
}
.el-radio-button {
  width: 7.8rem;
  height: 7.8rem;
  cursor: pointer;
}
.el-radio-button:nth-child(1) {
  background: url("../assets/images/gaode_vector.png") no-repeat center center;
}
.el-radio-button:nth-child(2) {
  background: url("../assets/images/gaode_image.png") no-repeat center center;
}
.is-active {
  border: 2px solid red;
}
.catlog {
  position: absolute;
  top: 5.5em;
  left: 0.5em;
  bottom: auto;
  right: auto;
  padding: 1px;
  background: #edab5c;
  appearance: none;
  border: none;
  outline: none;
  border-radius: 2px;
  border: 0.5px solid transparent;
  div {
    width: 22px;
    height: 22px;
    background: url("../assets/images/layer1.svg") no-repeat center center;
    background-size: 18px;
    cursor: pointer;
    &:hover {
      background: url("../assets/images/layer2.svg") no-repeat center center;
      background-size: 18px;
    }
  }
  &:hover {
    border: 0.5px solid #000;
  }
}
#dir_tree {
  margin-left: 5px;
  margin-top: 45px;
  padding: 20px 10px;
  position: relative;
  width: 220px;
  height: 300px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  border: 1px solid #3174aa;
  h1 {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .box {
    margin-top: 10px;
    margin-left: 50px;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
.tree-enter-active {
  position: absolute;
  animation: backInLeft 2s;
}
.tree-leave-active {
  position: absolute;
  animation: backOutLeft 2s;
}
</style>
