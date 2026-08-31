/* =========================================================
   furniture/chair.js — buildChair
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildChair() {
  /* 真实办公扶手椅：五星脚轮底座 + 金属气压杆 + 皮质座/靠/扶手 + 滚轮（鼠标触碰缓慢旋转）
     皮质用 leather 纹理、金属用拉丝纹理、轮子用塑料纹理，不再色块 */
  var spin = new THREE.Group();
  var leather = texturedMaterial(0xc05a33, 'leather', 2);
  var metalM  = texturedMaterial(0x8a8f98, 'metal', 1, 0.32);
  var darkM   = texturedMaterial(0x3a3f47, 'plastic', 1, 0.55);
  var wheelM  = texturedMaterial(0x22262c, 'plastic', 1, 0.5);
  var Y = 0.14;
  /* 五星脚轮底座：中心毂 + 五根支脚 + 末端小圆柱滚轮（轴沿臂方向，贴地） */
  var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.08, 12), darkM);
  hub.position.y = Y + 0.05; spin.add(hub);
  for (var i = 0; i < 5; i++) {
    var a = i / 5 * Math.PI * 2;
    var arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.4), darkM);
    arm.position.set(Math.cos(a) * 0.2, Y + 0.04, Math.sin(a) * 0.2); arm.rotation.y = -a; spin.add(arm);
    var wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 10), wheelM);
    wheel.position.set(Math.cos(a) * 0.41, Y + 0.015, Math.sin(a) * 0.41);
    wheel.rotation.z = a + Math.PI / 2; spin.add(wheel);
  }
  /* 金属气压杆 */
  var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 0.42, 12), metalM);
  pole.position.y = Y + 0.28; spin.add(pole);
  /* 皮质座垫（圆角坐垫） */
  var seat = new THREE.Mesh(roundedBox(0.82, 0.15, 0.82, 0.06, 6), leather);
  seat.position.y = Y + 0.54; spin.add(seat);
  /* 左右扶手：金属立柱 + 皮质扶手面（更明显，延伸到座垫前缘） */
  [[-0.52, 1], [0.52, -1]].forEach(function (sd) {
    var post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.36, 10), metalM);
    post.position.set(sd * 0.62, Y + 0.62, -0.28); spin.add(post);
    var pad = new THREE.Mesh(roundedBox(0.15, 0.075, 0.5, 0.03, 4), leather);
    pad.position.set(sd * 0.6, Y + 0.82, -0.24); spin.add(pad);
  });
  /* 弧形靠背：皮质圆润背板（更高含头枕感）+ 腰托 */
  var back = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.6, 6, 16), leather);
  back.position.set(0, Y + 1.0, -0.38); back.rotation.x = 0.28; spin.add(back);
  var backPad = new THREE.Mesh(roundedBox(0.68, 0.34, 0.09, 0.04, 4), leather);
  backPad.position.set(0, Y + 0.92, -0.36); backPad.rotation.x = 0.28; spin.add(backPad);

  chairSpin = spin;   /* 暴露给 picker/animate 做"鼠标触碰旋转" */
  spin.position.set(-0.8, 0.02, -2.2);
  spin.rotation.y = 0.35;
  scene.add(spin);
}

/* 左墙黑色钉板贴图（复刻雪原：文档+红图钉+海报+便签） */
/* 洞洞板贴图：黑色板 + 规则圆孔阵列（洞洞质感） */
