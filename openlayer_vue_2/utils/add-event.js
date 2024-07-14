import { ElMessage } from "element-plus";

let POINT_STYLE = {
  Angle: 0,
  Color: 6, //子图的颜色
  Space: 0,
  SymHeight: 5, //点的高度
  SymID: 21,
  SymWidth: 5, //点的宽度
};
/**
 *
 * @param {array} position 坐标的位置
 * @param {string} layer 图层
 * @param {array} attr [{name,value,type}]
 * @param {object} service {name,layerId}
 */
export function addPoint({ position, layer, attr, service }) {
  attr.forEach((item) => {
    if (item.name === "处理状态") {
      // console.log(item.value);
      // 等级为1————轻微 设置颜色为
      if (item.value == 0) {
        POINT_STYLE.Color = 6;
      }
      if (item.value == 1) {
        POINT_STYLE.Color = 4;
      }
      if (item.value == 2) {
        POINT_STYLE.Color = 90;
      }
    }
  });
  // console.log(POINT_STYLE);
  /* 2.1构建几何信息 */
  /* 创建一个点形状,描述点形状的几何信息 */
  var gpoint = new Zondy.Object.GPoint(position[0], position[1]);
  /* 设置当前点要素的几何信息 */
  var fGeom = new Zondy.Object.FeatureGeometry({
    PntGeom: [gpoint],
  });
  /* 2.2 设置样式信息 */
  var pointInfo = new Zondy.Object.CPointInfo(POINT_STYLE);
  /* 设置当点要素的图形参数信息 */
  var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
    InfoType: 1, //点
    PntInfo: pointInfo,
  });
  /* 2.3 设置属性信息 */
  /* 设置添加点要素的属性信息 */
  var attValue = attr.map((item) => item.value);
  /* 2.4  构建要素对象 */
  var feature = new Zondy.Object.Feature({
    fGeom: fGeom, //坐标--几何信息
    GraphicInfo: webGraphicInfo, //样式信息
    AttValue: attValue, //属性
  });
  /* 设置要素为点要素 
	点 -->1
	线 -->2
	面 -->3
	*/
  feature.setFType(1);
  /* 2.5 设置要素集 */
  //创建一个要素数据集
  var featureSet = new Zondy.Object.FeatureSet();
  /* 设置属性结构 */
  var cAttStruct = new Zondy.Object.CAttStruct({
    FldName: attr.map((item) => item.name), //属性的字段名
    FldNumber: attr.length, //属性的个数
    FldType: attr.map((item) => item.type), //属性的类型
  });
  featureSet.AttStruct = cAttStruct;
  /* 添加要素到要素数据集 */
  featureSet.addFeature(feature);
  /* 2.6 调用编辑服务接口 */
  /* 
	创建一个编辑服务类 
	第一个参数：服务的名称 第二参数：图层的名称
	*/
  var editService = new Zondy.Service.EditDocFeature(
    service.name,
    service.layerId,
    {
      ip: "localhost",
      port: "6163", //访问IGServer的端口号, .net为6163,Java为8089
    }
  );
  //执行添加点要素功能
  editService.add(featureSet, onPntSuccess(layer));
}

function onPntSuccess(layer) {
  return function (data) {
    if (data.succeed) {
      ElMessage({
        message: "添加成功！",
        type: "success",
      });
      layer.refresh(); //重新加载地图文档
    } else {
      ElMessage({
        message: "添加失败！",
        type: "error",
      });
    }
  };
}
