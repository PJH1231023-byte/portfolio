/* =========================================================
   furniture/lamp.js — buildLamp
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildLamp() {
  lampMesh = new THREE.Group();
  var brass = texturedMaterial(0xc9974f, 'metal', 1, 0.3);   /* 黄铜金属拉丝 */
  var base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.08, 20), brass);
  base.position.y = 0.04; lampMesh.add(base);
  var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 12), brass);
  pole.position.y = 1.05; lampMesh.add(pole);
  var shadeMat = texturedMaterial(0xffd3a3, 'lampshade', 1, 0.6);   /* 灯罩斜纹布 */
  shadeMat.emissive = new THREE.Color(0xffc983); shadeMat.emissiveIntensity = 0.9;
  var shade = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), shadeMat);
  shade.position.y = 2.05; lampMesh.add(shade);
  var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff3d6, transparent: true, opacity: 0.25 }));
  bulb.position.y = 2.02; lampMesh.add(bulb);
  lampMesh.position.set(-3.2, 0.02, -4.3);   /* 台式电脑与书架之间的后墙前 */
  lampMesh.userData.type = 'lamp';
  scene.add(lampMesh);
  interactives.push({ mesh: lampMesh, type: 'lamp' });
  lampLight = new THREE.PointLight(0xffc983, 0, 9);
  lampLight.position.set(-3.2, 2.1, -4.3);
  scene.add(lampLight);
}

/* 时间 → 窗外天色 + 室内光照联动 */
