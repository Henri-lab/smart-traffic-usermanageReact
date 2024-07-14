/**
 *@param {Array} position =  [
          [114.30041, 30.54372],
          [114.301674, 30.543325],
          [114.301501, 30.542621]
        ] 
 *@param {Array} attr =[{name:"xxx",type:"xxx",value:"xx"}]
 *  */
function addArea({
    position,
    attr = [],
    service,
    docLayer
}) {
    var pointObj = position.map(item => new Zondy.Object.Point2D(item[0], item[1]))
    //设置区要素的几何信息  geometry
    var gArc = new Zondy.Object.Arc(pointObj);
    //构成区要素折线
    var gAnyLine = new Zondy.Object.AnyLine([gArc]);
    //构成区要素
    var gRegion = new Zondy.Object.GRegion([gAnyLine]);
    //构成区要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ RegGeom: [gRegion] });
    /* style */
    //设置区要素的图形参数信息
    var cRegionInfo = new Zondy.Object.CRegionInfo({
        EndColor: 1,
        FillColor: 11, //填充色
        FillMode: 0,//填充模式
        OutPenWidth: 1,
        OverMethod: 0,
        PatAngle: 1,
        PatColor: 1,
        PatHeight: 1,
        PatID: 0,//图案编号
        PatWidth: 1
    });
    //要素图形参数信息
    var graphicInfo = new Zondy.Object.WebGraphicsInfo({
        InfoType: 3,
        RegInfo: cRegionInfo
    });
    /* attr属性信息 */
    //设置区要素的属性信息
    var attValue = attr.map(item => item.value);

    //创建一个新的区要素
    var newFeature = new Zondy.Object.Feature({
        AttValue: attValue,
        fGeom: fGeom,
        GraphicInfo: graphicInfo
    });
    newFeature.setFType(3);
    /* 2、FeatureSet */
    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet();
    var fldNumber = attr.length;
    var fldType = attr.map(item => item.type);;
    var fldName = attr.map(item => item.name);
    var cAttValue = new Zondy.Object.CAttStruct({ FldNumber: fldNumber, FldType: fldType, FldName: fldName });
    featureSet.AttStruct = cAttValue;
    featureSet.addFeature(newFeature);
    //创建一个要素编辑服务对象
    var editDocFeature = new Zondy.Service.EditDocFeature(service.name, service.layerId, {

    });
    editDocFeature.add(featureSet, onPloySuccess(docLayer));
}
function onPloySuccess(docLayer) {
    return function (data) {
        if (data.succeed) {
            alert("添加要素成功！");
            docLayer.refresh();
        } else {
            alert("添加要素失败！");
        }
    }
}