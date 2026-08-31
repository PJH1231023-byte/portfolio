/* =========================================================
   furniture/bear.js — buildBearPlush
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildBearPlush() {
  var btex = tex('images/bear-dog-cutout.png');
  var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: btex, transparent: true, depthWrite: true, depthTest: false, alphaTest: 0.02 }));
  sp.scale.set(0.92, 1.15, 1);
  sp.position.set(2.5, 0.58, -2.9);
  sp.renderOrder = 999;
  sp.userData.type = 'bear';
  scene.add(sp);
  interactives.push({ mesh: sp, type: 'bear' });
  var sh = new THREE.Mesh(new THREE.CircleGeometry(0.5, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.set(2.5, 0.02, -2.9); scene.add(sh);
}

/* 金毛趴在泰迪熊身边睡觉（面向观众，能看清狗脸：闭眼/垂耳/粉腮红，鲜明金黄） */
