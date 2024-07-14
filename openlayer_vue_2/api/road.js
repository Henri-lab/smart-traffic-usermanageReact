import request from "./axios";

//1、获取路况
export const getRoadHttp = () => {
  return request({
    url: "/api/roadInfo",
    method: "get",
  });
};

//2、上报路况
export const reportRoadHttp = ({
  reporter,
  type,
  location,
  sign,
  time,
  detail,
}) => {
  return request({
    url: "/api/reportRoad",
    method: "post",
    data: {
      reporter,
      type,
      location,
      sign,
      time,
      detail,
    },
  });
};
//3、更新路况的处理状态
export const updateRoadHttp = (id) => {
  return request({
    url: "/api/roadInfo/update",
    method: "patch",
    data: {
      id,
    },
  });
};

// 删除路况
export const deleteRoadHttp = (id) => {
  return request({
    url: "/api/roadInfo/delete",
    method: "delete",
    data: {
      id,
    },
  });
};
