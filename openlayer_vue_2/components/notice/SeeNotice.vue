<template>
  <el-dialog
    v-model="store.isShowNoticeList"
    v-if="store.noticeList != []"
    title="查看公告"
    width="60%"
    center 
    draggable
  >
    <!-- 列表控件 -->
    <el-table :data="tableData" stripe border style="width: 100%" height="250">
      <el-table-column
        prop="title"
        label="公告标题"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="publisher" label="发布者" align="center" />
      <el-table-column
        prop="content"
        label="公告内容"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column prop="date" label="发布时间" align="center" />
      <el-table-column label="查看" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            plain
            size="small"
            @click.prevent="details(scope.row.id)"
          >
            详细信息
          </el-button>
          <el-button
            type="danger"
            plain
            size="small"
            @click.prevent="noticeDel(scope.row)"
            v-if="
              userType === 'admin' ||
              (userType === 'traffic' && scope.row.type != 'admin')
            "
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="el-page">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="store.noticeList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { noticeDelHttp } from "@/api/notice.js";
import { useNoticeStore } from "@/stores/notice";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, watch } from "vue";
const store = useNoticeStore();
//查询公告详细信息
const details = (id) => {
  //把id存到pinia
  store.setId(id);
  //根据id查询
  store.getNoticeById(id);
  //显示详细信息框
  store.setNoticeDetailShow(true);
};
// 当前页
const currentPage = ref(1);
// 每页的数量
const pageSize = ref(5);
// 显示在表格里的数据
const tableData = ref([]);

// 改变每页的数量，重新渲染表格数据
const handleSizeChange = (h) => {
  tableData.value = store.noticeList.slice(
    (currentPage.value - 1) * h,
    currentPage.value * h
  );
};
// 根据当前页的值渲染表格数据
const handleCurrentChange = (p) => {
  currentPage.value = p;
  tableData.value = store.noticeList.slice(
    (currentPage.value- 1) * pageSize.value,
    currentPage.value* pageSize.value
  );
};
watch(
  () => store.noticeList,
  (val) => {
    tableData.value = val.slice(
      /* 之前没有加上value导致获取不到第一次的数据 */
      pageSize.value * (currentPage.value - 1),
      pageSize.value * currentPage.value
    );
  }
);
//获取当前用户类型
const userType = localStorage.getItem("type");
//删除公告
const noticeDel = async (row) => {
  ElMessageBox.confirm(
    `这是${row.publisher}发布的公告信息，确定删除吗？`,
    "Warning",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    let res = await noticeDelHttp(row.id);
    if (res.code === 200) {
      ElMessage({
        message: "删除成功",
        type: "success",
      });
      //更新公告列表
      store.noticeList = store.noticeList.filter((item) => item.id != row.id);
    } else {
      ElMessage.error(res.msg);
    }
  });
};
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba($color: #2a2a2a, $alpha: 0.8);
  z-index: 200;
  .content {
    width: 1200px;
    margin: 6% auto;
    background-color: #fff;
    .title {
      display: flex;
      padding: 10px 10px 10px 20px;
      color: #6d6d6d;
      font-weight: 700;
      font-size: 20px;
      border-bottom: 0.1px solid rgba($color: #4e4e4e, $alpha: 0.3);
      span {
        margin-left: 1050px;
        cursor: pointer;
      }
    }
  }
}
.el-page {
  padding: 20px 0 0 10px;
}
</style>
