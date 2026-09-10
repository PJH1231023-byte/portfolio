/* =========================================================
   furniture/coffee-table.js — buildCoffeeTable
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildCoffeeTable() {
  var g = new THREE.Group();
  var woodM = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xa97c4f, roughness: 0.55 });
  var top = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.07, 28), woodM);
  top.position.y = 0.42; g.add(top);
  var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.4, 14), woodM);
  leg.position.y = 0.2; g.add(leg);
  var base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.05, 18), woodM);
  base.position.y = 0.025; g.add(base);
  g.position.set(4.3, 0.02, -1.9);
  scene.add(g);
}

/* 洞洞板下方地板蜷缩的橘猫（鼠标碰触摇尾巴） */
/* 洞洞板下方地板趴着的金毛犬（大型犬，脸朝向观众，鼠标碰触摇尾巴） */
