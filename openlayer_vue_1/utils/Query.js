class Query {
    static queryByPntGeom({
        position,
        service,
        success
    }) {
        /* 1、设置查询结构 */
        var queryStruct = new Zondy.Service.QueryFeatureStruct();
        //是否包含几何图形信息
        queryStruct.IncludeGeometry = true;
        //是否包含属性信息
        queryStruct.IncludeAttribute = true;
        //是否包含图形显示参数
        queryStruct.IncludeWebGraphic = false;
        /* 2、设置查询规则 */
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
        /* 3、设置查询参数 */
        //创建一个用于查询的点形状
        var pointObj = new Zondy.Object.Point2D(position[0], position[1]);
        //设置查询点的搜索半径
        pointObj.nearDis = 1;
        var queryParam = new Zondy.Service.QueryParameter({
            geometry: pointObj,
            resultFormat: "json",
            struct: queryStruct,
            rule: rule
        });
        /* 4、调用查询服务 */
        var queryService = new Zondy.Service.QueryDocFeature(queryParam, service.name, service.layerId, {

        });
        //执行查询操作，querySuccess为查询回调函数
        queryService.query(success);
    }
    /* service.layerId = Number|Array */
    static queryByGeometry({
        geometry,
        service,
        success
    }) {
        /* 1、设置查询结构 */
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
            Intersect: true
        });
        //实例化查询参数对象
        var queryParam = new Zondy.Service.QueryParameter({
            geometry: geomObj,
            resultFormat: "json",
            struct: queryStruct,
            rule: rule
        });
        //设置查询分页号
        /* offset */
        queryParam.pageIndex = 0;
        //设置查询要素数目
        /* limit */
        queryParam.recordNumber = 100;
        //实例化地图文档查询服务对象
        var queryService = new Zondy.Service.QueryDocFeature(queryParam, service.name, service.layerId, {

        });
        //执行查询操作，querySuccess为查询回调函数
        queryService.query(success);
    }
    /* service.layerId = Number|Array */
    static queryByLayerId({
        service,
        success
    }) {
        /* 1、设置查询结构 */
        //初始化查询结构对象，设置查询结构包含几何信息
        var queryStruct = new Zondy.Service.QueryFeatureStruct();
        //是否包含几何图形信息
        queryStruct.IncludeGeometry = true;
        //是否包含属性信息
        queryStruct.IncludeAttribute = true;
        //是否包含图形显示参数
        queryStruct.IncludeWebGraphic = false;
        /* 2、设置查询rule */
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
        /* 3、设置查询参数 */
        var queryParam = new Zondy.Service.QueryParameter({
            resultFormat: "json",
            struct: queryStruct,
            rule: rule
        });
        //设置查询分页号
        queryParam.pageIndex = 0;
        //设置查询要素数目
        queryParam.recordNumber = 100;
        /* 4、调用查询服务 */
        var queryService = new Zondy.Service.QueryDocFeature(queryParam, service.name, service.layerId, {

        });
        //执行查询操作，querySuccess为查询回调函数
        queryService.query(success);
    }
    /**@param {Object} where = {key:"name",value:"汉"} */
    static queryByAttr({
        service,
        where,
        success
    }) {
        var queryStruct = new Zondy.Service.QueryFeatureStruct();
        //是否包含几何图形信息
        queryStruct.IncludeGeometry = true;
        //是否包含属性信息
        queryStruct.IncludeAttribute = true;
        //是否包含图形显示参数
        queryStruct.IncludeWebGraphic = false;
        //实例化查询参数对象
        var queryParam = new Zondy.Service.QueryParameter({
            resultFormat: "json",
            struct: queryStruct
        });
        //设置查询分页号
        queryParam.pageIndex = 0;

        //设置查询要素数目
        queryParam.recordNumber = 20;
        /* where mysql的语法 */
        /* name值包含 汉这个关键字 */
        queryParam.where = `${where.key} like '%${where.value}%'`
        var queryService = new Zondy.Service.QueryDocFeature(queryParam, service.name, service.layerId, {

        });
        //执行查询操作，querySuccess为查询回调函数
        queryService.query(success);
    }
    /* fids = Number|Array */
    static queryByFids({
        fids,
        service,
        success
    }) {
        var queryStruct = new Zondy.Service.QueryFeatureStruct();
        //是否包含几何图形信息
        queryStruct.IncludeGeometry = true;
        //是否包含属性信息
        queryStruct.IncludeAttribute = true;
        //是否包含图形显示参数
        queryStruct.IncludeWebGraphic = false;
        var queryParam = new Zondy.Service.QueryParameter({
            /* fids:number|Array */
            objectIds: fids,
            resultFormat: "json",
            struct: queryStruct
        });

        var queryService = new Zondy.Service.QueryDocFeature(queryParam, service.name, service.layerId, {

        });
        //执行查询操作，querySuccess为查询回调函数
        queryService.query(success);
    }
}
export { Query } ;