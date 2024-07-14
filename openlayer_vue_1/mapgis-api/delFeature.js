/**
 *@param {Number|Array} fids
 *   */
function delFeature({
    fids,
    service,
    docLayer
}) {
    var deleteService = new Zondy.Service.EditDocFeature(service.name, service.layerId, {
    });
    deleteService.deletes(fids, onDelSuccess(docLayer));
}
function onDelSuccess(docLayer) {
    return function (data) {
        if (data.succeed) {
            alert("删除要素成功！");
            docLayer.refresh();
        } else {
            alert("删除要素失败！");
        }
    }

}export{
    delFeature, onDelSuccess
}