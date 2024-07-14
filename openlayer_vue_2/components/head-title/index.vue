<template>
  <el-row>
    <el-col :span="6">
      <span>{{ title }}</span>
    </el-col>
    <el-col :span="14">
      <menu-list></menu-list>
    </el-col>
    <el-col :span="2">
      <search-input></search-input>
    </el-col>
  </el-row>
</template>

<script setup>
let title = import.meta.env.VITE_TITLE;
import MenuList from "./MenuList.vue";
import SearchInput from "./SearchInput.vue";
</script>

<style lang="scss" scoped>
@import "@/assets/styles/tooltip.css";
.el-row {
  height: 59px;
  background-color: #58616c;
  color: #fff;
  text-align: center;
  span {
    margin-left: 20px;
    line-height: 60px;
    font-size: 24px;
    font-weight: 800;
    color: #e6e6e6;
    font-family: "楷体";
    background: linear-gradient(
      to right bottom,
      #ffd04b,
      #ebebeb,
      #ffd04b
    ); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
    -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
    -webkit-text-fill-color: transparent; /*给文字设置成透明*/
  }
}
</style>
