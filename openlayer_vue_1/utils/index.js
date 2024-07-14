function getLayerByTitle({ map, title }) {
    /* 1、获取地图所有的图层 */
    let layers = map.getLayers().getArray();
    /* 2、过滤出title=image */
    let result = layers.find(item => item.get("title") == title);
    /* 3、返回结果图层 */
    return result;
}

function setPntStyle({
    radius = 15,
    fill = "red",
    stroke = "#333",
    width = 2,

}) {
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius,
            fill: new ol.style.Fill({
                color: fill,
            }),
            stroke: new ol.style.Stroke({
                color: stroke,
                width
            }),
        })
    })
}
function setLineStyle({
    color = "#333",
    width = 2
}) {
    return new ol.style.Style({
        //边线颜色
        stroke: new ol.style.Stroke({
            color,
            width
        })
    })
}
function setAreaStyle({
    fill = 'rgba(33,33,33,0.5)',
    stroke = "#ff2d51",
    width = 1
}) {
    return new ol.style.Style({
        fill: new ol.style.Fill({
            color: fill,
        }),
        stroke: new ol.style.Stroke({
            color: stroke,
            width
        }),
    })
}

function getCoordinate(feature) {
    return feature.getGeometry().getCoordinates();
}

function setMarkerStyle(src) {
    return new ol.style.Style({
        /**{olx.style.IconOptions}类型*/
        image: new ol.style.Icon({
            anchor: [0.5, 60],
            anchorOrigin: 'top-right',
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            offsetOrigin: 'top-right',
            // offset:[0,10],
            //图标缩放比例
            scale: 0.75,
            //透明度
            opacity: 0.75,
            //图标的url
            src,
        }),
    })
}