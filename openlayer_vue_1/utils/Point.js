/**
 * @param {Array} position = [114,30]
 * @param {Array} [
 * {"name":"title","type":"string",value:"李四"},
 * {"name":"id","type":"number",value:1001},
 * ]
 * @param {Object} service ={
 *   name:"xxx",
 *   layerId:"xxx"
 * }
 *  */
const POINT_STYLE = {
    Angle: 0,
    Color: 11,  //子图颜色
    Space: 0,
    SymHeight: 12,
    SymID: 31,//子图号
    SymWidth: 12
}
class Point {
    static add({
        position,
        attr,
        service,
        docLayer
    }) {
        /*  添加数据mapgis-api*/
        /* 1、创建要素  mapgis=style+geometry+attr */
        /* 1-1、geometry */
        var gpoint = new Zondy.Object.GPoint(position[0], position[1]);
        //设置当前点要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] });
        //描述点要素的符号参数信息
        /* 1-2、style */
        var pointInfo = new Zondy.Object.CPointInfo(POINT_STYLE);
        //设置当前点要素的图形参数信息
        var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
            /* 1 --Point  2--LineString  3--Polygon */
            InfoType: 1,
            PntInfo: pointInfo
        });
        /* 1-3、属性信息 */
        //设置添加点要素的属性信息        
        var attValue = attr.map(item => item.value)
        //创建一个要素
        /* new ol.Feature */
        var feature = new Zondy.Object.Feature({
            fGeom: fGeom,
            GraphicInfo: webGraphicInfo,
            AttValue: attValue
        });
        //设置要素为点要素
        feature.setFType(1);
        /* 2、要素集 */
        /* 要素集的属性结构映射 mapgis图层字段类型 */
        var featureSet = new Zondy.Object.FeatureSet();
        var cAttStruct = new Zondy.Object.CAttStruct({
            FldName: attr.map(item => item.name),
            FldNumber: attr.length,
            FldType: attr.map(item => item.type)
        });
        featureSet.AttStruct = cAttStruct;
        //添加要素到要素数据集
        featureSet.addFeature(feature);
        /* 3、调用服务添加要素集 */
        //创建一个编辑服务类
        /* 第一个参数 地图文档名称
           第二个参数  是要素在地图文档中的图层
         */
        var editService = new Zondy.Service.EditDocFeature(service.name, service.layerId, {
            ip: "localhost",
            port: "6163"    //访问IGServer的端口号，.net版为6163，Java版为8089
        });
        //执行添加点要素功能
        editService.add(featureSet, this.onPntSuccess(docLayer));
    }
    static onPntSuccess(docLayer) {
        return function (data) {
            if (data.succeed) {
                alert("添加点要素成功！");
                docLayer.refresh();
            } else {
                alert("添加点要素失败！");
            }
        }
    }
}