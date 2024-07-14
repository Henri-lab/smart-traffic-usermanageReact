const POINT_STYLE_1 = {
  Angle: 0,
  Color: 6, //子图颜色
  Space: 0,
  SymHeight: 10,
  SymID: 21, //子图号
  SymWidth: 10,
};
const POINT_STYLE_2 = {
  Angle: 0,
  Color: 4, //子图颜色
  Space: 0,
  SymHeight: 10,
  SymID: 21, //子图号
  SymWidth: 10,
};
const POINT_STYLE_3 = {
  Angle: 0,
  Color: 74, //子图颜色
  Space: 0,
  SymHeight: 10,
  SymID: 21, //子图号
  SymWidth: 10,
};

export class Modifypoint {
  static update({ fid, position, attr, service, layer, callback }) {
    /* 1、确定修改的几何位置 */
    var gpoint = new Zondy.Object.GPoint(position[0], position[1]); // 修改位置
    /* 设置当前点要素的几何信息 */
    var fGeom = new Zondy.Object.FeatureGeometry({
      PntGeom: [gpoint],
    });
    /* 3、属性 */
    var attValue = attr.map((item) => item.value);
    /* 2、样式信息 */
    /* 2.2 设置样式信息 */
    let style = null;
    if (attValue == 0) {
      style = POINT_STYLE_1;
    } else if (attValue == 1) {
      style = POINT_STYLE_2;
    } else {
      style = POINT_STYLE_3;
    }
    var pointInfo = new Zondy.Object.CPointInfo(style);
    /* 设置当点要素的图形参数信息 */
    var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 1, //点
      PntInfo: pointInfo,
    });
    /* 4、设置要素 */
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
    feature.setFID(fid); //++
    /* 5、设置要素集,添加要素 */
    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet();
    /* 设置属性结构 */
    var cAttStruct = new Zondy.Object.CAttStruct({
      FldName: attr.map((item) => item.key),
      FldNumber: attr.length, //属性的个数
      FldType: attr.map((item) => item.type),
    });
    featureSet.AttStruct = cAttStruct;
    /* 添加要素到要素数据集 */
    featureSet.addFeature(feature);
    /* 6、调用服务,执行更新 */
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
    editService.update(featureSet, callback);
  }
}
