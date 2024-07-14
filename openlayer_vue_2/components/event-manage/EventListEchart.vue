<template>
  <el-dialog
    v-model="queryEventStore.isShow"
    title="事件查询"
    width="75%"
    :before-close="handleClose"
    center
    draggable
  >
    <el-tabs v-model="activeName" type="card" class="demo-tabs">
      <el-tab-pane label="查询结果" name="查询结果">
        <div class="table">
          <el-table :data="filterTableData" style="width: 100%" height="290">
            <el-table-column prop="number" label="事件编号" align="center" />
            <el-table-column prop="type" label="事件类型" align="center" />
            <el-table-column prop="level" label="事件等级" align="center">
              <!-- 事件等级插槽 -->
              <template #default="scope">
                <el-tag effect="dark" :type="filterTag(scope.row.level)">{{
                  filterLevel(scope.row.level)
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="发生时间" align="center" />
            <el-table-column prop="location" label="发生地点" align="center" />
            <el-table-column prop="carNumber" label="车牌号" align="center" />
            <el-table-column prop="driver" label="驾驶员" align="center" />
            <el-table-column prop="state" label="处理状态" align="center">
              <!-- 事件状态插槽 -->
              <template #default="scope">
                <el-tag effect="dark" :type="filterButton(scope.row.state)">{{
                  filterStatus(scope.row.state)
                }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="el-page">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 15]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="eventList.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="可视化分析" name="可视化分析" :lazy="true">
        <div class="charts">
          <div class="chart">
            <v-chart :option="pieOption"></v-chart>
          </div>
          <div class="chart">
            <v-chart :option="pieOption2"></v-chart>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设置" name="设置" :lazy="true">
        <div class="setting">
          <div>
            事件热力图：
            <el-switch v-model="queryEventStore.isOpen" size="large" />
          </div>
          <div class="slider-demo-block">
            <span>半 径：</span>
            <el-slider v-model="radius" />
          </div>
          <div class="slider-demo-block">
            <span> 模糊度：</span>
            <el-slider v-model="blur" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
import { Query } from "@/utils/query-map-gis";
import { useQueryEventStore } from "@/stores/queryEventDialog";
import { inject, onMounted, ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import {
  filterLevel,
  filterStatus,
  filterTag,
  filterButton,
} from "../../filters/event-query";
const queryEventStore = useQueryEventStore();
let map = null;
onMounted(() => {
  map = inject("$map");
});
// 默认页面
const activeName = ref("查询结果");
// 查询到的事件列表
const eventList = ref([]);
// 显示在表格里的数据
const tableData = ref([]);

// 监测几何信息geom，进行查询
watch(
  () => queryEventStore.geom,
  (newValue) => {
    Query.queryByGeom({
      geometry: newValue,
      service: {
        name: "guanggu-doc",
        layerId: 2,
      },
      success: querySuccess,
    });
  }
);
// 查询成功的回调
const querySuccess = (data) => {
  source.clear();
  if (data.TotalCount) {
    // 将mapgis要素转换为ol要素
    const format = new Zondy.Format.PolygonJSON();
    //将MapGIS要素转化为ol要素
    features = format.read(data);
    if (queryEventStore.isOpen) {
      source.addFeatures(features);
    }

    let list = data.SFEleArray;
    eventList.value = list.map((item) => {
      return {
        number: item.AttValue[0],
        type: item.AttValue[1],
        level: item.AttValue[2],
        date: item.AttValue[3],
        location: item.AttValue[4],
        carNumber: item.AttValue[5],
        driver: item.AttValue[6],
        state: item.AttValue[7],
      };
    });
    tableData.value = eventList.value.slice(0, pageSize.value);
    // 弹窗
    queryEventStore.changeState(true);
  } else {
    ElMessage({
      message: "未查询到事件",
      type: "error",
    });
  }
};

// 当前页
const currentPage = ref(1);
// 每页的数量
const pageSize = ref(5);

// 改变每页的数量，重新渲染表格数据
const handleSizeChange = (h) => {
  const tableList = eventList.value.slice(
    (currentPage.value - 1) * h,
    currentPage.value * h
  );
  tableData.value = tableList;
};
// 根据当前页的值渲染表格数据
const handleCurrentChange = (p) => {
  const tableList = eventList.value.slice(
    (p - 1) * pageSize.value,
    p * pageSize.value
  );
  tableData.value = tableList;
};
// 根据事件类型进行搜索
const search = ref("");
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.type.toLowerCase().includes(search.value.toLowerCase())
  )
);

// 关闭窗口后的回调
const handleClose = () => {
  // 关闭窗口
  queryEventStore.changeState(false);
};

// 图表
const pieOption = ref({});
const pieOption2 = ref({});
// 数组去重方法
function deepUniqueArray(arr) {
  let result = [];
  let jsonStr = "";
  for (let i = 0, len = arr.length; i < len; i++) {
    if (typeof arr[i] === "object") {
      jsonStr = JSON.stringify(arr[i]);
      if (result.indexOf(jsonStr) === -1) {
        result.push(jsonStr);
      }
    } else {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i]);
      }
    }
  }
  return result.map((item) => JSON.parse(item));
}
// 监听查询事件结果，实时渲染图表
watch(eventList, (newValue) => {
  // 图表一数据
  const data1 = newValue.map((item) => {
    return {
      name: item.type,
      value: newValue.filter((item2) => item2.type === item.type).length,
    };
  });
  // 图表二数据
  const data2 = newValue.map((item) => {
    return {
      name: filterLevel(item.level),
      value: newValue.filter((item2) => item2.level === item.level).length,
    };
  });
  // 数组去重
  let pieData = deepUniqueArray(data1); //饼状图data1
  let pieData2 = deepUniqueArray(data2); //饼状图data2
  pieOption.value = {
    title: {
      text: "事件类型分析",
      left: "left",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "right",
    },
    series: [
      {
        name: "事件类型",
        type: "pie",
        radius: "75%",
        data: pieData,
      },
    ],
  };
  pieOption2.value = {
    title: {
      text: "事件等级分析",
      left: "left",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "right",
    },
    series: [
      {
        name: "事件等级",
        type: "pie",
        radius: "75%",
        data: pieData2,
      },
    ],
  };
});

// 热力图
let features = null;
let source = new ol.source.Vector({});
let heatMapLayer = new ol.layer.Heatmap({
  source,
  blur: 4,
  radius: 8,
  name: "heatLayer",
});
// 监听热力图层的显隐状态
watch(
  () => queryEventStore.isOpen,
  (newValue) => {
    if (newValue) {
      source.addFeatures(features);
      map.addLayer(heatMapLayer);
    } else {
      source.clear();
      map.removeLayer(heatMapLayer);
    }
  }
);
// 设置热力图层属性
const radius = ref(8);
const blur = ref(4);
watch(radius, (newValue) => {
  heatMapLayer.set("radius", newValue);
});
watch(blur, (newValue) => {
  heatMapLayer.set("blur", newValue);
});
</script>

<style lang="scss" scoped>
.el-page {
  padding: 20px 0 0 10px;
}
.charts {
  display: flex;
  justify-content: space-between;
  .chart {
    width: 500px;
    height: 310px;
    // background-color: skyblue;
  }
}
.setting {
  padding-left: 20px;
  // height: 310px;
  .slider-demo-block {
    display: flex;
    align-items: center;
    span {
      padding-right: 20px;
    }
    .el-slider {
      width: 150px;
    }
  }
}
</style>
