/**
 * 高德地图 GCJ02转WGS84坐标
 * @returns ol.proj 坐标系转换函数
 */
export function gcj02Mecator() {
  let forEachPoint = function (func) {
    return function (input, opt_output, opt_dimension) {
      let len = input.length;
      let dimension = opt_dimension ? opt_dimension : 2;
      let output;
      if (opt_output) {
        output = opt_output;
      } else {
        if (dimension !== 2) {
          output = input.slice();
        } else {
          output = new Array(len);
        }
      }
      for (let offset = 0; offset < len; offset += dimension) {
        func(input, output, offset);
      }
      return output;
    };
  };
  let gcj02 = {};
  let i = 0;
  let PI = Math.PI;
  let AXIS = 6378245.0;
  let OFFSET = 0.00669342162296594323; // (a^2 - b^2) / a^2
 
  function delta(wgLon, wgLat) {
    let dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
    let dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
    let radLat = (wgLat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - OFFSET * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((AXIS * (1 - OFFSET)) / (magic * sqrtMagic)) * PI);
    dLon = (dLon * 180.0) / ((AXIS / sqrtMagic) * Math.cos(radLat) * PI);
    return [dLon, dLat];
  }
 
  function outOfChina(lon, lat) {
    if (lon < 72.004 || lon > 137.8347) {
      return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true;
    }
    return false;
  }
 
  function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  }
 
  function transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
  }
 
  gcj02.toWGS84 = forEachPoint(function (input, output, offset) {
    let lng = input[offset];
    let lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
      let deltaD = delta(lng, lat);
      lng = lng - deltaD[0];
      lat = lat - deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
  });
 
  gcj02.fromWGS84 = forEachPoint(function (input, output, offset) {
    let lng = input[offset];
    let lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
      let deltaD = delta(lng, lat);
      lng = lng + deltaD[0];
      lat = lat + deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
  });
 
  let sphericalMercator = {};
 
  let RADIUS = 6378137;
  let MAX_LATITUDE = 85.0511287798;
  let RAD_PER_DEG = Math.PI / 180;
 
  sphericalMercator.forward = forEachPoint(function (input, output, offset) {
    let lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE);
    let sin = Math.sin(lat * RAD_PER_DEG);
 
    output[offset] = RADIUS * input[offset] * RAD_PER_DEG;
    output[offset + 1] = (RADIUS * Math.log((1 + sin) / (1 - sin))) / 2;
  });
 
  sphericalMercator.inverse = forEachPoint(function (input, output, offset) {
    output[offset] = input[offset] / RADIUS / RAD_PER_DEG;
    output[offset + 1] = (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - Math.PI / 2) / RAD_PER_DEG;
  });
 
  let projzh = {};
  projzh.ll2gmerc = function (input, opt_output, opt_dimension) {
    let output = gcj02.fromWGS84(input, opt_output, opt_dimension);
    return projzh.ll2smerc(output, output, opt_dimension);
  };
  projzh.gmerc2ll = function (input, opt_output, opt_dimension) {
    let output = projzh.smerc2ll(input, input, opt_dimension);
    return gcj02.toWGS84(output, opt_output, opt_dimension);
  };
  projzh.smerc2gmerc = function (input, opt_output, opt_dimension) {
    let output = projzh.smerc2ll(input, input, opt_dimension);
    output = gcj02.fromWGS84(output, output, opt_dimension);
    return projzh.ll2smerc(output, output, opt_dimension);
  };
  projzh.gmerc2smerc = function (input, opt_output, opt_dimension) {
    let output = projzh.smerc2ll(input, input, opt_dimension);
    output = gcj02.toWGS84(output, output, opt_dimension);
    return projzh.ll2smerc(output, output, opt_dimension);
  };
 
  projzh.ll2smerc = sphericalMercator.forward;
  projzh.smerc2ll = sphericalMercator.inverse;
 
  // 定义GCJ02
  const gcj02Extent = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];
  const gcj02Mecator = new ol.proj.Projection({
    code: 'GCJ-02',
    extent: gcj02Extent,
    units: 'm',
  });
  new ol.proj.addProjection(gcj02Mecator);
  // 将4326/3857转为gcj02坐标的方法定义
  new ol.proj.addCoordinateTransforms('EPSG:4326', gcj02Mecator, projzh.ll2gmerc, projzh.gmerc2ll);
  new ol.proj.addCoordinateTransforms('EPSG:3857', gcj02Mecator, projzh.smerc2gmerc, projzh.gmerc2smerc);
  return gcj02Mecator
}
/**
 * 动画样式绘制
 */
export function setCanvasStyle(map, size) {
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
      ctx.fillStyle = "#652e80";
      ctx.fill();
      if (radius > (size / 4 + 6)) {
          increase = false
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
      // map.render();
  }
  /* 触发动画 */
  draw();
  /* 将canvas元素转化openlayers的样式 */
  let style = new ol.style.Style({
      image: new ol.style.Icon({
          img: canvas,
          imgSize: [canvas.width, canvas.height]
      })
  })
  return style;
}