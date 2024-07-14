function setCanvasStyle(size) {
    let canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    /* 设置半径 */
    let radius = size / 4;
    /* 绘制 */
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "#ff2d51";
    ctx.fill();
    /* canvas转成openlayer样式 */
    let style = new ol.style.Style({
        image: new ol.style.Icon({
            img: canvas,
            imgSize: [canvas.width, canvas.height]
        })
    })
    return style;
}