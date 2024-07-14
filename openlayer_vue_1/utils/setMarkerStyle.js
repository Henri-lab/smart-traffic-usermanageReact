function setMarkerStyle({
    src,
    text = ""
}) {
    const icon_style = new ol.style.Style({
        /**{olx.style.IconOptions}类型*/
        image: new ol.style.Icon({
            anchor: [0.5, 60],
            anchorOrigin: 'top-right',
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            offsetOrigin: 'top-right',
            // offset:[0,10],
            //图标缩放比例
            scale: 0.5,
            //透明度
            opacity: 0.75,
            //图标的url
            src,
        }),
        text: new ol.style.Text({
            offsetX: 0,
            offsetY: 10,
            font: 'normal 12px 微软雅黑',
            text,
            fill: new ol.style.Fill({ color: '#333' }),
            stroke: new ol.style.Stroke({ color: "#ff2d51", width: 2 })
        })
    })
    return icon_style;
}