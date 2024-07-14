/**
 * @param {Number|Array} fids = 1 || [2,3]
 *  */
function delFeature({
    service,
    fids,
    docLayer
}) {
    var deleteService = new Zondy.Service.EditDocFeature(service.name, service.layerId, {

    });
    /* number|Array */
    deleteService.deletes(fids, onPntSuccess(docLayer));
}
function onPntSuccess(docLayer) {
    return function (data) {
        if (data.succeed) {
            console.log("删除要素成功！");
            docLayer.refresh();
        } else {
            console.log("删除要素失败！");
        }
    }

}