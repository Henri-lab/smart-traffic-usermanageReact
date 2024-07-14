import request from "./axios";
//一、用户
//1、注册
export const RegisterHttp = ({ username, password, type }) => {
  return request({
    url: `/api/register`,
    method: "post",
    data: {
      username,
      password,
      type,
    },
  });
};
//2、登录
export const LoginHttp = ({ username, password, type }) => {
  return request({
    url: `/api/login`,
    method: "post",
    data: {
      username,
      password,
      type,
    },
  });
};
//3 获取所有用户
export const AllUsersHttp = () => {
  return request({
    url: "/api/allusers",
    method: "get",
  });
};
//4、退出登录
export const LogOutHttp = ({ username, type }) => {
  return request({
    url: "/api/logout",
    method: "post",
    data: {
      username,
      type,
    },
  });
};
//5、删除用户
export const UserDelHttp = ({ username, type }) => {
  return request({
    url: "/api/users/delete",
    method: "delete",
    data: {
      username,
      type,
    },
  });
};
//6、修改密码
export const EditPasswordHttp = ({ username, newPassword, type }) => {
  return request({
    url: "/api/users/update",
    method: "put",
    data: {
      username,
      newPassword,
      type,
    },
  });
};
