import { Query } from "@/utils/query-map-gis"
import { setCanvasStyle } from "@/utils/map"
let imgURL =`/src/assets/images/tricffic-event.png`
var markerSource = new ol.source.Vector({
  wrapX: false,
});
export var markerLayer = new ol.layer.Vector({
  name:"markerLayer",
  source: markerSource,
  style: new ol.style.Style({
    //形状
    image: new ol.style.Icon({
      src: imgURL,
      color: "red"
      /* radius 设置半径 */
      // radius: 10,
      // fill: new ol.style.Fill({
      //   color: '#ffcc33'
      // }),
      // stroke: new ol.style.Stroke({
      //   color: "#333",
      //   width: 2
      // })
    })
  })
})
export class SearchMarker {
  static addMarkerLayer(map, input, data) {
    //添加数据之前做数据清空
    markerSource.clear();
    //根据事件数据类型查询 并在地图上打点
    if (input) {
      Query.queryByType({
        service : {
          name: "guanggu-doc",
          layerId: [2]
        },
        input: input,
        success: function (data) {
           //将MapGIS要素JSON反序列化为ol.Feature类型数组
           var features = new Zondy.Format.PolygonJSON().read(data);
           markerSource.addFeatures(features);
           map.addLayer(markerLayer)
        }
      }) 
    }
    //根据传入的事件数据 在地图上打点
    if (data) {
       //将MapGIS要素JSON反序列化为ol.Feature类型数组
       var features = new Zondy.Format.PolygonJSON().read(data);
       markerSource.addFeatures(features);
       map.addLayer(markerLayer)
    }
  }
  static removeMarkerLayer(map) {
    map.removeLayer(markerLayer);
  }
}