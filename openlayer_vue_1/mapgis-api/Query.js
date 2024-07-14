/**
 *success  --result 是ol要素
 *callback --result mapgis要素
 *
 *   */
class Query {
  /* 基于几何属性查询-查到图层里面部分的数据 */
  static queryByGeom({ geometry, service, success, callback }) {
    //1、初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //创建一个用于查询的区
    var geomObj = new Zondy.Object.Polygon()
    geomObj.setByOL(geometry)
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
    })
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: geomObj,
      resultFormat: 'json',
      struct: queryStruct,
      rule: rule
    })
    //设置查询分页号
    queryParam.pageIndex = 0
    //设置查询要素数目
    queryParam.recordNumber = 20
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    )
    //执行查询操作，querySuccess为查询回调函数
    if (success) {
      queryService.query(this.onSuccess(success))
    } else if (callback) {
      queryService.query(callback)
    }
  }

  /* 基于点坐标查询-查到图层里面部分的数据 */
  static queryByPnt({ position, service, success, callback }) {
    /* 1、查询要素的查询结构 */
    // debugger;
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    /* 2、设置查询的规则 */
    var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true
    })
    /* 3、设置查询参数 */
    let pointObj = new Zondy.Object.Point2D(position[0], position[1])
    pointObj.nearDis = 1 //必选参数--点的搜索半径
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: pointObj, //key-code
      resultFormat: 'json',
      struct: queryStruct,
      rule: rule
    })
    /* 4、调用查询服务 */
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    )
    //执行查询操作，querySuccess为查询回调函数
    if (success) {
      queryService.query(this.onSuccess(success))
    } else if (callback) {
      queryService.query(callback)
    }
  }

  /* 基于图层id的查询-查到图层里面所有的数据 */
  static queryByLayerId({ service, success, callback }) {
    //1、初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //2、指定查询规则
    // var rule = new Zondy.Service.QueryFeatureRule({
    //     //是否将要素的可见性计算在内
    //     EnableDisplayCondition: false,
    //     //是否完全包含
    //     MustInside: false,
    //     //是否仅比较要素的外包矩形
    //     CompareRectOnly: false,
    //     //是否相交
    //     Intersect: true
    // });
    //3、实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: 'json',
      struct: queryStruct
      // rule: rule
    })
    /* 默认只能获取20条 */
    //设置查询分页号
    queryParam.pageIndex = 0
    //设置查询要素数目
    queryParam.recordNumber = 100
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    )
    //执行查询操作，querySuccess为查询回调函数
    if (success) {
      queryService.query(this.onSuccess(success))
    } else if (callback) {
      queryService.query(callback)
    }
  }

  /* 基于Fid的查询 */
  /* callback-mapgis数据 */
  static queryByFid({ service, fid, success, callback }) {
    /* 1、查询要素的结构 */
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    /* 2、查询参数 */
    var queryParam = new Zondy.Service.QueryParameter({
      objectIds: fid,
      resultFormat: 'json',
      struct: queryStruct
    })
    /* 3、调用查询服务 */
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    )
    //执行查询操作，querySuccess为查询回调函数
    /* ol-feature */
    // 如果success为真,转成ol要素,否则使用mapgis要素
    if (success) {
      queryService.query(this.onSuccess(success))
    } else if (callback) {
      queryService.query(callback)
    }
  }
  /* where={key:"name",value:"汉"} */
  static queryByAttr({ where, service, success, callback }) {
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct()
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true
    //是否包含属性信息
    queryStruct.IncludeAttribute = true
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: 'json',
      struct: queryStruct
    })
    /* where遵循mysql的规范 */
    /* 包含 */
    queryParam.where = `${where.key} like '%${where.value}%'` //key-code
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    )
    //执行查询操作，querySuccess为查询回调函数
    if (success) {
      queryService.query(this.onSuccess(success))
    } else if (callback) {
      queryService.query(callback)
    }
  }
  static onSuccess(success) {
    return function (data) {
      var format = new Zondy.Format.PolygonJSON()
      //将MapGIS要素JSON反序列化为ol.Feature类型数组
      var features = format.read(data)
      success(features)
    }
  }
}
export{Query}