/* =========================================================
   furniture/sunspot.js — buildSunspot
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildSunspot() {
  var c = document.createElement('canvas'); c.width = 256; c.height = 256;
  var g = c.getContext('2d');
  var rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, 'rgba(255,244,196,0.8)');
  rg.addColorStop(0.6, 'rgba(255,238,180,0.4)');
  rg.addColorStop(1, 'rgba(255,238,180,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  sunspot = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false }));
  sunspot.rotation.x = -Math.PI / 2;
  sunspot.position.set(0, 0.08, -2.6);
  scene.add(sunspot);
}

/* 后墙书桌后方落地窗（窗外自然景），田字窗框 + 两侧窗帘 + 顶部帘杆 */
