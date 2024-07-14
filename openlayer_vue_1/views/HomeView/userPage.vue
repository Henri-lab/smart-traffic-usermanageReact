<template>
  <div>
    <!-- this is user page -->
    <OpenMap></OpenMap>
    <NavBar></NavBar>
    <tool-box v-show="$store.isShow"></tool-box>
    <OpenToggle></OpenToggle>
    <!-- <GuangGu></GuangGu> -->
    <open-control></open-control>
    <!-- <query-event-popup></query-event-popup> -->
  </div>
</template>

<script setup>
import OpenMap from "@/components/common/openMap.vue";
import NavBar from "@/components/common/NavBar.vue";
import ToolBox from "@/components/common/ToolBox.vue";
import { useStore } from "@/stores/index.js";
const $store = useStore();
import OpenToggle from "@/components/common/OpenToggle.vue";
import GuangGu from "@/components/common/GuangGu.vue";
import OpenControl from "@/components/common/OpenControl.vue";
import QueryEventPopup from "@/components/common/QueryEventPopup.vue";
</script>

<style scoped></style>
