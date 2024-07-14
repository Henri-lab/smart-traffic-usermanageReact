<template>
  <el-dialog
    v-model="$store.setUpdateInfoShow"
    title="修改信息"
    center
    draggable
    @closed="delLastInfo"
  >
    <el-form :model="info">
      <el-form-item label="用户名：" :label-width="formLabelWidth">
        <el-input v-model="info.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码：" :label-width="formLabelWidth">
        <el-input v-model="info.password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$store.setUpdateInfoShow = false">取消</el-button>
        <el-button type="primary" @click="editInfo(info)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useUserStore } from "@/stores/user.js";
import { onMounted, ref } from "vue";
import { UserDelHttp, EditPasswordHttp, RegisterHttp } from "@/api/user.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
const $store = useUserStore();
const formLabelWidth = "100px";
const info = ref({});

onMounted(() => {
  const userInitialData = {
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
    type: localStorage.getItem("type"),
  };
  info.value = userInitialData;
});
//取消修改
function delLastInfo() {
  info.value.username = localStorage.getItem("username");
  info.value.password = localStorage.getItem("password");
  $store.setUpdateInfoShow = false;
}
//确认修改
async function editInfo(info) {
  const userInitialData = {
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
    type: localStorage.getItem("type"),
  };
  const userItem = $store.allusersData.find(
    (item) => item.username === localStorage.getItem("username")
  );
  if (info.username != userInitialData.username) {
    if (
      $store.allusersData.filter((item) => item.username === info.username)
        .length != 0
    ) {
      $store.setUpdateInfoShow = true;
      ElMessage({
        showClose: true,
        message: "用户名已存在",
        type: "error",
        duration: 1000,
      });
    } else if (
      $store.allusersData.filter((item) => item.username === info.username)
        .length === 0
    ) {
      let result1 = await RegisterHttp({
        username: info.username,
        password: info.password,
        type: info.type,
      });
      let result2 = await UserDelHttp({
        username: userItem.username,
        type: userItem.type,
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
          if (item.id === info.id) {
            item.username = info.username;
            item.password = info.password;
          }
        });
        router.push("/login");
        //本地存储需要全部清空
        localStorage.clear();
        $store.setUpdateInfoShow = false;
      } else if (result1.code != 200 || result2.code != 200) {
        ElMessage({
          showClose: true,
          message: "修改失败",
          type: "error",
          duration: 2000,
        });
        $store.setUpdateInfoShow = true;
      }
    }
  } else if (info.password != userInitialData.password) {
    let result = await EditPasswordHttp({
      username: info.username,
      newPassword: info.password,
      type: info.type,
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
        if (item.username === info.username) {
          item.password = info.password;
        }
      });
      localStorage.setItem("password", info.password);
      $store.setUpdateInfoShow = false;
    } else {
      ElMessage.error(result.msg);
      $store.setUpdateInfoShow = true;
    }
  } else {
    $store.setUpdateInfoShow = false;
  }
}
</script>

<style lang="scss" scoped></style>
