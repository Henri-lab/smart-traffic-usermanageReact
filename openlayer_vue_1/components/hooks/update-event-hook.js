import { Query } from "@/utils/query-map-gis";
import { usePopupStore } from "@/stores/eventPopup";
import { ElMessage } from "element-plus";
import { filterDataByPermission } from "@/filters/event-query"
const store = usePopupStore();
let handleClickListener = null //定义地图事件监听器
export const updateEventHook = () => { 
  function openUpdateEvent(map) {
    handleClickListener = map.on("click", handleClick);
  }
  //查询+更新
  //1、查询
  function handleClick(e) {
    let position = e.coordinate;
    Query.queryByPnt({
      position,
      service: {
        name: "guanggu-doc",
        layerId: 2,
      },
      success: querySuccess,
    });
  }
  //查询成功回调
  function querySuccess(result) {
    if (result.TotalCount == 0) {
      ElMessage.error("当前点无要素，请重新选择");
      return;
    }
    var format = new Zondy.Format.PolygonJSON();
    //将MapGIS要素JSON反序列化为ol.Feature类型数组
    var feature_ = format.read(result)[0];
    if (feature_) {
      let position = feature_.getGeometry().getCoordinates();
      //更新要素
      store.setDataList(filterDataByPermission(localStorage.getItem("type"),result))
      store.setPosition(position[0])
      store.setTitle('事件状态更新')
      store.setIsShow(true)
      store.isUpdate = true

      const coor_ = feature_.values_.geometry.flatCoordinates;
      const attr_ = Object.values(feature_.values_.values_);
      const attNames_ = Object.keys(feature_.values_.values_);
      const FID_ = feature_.id_;
      //更新store
      store.attrInfo = {
        coor_,
        attr_,
        attNames_,
        FID_
      }
    }else store.setIsShow(false)
  }
  /**
   * 更新事件信息
   * @param {*} { } 事件属性信息 
   * @param {*} updateStatus 选择的事件状态
   * @param {*} map 
   */
  function updateEvent({ coor_, attr_, FID_, attNames_ },updateStatus,map) {
    //2、更新
    /* 添加一个点到数据库 */
    /* 2.1构建几何信息 */
    /* 创建一个点形状,描述点形状的几何信息 */
    var gpoint = new Zondy.Object.GPoint(coor_[0], coor_[1]);
    /* 设置当前点要素的几何信息 */
    var fGeom = new Zondy.Object.FeatureGeometry({
      PntGeom: [gpoint],
    });
    /* 2.2 设置样式信息 */
    //把用户选择的处理状态获取
    // const newIndex = $("#7").val();
    const newIndex = updateStatus;
    attr_[7] = newIndex;
    let color_;
    if (newIndex == 0) {
      color_ = 6;
    } else if (newIndex == 1) {
      color_ = 4;
    } else if (newIndex == 2) {
      color_ = 90;
    }
    var pointInfo = new Zondy.Object.CPointInfo({
      Angle: 0,
      Color: color_, //子图的颜色
      Space: 0,
      SymHeight: 5, //点的高度
      SymID: 21,
      SymWidth: 5, //点的宽度
    });
    /* 设置当点要素的图形参数信息 */
    var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 1, //点
      PntInfo: pointInfo,
    });
    /* 2.3 设置属性信息 */
    /* 设置添加点要素的属性信息 */
    var attValue = attr_;
    /* 2.4  构建要素对象 */
    var feature = new Zondy.Object.Feature({
      fGeom: fGeom, //坐标--几何信息
      GraphicInfo: webGraphicInfo, //样式信息
      AttValue: attValue, //属性
    });
    /* 设置要素为点要素 
            点 -->1
            线 -->2
            面 -->3
            */
    feature.setFType(1);
    feature.setFID(FID_); //++
    /* 2.5 设置要素集 */
    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet();
    /* 设置属性结构 */
    var cAttStruct = new Zondy.Object.CAttStruct({
      FldName: attNames_, //属性的字段名
      FldNumber: attr_.length, //属性的个数
      FldType: [
        "string",
        "string",
        "int",
        "string",
        "string",
        "string",
        "string",
        "int",
        "int",
      ], //属性的类型
    });
    featureSet.AttStruct = cAttStruct;
    /* 添加要素到要素数据集 */
    featureSet.addFeature(feature);
    /* 2.6 调用编辑服务接口 */
    /*
            创建一个编辑服务类
            第一个参数：服务的名称 第二参数：图层的名称
      */
    var editService = new Zondy.Service.EditDocFeature("guanggu-doc", 2, {
      ip: "localhost",
      port: "6163", //访问IGServer的端口号, .net为6163,Java为8089
    });
    //执行添加点要素功能
    editService.update(featureSet, onSuccess);
    let layers = map.getLayers().array_;
    var docLayer = layers.find((item) => {
      return item.get("name") == "guanggu-doc";
    });
    function onSuccess(data) {
      if (data.succeed) {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        cancalEvent(map) // 更新数据完成，关闭pop 取消事件监听
        docLayer.refresh(); //重新加载地图文档
        map.render()
      } else {
        ElMessage.error("修改失败");
      }
    }
  }
  //取消事件更新并删除pop
  function cancalEvent(map) {
    //直接做的全部overlay清除
    map.getOverlays().clear();
    ol.Observable.unByKey(handleClickListener); //取消地图点击事件
    store.setIsShow(false)
    store.isUpdate = false
  }
  return { openUpdateEvent,updateEvent,cancalEvent };
};
