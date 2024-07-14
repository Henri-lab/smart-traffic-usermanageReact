export function setMarkerStyle(src) {
    const icon = new ol.style.Style({
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
            src
        })
    })
    return icon;
}