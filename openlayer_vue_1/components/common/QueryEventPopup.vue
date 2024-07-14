<template>
  <!-- Popup -->
  <div class="popup-dialog" v-show="$queryEvent.isShow">
    <div class="title">
      <span>事件查询功能</span>
      <span
        class="close"
        style="cursor: pointer; position: absolute; right: 0%"
        @click="closePopup()"
        >关闭</span
      >
    </div>

    <div class="toolbar" style="position: relative; height: 50px">
      <button
        style="width: 150px; height: 50px; background-color: aqua"
        @click="openHeatMap"
      >
        生成热力图
      </button>
      <button
        style="width: 150px; height: 50px; background-color: aqua"
        @click="closeHeatMap"
      >
        关闭热力图
      </button>
      <button style="width: 150px; height: 50px; background-color: aqua">
        生成分析图表
      </button>
    </div>
    <div class="content">
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        style="width: 100%"
      >
        <el-table-column prop="AttValue[0]" label="事件编号" width="120">
        </el-table-column>
        <el-table-column prop="AttValue[1]" label="事件类型" width="80">
        </el-table-column>
        <el-table-column prop="AttValue[2]" label="事件等级" width="80">
        </el-table-column>
        <el-table-column prop="AttValue[3]" label="发生时间"> </el-table-column>
        <el-table-column prop="AttValue[4]" label="发生地点"> </el-table-column>
        <el-table-column prop="AttValue[5]" label="车牌号"> </el-table-column>
        <el-table-column prop="AttValue[6]" label="驾驶员"> </el-table-column>
        <el-table-column prop="AttValue[7]" label="处理状态"> </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 6, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
  </div>

  <!-- 热力图控制控件 -->
  <div class="heatMapControl" v-show="$queryEvent.isShow">
    <div>
      <div>
        <label>热点半径(radius size):</label>
        <input
          type="range"
          id="radius"
          min="1"
          max="50"
          step="1"
          :value="radius"
          @input="handleRadiusChange"
        />
      </div>
      <div>
        <label>模糊尺寸(blur size):</label>
        <input
          type="range"
          id="blur"
          min="1"
          max="50"
          step="1"
          :value="blur"
          @input="handleBlurChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  computed,
  getCurrentInstance,
  inject,
  onMounted,
} from "vue";
import { usePopupStore } from "@/stores/index.js";
import { Query } from "@/utils/Query.js";
/* //引用父组件方法
const deactiveDraw  = inject("deactiveDraw"); */
//地图全局变量
let $map = null;
/* const { proxy } = getCurrentInstance();
$map = proxy.$map; */

onMounted(() => {
  const { proxy } = getCurrentInstance();
  $map = proxy.$map;
});

//引用数据
const $queryEvent = usePopupStore();
const tableData = computed(() => $queryEvent.dataList);

//分页
const currentPage = ref(1); //分页当前页
let pageSize = ref(5); //分页每页显示条数

//每页条数改变时触发 选择一页显示多少行
const handleSizeChange = (val) => {
  //console.log(`每页 ${val} 条`);
  currentPage.value = 1;
  pageSize.value = val;
};
//当前页改变时触发 跳转其他页
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  currentPage.value = val;
};

//关闭弹窗
const closePopup = () => {
  $queryEvent.setHide();
};

//打开热力图
//生成热力图
//热力图配置
var blur = document.getElementById("blur");
var radius = document.getElementById("radius");
let heatMapLayer = null;
let GeoData = ref({});
const service = {
  name: "guanggu",
  layerId: 2,
};
Query.queryByLayerId({
  service,
  success: queryAllSuccess,
});

function queryAllSuccess(data) {
  let geoJsonFeatures;
  var format = new Zondy.Format.PolygonJSON();
  GeoData.value = format.read(data);
  console.log("查询成功", GeoData.value);
  geoJsonFeatures = new ol.format.GeoJSON().writeFeaturesObject(GeoData.value);
  heatMapLayer = new ol.layer.Heatmap({
    source: new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(geoJsonFeatures),
    }),
    blur: 15,
    radius: 19,
  });
}
const openHeatMap = () => {
  $map.addLayer(heatMapLayer);
};

const closeHeatMap = () => {
  $map.removeLayer(heatMapLayer);
};

// 处理热点半径滑块变化
const handleRadiusChange = (event) => {
  heatMapLayer.setRadius(parseInt(event.target.value));
};

// 处理模糊尺寸滑块变化
const handleBlurChange = (event) => {
  heatMapLayer.setBlur(parseInt(event.target.value));
};
</script>

<style lang="scss" scoped>
.popup-dialog {
  position: fixed;
  width: 600px;
  top: 10%;
  left: 3%;
  /* bottom: 5%; */
  background-color: white;
  border-radius: 10px;
  border: 1px solid #cccccc;
  z-index: 1000;

  .title {
    padding: 10px;
    border-radius: 10px 10px 0 0;
    background-color: #f7c12c;
    color: #fff;
    font-family: "微软雅黑";
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
  }

  .content {
    padding: 2px;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .update_btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
  }
}

.heatMapControl {
  position: fixed;
  top: 8%;
  right: 10%;
  background-color: #fff;
}
</style>
