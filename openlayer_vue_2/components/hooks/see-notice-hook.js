import { useNoticeStore } from "@/stores/notice.js";
const store = useNoticeStore();
export const seeNoticeHook = () => {
  store.getNoticeList();
  store.setSeeNoticeShow(true);
};
