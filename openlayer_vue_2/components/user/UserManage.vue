<template>
  <el-dialog v-model="$store.setUserManageShow" title="用户管理" width="60%" center draggable>
    <el-button
      type="danger"
      size="small"
      @click="dialogTrafficUser = true"
      class="addbtn"
      >新增<el-icon><CirclePlus /></el-icon
    ></el-button>
    <!-- 新增用户对话框 -->
    <el-dialog v-model="dialogTrafficUser" title="添加交通管理员账号" @closed="beforeClose">
      <el-form :model="addTraffic" label-width="100%">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="addTraffic.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addTraffic.password" autocomplete="off" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogTrafficUser = false">取消</el-button>
          <el-button type="primary" @click="userAdd(addTraffic)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 用户信息表格渲染 -->
    <el-table :data="table" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="type" label="用户类型">
        <template #default="scope">
          <span>{{ filterUserType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isOnline" label="登录状态">
        <template #default="scope">
          <el-tag effect="dark" :type="scope.row.isOnline ? 'success' : 'info'">
            {{ scope.row.isOnline ? "在线" : "离线" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="extra" width="200px">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            plain
            @click="userDelete(scope.row)"
            v-if="scope.row.username != localUsername"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="small"
            plain
            @click="userEdit(scope.row)"
            v-if="scope.row.type != 'admin'"
            >修改</el-button
          >
          <el-button
            plain
            type="warning"
            size="small"
            @click="userOffline(scope.row)"
            v-if="scope.row.isOnline && scope.row.username != localUsername"
            >下线</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <template #footer>
      <div class="el-page">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="$store.allusersData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <!-- 修改用户信息对话框 -->
    <el-dialog v-model="dialogFormVisible" title="修改用户信息">
      <el-form :model="userEditData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userEditData.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="userEditData.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editUserInfo(userEditData)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import {
  UserDelHttp,
  LogOutHttp,
  EditPasswordHttp,
  RegisterHttp,
} from "@/api/user.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { CirclePlus } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user.js";
import { ref, watch } from "vue";
import { filterUserType } from "@/filters/event-query.js";
const $store = useUserStore();
const pageSize = 5;
const extra = "操作";
let currentPage = 1;
let table = ref([]);
const dialogFormVisible = ref(false);
const dialogTrafficUser = ref(false);
const formLabelWidth = "140px";
const addTraffic = ref({});
const userEditData = ref([]);

const handleSizeChange = (pSize) => {
  table.value = $store.allusersData.slice(
    pSize * (currentPage - 1),
    pSize * currentPage
  );
};

const handleCurrentChange = (page) => {
  currentPage = page;
  table.value = $store.allusersData.slice(
    pageSize * (currentPage - 1),
    pageSize * currentPage
  );
};

//解决第一次点击时没有数据的问题
table.value = $store.allusersData.slice(0, pageSize);
watch(
  () => $store.allusersData,
  (val) => {
    table.value = val.slice(
      pageSize * (currentPage - 1),
      pageSize * currentPage
    );
  }
);
const localUsername = ref(localStorage.getItem("username"));
/* 删除用户 */
function userDelete(row) {
  ElMessageBox.confirm(
    `这是${filterUserType(row.type)}的账号，确定删除吗？`,
    "Warning",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    let data = await UserDelHttp({
      username: row.username,
      type: row.type,
    });
    if (data.code === 200) {
      ElMessage({
        showClose: true,
        message: "删除成功",
        type: "success",
        duration: 2000,
      });
    } else {
      ElMessage.error(data.msg);
    }
    $store.allusersData = $store.allusersData.filter(
      (item) => item.username != row.username
    );
  });
}
/* 强制下线 */
async function userOffline(row) {
    ElMessageBox.confirm(`确认将该用户强制下线？`, "Warning",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async ()=> {
      let data = await LogOutHttp({
        username: row.username,
        type: row.type,
      });
      if (data.code === 200) {
        ElMessage({
          showClose: true,
          message: "强制下线成功",
          type: "success",
          duration: 2000,
        });
        table.value.forEach((item) => {
        if (item.username === row.username) {
            item.isOnline = false;
          }
        });
      } else {
        ElMessage.error(data.msg);
      }
    })
}
/* 新增用户 */
async function userAdd(addTraffic) {
  // 发送请求
  let result = await RegisterHttp({
    username: addTraffic.username,
    password: addTraffic.password,
    type: "traffic",
  });
  if (result.code === 200) {
    ElMessage({
      showClose: true,
      message: "成功添加交通管理员账号",
      type: "success",
      duration: 2000,
    });
    dialogTrafficUser.value = false;
    //更新用户数据
    const userid = $store.allusersData.slice(-1)[0].id + 1;
    $store.allusersData.push({
      id: userid,
      username: addTraffic.username,
      password: addTraffic.password,
      type: "traffic",
      isOnline: false,
    });
    /* 更新列表 */
    table.value = $store.allusersData.slice(
      pageSize * (currentPage - 1),
      pageSize * currentPage
    );
  } else {
    ElMessage.error(result.msg);
  }
}

/* 修改用户信息 */
function userEdit(row) {
  localStorage.setItem("userInitialData", JSON.stringify(row));
  if (row.type === "admin") {
    ElMessage({
      message: "管理员账号，无法修改",
      type: "warning",
      duration: 2000,
    });
  } else {
    dialogFormVisible.value = true;
    //渲染用户名在输入框上
    userEditData.value = JSON.parse(localStorage.getItem("userInitialData"));
  }
}

async function editUserInfo(userEditData) {
  const userInitialData = JSON.parse(localStorage.getItem("userInitialData"));
  if (userEditData.username != userInitialData.username) {
    if (
      $store.allusersData.filter(
        (item) => item.username === userEditData.username
      ).length != 0
    ) {
      dialogFormVisible.value = true;
      ElMessage({
        showClose: true,
        message: "用户名已存在",
        type: "error",
        duration: 1000,
      });
    } else if (
      $store.allusersData.filter(
        (item) => item.username === userEditData.username
      ).length === 0
    ) {
      let result1 = await RegisterHttp({
        username: userEditData.username,
        password: userEditData.password,
        type: userEditData.type,
      });
      const item = $store.allusersData.find(
        (item) => item.id === userInitialData.id
      );
      let result2 = await UserDelHttp({
        username: item.username,
        type: item.type,
      });
      if (result1.code === 200 && result2.code === 200) {
        ElMessage({
          showClose: true,
          message: "修改成功",
          type: "success",
          duration: 2000,
        });
        //更新列表
        $store.allusersData.forEach((item) => {
          if (item.id === userEditData.id) {
            item.username = userEditData.username;
          }
        });
        localStorage.setItem("userInitialData", JSON.stringify(userEditData));
        dialogFormVisible.value = false;
      } else if (result1.code != 200 || result2.code != 200) {
        ElMessage({
          showClose: true,
          message: "修改失败",
          type: "error",
          duration: 2000,
        });
        dialogFormVisible.value = true;
      }
    }
  } else if (userEditData.password != userInitialData.password) {
    let result = await EditPasswordHttp({
      username: userEditData.username,
      newPassword: userEditData.password,
      type: userEditData.type,
    });
    if (result.code === 200) {
      ElMessage({
        showClose: true,
        message: "修改密码成功",
        type: "success",
        duration: 2000,
      });
      /* 更新用户数据 */
      $store.allusersData.forEach((item) => {
        if (item.id === userEditData.id) {
          item.password = userEditData.password;
        }
      });
      localStorage.setItem("userInitialData", JSON.stringify(userEditData));
      dialogFormVisible.value = false;
    } else {
      ElMessage.error(result.msg);
      dialogFormVisible.value = true;
    }
  } else {
    dialogFormVisible.value = false;
  }
}
//关闭新增弹窗前，清空上一次的数据
const beforeClose= ()=>{
  // 清空上一次输入框的记录
  addTraffic.value.username = "";
  addTraffic.value.password = "";
}
</script>

<style lang="scss" scoped>
.addbtn {
  margin-bottom: 10px;
}
.refresh {
  margin-bottom: 10px;
  margin-left: 10px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-page {
  padding-left: 5px;
}
</style>
