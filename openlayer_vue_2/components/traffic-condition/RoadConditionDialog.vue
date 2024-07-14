<template>
  <el-dialog v-model="roadStore.isShow" title="路况信息" center draggable>
    <div class="table">
      <el-table :data="filterTableData" style="width: 100%" height="260">
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="reporter" label="上报人" align="center" />
        <el-table-column prop="type" label="事件类型" align="center" />
        <el-table-column prop="time" label="发生时间" align="center" />
        <el-table-column prop="location" label="发生地点" align="center" />
        <el-table-column prop="sign" label="建筑物标识" align="center" />
        <el-table-column prop="detail" label="事件详情" align="center" />
        <el-table-column width="160">
          <template #header>
            <el-input
              v-model="search"
              size="default"
              placeholder="根据事件类型搜索"
            />
          </template>
          <template #default="scope">
            <el-button
              type="success"
              size="small"
              @click="handleRoad(scope)"
              left="left"
              v-if="!scope.row.isHandle"
              >处理</el-button
            >
            <el-button
              type="info"
              plain
              size="small"
              left="left"
              v-if="scope.row.isHandle"
              >已处理</el-button
            >
            <el-button
              type="danger"
              size="small"
              left="right"
              v-if="!scope.row.isHandle"
              @click="ingoreRoad(scope)"
              >忽略</el-button
            >
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
        :total="roadStore.roadList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoadStore } from "../../stores/roadDialog.js";
import { ElMessage } from "element-plus";
import { getRoadHttp, updateRoadHttp, deleteRoadHttp } from "../../api/road.js";
const roadStore = useRoadStore();

// 当前页
const currentPage = ref(1);
// 每页的数量
const pageSize = ref(5);

// 改变每页的数量，重新渲染表格数据
const handleSizeChange = (h) => {
  const tableList = roadStore.roadList.slice(
    (currentPage.value - 1) * h,
    currentPage.value * h
  );
  roadStore.changeTableList(tableList);
};
// 根据当前页的值渲染表格数据
const handleCurrentChange = (p) => {
  const tableList = roadStore.roadList.slice(
    (p - 1) * pageSize.value,
    p * pageSize.value
  );
  roadStore.changeTableList(tableList);
};
// 根据事件类型进行搜索
const search = ref("");
const filterTableData = computed(() =>
  roadStore.roadTableList.filter(
    (data) =>
      !search.value ||
      data.type.toLowerCase().includes(search.value.toLowerCase())
  )
);

// 处理路况
const handleRoad = async (scope) => {
  let id = scope.row.id;
  // 调用更新接口
  const res = await updateRoadHttp(id);
  if (res.code === 200) {
    ElMessage({
      message: "处理完成",
      type: "success",
    });
  }
  renderData();
};

// 忽略路况
const ingoreRoad = async (scope) => {
  let id = scope.row.id;
  // 调用删除接口
  const res = await deleteRoadHttp(id);
  renderData();
};

// 重新渲染数据
const renderData = async () => {
  const _res = await getRoadHttp();
  // 所有路况数据
  roadStore.getRoadList(_res.data);
  // 重新渲染列表数据
  roadStore.changeTableList(
    _res.data.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  );
};
</script>

<style lang="scss" scoped>
.el-page {
  padding: 20px 0 0 50px;
}
</style>
