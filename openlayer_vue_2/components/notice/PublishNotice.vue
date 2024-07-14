<template>
  <el-dialog v-model="dialogTableVisible" title="公告信息" @closed="beforeClose" center draggable>
    <el-divider class="divider"></el-divider>
    <div class="title2">发布公告的区域与物业电话</div>
    <div>
      <!-- 表格 -->
      <el-table
        :data="store.WuYeData"
        border
        stripe
        style="width: 100%"
        max-height="277"
      >
        <el-table-column property="name" label="Name" />
        <el-table-column property="tel" label="Tel" />
      </el-table>
    </div>

    <!-- 公告信息填写 -->
    <div class="info">
      <div class="title">
        <span>公告标题：</span>
        <!-- 输入框 -->
        <el-autocomplete
          v-model="title"
          :fetch-suggestions="querySearch"
          placeholder="请输入公告标题"
        >
          <template #suffix>
            <el-icon class="el-input__icon">
              <edit />
            </el-icon>
          </template>
          <template #default="{ item }">
            <div class="value">{{ item.value }}</div>
          </template>
        </el-autocomplete>
      </div>
      <div class="detail">
        <span>公告信息：</span>
        <!-- 输入框 -->
        <el-input
          v-model="info"
          :rows="6"
          class="write"
          type="textarea"
          placeholder="您好！XXX道路近期维修，时间为2023年12月1日-2024年1月21日，请及时规划出行路线，避免对您的出行造成影响"
        ></el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- btns -->
    <div class="btns">
      <el-button color="#626aef" plain @click="publish">发送</el-button>
      <el-button color="#626aef" plain @click="cancle">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, inject, onMounted, onBeforeUpdate } from "vue";
import { useNoticeStore } from "@/stores/notice.js";
import { publishNoticeHttp } from "@/api/notice.js";
import { ElMessage } from "element-plus";
import { Edit } from "@element-plus/icons-vue";
import date_now from "@/utils/date_now.js";
const store = useNoticeStore();
const dialogTableVisible = ref(false);
const title = ref(""); //输入标题
const info = ref(""); //输入内容
let $map = null;
let line_layer = null;
let clipLayer = null;
const titleInfo = ref([]); //标题建议输入的内容
onMounted(() => {
  $map = inject("$map");
  titleInfo.value = loadAll();
});
onBeforeUpdate(() => {
  //为什么要在这设置移除图层，不在按钮的点击事件设置，一是为了集合代码，而是因为dialog组件的x按钮获取不到，设置不了方法
  if (dialogTableVisible.value == false) {
    //隐藏
    $map.removeLayer(clipLayer);
    $map.removeLayer(line_layer);
    //为什么要手动设一下，是为了避免第一次关闭走的是dialog自带的X，这个X的按钮获取不到，
    //不能设置点击方法，这样的话就不会更改pinia中的isShowPublishNotice，会导致第二次画的时候不显示
    store.setPublishNoticeShow(false);
  }
});
watch(
  () => store.isShowPublishNotice,
  () => {
    dialogTableVisible.value = store.isShowPublishNotice;
    const layers = $map.getLayers().array_;
    //找到线图层和裁剪图层
    line_layer = layers.find((item) => {
      return item.get("name") == "clip_layer";
    });
    clipLayer = layers.find((item) => {
      return item.values_.title == "line_layer";
    });
  }
);
async function publish() {
  if (info.value != "" && title.value != "") {
    const res = await publishNoticeHttp({
      publisher: localStorage.getItem("username"),
      type: localStorage.getItem("type"),
      content: info.value,
      title: title.value,
      date: date_now,
    });
    if (res.code == 200) {
      ElMessage({
        message: "发布成功",
        type: "success",
      });
      store.setPublishNoticeShow(false);
    }
  } else if (title.value == "") {
    ElMessage({
      message: "请输入公告标题",
      type: "warning",
    });
  } else {
    ElMessage({
      message: "请输入公告内容",
      type: "warning",
    });
  }
}
function cancle() {
  store.setPublishNoticeShow(false);
}
//关闭弹窗清空输入信息
function beforeClose() {
  title.value = "";
  info.value = "";
}
//输入框
const querySearch = (queryString, cb) => {
  let results = titleInfo.value;
  results = queryString ? results.filter(createFilter(queryString)) : results;
  cb(results);
};
const createFilter = (queryString) => {
  return (item) => {
    return item.value.toUpperCase().match(queryString.toUpperCase());
  };
};
const loadAll = () => {
  return [
    { value: "关于xxx维修事件的交通管制公告" },
    { value: "关于xxx碰撞事件的交通管制公告" },
    { value: "关于xxx积水事件的交通管制公告" },
    { value: "关于xxx开展活动的交通管制公告" },
  ];
};
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0 !important;
  margin-left: -3% !important;
  width: 106% !important;
}
.el-overlay {
  overflow: hidden !important;
}
.divider {
  margin-top: -20px !important;
}
:v-deep(.el-dialog .el-dialog__header .el-dialog__headerbtn) {
  display: none !important;
}
.title2 {
  font-size: 18px;
  font-weight: 400;
  padding: 8px 15px;
  background-color: #f0f0f0;
}

.info {
  margin: 20px 10px;
  .detail {
    margin-top: 10px;
    display: flex;
  }
  .title span {
    margin-right: 20px;
  }
  span {
    font-weight: 700;
    flex: 1;
    display: inline-block;
  }

  .write {
    flex: 7;
    padding: 4px;
    color: gray;
  }
}
.btns {
  margin: 13px 0px -15px 470px;
  width: 180px;
  button {
    margin-left: 20px;
  }
}
</style>
