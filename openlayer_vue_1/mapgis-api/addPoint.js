/**
 *@param {Array} position = [114.30,30.50]
 *@param {Array} attr =[{name:"xxx",type:"xxx",value:"xx"}]
 *@param {Object} service = {name:"ig-server服务的名称",layerId:"layerIndex"}
 *@param {Object} docLayer  地图文档图层
 *   */
const PONT_STYLE = {
    Angle: 0,
    Color: 11,//子图的颜色
    Space: 0,
    SymHeight: 8,
    SymID: 1,//子图号
    SymWidth: 8
}
function addPoint({
    position,
    attr,
    service,
    docLayer
}) {
    var gpoint = new Zondy.Object.GPoint(position[0], position[1]);//createPoint();
    //设置当前点要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] });
    /* 1-2、style */
    var pointInfo = new Zondy.Object.CPointInfo(PONT_STYLE);
    //设置当前点要素的图形参数信息
    var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
        /* 1-point 2-line 3-area */
        InfoType: 1,
        /* 设置点要素的图形参数信息 */
        PntInfo: pointInfo
    });
    /* 1-3、属性信息 */
    //设置添加点要素的属性信息        
    var attValue = attr.map(item => item.value);
    /* 1、构建要素 */
    var feature = new Zondy.Object.Feature({
        fGeom: fGeom,
        GraphicInfo: webGraphicInfo,
        AttValue: attValue
    });
    //设置要素为点要素
    feature.setFType(1);
    /* 2、mapgis的要素集   source */
    var featureSet = new Zondy.Object.FeatureSet();

    var cAttStruct = new Zondy.Object.CAttStruct({
        FldName: attr.map(item => item.name),
        FldNumber: attr.length,
        FldType: attr.map(item => item.type)
    });
    //设置要素集的属性结构,和mapgis图层的字段映射
    featureSet.AttStruct = cAttStruct;
    featureSet.addFeature(feature);
    /* 3、调动mapgis服务,添加要素到对应的地图文档的图层 */
    /* 第一个参数:地图文档的名称
       第二个参数:地图文档上图层的下标
     */
    var editService = new Zondy.Service.EditDocFeature(service.name, service.layerId, {

    });
    //执行添加点要素功能
    editService.add(featureSet, onPntSuccess(docLayer));

}
function onPntSuccess(docLayer) {
    return function (data) {
        if (data.succeed) {
            alert("添加点要素成功！");
            docLayer.refresh();
        } else {
            alert("添加点要素失败！");
        }
    }
}