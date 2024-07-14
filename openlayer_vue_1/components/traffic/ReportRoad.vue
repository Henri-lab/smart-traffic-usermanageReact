<template>
    <el-dialog v-model="store.isShowReport" title="报告路况" center draggable>
      <div class="form">
        <el-form :model="form" label-width="120px">
          <el-form-item label="事件类型">
            <el-select v-model="form.type" placeholder="please select">
              <el-option label="碰撞" value="pengzhuang" />
              <el-option label="刮擦" value="guaca" />
              <el-option label="碾压" value="nianya" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="事件地址">
            <el-input
              v-model="form.location"
              placeholder="请输入路况地址，包含事故路段"
            />
          </el-form-item>
          <el-form-item label="建筑标识">
            <el-input
              v-model="form.sign"
              placeholder="请输入事故最近的建筑标识"
            />
          </el-form-item>
          <el-form-item label="发生时间">
            <el-date-picker
                v-model="form.time"
                type="date"
                style="width: 100%"
              />
          </el-form-item>
          <el-form-item label="事件描述">
            <el-input v-model="form.detail" placeholder="请输入事故的具体信息" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="report"> 确定</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>

  import { useRoadStore } from "../../stores/roadDialog.js"
  const store = useRoadStore();
  import { reactive, ref } from "vue";
  import date_now from "@/ol-utils/date_now.js"
  // import { reportRoadHttp } from "@/api/road.js";
  
  import { ElMessage } from "element-plus";
  let time_ = ref("");
  time_.value = date_now;
  // do not use same name with ref
  let form = ref({
    reporter: localStorage.getItem("username"),
    type: "碰撞",
    location: "",
    sign: "",
    time: time_.value,
    detail: "",
  });
  const report = async () => {
    if (
      form.value.reporter != "" ||
      form.value.type != "" ||
      form.value.location != "" ||
      form.value.sign != "" ||
      form.value.detail != "" ||
      form.value.time != ""
    ) {
      // let res = await reportRoadHttp(form.value);
      // if (res.code == 200) {
      //   ElMessage({
      //     message: "上报成功",
      //     type: "success",
      //   });
      //   store.setReportShow(false);
      // }
    } 
    // else {
    //   ElMessage({
    //     message: "请输入完整信息",
    //     type: "warning",
    //   });
    // }
  };
  const cancel = function () {
    store.setReportShow(false);
  };
  </script>
  
  <style lang="scss" scoped>
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba($color: #2a2a2a, $alpha: 0.5);
    z-index: 200;
    .content {
      width: 600px;
      height: 370px;
      margin: 8% auto;
      background-color: #fff;
      border-radius: 10px;
      .title {
        display: flex;
        padding: 10px 10px 15px 20px;
        color: #6d6d6d;
        font-weight: 700;
        font-size: 20px;
        border-bottom: 0.1px solid rgba($color: #4e4e4e, $alpha: 0.3);
        span {
          margin-left: 80%;
          cursor: pointer;
        }
      }
      .form {
        margin: 25px 20px 10px -15px;
      }
      .btns {
        margin: 20px 10px 0 390px;
        width: 180px;
        button {
          margin: 0 0 10px 30px;
        }
      }
    }
  }
  </style>
  