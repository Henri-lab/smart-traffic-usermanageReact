<template>
  <!-- 发布公告 -->
  <publish-notice></publish-notice>
  <!-- 查看公告 -->
  <see-notice></see-notice>
  <!-- 公告详情 -->
  <notice-detail></notice-detail>
  <!-- 报告路况 -->
  <report-road></report-road>
  <!-- 上报路况 -->
  <add-event-dialog></add-event-dialog>
  <!-- 路况信息列表 -->
  <road-condition-dialog></road-condition-dialog>
  <!-- 用户管理列表 -->
  <user-manage></user-manage>
  <!-- 用户新增更新 -->
  <update-info></update-info>
  <!-- 事件列表 echart图-->
  <event-list-echart></event-list-echart>
  <!-- 视频监控弹窗 -->
  <monitor-popup></monitor-popup>
</template>

<script setup>
import PublishNotice from "@/components/notice/PublishNotice.vue";
import SeeNotice from "@/components/notice/SeeNotice.vue";
import NoticeDetail from "@/components/notice/NoticeDetail.vue";
import ReportRoad from "@/components/traffic-condition/ReportRoad.vue";
import EventListEchart from "@/components/event-manage/EventListEchart.vue";
import AddEventDialog from "@/components/event-manage/AddEventDialog.vue";
import RoadConditionDialog from "@/components/traffic-condition/RoadConditionDialog.vue";
import UserManage from "@/components/user/UserManage.vue";
import UpdateInfo from "@/components/user/UpdateInfo.vue";
import MonitorPopup from "@/components/monitor/MonitorPopup.vue";
</script>

<style lang="scss" scoped>

</style>