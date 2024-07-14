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
  Color: 90, //子图颜色
  Space: 0,
  SymHeight: 10,
  SymID: 21, //子图号
  SymWidth: 10,
};
/**
 * @param {Array} attr = [
 *  {type:"string",name:"name",value:"武汉"}，
 *  {type:number,name:"id",value:1001}
 * ]
 * @param {Object} service ={name:"ig-server",layerId:3}
 *  */
export function addPoint({ position, attr, service, docLayer }) {
  /* 1、创建要素 mapgis
    Feature = geometry+style+attr
     */
  /* geometry */
  var gpoint = new Zondy.Object.GPoint(position[0], position[1]); //createPoint();
  //设置当前点要素的几何信息
  var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] });

  //style

  var pointInfo = new Zondy.Object.CPointInfo(POINT_STYLE_1);
  //设置当前点要素的图形参数信息
  var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
    /* 1 -- point  2--line  3--area */
    InfoType: 1,
    PntInfo: pointInfo,
  });
  var attValue = attr.map((item) => item.value);
  console.log(attValue);
  //创建一个要素
  var feature = new Zondy.Object.Feature({
    fGeom: fGeom,
    GraphicInfo: webGraphicInfo,
    AttValue: attValue,
  });
  //设置要素为点要素
  feature.setFType(1);

  /* 2、将创建添加要素集source */

  var featureSet = new Zondy.Object.FeatureSet();
  //设置属性结构
  /* mapgis图层中设置了name属性才需要写映射 */
  var cAttStruct = new Zondy.Object.CAttStruct({
    FldName: attr.map((item) => item.name),
    FldNumber: attr.length,
    FldType: attr.map((item) => item.type),
  });
  featureSet.AttStruct = cAttStruct;
  //添加要素到要素数据集
  featureSet.addFeature(feature);
  /* 3、调用添加服务 */
  //创建一个编辑服务类
  /* 第一个参数是ig-server服务的名称 */
  /* 第一个是添加要素所在的图层 */
  var editService = new Zondy.Service.EditDocFeature(
    service.name,
    service.layerId,
    {}
  );
  console.log(123);
  console.log(featureSet);
  console.log(editService);
  //执行添加点要素功能
  editService.add(featureSet, onPntSuccess(docLayer));
}
//添加点要素回调函数
function onPntSuccess(docLayer) {
  return function (data) {
    console.log(11);
    if (data.succeed) {
      alert("添加点要素成功！");
      docLayer.refresh();
    } else {
      alert("添加点要素失败！");
    }
  };
}
