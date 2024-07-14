<template>
  <div></div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
let $map = null;
onMounted(() => {
  const { proxy } = getCurrentInstance();
  $map = proxy.$map;
  $map.addLayer(docLayer);
});
const docLayer = new Zondy.Map.Doc("", "guanggu", {
  // ip: "localhost",
  // port: 6163
  crossOrigin: "Anonymous",
});
</script>

<style scoped></style>
