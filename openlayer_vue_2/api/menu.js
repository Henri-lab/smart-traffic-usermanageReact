import request from "./axios";

//3、获取菜单
export const MenuHttp = (type) => {
  return request({
    url: `/api/menu?type=${type}`,
    method: "get",
  });
};