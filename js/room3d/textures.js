/* =========================================================
   room3d/textures.js — 所有程序化纹理/贴图画布（天空/木纹/墙面/地毯/洞洞板/月亮/星星/桌面）
   每件家具如需纹理在此文件添加
   ========================================================= */
'use strict';

/* 纹理画布缓存（供 woodNormal/wallNormal 法线贴图复用） */
var _woodCanvas = null;
var _wallCanvas = null;
var _woodNorm = null;
var _wallNorm = null;
var _woodTex = null;

function drawSkyCanvas() {
  var c = document.createElement('canvas'); c.width = 512; c.height = 512;
  var g = c.getContext('2d');
  var grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#7fb8f0');
  grad.addColorStop(0.55, '#bcd9f7');
  grad.addColorStop(1, '#eaf4ff');
  g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
  g.fillStyle = 'rgba(255,255,255,0.9)';
  for (var i = 0; i < 5; i++) {
    var x = Math.random() * 512, y = 30 + Math.random() * 150;
    g.beginPath(); g.arc(x, y, 24, 0, 7); g.arc(x + 30, y + 8, 19, 0, 7); g.arc(x - 30, y + 10, 17, 0, 7); g.fill();
  }
  g.fillStyle = '#7c9a68';
  g.beginPath(); g.moveTo(0, 340);
  for (var x = 0; x <= 512; x += 16) { g.lineTo(x, 340 - Math.abs(Math.sin(x / 60)) * 90); }
  g.lineTo(512, 512); g.lineTo(0, 512); g.closePath(); g.fill();
  g.fillStyle = '#5f8452';
  g.beginPath(); g.moveTo(0, 410);
  for (var x = 0; x <= 512; x += 16) { g.lineTo(x, 410 - Math.abs(Math.cos(x / 50)) * 70); }
  g.lineTo(512, 512); g.lineTo(0, 512); g.closePath(); g.fill();
  g.fillStyle = '#4f7a45';
  for (var i = 0; i < 7; i++) {
    var x = Math.random() * 512;
    g.fillRect(x, 380, 6, 70);
    g.beginPath(); g.arc(x + 3, 370, 17, 0, 7); g.fill();
  }
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

function drawWoodCanvas() {
  var c = document.createElement('canvas'); c.width = 512; c.height = 512;
  var g = c.getContext('2d');
  var base = g.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0, '#e2c9a3'); base.addColorStop(0.5, '#d4b58a'); base.addColorStop(1, '#c9a77a');
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  /* 木纹沟槽：加深 + 更细密，让颜色纹理有清晰层次（配合法线贴图显立体） */
  for (var i = 0; i < 160; i++) {
    var y = Math.random() * 512;
    g.fillStyle = 'rgba(150,105,60,' + (0.05 + Math.random() * 0.16) + ')';
    g.fillRect(0, y, 512, 1 + Math.random() * 3);
  }
  /* 木孔噪点：细密小点增强表面颗粒感 */
  for (var p = 0; p < 900; p++) {
    g.fillStyle = 'rgba(120,84,48,' + (0.05 + Math.random() * 0.12) + ')';
    g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random(), 1 + Math.random());
  }
  for (var k = 0; k < 6; k++) {
    var kx = Math.random() * 512, ky = Math.random() * 512;
    g.fillStyle = 'rgba(120,82,45,0.25)';
    g.beginPath(); g.ellipse(kx, ky, 8 + Math.random() * 10, 4 + Math.random() * 5, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(90,62,32,0.2)';
    g.beginPath(); g.ellipse(kx, ky, 4 + Math.random() * 5, 2 + Math.random() * 3, 0, 0, 7); g.fill();
  }
  for (var x = 0; x < 512; x += 128) {
    g.fillStyle = 'rgba(110,78,48,0.45)'; g.fillRect(x, 0, 3, 512);
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x + 3, 0, 2, 512);
  }
  _woodCanvas = c;
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  return t;
}

var _wallCanvas = null;
/* 微水泥墙面纹理（细腻颗粒噪点，哑光真实质感） */


/* 布帘褶皱纹理：竖长画布，竖向布料褶皱（明暗交替）+ 顶部挂帘波浪 + 底部垂坠微深 */
function drawCurtainCanvas(base) {
  var c = document.createElement('canvas'); c.width = 256; c.height = 512;
  var g = c.getContext('2d');
  var grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, base); grad.addColorStop(0.55, shade(base, 0.97)); grad.addColorStop(1, shade(base, 0.86));
  g.fillStyle = grad; g.fillRect(0, 0, 256, 512);
  /* 竖向褶皱：交替深浅竖条，模拟布料起伏的高光与暗部 */
  for (var x = 0; x < 256; x += 16) {
    var lg = g.createLinearGradient(x, 0, x + 16, 0);
    lg.addColorStop(0, shade(base, 0.72)); lg.addColorStop(0.45, shade(base, 1.12));
    lg.addColorStop(0.75, shade(base, 0.8)); lg.addColorStop(1, shade(base, 0.92));
    g.fillStyle = lg; g.fillRect(x, 0, 16, 512);
  }
  /* 顶部挂帘波浪：几道横向弧线阴影，模拟帘头收褶 */
  g.strokeStyle = shade(base, 0.6); g.lineWidth = 4;
  for (var w = 0; w < 4; w++) {
    g.globalAlpha = 0.55 - w * 0.1;
    g.beginPath();
    for (var px = 0; px <= 256; px += 4) { var py = 14 + w * 12 + Math.sin(px / 16) * 6; if (px === 0) g.moveTo(px, py); else g.lineTo(px, py); }
    g.stroke();
  }
  g.globalAlpha = 1;
  /* 底部垂坠：微加深，模拟布帘自然收垂的暗部 */
  var bg = g.createLinearGradient(0, 470, 0, 512);
  bg.addColorStop(0, 'rgba(0,0,0,0)'); bg.addColorStop(1, 'rgba(90,72,50,0.18)');
  g.fillStyle = bg; g.fillRect(0, 470, 256, 42);
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 1);
  return t;
}

/* 颜色明暗工具：hex 转 rgb 后按系数缩放 */
function shade(hex, k) {
  var n = parseInt(hex.slice(1), 16);
  var r = Math.min(255, Math.round(((n >> 16) & 255) * k));
  var gg = Math.min(255, Math.round(((n >> 8) & 255) * k));
  var b = Math.min(255, Math.round((n & 255) * k));
  return 'rgb(' + r + ',' + gg + ',' + b + ')';
}

function drawWallCanvas() {
  var c = document.createElement('canvas'); c.width = 256; c.height = 256;
  var g = c.getContext('2d');
  g.fillStyle = '#e6ddd0'; g.fillRect(0, 0, 256, 256);
  for (var i = 0; i < 4200; i++) {
    g.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.06) + ')';
    g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
    g.fillStyle = 'rgba(132,112,84,' + (Math.random() * 0.06) + ')';
    g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
  }
  _wallCanvas = c;
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 3);
  return t;
}

/* 从高度图（canvas 亮度）生成法线贴图（Sobel 算子）——材质的立体感来源
   降采样到 256 保证低端环境（软件渲染）也流畅，法线高频细节足够 */

function normalFromCanvas(srcCanvas, strength) {
  var sw = Math.min(srcCanvas.width, 256), sh = Math.min(srcCanvas.height, 256);
  var sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
  var sg = sc.getContext('2d'); sg.drawImage(srcCanvas, 0, 0, sw, sh);
  var d = sg.getImageData(0, 0, sw, sh).data;
  var n = document.createElement('canvas'); n.width = sw; n.height = sh;
  var ng = n.getContext('2d');
  var out = ng.createImageData(sw, sh);
  var s = strength || 2;
  function idx(x, y) {
    if (x < 0) x = 0; else if (x >= sw) x = sw - 1;
    if (y < 0) y = 0; else if (y >= sh) y = sh - 1;
    return (y * sw + x) * 4;
  }
  function lum(i) { return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; }
  for (var y = 0; y < sh; y++) {
    var yw = y * sw;
    for (var x = 0; x < sw; x++) {
      var i = (yw + x) * 4;
      var tl = lum(idx(x - 1, y - 1)), t = lum(idx(x, y - 1)), tr = lum(idx(x + 1, y - 1));
      var ml = lum(idx(x - 1, y)), mr = lum(idx(x + 1, y));
      var bl = lum(idx(x - 1, y + 1)), b = lum(idx(x, y + 1)), br = lum(idx(x + 1, y + 1));
      var dx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
      var dy = (bl + 2 * b + br) - (tl + 2 * t + tr);
      var nx = -dx * s / 255, ny = -dy * s / 255, nz = 1;
      var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      out.data[i] = (nx / len * 0.5 + 0.5) * 255;
      out.data[i + 1] = (ny / len * 0.5 + 0.5) * 255;
      out.data[i + 2] = (nz / len * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  }
  ng.putImageData(out, 0, 0);
  var nt = new THREE.CanvasTexture(n);   /* 法线贴图：不设 sRGB，保持线性数据 */
  nt.wrapS = nt.wrapT = THREE.RepeatWrapping;
  return nt;
}

/* 缓存木纹法线（与木纹纹理同源，沟槽/节疤/木孔有起伏） */

function woodNormal() {
  if (_woodNorm) return _woodNorm;
  if (!_woodCanvas) { try { woodTexture(); } catch (e) {} }
  _woodNorm = normalFromCanvas(_woodCanvas, 2.4);
  _woodNorm.repeat.set(2, 1);
  return _woodNorm;
}
/* 缓存墙面法线（微水泥颗粒） */
var _wallNorm = null;

function wallNormal() {
  if (_wallNorm) return _wallNorm;
  if (!_wallCanvas) drawWallCanvas();
  _wallNorm = normalFromCanvas(_wallCanvas, 1.6);
  _wallNorm.repeat.set(4, 3);
  return _wallNorm;
}

/* 缓存木纹纹理（家具与地板共用，Blender 质感暖木） */
var _woodTex = null;

function woodTexture() {
  if (!_woodTex) _woodTex = drawWoodCanvas();
  return _woodTex;
}


/* ================= 通用材质纹理工厂 =================
   让家具不再是纯色块：布/绒布/皮革/塑料/灯罩/金属 各有程序化织理 + 法线。
   texturedMaterial(color, kind, repeat) → MeshStandardMaterial（带 map+normalMap，已缓存）
   kind: fabric(平纹布) | felt(绒布) | leather(皮革) | plastic(塑料) | lampshade(灯罩斜纹) | metal(金属拉丝) */
var _matCache = {};

function hexStr(hex) {
  if (typeof hex === 'number') { var h = hex.toString(16); while (h.length < 6) h = '0' + h; return '#' + h; }
  return hex;
}

function drawKindCanvas(color, kind) {
  var c = document.createElement('canvas'); c.width = 256; c.height = 256;
  var g = c.getContext('2d');
  g.fillStyle = color; g.fillRect(0, 0, 256, 256);
  var dark = shade(color, 0.82), light = shade(color, 1.18);
  if (kind === 'fabric') {
    /* 平纹布：细密经纬编织格 */
    for (var y = 0; y < 256; y += 12) {
      g.fillStyle = 'rgba(' + rgb(dark) + ',0.28)'; g.fillRect(0, y, 256, 1);
      g.fillStyle = 'rgba(' + rgb(light) + ',0.2)'; g.fillRect(0, y + 1, 256, 1);
    }
    for (var x = 0; x < 256; x += 12) {
      g.fillStyle = 'rgba(' + rgb(dark) + ',0.22)'; g.fillRect(x, 0, 1, 256);
      g.fillStyle = 'rgba(' + rgb(light) + ',0.16)'; g.fillRect(x + 1, 0, 1, 256);
    }
    for (var i = 0; i < 900; i++) { g.fillStyle = 'rgba(' + rgb((i % 2 ? dark : light)) + ',0.05)'; g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1); }
  } else if (kind === 'felt') {
    /* 绒布：密集短绒点阵（柔焦颗粒感） */
    for (var i = 0; i < 4200; i++) {
      g.fillStyle = 'rgba(' + rgb(i % 2 ? dark : light) + ',' + (0.08 + Math.random() * 0.12) + ')';
      g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random(), 1 + Math.random());
    }
  } else if (kind === 'leather') {
    /* 皮革：细腻毛孔颗粒 + 少量浅褶皱 */
    for (var i = 0; i < 2600; i++) {
      g.fillStyle = 'rgba(' + rgb(i % 2 ? dark : light) + ',' + (0.1 + Math.random() * 0.14) + ')';
      g.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
    }
    for (var k = 0; k < 8; k++) {
      var gx = Math.random() * 256, gy = Math.random() * 256;
      g.fillStyle = 'rgba(' + rgb(dark) + ',0.1)';
      g.beginPath(); g.ellipse(gx, gy, 14 + Math.random() * 18, 3 + Math.random() * 4, Math.random() * 3, 0, 7); g.fill();
    }
  } else if (kind === 'plastic') {
    /* 塑料：极细哑光颗粒 */
    for (var i = 0; i < 1500; i++) {
      g.fillStyle = 'rgba(' + rgb(i % 2 ? dark : light) + ',' + (0.04 + Math.random() * 0.08) + ')';
      g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
    }
  } else if (kind === 'lampshade') {
    /* 灯罩：斜向编织细纹（45°） */
    for (var y = -256; y < 512; y += 6) {
      g.fillStyle = 'rgba(' + rgb(dark) + ',0.16)'; g.beginPath(); g.moveTo(0, y); g.lineTo(256, y - 256); g.lineWidth = 2; g.stroke();
      g.fillStyle = 'rgba(' + rgb(light) + ',0.1)'; g.beginPath(); g.moveTo(0, y + 3); g.lineTo(256, y - 253); g.lineWidth = 1; g.stroke();
    }
    for (var i = 0; i < 500; i++) { g.fillStyle = 'rgba(' + rgb(i % 2 ? dark : light) + ',0.04)'; g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1); }
  } else { /* metal：金属拉丝 */
    for (var y = 0; y < 256; y += 2) {
      g.fillStyle = 'rgba(' + rgb((y % 4 ? dark : light)) + ',' + (0.05 + Math.random() * 0.1) + ')';
      g.fillRect(0, y + Math.random() * 2, 256, 1);
    }
    for (var mi = 0; mi < 400; mi++) { g.fillStyle = 'rgba(' + rgb(mi % 2 ? dark : light) + ',0.05)'; g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1); }
  }
  return c;
}

function rgb(str) {
  var n = parseInt(str.slice(1), 16);
  return (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255);
}

function texturedMaterial(color, kind, repeat, roughness) {
  var key = kind + ':' + color + ':' + (repeat || 1);
  if (_matCache[key]) return _matCache[key];
  var col = hexStr(color);
  var c = drawKindCanvas(col, kind);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat || 1, repeat || 1);
  var n = normalFromCanvas(c, 2.0); n.wrapS = n.wrapT = THREE.RepeatWrapping;
  n.repeat.set(repeat || 1, repeat || 1);
  var rr = roughness || (kind === 'leather' ? 0.5 : kind === 'metal' ? 0.38 : 0.82);
  var m = new THREE.MeshStandardMaterial({ map: t, normalMap: n, roughness: rr });
  _matCache[key] = m;
  return m;
}

/* ---------- 完整封闭房间（第一人称身处室内：原木地板 + 奶油微水泥墙 + 天花板，不穿模） ---------- */

function drawRugCanvas() {
  var c = document.createElement('canvas'); c.width = 256; c.height = 256;
  var g = c.getContext('2d');
  g.fillStyle = '#f2ead8'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
  g.strokeStyle = '#c98a5a'; g.lineWidth = 16; g.beginPath(); g.arc(128, 128, 108, 0, 7); g.stroke();
  g.strokeStyle = '#8fa08a'; g.lineWidth = 7; g.beginPath(); g.arc(128, 128, 94, 0, 7); g.stroke();
  g.fillStyle = 'rgba(201,138,90,0.35)';
  for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; g.beginPath(); g.arc(128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70, 6, 0, 7); g.fill(); }
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

function drawHoleboardCanvas() {
  var c = document.createElement('canvas'); c.width = 512; c.height = 512;
  var g = c.getContext('2d');
  g.fillStyle = '#2a2a2a'; g.fillRect(0, 0, 512, 512);
  g.fillStyle = '#141414';
  for (var y = 30; y < 510; y += 36) { for (var x = 30; x < 510; x += 36) { g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); } }
  g.fillStyle = 'rgba(255,255,255,0.05)';
  for (var y = 30; y < 510; y += 36) { for (var x = 30; x < 510; x += 36) { g.beginPath(); g.arc(x + 2, y + 2, 8, 0, 7); g.fill(); } }
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
}

/* 洞洞板（窗右侧后墙，上半个墙）：黑色带孔洞板 + 小钥匙扣作品集，可点击放大 */

function drawMoonCanvas() {
  var c = document.createElement('canvas'); c.width = 128; c.height = 128;
  var g = c.getContext('2d');
  g.fillStyle = '#fff6e0';
  g.beginPath(); g.arc(60, 64, 50, 0, 7); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.arc(80, 52, 44, 0, 7); g.fill();
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

/* 窗外天空：自然景板 + 太阳 + 弯月 + 星海光点（与进入前的户外天空前后呼应） */

function drawStarCanvas() {
  var c = document.createElement('canvas'); c.width = 64; c.height = 64;
  var g = c.getContext('2d');
  var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)');
  rg.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

/* 高落地灯（复古黄铜，可开关，靠左墙、离桌较远、比电脑高，灯罩高位） */

function drawDesktopCanvas() {
  var c = document.createElement('canvas'); c.width = 1024; c.height = 640;
  var g = c.getContext('2d');
  var grd = g.createLinearGradient(0, 0, 1024, 640);
  grd.addColorStop(0, '#eaf4ff'); grd.addColorStop(0.5, '#e8dcff'); grd.addColorStop(1, '#e0f6ec');
  g.fillStyle = grd; g.fillRect(0, 0, 1024, 640);
  g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.arc(840, 120, 120, 0, 7); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.arc(160, 500, 160, 0, 7); g.fill();
  g.fillStyle = 'rgba(122,82,112,0.9)';
  g.font = '600 32px "PingFang SC", "Microsoft YaHei", sans-serif';
  g.textAlign = 'center';
  g.fillText('黄佩嘉的 iMac', 512, 62);
  var icons = [
    { x: 300, label: '简历', sub: '个人介绍', color: '#ff8fbd', type: 'doc' },
    { x: 512, label: '游戏', sub: '贪吃蛇', color: '#7ab8ff', type: 'game' },
    { x: 724, label: '项目', sub: '含钥匙扣作品集', color: '#bfe8d4', type: 'folder' }
  ];
  icons.forEach(function (ic) {
    if (ic.type === 'doc') {
      g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(ic.x - 40, 200, 80, 92, 12); g.fill();
      g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 26, 212, 52, 40, 8); g.fill();
      g.fillStyle = '#ffffff'; g.fillRect(ic.x - 18, 222, 36, 4); g.fillRect(ic.x - 18, 230, 36, 4); g.fillRect(ic.x - 18, 238, 22, 4);
      g.fillStyle = '#ececec'; g.beginPath(); g.moveTo(ic.x + 40, 200); g.lineTo(ic.x + 18, 200); g.lineTo(ic.x + 40, 222); g.closePath(); g.fill();
    } else if (ic.type === 'game') {
      g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(ic.x - 40, 200, 80, 92, 12); g.fill();
      g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 30, 220, 60, 44, 12); g.fill();
      g.fillStyle = '#ffffff';
      g.beginPath(); g.arc(ic.x - 12, 242, 5, 0, 7); g.fill();
      g.beginPath(); g.arc(ic.x + 12, 242, 5, 0, 7); g.fill();
      g.fillRect(ic.x - 3, 231, 6, 12); g.fillRect(ic.x - 9, 237, 12, 6);
    } else {
      g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 40, 204, 80, 88, 10); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.55)';
      g.beginPath(); g.moveTo(ic.x - 40, 204); g.lineTo(ic.x - 20, 204); g.lineTo(ic.x - 12, 222); g.lineTo(ic.x - 40, 222); g.closePath(); g.fill();
    }
    g.fillStyle = '#7a5270';
    g.font = '600 26px "PingFang SC", sans-serif';
    g.fillText(ic.label, ic.x, 340);
    g.font = '14px sans-serif';
    g.fillStyle = 'rgba(122,82,112,0.6)';
    g.fillText(ic.sub, ic.x, 360);
  });
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

/* 电脑第一视角桌面：点 iMac → 全屏桌面（简历/游戏/项目） */
