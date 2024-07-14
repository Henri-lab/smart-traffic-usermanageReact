<template>
  <button class="catlog" @click="roadCatlog">
    <div>图层目录</div>
  </button>
  <Transition name="tree">
    <div id="dir_tree" v-show="isShow">
      <h1>图层目录</h1>
      <div class="box"></div>
    </div>
  </Transition>
</template>

<script setup>
import { inject, onMounted, ref, watch,getCurrentInstance } from "vue";

let isShow = ref(false);
let $map = null;
onMounted(() => {
    const { proxy } = getCurrentInstance();
    $map = proxy.$map;

/* 目录树 */
const docCatalog = new Zondy.Catalog.MapDoc({
    docName: "guanggu",
  });
  //解决获取图层写死导致后续加载图层失败问题
  const layers = $map.getLayers().array_;
  let docLayer;
  layers.forEach((item) => {
    if (item.get("name") === "guanggu") {
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

function roadCatlog() {
  isShow.value = !isShow.value;
}
</script>

<style lang="scss" scoped>


.catlog {
  position: absolute;
//   top: 5.5em;
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

    width: 100px;
    height: 22px;
    // background: url("../../assets/layer1.svg") no-repeat center center;
    background-size: 18px;
    cursor: pointer;
    &:hover {
    //   background: url("../../assets/layer2.svg") no-repeat center center;
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