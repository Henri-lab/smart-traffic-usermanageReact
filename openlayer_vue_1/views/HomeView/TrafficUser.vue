<template>
  <OpenMap></OpenMap>
  <TrafficBar></TrafficBar>
  <OpenToggle></OpenToggle>
  <!-- <GuangGu></GuangGu> -->
  <MonitorPropup></MonitorPropup>
  <TrafficDrawer></TrafficDrawer>
  <AddEventDialog></AddEventDialog>
  <tool-box v-show="$store.isShow"></tool-box>
  <open-control></open-control>
</template>

<script setup>
import OpenMap from "@/components/common/openMap.vue";
import TrafficBar from "@/components/traffic/TrafficBar.vue";
import OpenToggle from "@/components/common/OpenToggle.vue";
import GuangGu from "@/components/common/GuangGu.vue";
import MonitorPropup from "@/components/traffic/MonitorPropup.vue";
import TrafficDrawer from "@/components/traffic/TrafficDrawer.vue";
import AddEventDialog from "@/components/traffic/AddEventDialog.vue";
import ToolBox from "@/components/common/ToolBox.vue";
import { useStore } from "@/stores/index.js";
const $store = useStore();
import OpenControl from "@/components/common/OpenControl.vue";
</script>

<style lang="scss" scoped></style>
