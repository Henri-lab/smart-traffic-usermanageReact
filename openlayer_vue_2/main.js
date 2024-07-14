import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
// 清除浏览器样式 引入的库
import "reset-css";
// 引入ui库
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";

//引入动画库
import "animate.css";
// 地图控件样式
import "@/assets/styles/open-control.css";
// 测量工具提示框样式
import "@/assets/styles/tooltip.css";

// 引入v-charts 绘制图表库
import vcharts from "vue-echarts";
import * as echarts from "echarts";

export const app = createApp(App);
// import "@/plugins/ElementPlus";
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.component("v-chart", vcharts);
app.mount("#app");
