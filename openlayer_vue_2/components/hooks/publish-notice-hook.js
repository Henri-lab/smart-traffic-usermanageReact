import { createDraw } from "@/utils/create-draw";
import { ref } from "vue";
import { useNoticeStore } from "@/stores/notice.js";
import { ElMessage } from "element-plus";
const store = useNoticeStore();
export const publishNoticeHook = (map) => {
  var line_layer;
  var clipLayer;
  //一、获取受影响的居民区区域范围
  //1、交互式绘制线段crateDraw
  let draw = ref(null);
  var source = new ol.source.Vector({
    wrapX: false,
  });
  line_layer = new ol.layer.Vector({
    source,
    title: "line_layer",
  });
  map.addLayer(line_layer); //绘图图层
  function activeDraw() {
    source.clear(); //清一下绘图图层
    draw = createDraw({
      type: "LineString",
      source,
      callback: handleDraw,
    });
    map.addInteraction(draw);
  }
  function deactiveDraw() {
    map.removeInteraction(draw);
  }
  activeDraw();
  function handleDraw(e) {
    deactiveDraw();
    const line = e.feature;
    //2、缓冲分析该线段，得到缓冲区
    /* 步骤 */
    /*
        1、调用中地接口创建缓冲区分析对象
        2、设置分析对象
        3、设置分析结果
        4、执行分析 
         */
    var resultBaseUrl = "gdbp://MapGisLocal/wuhan/sfcls/"; //缓存结果图层的基地址
    function singleBuffAnalysis() {
      var pointObj = new Array();
      for (var i = 0; i < line.getGeometry().getCoordinates().length; i++) {
        var pointGeo = new Zondy.Object.Point2D(
          line.getGeometry().getCoordinates()[i][0],
          line.getGeometry().getCoordinates()[i][1]
        );
        pointObj.push(pointGeo);
      }
      var gArc = new Zondy.Object.Arc(pointObj);
      //构成线的折线
      var gAnyLine = new Zondy.Object.AnyLine([gArc]);
      //设置线要素的几何信息
      var gline = new Zondy.Object.GLine(gAnyLine);
      //设置要素的几何信息
      var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] });
      //设置属性结构
      var regAttStr = new Zondy.Object.CAttStruct({
        FldName: ["ID", "面积", "周长", "LayerID"],
        FldNumber: 4,
        FldType: ["FldLong", "FldDouble", "FldDouble", "FldLong"],
      });
      //实例化CAttDataRow类
      var values = [0, 62.566714, 50.803211, 0];
      var valuesRow = new Zondy.Object.CAttDataRow(values, 1);
      //实例化FeatureBuffBySingleRing类，设置要素缓冲分析必要参数，输出分析结果到缓冲分析结果图层
      var featureBufBySR = new Zondy.Service.FeatureBuffBySingleRing({
        ip: "localhost",
        port: "6163",
        //设置要素缓冲分析左半径
        leftRad: 0.002,
        //设置要素缓冲分析右半径
        rightRad: 0.002,
      });
      /*设置缓冲分析参数*/
      //设置几何信息
      featureBufBySR.sfGeometryXML = JSON.stringify([fGeom]);
      //设置属性结构
      featureBufBySR.attStrctXML = JSON.stringify(regAttStr);
      //设置属性值
      featureBufBySR.attRowsXML = JSON.stringify([valuesRow]);
      //设置追踪半径
      featureBufBySR.traceRadius = 0.0001;
      //设置缓冲结果的名称以及存放地址
      var resultname = "singleBuffAnalysisResultLayer" + Date.now();
      featureBufBySR.resultName = resultBaseUrl + resultname;
      //调用Zondy.Service.AnalysisBase基类的execute方法执行要素缓冲分析，AnalysisSuccess为回调函数。
      featureBufBySR.execute(
        AnalysisSuccess,
        "post",
        false,
        "json",
        AnalysisError
      );
    }
    //分析失败回调
    function AnalysisError(e) {
      //停止进度条
      console.log("分析失败");
    }
    //分析成功后的回调
    function AnalysisSuccess(data) {
      if (!data.results) {
        ElMessage.error("缓冲失败，请检查参数！");
      } else {
        if (data.results.length != 0) {
          var bufferLayerUrl = data.results[0].Value || data.results[0].value;
          //将结果图层添加到地图视图中显示
          var bufferLayer = new Zondy.Map.GdbpLayer("", [bufferLayerUrl], {
            ip: "localhost",
            port: "6163",
            isBaseLayer: false,
          });
          map.addLayer(bufferLayer);
          //3、缓冲区与居民区进行裁剪分析
          var clspath = data.results[0].Value; //缓冲图层url
          //实例化ClipByLayer类
          var clipParam = new Zondy.Service.ClipByLayer({
            ip: "localhost",
            port: "6163",
            //源简单要素类的URL
            srcInfo1: "gdbp://MapGisLocal/wuhan/sfcls/居民区",
            //裁剪框简单要素类的URL
            srcInfo2: clspath,
            //设置结果URL
            desInfo:
              "gdbp://MapGisLocal/wuhan/ds/clip/sfcls/clipresult" + Date.now(),
            infoOptType: 0,
          });
          //调用基类的execute方法，执行图层裁剪分析。AnalysisSuccess为结果回调函数
          clipParam.execute(clipSuccess, "post", false, "json", clipError);
          //分析失败回调
          function clipError(e) {}
          //分析成功后的回调
          function clipSuccess(data) {
            if (!data.results) {
              ElMessage.error("裁剪分析失败，请检查参数！");
            } else {
              if (data.results.length != 0) {
                var clipLayerUrl =
                  data.results[0].Value || data.results[0].value;
                //将结果图层添加到地图视图中显示
                clipLayer = new Zondy.Map.GdbpLayer("", [clipLayerUrl], {
                  ip: "localhost",
                  port: "6163",
                  isBaseLayer: false,
                  name: "clip_layer",
                });
                //4、先把bufferLayer移除
                map.removeLayer(bufferLayer);
                //还要把线line移除
                map.removeLayer(line_layer);
                //再添加裁剪结果图层
                map.addLayer(clipLayer);
                //把线放在上层
                map.addLayer(line_layer);
                //5、查询物业信息
                //图层查询方法
                function queryVectorLayer({ url, success }) {
                  //初始化查询结构对象，设置查询结构包含⼏何信息
                  var queryStruct = new Zondy.Service.QueryFeatureStruct();
                  //是否包含⼏何图形信息
                  queryStruct.IncludeGeometry = false;
                  //是否包含属性信息
                  queryStruct.IncludeAttribute = true;
                  //是否包含图形显示参数
                  queryStruct.IncludeWebGraphic = false;
                  //var objectIds = "10,104,185,238";
                  //实例化查询参数对象
                  var queryParam = new Zondy.Service.QueryByLayerParameter(
                    url,
                    {
                      resultFormat: "json",
                      struct: queryStruct,
                    }
                  );
                  queryParam.recordNumber = 1000;
                  //实例化地图⽂档查询服务对象
                  var queryService = new Zondy.Service.QueryLayerFeature(
                    queryParam,
                    {
                      ip: "localhost",
                      port: "6163", //访问IGServer的端⼝号，.net版为6163，Java版为8089
                    }
                  );
                  //执⾏查询操作，querySuccess为查询回调函数
                  queryService.query(success);
                }
                function handleQuerySuccess(res) {
                  let arr = [];
                  res.SFEleArray.forEach((item) => {
                    arr.push({ name: item.AttValue[4], tel: item.AttValue[5] });
                  });
                  if (arr.length > 0) {
                    //把物业电话信息添加到pinia
                    store.setWuYwData(arr);
                    //二、发布公告
                    //弹出表单展示物业信息，提交公告信息
                    setTimeout(() => {
                      store.setPublishNoticeShow(true);
                    }, 900);
                  } else {
                    ElMessage.error("该区域没有物业信息，请在居民区附近绘制");
                    store.setPublishNoticeShow(false);
                    map.removeLayer(line_layer);
                  }
                }
                queryVectorLayer({
                  url: clipLayerUrl,
                  success: handleQuerySuccess,
                });
              }
            }
          }
        }
      }
    }
    singleBuffAnalysis();
  }
};
