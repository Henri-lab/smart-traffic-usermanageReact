import { ref, inject, onMounted } from "vue";
import { Query } from "@/utils/query-map-gis"
import { createDraw } from "@/utils/create-draw"; 
import { queryDialogStore } from "@/stores/queryDialog"
const store = queryDialogStore()
export const searchEventHook = ()=> {
let map = ref(null)
let draw = ref(null)
var source = new ol.source.Vector({
  wrapX: false
});
var layer = new ol.layer.Vector({
  source
})
onMounted(() => {
  map = inject('$map')
  map.addLayer(layer);
})


function activeDraw() {
    draw = createDraw({
        type: "Box",
        source,
        callback: handleDraw
    })
    map.addInteraction(draw)
}
function deactiveDraw() {
    map.removeInteraction(draw)
    map.removeLayer(layer);
}

function handleDraw(e) {
    source.clear();
    var geometry = e.feature.getGeometry();
    Query.queryByGeom({
        geometry,
        service: {
            name:"guanggu-doc",
            layerId:2
        },
        success: querySuccess
    })
}
//查询成功回调
function querySuccess(result) {
    if (result.TotalCount == 0) {
      store.setDialogShow(false)
    }else {
      store.setData(result)
      store.setDialogShow(true)
    }
}
  return { activeDraw,deactiveDraw } 
}
