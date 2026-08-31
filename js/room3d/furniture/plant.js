/* =========================================================
   furniture/plant.js — buildPlant
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildPlant() {
  var g = new THREE.Group();
  var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.6, 20), texturedMaterial(0xb98a5e, 'plastic', 1, 0.55));
  pot.position.y = 0.3; g.add(pot);
  var leafMat = new THREE.MeshStandardMaterial({ color: 0x6f8f60, roughness: 0.8, side: THREE.DoubleSide });
  for (var i = 0; i < 7; i++) {
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 1.15, 6), leafMat);
    stem.position.set(Math.cos(i * 1.05) * 0.2, 0.9 + i * 0.04, Math.sin(i * 1.05) * 0.2);
    stem.rotation.z = Math.cos(i * 1.05) * 0.32;
    g.add(stem);
    var leaf = new THREE.Mesh(new THREE.CircleGeometry(0.3, 14), leafMat);
    leaf.position.set(Math.cos(i * 1.05) * 0.48, 1.2 + i * 0.07, Math.sin(i * 1.05) * 0.48);
    leaf.rotation.z = 0.4;
    leaf.scale.set(1, 1.5, 1);
    g.add(leaf);
  }
  g.position.set(5.3, 0.14, -3.6);
  g.userData.type = 'plant';
  scene.add(g);
  interactives.push({ mesh: g, type: 'plant' });
}

/* 后墙书架（Blender 质感：浅暖木圆角，底部贴地面，多层搁板摆满书） */
