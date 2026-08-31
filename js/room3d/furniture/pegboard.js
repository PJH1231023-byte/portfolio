/* =========================================================
   furniture/pegboard.js — buildPegboard
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildPegboard() {
  var g = new THREE.Group();
  var board = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 0.12), new THREE.MeshStandardMaterial({ map: drawHoleboardCanvas(), roughness: 0.85 }));
  board.position.set(0, 1.0, 0); g.add(board);
  var ringMat = new THREE.MeshStandardMaterial({ color: 0xd8b64a, metalness: 0.8, roughness: 0.3 });
  var lineMat = new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.6, roughness: 0.4 });
  var keys = keychainWorks.slice(0, 9);
  keys.forEach(function (key, idx) {
    var d = workDetails[key];
    if (!d || !d.cover) return;
    var col = idx % 3, row = Math.floor(idx / 3);
    var px = (col - 1) * 0.68, py = 1.46 - row * 0.62;
    var img = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.38), new THREE.MeshBasicMaterial({ map: tex(d.cover) }));
    img.position.set(px, py, 0.08); g.add(img);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16), ringMat);
    ring.position.set(px, py + 0.24, 0.09); g.add(ring);
    var line = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.07, 6), lineMat);
    line.position.set(px, py + 0.15, 0.09); g.add(line);
  });
  g.position.set(3.5, 1.5, -4.42);
  g.userData.type = 'wall';
  scene.add(g);
  interactives.push({ mesh: g, type: 'wall' });
}

/* 右墙照片墙（更高位置，圆/方异形彩色相框混搭，可点击放大） */
