<template>
  <el-table :data="tableData" stripe border style="width: 100%">
    <el-table-column
      v-for="(item, index) of propLabel"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      align="center"
    />
  </el-table>
  <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :hide-on-single-page="isValue"
      :page-sizes="[5, 10, 15, 20]"
      :background="true"
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
  </el-pagination>
</template>

<script setup>
import { ref } from "vue"
// 分页控制
const currentPage = ref(1) // 当前页
const pageSize = ref(5) // 每页显示条数
const isValue = ref(true) // 是否只有一页
const total = ref(100) // 总条数
const tableData = ref([]) // 表格数据
const propLabel = ref([]) // 表格属性与数据绑定
const handleSizeChange = (val,data) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}
</script>

<style lang="scss" scoped>

</style>