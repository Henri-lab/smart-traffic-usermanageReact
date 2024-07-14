const now = new Date();
const year = now.getFullYear();
const month = ("0" + (now.getMonth() + 1)).slice(-2);
const day = ("0" + now.getDate()).slice(-2);
const hours = ("0" + now.getHours()).slice(-2);
const minutes = ("0" + now.getMinutes()).slice(-2);
const date_now = `${year}-${month}-${day} ${hours}:${minutes}`;
export default date_now;
// console.log(date_now); // 输出：2023-12-20 15:21
