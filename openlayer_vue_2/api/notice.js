import request from "./axios";
//1、发布公告
export const publishNoticeHttp = ({
  publisher,
  type,
  title,
  content,
  date,
}) => {
  return request({
    url: `/api/publish`,
    method: "post",
    data: {
      publisher,
      type,
      title,
      content,
      date,
    },
  });
};
//2、查看公告
export const seeNoticeHttp = () => {
  return request({
    url: `/api/notice`,
    method: "get",
  });
};
//3、根据id获取公告
export const getNoticeByIdHttp = (id) => {
  return request({
    url: `/api/noticeDetails?id=${id}`,
    method: "get",
  });
};
//4、删除公告
export const noticeDelHttp = (id) => {
  return request({
    url: "/api/notice/delete",
    method: "delete",
    data: {
      id,
    },
  });
};
