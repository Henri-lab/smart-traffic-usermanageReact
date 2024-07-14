/**
 * @param {Function} success
 *  */
export class Query {
  static queryByPnt({ position, service, success }) {
    /* 1、设置查询结构 */
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;

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
    let pointObj = new Zondy.Object.Point2D(position[0], position[1]);
    //设置查询点的搜索半径
    pointObj.nearDis = 0.005;
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: pointObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 20;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(success);
  }

  static queryByGeom({ geometry, service, success }) {
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    //创建一个用于查询的区
    var geomObj = new Zondy.Object.Polygon();
    geomObj.setByOL(geometry);

    //指定查询规则
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
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: geomObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });

    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 400;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(success);
  }
  /* 通过图层id去查询 */
  static queryByLayerId({ service, success }) {
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
      Intersect: true,
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 100;

    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(success);
  }
  /* 通过类型搜索 */
  static queryByType({ service, input, success }) {
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
      Intersect: true,
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
      where: `事件类型 LIKE '%${input}%'`,
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 100;

    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(success);
  }
}
