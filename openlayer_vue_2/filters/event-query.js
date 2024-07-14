// 事件等级中文定义
export function filterLevel(val) {
  let result;
  switch (val) {
    case "1":
      result = "轻微事故";
      break;
    case "2":
      result = "一般事故";
      break;
    case "3":
      result = "重大事故";
      break;
    case "4":
      result = "特大事故";
      break;

    default:
      break;
  }
  return result;
}
//事件等级tag标签类型定义
export function filterTag(val) {
  let type;
  switch (val) {
    case "1":
      type = "info";
      break;
    case "2":
      type = "success";
      break;
    case "3":
      type = "warning";
      break;
    case "4":
      type = "danger";
      break;
    default:
      break;
  }
  return type;
}
// 事件状态中文定义
export function filterStatus(val) {
  let result;
  switch (val) {
    case "0":
      result = "未处理";
      break;
    case "1":
      result = "已忽略";
      break;
    case "2":
      result = "已处理";
      break;
    default:
      break;
  }
  return result;
}
// 事件状态按钮类型定义
export function filterButton(val) {
  let type;
  switch (val) {
    case "0":
      type = "danger";
      break;
    case "1":
      type = "info";
      break;
    case "2":
      type = "success";
      break;
    default:
      break;
  }
  return type;
}

//事件状态tag标签类型定义
export function filterStatusTag(val) {
  let type;
  switch (val) {
    case "0":
      type = "info";
      break;
    case "1":
      type = "warning";
      break;
    case "2":
      type = "success";
      break;
    default:
      break;
  }
  return type;
}

//事件数据根据用户权限筛选展示
//数据属性名称过滤
export function filterDataByPermission(permission, data) {
  const valueArr = data.SFEleArray.map((element) => element.AttValue); // 属性值数组
  const keyArr = data.AttStruct.FldName.filter((item) => item !== "mpLayer"); // 属性名称数组
  const tableData = [];
  for (let index = 0; index < valueArr.length; index++) {
    const values = valueArr[index];
    let obj = {};
    Object.assign(obj, ...keyArr.map((key, i) => ({ [key]: values[i] })));
    tableData.push(obj);
  }
  let result = [];
  switch (permission) {
    case "common":
      tableData.forEach((element) => {
        ["事件编号", "车牌号", "驾驶员"].forEach(
          (property) => delete element[property]
        );
        result.push(element);
      });
      break;
    case "traffic":
      result = tableData;
      break;
    case "admin":
      result = tableData;
      break;
    default:
      break;
  }
  return result;
}

//用户类型定义
export function filterUserType(val) {
  let type;
  switch (val) {
    case "common":
      type = "普通用户";
      break;
    case "traffic":
      type = "交通部门";
      break;
    case "admin":
      type = "管理员";
      break;
    default:
      break;
  }
  return type;
}
