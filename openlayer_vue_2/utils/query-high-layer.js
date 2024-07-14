
export const queryHighLayer = ()=>{
  /* 基于某个图层查询 */
  let service = {
    name: "guanggu-doc",
    layerId: [1]
  }
  let features
  //初始化查询结构对象，设置查询结构包含几何信息
  var queryStruct = new Zondy.Service.QueryFeatureStruct();
  //是否包含几何图形信息
  queryStruct.IncludeGeometry = true;
  //是否包含属性信息
  queryStruct.IncludeAttribute = true;
  //是否包含图形显示参数
  queryStruct.IncludeWebGraphic = false;
  
  //指定查询规则
  var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true
  });
  //实例化查询参数对象
  var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: "json",
      struct: queryStruct,
      rule: rule
  });
  //设置查询分页号
  queryParam.pageIndex = 0;
  //设置查询要素数目
  queryParam.recordNumber = 100;
  
  var queryService = new Zondy.Service.QueryDocFeature(queryParam, service.name, service.layerId, {});
  //执行查询操作，querySuccess为查询回调函数
  queryService.query(querySuccess);
  
  function querySuccess(data) {
    //初始化Zondy.Format.PolygonJSON类
    var format = new Zondy.Format.PolygonJSON();
    //将MapGIS要素JSON反序列化为ol.Feature类型数组
    features = format.read(data);
    hightLinelayer.getSource().addFeatures(features);
  }
  // 设置高亮图层
  function styleFunction(feature) {
    const type = feature.values_.values_.车流量;
    const width =  4
    let style
    if (type <= 1000) {
      style = new ol.style.Style({
         //边线颜色
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 255, 0, 1)',
            width: width
        })
      });
    }else if (type <=1300 && type > 1000) {
      style = new ol.style.Style({
         stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 0, 1)', 
            width: width
        })
      });
    }
    else {
      style = new ol.style.Style({
         stroke: new ol.style.Stroke({
          color: 'rgba(255, 0, 0, 1)', 
          width: width
        })
      });
    }
    return [style]
  }
  let hightLinelayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: styleFunction
    });
  return  { hightLinelayer }
  }