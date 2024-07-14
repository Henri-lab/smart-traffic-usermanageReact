function setAnimateStyle({ map, size = 40 }) {
    let canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    /* 设置半径 */
    /* size =40;
    10~16
    <10  size++ true
    >16  size-- false
     */
    let radius = size / 4;
    let increase = true;
    /* 绘制 */
    let ctx = canvas.getContext("2d");

    function draw() {
        /* 清空画布 */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "#ff2d51";
        ctx.fill();
        if (radius > (size / 4 + 6)) {
            increase = false
        } else if (radius < size / 4) {
            increase = true
        }
        if (increase) {
            radius++;
        } else {
            radius--
        }
        setTimeout(draw, 100)
        /* 重新渲染map */
        map.render();
    }
    draw();
    let style = new ol.style.Style({
        image: new ol.style.Icon({
            img: canvas,
            imgSize: [canvas.width, canvas.height]
        })
    })
    return style;

}