export function setCanvasStyle1(map, size) {
  /* canvas-style */
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  /* 设置半径 */
  /* 如果 size = 40 编辑 radius 10 */
  let radius = size / 4;
  let increase = true;
  /* 10~16 */
  function draw() {
    /* 清空画布 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    if (radius > size / 4 + 6) {
      increase = false;
    } else if (radius < size / 4) {
      increase = true;
    }
    if (increase) {
      radius++;
    } else {
      radius--;
    }
    setTimeout(draw, 50);
    /* render */
    map.render();
  }
  /* 触发动画 */
  draw();
  /* 将canvas元素转化openlayers的样式 */
  let style = new ol.style.Style({
    image: new ol.style.Icon({
      img: canvas,
      imgSize: [canvas.width, canvas.height],
    }),
  });
  return style;
}

export function setCanvasStyle2({ map, size }) {
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  /* 半径 */
  let radius = size / 4;
  let state = true;
  /* 
  size =40  radius =10  10~16
  <10  true ++
  >16  false --
   */
  let ctx = canvas.getContext("2d");
  function draw() {
    /* 绘制 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    /* 累加一个静态点 */
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 4, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();

    if (radius > size / 4 + 6) {
      state = false;
    } else if (radius < size / 4) {
      state = true;
    }
    if (state) {
      radius++;
    } else {
      radius--;
    }
    setTimeout(draw, 100);
    map.render();
  }
  draw();
  /* 将canvas转成ol的样式 */
  let style = new ol.style.Style({
    image: new ol.style.Icon({
      img: canvas,
      imgSize: [canvas.width, canvas.height],
    }),
  });
  return style;
}
