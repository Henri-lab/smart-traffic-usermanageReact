import { ref } from "vue";
import { defineStore } from "pinia";
import { seeNoticeHttp, getNoticeByIdHttp } from "@/api/notice.js";
export const useNoticeStore = defineStore("notice", () => {
  const isShowPublishNotice = ref(false); //是否显示公告信息框
  const isShowNoticeList = ref(false); //是否显示公告列表
  const WuYeData = ref([]); //物业电话列表信息
  const noticeList = ref([]);
  const noticeDetail = ref("");
  const isShowNoticeDetail = ref(false);
  const id = ref();
  function setPublishNoticeShow(val) {
    //设置显示隐藏
    isShowPublishNotice.value = val;
  }
  function setSeeNoticeShow(val) {
    //设置显示隐藏
    isShowNoticeList.value = val;
  }
  async function getNoticeList() {
    //获取公告列表
    let res = await seeNoticeHttp();
    if (res.code == 200) {
      noticeList.value = res.data;
    }
  }
  function setWuYwData(val) {
    //设置物业信息
    WuYeData.value = val;
  }
  async function getNoticeById(id) {
    let res = await getNoticeByIdHttp(id);
    if (res.code == 200) {
      noticeDetail.value = res.data;
    }
  }
  function setNoticeDetailShow(val) {
    isShowNoticeDetail.value = val;
  }
  function setId(val) {
    id.value = val;
  }

  return {
    isShowPublishNotice,
    isShowNoticeList,
    WuYeData,
    noticeList,
    noticeDetail,
    isShowNoticeDetail,
    id,
    setPublishNoticeShow,
    setSeeNoticeShow,
    getNoticeList,
    setWuYwData,
    getNoticeById,
    setNoticeDetailShow,
    setId,
  };
});
