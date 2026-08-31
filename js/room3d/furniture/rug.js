/* =========================================================
   furniture/rug.js — buildRug
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildRug() {
  var m = new THREE.Mesh(new THREE.CircleGeometry(1.7, 56), new THREE.MeshStandardMaterial({ map: drawRugCanvas(), roughness: 0.92 }));
  m.rotation.x = -Math.PI / 2; m.position.set(0, 0.03, -1.6); scene.add(m);
}

/* 靠后墙胡桃木大书桌（Blender 质感：深暖木圆角桌面 + 木质桌腿，屏幕朝观众） */
