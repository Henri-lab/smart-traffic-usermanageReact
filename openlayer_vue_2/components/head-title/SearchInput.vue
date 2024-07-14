<template>
  <el-input
    v-model="input"
    placeholder="事件类型搜索"
    size="large"
    @keydown.enter="addSearch"
    @keydown.esc="removeSearch"
    :prefix-icon="Search"
  >
  </el-input>
  <event-popup v-if="isShow"></event-popup>
</template>

<script setup>
import EventPopup from "@/components/common/EventPopup.vue";
import { ref, onMounted, inject, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { SearchMarker, markerLayer } from "@/utils/search-input";
import { Query } from "@/utils/query-map-gis";
import { usePopupStore } from "@/stores/eventPopup";
import { filterDataByPermission } from "@/filters/event-query";
let input = ref("");
let map = ref(null);
const store = usePopupStore();
const isShow = computed(() => {
  return store.isShow;
});
onMounted(() => {
  map = inject("$map");
});
let clickListener = null;
let pointMoveListener = null;
const addSearch = () => {
  if (input.value != "") {
    SearchMarker.addMarkerLayer(map, input.value);
    //鼠标点击要素
    clickListener = map.on("click", function (evt) {
      //判断当前单击处是否有要素，捕获到要素时弹出popup
      var feature = map.forEachFeatureAtPixel(
        evt.pixel,
        function (feature, markerLayer) {
          return feature;
        }
      );
      if (feature) {
        let position = feature.getGeometry().getCoordinates();
        //根据坐标查询属性数据
        Query.queryByPnt({
          position: position[0],
          service: {
            name: "guanggu-doc",
            layerId: 2,
          },
          success: function (data) {
            //查询成功后的回调函数
            //设置pop数据信息
            store.setDataList(
              filterDataByPermission(localStorage.getItem("type"), data)
            );
            //设置pop位置信息
            store.setPosition(position[0]);
            //设置pop标题信息
            store.setTitle("事件信息详情");
            //设置pop显示隐藏
            store.setIsShow(true);
          },
        });
      } else store.setIsShow(false);
    });
    //鼠标移入样式设置
    pointMoveListener = map.on("pointermove", function (e) {
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
  }
}
const removeSearch= ()=>{
  SearchMarker.removeMarkerLayer(map)
  ol.Observable.unByKey(clickListener)
  ol.Observable.unByKey(pointMoveListener)
  store.setIsShow(false)
}

</script>

<style lang="scss" scoped>
.el-input {
  width: 200px;
  margin: 10px;
}
</style>
