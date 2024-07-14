<template>
  <div class="traffic">
    <!-- api -->
    <axios-config ref="config_notice"></axios-config>
    <!-- 权限警告 -->
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <v-alert
        class="warning"
        v-if="isWarn"
        border="top"
        :type="alertType"
        prominent
      >
        {{ errmsg }}
      </v-alert>
    </transition>

    <!-- 粒子特效 -->
    <!-- 问候特效 -->
    <div class="greet"></div>
    <!-- 入口导航 -->
    <div class="navi"></div>
    <!-- 事件表单 -->
    <form
      v-if="isEvent"
      ref="draggableForm"
      class="event draggable-field"
      style="
        background-color: whitesmoke;
        opacity: 80%;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 10px 10px 10px black;
        position: absolute;
      "
      :draggable="true"
      @mousedown="onDragStart"
    >
      <v-text-field
        v-model="state.eventDriver"
        :counter="20"
        :error-messages="v$.name.$errors.map((e) => e.$message)"
        label="Name"
        required
        @blur="v$.name.$touch"
        @input="v$.name.$touch"
      ></v-text-field>

      <v-text-field
        v-model="state.eventCar"
        :counter="12"
        :error-messages="v$.name.$errors.map((e) => e.$message)"
        label="车牌号"
        required
        @blur="v$.name.$touch"
        @input="v$.name.$touch"
      ></v-text-field>

      <div class="event-time">{{ currentTime }}</div>
      <v-text-field
        v-model="state.eventTime"
        :error-messages="v$.name.$errors.map((e) => e.$message)"
        label="事件时间"
        :items="eventTime"
        required
      ></v-text-field>

      <v-text-field
        v-model="state.eventLocation"
        :error-messages="v$.name.$errors.map((e) => e.$message)"
        label="事件地点"
        required
      ></v-text-field>

      <v-select
        v-model="state.select_level"
        :error-messages="v$.select.$errors.map((e) => e.$message)"
        :items="eventLevel"
        label="事件等级"
        required
        @blur="v$.select.$touch"
        @change="v$.select.$touch"
      ></v-select>

      <v-select
        v-model="state.select_type"
        :error-messages="v$.select.$errors.map((e) => e.$message)"
        :items="eventType"
        label="事件类型"
        required
        @blur="v$.select.$touch"
        @change="v$.select.$touch"
      ></v-select>

      <v-select
        v-model="state.select_status"
        :error-messages="v$.select.$errors.map((e) => e.$message)"
        :items="eventStatus"
        label="处理状态"
        required
        @blur="v$.select.$touch"
        @change="v$.select.$touch"
      ></v-select>

      <v-checkbox
        v-model="state.checkbox"
        :error-messages="v$.checkbox.$errors.map((e) => e.$message)"
        label="您确定提交此次事件吗?"
        required
        @blur="v$.checkbox.$touch"
        @change="v$.checkbox.$touch"
      ></v-checkbox>

      <v-btn class="me-4" @mouseover="v$.$validate" @click="eventRequest">
        submit
      </v-btn>
      <v-btn @click="clear"> clear </v-btn>
    </form>
    <!-- 公告表单 -->
    <form
      v-if="isAnnouncement"
      ref="draggableForm_announcement"
      class="notice draggable-field"
      style="
        background-color: whitesmoke;
        opacity: 80%;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 10px 10px 10px black;
        position: absolute;
      "
      :draggable="true"
      @mousedown="onDragStart"
    >
      <v-text-field
        class="notice-text-field"
        v-model="state.noticeContent"
        :counter="150"
        :error-messages="v$.name.$errors.map((e) => e.$message)"
        label="公告内容"
        required
        @blur="v$.name.$touch"
        @input="v$.name.$touch"
      ></v-text-field>

      <v-checkbox
        v-model="state.checkbox"
        :error-messages="v$.checkbox.$errors.map((e) => e.$message)"
        label="您确定发布吗?"
        required
        @blur="v$.checkbox.$touch"
        @change="v$.checkbox.$touch"
      ></v-checkbox>

      <v-btn class="me-4" @mouseover="v$.$validate" @click="noticeRequest">
        发布
      </v-btn>
      <v-btn @click="state.noticeContent = ''"> 清空 </v-btn>
    </form>
    <!-- 公告列表 -->
    <div class="noticeList">
      <v-container>
        <v-row align="center" justify="center" dense>
          <!-- 响应式网格布局 -->
          <v-col
            cols="12"
            v-for="notice in paginatedNoticeList"
            :key="notice.id"
          >
            <v-card
              append-icon="mdi-check"
              class="mx-auto"
              prepend-icon="mdi-account"
              :title="[notice.username, '---',notice.time]"
              :subtitle="[notice.content]"
              @mouseover="isTrashShow = notice.id"
              @mouseleave="isTrashShow = -1"
            >
              <!-- <v-list-item-content>
                <v-list-item-title v-text="notice.username"></v-list-item-title>
                <v-list-item-subtitle>
                  <div v-for="(line, index) in paginatedNoticeList" :key="index">
                    {{ line.time }}<br>{{ line.content }}<br>
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content> -->
              <template v-slot:append>
                <v-btn
                  icon="mdi-delete"
                  variant="outlined"
                  color="blue"
                  size="30"
                  v-show="isTrashShow === notice.id"
                  @click="deleteNotice(notice.id)"
                >
                </v-btn>
              </template>
            </v-card>
          </v-col>
        </v-row>
        <!-- 分页 -->
        <v-pagination
          v-model="page"
          :length="pageCount"
          rounded="circle"
        ></v-pagination>
      </v-container>
    </div>
    <!-- 切换表单 -->
    <v-btn class="traggle" @click="traggleForm">切换器</v-btn>
    <!-- 获得所有公告 -->
    <v-btn class="allnotice" @click="getAllNotice">所有公告</v-btn>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import Typed from 'typed.js';
import AxiosConfig from './AxiosConfig.vue';
import { format } from 'date-fns';

const errmsg = ref('只有交通管理员才可以发布公告');
const alertType = ref('warning');
const isWarn = ref(false);
const warnHandler = () => {
  isWarn.value = true;
  const time = setTimeout(() => {
    isWarn.value = false;
    clearTimeout(time);
  }, 3000);
};

const isTrashShow = ref(-1);
const config_notice = ref(null);

const currentTime = ref(new Date());
const initialState = {
  eventDriver: '',
  eventCar: '',
  eventLocation: '',
  eventTime: '',
  select_level: null,
  select_type: null,
  select_status: null,
  checkbox: null,
};

const state = reactive({
  ...initialState,
});

const eventLevel = ['一般事故', '重大事故', '特大事故'];
const eventType = ['碰撞', '刮擦', '碾压', ' 其他'];
const eventTime = [`${currentTime.value}`];
const eventStatus = ['未处理', '处理中', '已处理'];

const rules = {
  name: { required },
  email: { required, email },
  select: { required },
  items: { required },
  checkbox: { required },
};

const v$ = useVuelidate(rules, state);

function clear() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}

const updateTime = () => {
  currentTime.value = new Date();
};
// Optionally, you can update the time every second
onMounted(() => {
  setInterval(updateTime, 1000);
});
onMounted(() => {
  var typed = new Typed('.greet', {
    strings: [
      '智慧交通，融贯古今',
      '我们在数据中看见了未来',
      '在算法中编织着希望',
      '每一条道路',
      '每一盏信号灯',
      '都在诉说着繁华与安全的故事',
      '在忙碌的街道上',
      '你是守护者',
      '指引着流动的车流',
      '如同指挥家掌控着交响乐的节奏',
      '每一个选择',
      '每一次点击',
      '都是为了那一天',
      '车辆顺畅，行人无恙',
      '让我们一起',
      '用科技绘制城市的未来',
      '用智慧点亮每一个平凡的日子',
      '光谷的每一寸土地',
      '都因你的努力而更加璀璨',
      '感谢你',
      '亲爱的交通管理人员',
      '让我们的城市',
      '在你的守护下',
      '变得更加美好',
      '愿你每天都能看见',
      '车流如诗',
      '灯火如歌',
      '在你的指引下',
      '城市的脉动',
      '绽放出最美的篇章',
      '亲爱的交通管理人员！',
      '欢迎回到光谷智慧交通',
      '请选择您的即将发布的内容类型',
    ],
    typeSpeed: 100,
    loop: true,
  });
});

function eventRequest() {}

async function getCurrentUserInfo() {
  const result = [];
  localStorageManager('get', 'Authorization-', result);
  if (result.length == 0) return 'unkonwn';
  const username = result[0].id;
  if (config_notice.value) {
    const config = {
      method: 'GET',
      route: '/search/username',
      params: { username },
    };
    const res = await config_notice.value.user_start(config);
    if (res.status) {
      return res.data;
    }
  }
}
async function noticeRequest() {
  const user = await getCurrentUserInfo();
  if (user.type !== 'traffic') {
    warnHandler();
    return 0;
  }
  if (config_notice.value) {
    let timestamp = new Date().getTime();
    const result = [];
    localStorageManager('get', 'Authorization-', result);
    const username = result[0].id;
    const data = {
      id: `${timestamp}`,
      content: state.noticeContent,
      time: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      username,
    };
    const config = {
      method: 'POST',
      route: '/create',
      data,
    };
    const res = await config_notice.value.notice_start(config);
    if (res.status) {
      errmsg.value = '公告发布成功';
      alertType.value = 'success';
      warnHandler();
    } else {
      errmsg.value = '公告发布失败';
      alertType.value = 'error';
      warnHandler();
    }
  }
}

const noticeList = ref([]);
async function getAllNotice() {
  if (config_notice.value) {
    const config = {
      method: 'GET',
      route: '/all',
    };
    const res = await config_notice.value.notice_start(config);
    if (res.status) {
      errmsg.value = '公告获取成功';
      alertType.value = 'primary';
      warnHandler();
      noticeList.value = [];
      res.data.forEach((item) => {
        noticeList.value.push(item);
      });
      return res.data;
    } else {
      errmsg.value = '公告获取失败';
      alertType.value = 'error';
      warnHandler();
    }
  }
}

async function deleteNotice(id) {
  const user = await getCurrentUserInfo();
  if (user.type !== 'traffic') {
    warnHandler();
    return 0;
  }
  if (config_notice.value) {
    const config = {
      method: 'post',
      params: { id },
      route: '/delete',
    };
    const res = await config_notice.value.notice_start(config);
    if (res.status) {
      await getAllNotice();
      errmsg.value = '公告删除成功';
      alertType.value = 'primary';
      warnHandler();
    } else {
      errmsg.value = '公告删除失败';
      alertType.value = 'error';
      warnHandler();
    }
  }
}

const isEvent = ref(false);
const isAnnouncement = ref(true);
// 🚨
const draggableForm = ref(null);
const draggableForm_announcement = ref(null);
const dragOffsetX = ref(0);
const dragOffsetY = ref(0);
const dragOffsetX_announcement = ref(0);
const dragOffsetY_announcement = ref(0);
const dragging = ref(false);
function onDragStart(event) {
  const form = draggableForm.value;
  // const rect = form.getBoundingClientRect();
  // dragOffsetX.value = event.clientX - rect.left;
  // dragOffsetY.value = event.clientY - rect.top;
  dragOffsetX.value = event.clientX;
  dragOffsetY.value = event.clientY;
  dragOffsetX_announcement.value = event.clientX;
  dragOffsetY_announcement.value = event.clientY;
  dragging.value = true;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', onDragEnd);
}
function onDrag(event) {
  if (!dragging.value) return;
  const form = draggableForm.value;
  const form_announce = draggableForm_announcement;
  const x = event.clientX - dragOffsetX.value;
  const y = event.clientY - dragOffsetY.value;
  const x_annoucement = event.clientX - dragOffsetX_announcement.value;
  const y_annoucement = event.clientY - dragOffsetY_announcement.value;
  form.style.left = `${x}px`;
  form.style.top = `${y}px`;
  form_announce.style.left = `${x_annoucement}px`;
  form_announce.style.top = `${y_annoucement}px`;
}
function onDragEnd() {
  dragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', onDragEnd);
}

const page = ref(1);
const itemPerPage = ref(5);
const pageCount = computed(() => {
  return Math.ceil(usersAllList.value.length / itemPerPage.value);
});
const paginatedNoticeList = computed(() => {
  const start = (page.value - 1) * itemPerPage.value;
  const end = start + itemPerPage.value;
  return noticeList.value.slice(start, end);
});
//
// util---------------------------------------------------------------------------
// --本地存储
const removeLocalStorageItemsByPrefix = (prefix) => {
  // 从后往前遍历以避免索引问题💥
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }
};

const setLocalStorageItems = (prefix, sourceArr = []) => {
  // 先删除所有以指定前缀开头的项
  removeLocalStorageItemsByPrefix(prefix);
  // 存储新的项
  sourceArr.forEach((obj) => {
    // 修改原有元素的属性
    const key = prefix;
    const value = JSON.stringify(obj);
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item with key ${key}`, error);
    }
  });
};

const getLocalStorageItemsByPrefix = (prefix, resultArr = []) => {
  // 初始化resultArray作为参数，避免外部arr的副作用
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
      const id = key.substring(prefix.length);
      try {
        const item = JSON.parse(localStorage.getItem(key));
        // bug🚩
        if (!resultArr.some((obj) => obj.id === id)) {
          resultArr.push(item);
        }
      } catch (error) {
        console.error(`Error parsing item with key ${key}`, error);
      }
    }
  }
  return resultArr; // 返回结果数组
};

function localStorageManager(type, predix, arr) {
  switch (type) {
    case 'set':
      setLocalStorageItems(predix, arr);
    case 'get':
      arr = getLocalStorageItemsByPrefix(predix, arr);
      // arr为结果集
      return arr;
    case 'clear':
      removeLocalStorageItemsByPrefix(predix);
      break;
    default:
      // 处理未知的type
      console.log('localStorageManager参数异常');
      return null;
  }
}

function traggleForm() {
  isAnnouncement.value = !isAnnouncement.value;
  isEvent.value = !isEvent.value;
}
</script>

<style lang="scss" scoped>
.traffic {
  background-color: transparent;
  position: relative;
  .navi {
    top: 0%;
    left: 50%;
    position: absolute;
    .speed-dial {
      width: 500px;
      height: 500px;
      :deep(.fab) {
        width: 100px;
        height: 100px;
        font-size: 24px;
      }
    }
  }
  .event {
    width: 50%;
    .event-time {
    }
  }
}

.draggable-field {
  cursor: move;
}

.greet {
  color: wheat;
  font-size: 25px;
  font-weight: bold;
  height: 25px;
  line-height: 25px;
  text-align: center;
}
.warning {
  width: 20%;
  position: fixed;
  left: 4%;
  z-index: 1;
}
.traggle {
  position: absolute;
  left: 60%;
  top: 200%;
}
.notice-text-field {
  width: 300px;
  height: 300px;
}
.allnotice {
  position: absolute;
  top: 300%;
  left: 60%;
}
.noticeList {
  width: 600px;
  background-color: rgb(175, 231, 244);
  opacity: 0.7;
  position: absolute;
  left: 60%;
  top: 400%;
}
</style>
