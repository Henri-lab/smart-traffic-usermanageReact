/**
 * @param {object} service  {name,layerId,host,port}
 */
export class Point {
  /* 查询 */
  static query({ position, service, success }) {
    //1、创建一个用于查询的点形状
    var pointObj = new Zondy.Object.Point2D(position[0], position[1]);
    //设置查询点的搜索半径
    pointObj.nearDis = 0.001;
    //2、初始化查询结构对象，告诉服务端查询结果中应该包含哪些信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = true;
    //3、创建查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true,
    });
    //4、实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: pointObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });
    //5、实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {
        // ip: service.host || HOST,
        // port: service.port || PORT, //访问IGServer的端口号, .net为6163,Java为8089
      }
    );
    queryService.query(success);
  }
}
