<template>
  <div class="container" v-if="store.isShowNoticeDetail"></div>
</template>
<script setup>
import { onMounted, onBeforeUpdate, watch } from "vue";
import { useNoticeStore } from "@/stores/notice";
import { ElMessage, ElMessageBox } from "element-plus";
const store = useNoticeStore();
watch(
  () => store.noticeDetail,
  () => {
    ElMessageBox.alert(`${store.noticeDetail.content}`, `${store.noticeDetail.title}`, {
      confirmButtonText: "关闭",
    });
  }
);
</script>

<style lang="scss" scoped></style>
