/**
 *  @param {Array} position =[[113,40],[114,30]]
 *  */
class Area {
    static add({
        position,
        attr,
        service,
        docLayer
    }) {
        /* 1、创建要素 new Zondy.Object.Feature */
        var pointObj = position.map(item => {
            return new Zondy.Object.Point2D(...item)
        })
        var gArc = new Zondy.Object.Arc(pointObj);
        //构成区要素折线
        var gAnyLine = new Zondy.Object.AnyLine([gArc]);
        //构成区要素
        var gRegion = new Zondy.Object.GRegion([gAnyLine]);
        //构成区要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({ RegGeom: [gRegion] });
        //设置区要素的图形参数信息
        var cRegionInfo = new Zondy.Object.CRegionInfo({
            EndColor: 1,
            FillColor: 11,//填充色 fill-color [paint]
            FillMode: 0,
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

        //设置区要素的属性信息
        var attValue = attr.map(item => item.value);

        /* 2、创建Mapgis的要素集 */
        var newFeature = new Zondy.Object.Feature({ AttValue: attValue, fGeom: fGeom, GraphicInfo: graphicInfo });
        newFeature.setFType(3);

        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet();
        var fldNumber = attr.length;
        var fldType = attr.map(item => item.type);
        var fldName = attr.map(item => item.name);
        var cAttValue = new Zondy.Object.CAttStruct({ FldNumber: fldNumber, FldType: fldType, FldName: fldName });
        featureSet.AttStruct = cAttValue;
        featureSet.addFeature(newFeature);
        /* 3、调用编辑要素服务,添加要素集add(featureSet,success) */
        //创建一个要素编辑服务对象
        var editDocFeature = new Zondy.Service.EditDocFeature(service.name, service.layerId, {

        });
        editDocFeature.add(featureSet, this.onSuccess(docLayer));
    }
    static onSuccess(docLayer) {
        return function (data) {
            if (data) {
                alert("添加线要素成功！");
                docLayer.refresh();
            } else {
                alert("添加线要素失败！");
            }
        }
    }
}