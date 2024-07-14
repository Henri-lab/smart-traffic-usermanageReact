<template>
  <div id="toggle">
    <img
      @click="toggleMap(item.name)"
      v-for="item of lists"
      :key="item.name"
      :src="item.src"
    />
  </div>
</template>

<script setup>
import vector from "../../assets/vector.png";
import image from "../../assets/image.png";
// import { gaode_image, gaode_vector } from "../plugins/Layers.js";
import { ref, onMounted, getCurrentInstance } from "vue";
import { getLayerByTitle } from "../../ol-utils/index.js";

const lists = ref([
  {
    name: "vector",
    src: vector,
  },
  {
    name: "image",
    src: image,
  },
]);
const { proxy } = getCurrentInstance(); //key-code
const $map = proxy.$map;

const toggleMap = (name) => {
  let image = getLayerByTitle({
    title: "image",
    map: proxy.$map,
  });
  let vector = getLayerByTitle({
    title: "vector",
    map: proxy.$map,
  });
  if (name == "vector") {
    image.setVisible(false);
    vector.setVisible(true);
  } else {
    image.setVisible(true);
    vector.setVisible(false);
  }
};
</script>

<style scoped>
#toggle img {
  width: 150px;
  height: 150px;
  border: 1px solid #333;
  padding: 5px;
  margin: 5px;
  border-radius: 15px;
}
#toggle {
  position: fixed;
  bottom: 20px;
  z-index: 1000;
  right: 20px;
}
#toggle img:hover {
  cursor: pointer;
  border-color: #ff2d51;
  border-width: 2px;
}
</style>
