<template>
  <div class="mapCon" v-show="$store.setMonitorPopup">
    <!-- Popup -->
    <div class="popup ol-popup">
      <a href="#" class="popup-closer ol-popup-closer"></a>
      <div class="popup-content">
        <div class="popup-title">
          摄像头：
        <span class="title"></span>
        </div>
        <el-descriptions :column="1" border size="small">
        <el-descriptions-item align="center" label="位置">
          <span class="position"></span>
        </el-descriptions-item>
        <el-descriptions-item align="center" label="视频">
          <video
                src=""
                width="100%"
                class="video"
                loop
                autoplay
                controls
              ></video>
        </el-descriptions-item>
      </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from "@/stores";
const $store = useMainStore();
</script>

<style lang="scss" scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 45px;
  left: -50px;
  width: 260px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
.popup-title{
  background: #f7c12c;
  border-radius: 10px 10px 0 0;
  color: #fff;
  font-family: "微软雅黑";
  font-size: 14px;
  padding: 5px;
  
}
.el-descriptions{
  margin: 10px
} 
.el-descriptions ::v-deep(.el-descriptions__label){
  width: 40px;
}
span,  video {
  vertical-align:middle ;
}
</style>
