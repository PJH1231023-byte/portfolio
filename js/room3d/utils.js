/* =========================================================
   room3d/utils.js — 通用工具：tex（纹理加载缓存）/ roundedBox（圆角盒几何）
   ========================================================= */
'use strict';

function tex(src) {
  if (_texCache[src]) return _texCache[src];
  var t = new THREE.TextureLoader().load(src);
  t.encoding = THREE.sRGBEncoding;
  _texCache[src] = t;
  return t;
}

function roundedBox(w, h, d, r, seg) {
  var geo = new THREE.BoxGeometry(w, h, d, seg || 6, seg || 6, seg || 6);
  var pos = geo.attributes.position;
  var hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
  for (var i = 0; i < pos.count; i++) {
    var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    var cx = Math.max(-hx, Math.min(hx, x));
    var cy = Math.max(-hy, Math.min(hy, y));
    var cz = Math.max(-hz, Math.min(hz, z));
    var dx = x - cx, dy = y - cy, dz = z - cz;
    var dl = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    var k = r / dl;
    pos.setXYZ(i, cx + dx * k, cy + dy * k, cz + dz * k);
  }
  geo.computeVertexNormals();
  return geo;
}

