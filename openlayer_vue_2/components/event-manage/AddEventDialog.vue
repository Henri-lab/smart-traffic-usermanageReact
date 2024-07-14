<template>
  <el-dialog v-model="eventStore.isShow" title="添加事件" width="30%" center draggable>
    <div class="form">
      <el-form label-width="100px" disabled>
        <el-form-item label="事件编号">
          <el-input v-model="number" />
        </el-form-item>
      </el-form>
      <el-form label-width="100px">
        <el-form-item label="事件类型">
          <el-input v-model="type" />
        </el-form-item>
        <el-form-item label="事件等级">
          <el-select v-model="level" placeholder="请选择事件类型">
            <el-option label="轻微事故" value="1" />
            <el-option label="一般事故" value="2" />
            <el-option label="重大事故" value="3" />
            <el-option label="特大事故" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生时间">
          <el-col :span="11">
            <el-date-picker
              v-model="date1"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="2" class="text-center">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker
              v-model="date2"
              placeholder="具体时间"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="发生地点">
          <el-input v-model="location" />
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="carNumber" />
        </el-form-item>
        <el-form-item label="驾驶员">
          <el-input v-model="driver" />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="state" placeholder="请选择状态">
            <el-option label="未处理" value="0" />
            <el-option label="已忽略" value="1" />
            <el-option label="已通过" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addEvent"> 添加 </el-button>
        <el-button @click="cancelEvent">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { inject, onMounted, ref, watch } from "vue";
import { useEventStore } from "../../stores/addEventDialog";
import { ElMessage } from "element-plus";
import { addPoint } from "@/utils/add-event";
const eventStore = useEventStore();
let $map = null;
// 事件内容
const number = ref("");
const type = ref("");
const level = ref("");
const date1 = ref("");
const date2 = ref("");
const location = ref("");
const carNumber = ref("");
const driver = ref("");
const state = ref("");
onMounted(() => {
  $map = inject("$map");
});
watch(
  () => eventStore.isShow,
  (newValue) => {
    if (newValue) {
      // 随机生成事件编号
      number.value = "SJ" + Math.floor(Math.random() * 1000000000000);
    }
  }
);
// 添加事件
const addEvent = () => {
  // 关闭弹框
  eventStore.changeState(false);
  // 移除地图点击事件
  $map.getInteractions().pop();
  // 1 坐标位置
  let position = eventStore.position;
  // 2 目标图层
  const layer = new Zondy.Map.Doc("", "guanggu-doc", {});
  $map.addLayer(layer);
  // 3 属性集
  // 4 服务对象
  const service = {
    name: "guanggu-doc",
    layerId: 2,
  };

  addPoint({
    position,
    layer,
    attr: [
      {
        name: "事件编号",
        value: number.value,
        type: "string",
      },
      { name: "事件类型", value: type.value, type: "string" },
      { name: "事件等级", value: level.value, type: "string" },
      { name: "发生时间", value: date2.value, type: "string" },
      { name: "发生地点", value: location.value, type: "string" },
      { name: "车牌号", value: carNumber.value, type: "string" },
      { name: "驾驶员", value: driver.value, type: "string" },
      { name: "处理状态", value: state.value, type: "string" },
    ],
    service,
  });
};

// 取消
const cancelEvent = () => {
  // 关闭弹框
  eventStore.changeState(false);
  // 移除地图点击事件
  $map.getInteractions().pop();
  ElMessage({
    message: "已取消",
    type: "success",
    duration: 1500,
  });
};
</script>

<style lang="scss" scoped></style>
