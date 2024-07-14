/**
 *@param {Array} position = [[114.30,30.50],[x,y],[z,y]]

 * @param {Array} attr = [
 *  {type:"string",name:"name",value:"武汉"}，
 *  {type:number,name:"id",value:1001}
 * ]
 * @param {Object} service ={name:"ig-server",layerId:3}
 */
const LINE_STYLE = {
  Color: 1,
  LinStyleID: 0,
  LinStyleID2: 24,
  LinWidth: 0.05,
  Xscale: 10,
  Yscale: 10,
};
class LineString {
  static add({ position, attr, service, docLayer }) {
    var pointObj = position.map(
      (item) => new Zondy.Object.Point2D(item[0], item[1])
    );
    // pointObj[0] = new Zondy.Object.Point2D(114.30, 30.50);

    //构成折线的弧段
    var gArc = new Zondy.Object.Arc(pointObj);
    //构成线的折线
    var gAnyLine = new Zondy.Object.AnyLine([gArc]);
    //设置线要素的几何信息
    var gline = new Zondy.Object.GLine(gAnyLine);
    //设置要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] });

    /* style */
    //设置添加线要素的图形参数信息
    var clineInfo = new Zondy.Object.CLineInfo(LINE_STYLE);
    //设置要素的图形参数信息
    var graphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 2,
      LinInfo: clineInfo,
    });
    /* attr */
    //设置添加线要素的属性信息
    var attValue = attr.map((item) => item.value);

    //创建一个线要素
    var newFeature = new Zondy.Object.Feature({
      fGeom: fGeom,
      GraphicInfo: graphicInfo,
      AttValue: attValue,
    });
    //设置要素为线要素
    newFeature.setFType(2);
    /* 2、构建要素集 */
    var featureSet = new Zondy.Object.FeatureSet();
    var fldNumber = attr.length; //属性个数
    var fldName = attr.map((item) => item.name);
    var fldType = attr.map((item) => item.type);
    //创建属性结构设置对象
    var cAttStruct = new Zondy.Object.CAttStruct({
      FldName: fldName,
      FldNumber: fldNumber,
      FldType: fldType,
    });
    //设置要素数据集的树形结构
    featureSet.AttStruct = cAttStruct;
    //将添加的线要素添加到属性数据集中
    featureSet.addFeature(newFeature);
    /* 3、调用服务 */
    var editDocFeature = new Zondy.Service.EditDocFeature(
      service.name,
      service.layerId,
      {}
    );
    editDocFeature.add(featureSet, this.onLineSuccess(docLayer));
  }
  static onLineSuccess(docLayer) {
    return function (data) {
      if (data.succeed) {
        alert("添加线要素成功！");
        docLayer.refresh();
      } else {
        alert("添加线要素失败！");
      }
    };
  }
}
