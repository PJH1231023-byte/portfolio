/* =========================================================
   furniture/avatar.js — buildAvatar3D
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildAvatar3D() {
  var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('images/avatar-3d-sit.png'), transparent: true, depthWrite: false, alphaTest: 0.05 }));
  sp.scale.set(1.0, 1.66, 1);
  sp.position.set(-0.8, 1.42, -1.78);
  sp.userData.type = 'avatar';
  scene.add(sp);
  interactives.push({ mesh: sp, type: 'avatar' });
}

/* 窗外弯月贴图（月牙形状） */
