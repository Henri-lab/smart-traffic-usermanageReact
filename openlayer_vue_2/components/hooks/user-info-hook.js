import { LogOutHttp, AllUsersHttp } from "../../api/user";
import Vrouter from "@/router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user.js";
const $store = useUserStore();
export const userInfoHook = () => {
  const username = localStorage.getItem("username");
  const type = localStorage.getItem("type");
  const logOut = async () => {
    const res = await LogOutHttp({ username, type });
    if (res.code === 200) {
      ElMessage({
        message: "退出登录",
        type: "success",
        duration: 1000,
        onClose: () => {
          const router = Vrouter;
          router.push("/login");
        },
      });
      //本地存储全部清空
      localStorage.clear();
    } else {
      ElMessage.error(res.msg);
    }
  };
  const userManage = async () => {
    const res = await AllUsersHttp();
    $store.allusersData = res.data;
    $store.setUserManageShow = true;
  };
  const updateInfo = async () => {
    const res = await AllUsersHttp();
    if (res.code === 200) {
      $store.allusersData = res.data;
    }
    $store.setUpdateInfoShow = true;
  };
  return {
    logOut,
    userManage,
    updateInfo,
  };
};
