<template>
  <div>
    <div class="input-search" @click="clickEvents">
      <el-input
        v-model="inputEvent"
        style="max-width: 600px"
        placeholder="碰撞/失火/碾压/刮擦/翻车/其他"
        class="input-with-select"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch" :plain="true">查询</el-button>
        </template>
      </el-input>
    </div>

    <el-dialog
      v-model="centerDialogVisible"
      title="事件详细信息"
      width="400"
      destroy-on-close
      center
      :modal="false"
      ref="dialog1"
      id="dialog"
      :style="{
        top: dialogTop + 'px',
        left: dialogLeft + 'px',
        position: 'absolute',
      }"
    >
      <div>
        <el-table style="width: 100%" :data="getValues" :show-header="false">
          <el-table-column
            v-for="(item, index) in getHeaders"
            :key="index"
            :prop="item"
            width="150px"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { Query } from "@/stores/Query.js";
import { setMarkerStyle } from "@/ol-utils/index.js";
import location from "@/assets/坐标点.png";

let $map = null;
const inputEvent = ref(""); //input搜索框
const centerDialogVisible = ref(false); //弹窗
let dialogTop = ref(0); // 对话框的top位置
let dialogLeft = ref(0); // 对话框的left位置

let dialog;
const dialog1 = ref(null);
onMounted(async () => {
  const { proxy } = getCurrentInstance();
  $map = await proxy.$map;
  $map.addLayer(markerLayer); //标注图层
  // console.log(dialog.value, 'dialog')
  dialog = document.getElementById("dialog");
  // console.log(dialog1.value, 'dialog')
});
// 标注图层
const markerLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [],
  }),
  style: setMarkerStyle(location),
});

const handleSearch = () => {
  const service = {
    name: "guanggu",
    layerId: 2,
  };
  let where = {
    key: "事件类型",
    value: inputEvent.value,
  };
  /* 属性查询 */
  Query.queryByAttr({
    where,
    service,
    success: (res) => {
      console.log(res, "res");
      markerLayer.getSource().addFeatures(res); //添加数据到标注图层
    },
  });

  //清除要素
  markerLayer.getSource().clear(); //清除之前的缓冲区
};

/* ================弹窗===================== */
const headers = ref([
  {
    prop: "event_level",
    label: "事件等级",
  },
  {
    prop: "event_time",
    label: "发生时间",
  },
  {
    prop: "event_addr",
    label: "发生地点",
  },
  {
    prop: "event_status",
    label: "发生状态",
  },
]);
const tableData = ref([]);

const clickEvents = () => {
  // 修改小手
  $map.on("pointermove", function (e) {
    var pixel = $map.getEventPixel(e.originalEvent);
    var hit = $map.hasFeatureAtPixel(pixel);
    $map.getTargetElement().style.cursor = hit ? "pointer" : "";
  });
  // ===========添加标注的点击事件=======
  $map.on("click", function (e) {
    centerDialogVisible.value = true;
    // 获取当前点击的点是否存在要素,并返回
    const feature = $map.forEachFeatureAtPixel(
      e.pixel, //像素坐标
      function (feature) {
        // feature.set('name','video-ft')
        return feature;
      }
    );
    if (feature) {
      let data = feature.values_.values_;
      console.log(data.事件等级, "data");
      //改变事件等级
      const changeLevel = (level) => {
        if (level === "1") {
          level = "轻微事故";
        } else if (level === "2") {
          level = "一般事故";
        } else if (level === "3") {
          level = "重大事故";
        } else if (level === "4") {
          level = "特大事故";
        }
        return level;
      };
      //改变处理状态
      const changeHandle = (status) => {
        if (status === "0") {
          status = "待处理";
        } else if (status === "1") {
          status = "处理中";
        } else if (status === "2") {
          status = "已归档";
        }
        return status;
      };

      tableData.value = [
        {
          event_level: changeLevel(data.事件等级),
          event_time: data.发生时间,
          event_addr: data.发生地点,
          event_status: changeHandle(data.处理状态),
        },
      ];
      console.log(tableData.value, "tableData");
    }
    if (dialog1.value) {
      const coordinate = e.coordinate; // 获取点击位置的经纬度坐标

      // 获取屏幕坐标
      const pixel = $map.getPixelFromCoordinate(coordinate);
      console.log(pixel, "pixel");

      // 将屏幕坐标转换为页面坐标
      const mapElement = $map.getTargetElement();
      const rect = mapElement.getBoundingClientRect();

      dialogTop.value = pixel[1] + rect.top - 470;
      dialogLeft.value = pixel[0] + rect.left - 150;
    }
  });
};
const getHeaders = computed(() => {
  return tableData.value.reduce(
    (pre, cur, index) => pre.concat(`value${index}`),
    ["title"]
  );
});
const getValues = computed(() => {
  return headers.value.map((item) => {
    return tableData.value.reduce(
      (pre, cur, index) =>
        Object.assign(pre, { ["value" + index]: cur[item.prop] }),
      { title: item.label }
    );
  });
});
</script>

<style lang="scss" scoped>
.input-search {
  display: flex;
  align-items: center;
  height: 60px;
  line-height: 60px;
}
</style>
