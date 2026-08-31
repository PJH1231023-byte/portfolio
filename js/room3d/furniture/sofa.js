/* =========================================================
   furniture/sofa.js — buildSofa
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildSofa() {
  var g = new THREE.Group();
  var sof = texturedMaterial(0x8fa8c8, 'fabric', 3);    /* 雾蓝布艺（织纹） */
  var dark = texturedMaterial(0x7e9cbe, 'fabric', 3);
  var base = new THREE.Mesh(roundedBox(3.0, 0.42, 0.85, 0.12, 5), sof); base.position.y = 0.21; g.add(base);
  var back = new THREE.Mesh(roundedBox(3.0, 0.75, 0.24, 0.1, 5), sof); back.position.set(0, 0.7, -0.32); g.add(back);
  var pad = new THREE.Mesh(roundedBox(2.9, 0.1, 0.76, 0.05, 5), dark); pad.position.set(0, 0.45, 0.02); g.add(pad);
  var armL = new THREE.Mesh(roundedBox(0.2, 0.55, 0.9, 0.07, 5), sof); armL.position.set(-1.42, 0.33, 0); g.add(armL);
  var armR = armL.clone(); armR.position.x = 1.42; g.add(armR);
  /* 彩色抱枕（橙/雾蓝/浅粉/黄绿四色），为深色沙发增加丰富色彩 */
  var pill = [ { c: 0xc95d33, p: [-0.95, 0.52, 0.05] }, { c: 0xe0b0a0, p: [0.95, 0.52, 0.05] }, { c: 0xd98a5a, p: [-0.55, 0.5, -0.12] }, { c: 0x9aaa83, p: [0.55, 0.5, -0.12] } ];
  pill.forEach(function (q) {
    var pp = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 14), texturedMaterial(q.c, 'fabric', 1));
    pp.scale.set(1.35, 0.85, 0.5); pp.position.set(q.p[0], q.p[1], q.p[2]); pp.rotation.x = 0.3; g.add(pp);
  });
  var legMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.6 });
  [[-1.3, -0.3], [1.3, -0.3], [-1.3, 0.3], [1.3, 0.3]].forEach(function (p) {
    var l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 10), legMat);
    l.position.set(p[0], 0.11, p[1]); g.add(l);
  });
  g.position.set(5.5, 0.02, -1.9); g.rotation.y = -Math.PI / 2;
  scene.add(g);
}

/* 沙发前圆形矮桌（深木纹桌面 + 木质支柱底座） */

/* 懒人沙发（Bean Bag）：焦糖绒布袋，放书柜前靠左墙，参考真实懒人沙发的豌豆形+顶部收口+褶皱 */
function buildBeanBag() {
  /* 懒人沙发（Bean Bag）：矮胖豌豆形 + 焦糖绒布纹理 + 顶部收口褶皱 + 表面菱形缝线（quilted） */
  var g = new THREE.Group();
  var bag  = texturedMaterial(0xc26b3a, 'felt', 1);        /* 绒布（短绒颗粒） */
  var fold = texturedMaterial(0xb05a2c, 'felt', 1);
  var line = new THREE.MeshStandardMaterial({ color: 0x8f4820, roughness: 0.9 });
  /* 主体：矮胖豌豆形（底部宽、顶部收窄，真实 bean bag 比例） */
  var body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 30, 26), bag);
  body.scale.set(1.15, 0.72, 1.2); body.position.y = 0.4; g.add(body);
  /* 顶部：收口环形褶皱（多层圆环堆叠出布袋收口感） */
  for (var r = 0; r < 3; r++) {
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.3 - r * 0.06, 0.06, 10, 24), fold);
    ring.position.set(0, 0.68 + r * 0.06, 0); ring.rotation.x = Math.PI / 2; g.add(ring);
  }
  var knob = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 14), fold);
  knob.scale.set(1, 0.55, 1); knob.position.set(0, 0.8, 0); g.add(knob);
  /* 底部坐垫阴影：压实在地面 */
  var bottom = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.5, 0.08, 26), line);
  bottom.position.set(0, 0.05, 0); g.add(bottom);
  /* 表面菱形缝线：几道交叉弧线，模拟 quilted 绒布面（更像真实懒人沙发） */
  for (var q = -1; q <= 1; q += 1) {
    var st1 = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.016, 6, 22), line);
    st1.position.set(0, 0.28 + Math.abs(q) * 0.14, 0); st1.rotation.x = Math.PI / 2; st1.rotation.y = q * 0.5; g.add(st1);
    var st2 = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.016, 6, 22), line);
    st2.position.set(0, 0.28 + Math.abs(q) * 0.14, 0); st2.rotation.x = Math.PI / 2; st2.rotation.y = q * 0.5 + Math.PI / 2; g.add(st2);
  }
  g.position.set(-5.5, 0.02, -3.1);   /* 书柜前、靠左墙 */
  g.rotation.y = 0.5;
  g.userData.type = 'sofa';
  scene.add(g);
}
