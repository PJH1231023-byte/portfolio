/* =========================================================
   furniture/trophy.js — buildTrophy
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildTrophy() {
  var g = new THREE.Group();
  var shelf = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 1.5), texturedMaterial(0x8a5a35, 'metal', 1, 0.55));
  shelf.position.y = 0.04; g.add(shelf);
  var troMat = texturedMaterial(0xf7d27a, 'metal', 1, 0.2)
  troMat.metalness = 0.75;;
  var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.22, 20), troMat);
  cup.position.set(0, 0.3, 0); g.add(cup);
  var ear = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), troMat);
  ear.position.set(-0.13, 0.34, 0); g.add(ear);
  var ear2 = ear.clone(); ear2.position.x = 0.13; g.add(ear2);
  var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12), troMat);
  stem.position.set(0, 0.17, 0); g.add(stem);
  var base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.05, 16), troMat);
  base.position.set(0, 0.09, 0); g.add(base);
  var topBall = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), troMat);
  topBall.position.set(0, 0.43, 0); g.add(topBall);
  g.position.set(5.0, 2.35, -1.7); g.rotation.y = -Math.PI / 2;
  scene.add(g);
}

/* 右墙角大型绿植（复刻雪原：龟背竹大叶，低多边形） */
