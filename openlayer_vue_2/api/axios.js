import axios from "axios";
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 800,
});
//添加请求拦截诶器
request.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      // 如果 token 存在，在每个 HTTP header 都加上 token
      // Bearer 是 JWT 的认证头部信息
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // console.log("没有token");  登录注册的时候就是应该显示没有token
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default request;
