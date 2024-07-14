var gaode_vector = new ol.layer.Tile({
    title: "vector",
    source: new ol.source.XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        wrapX: false,
        crossOrigin: "Anonymous",
    }),
     
});
var gaode_image = new ol.layer.Tile({
    title: "image",
    source: new ol.source.XYZ({
        url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}",
        wrapX: false,
        crossOrigin: "Anonymous",
    }),
    
})
export {
    gaode_image,
    gaode_vector
}