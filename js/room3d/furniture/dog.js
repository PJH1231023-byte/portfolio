/* =========================================================
   furniture/dog.js — buildGoldenDog / buildSleepingDog
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildGoldenDog() {
  catGroup = new THREE.Group();
  var gold = new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.8 });
  var dark = new THREE.MeshStandardMaterial({ color: 0xc08a30, roughness: 0.8 });
  var black = new THREE.MeshStandardMaterial({ color: 0x2b1f18, roughness: 0.3 });
  /* 俯卧身体（大型犬：宽而长） */
  var body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), gold);
  body.scale.set(1.5, 0.62, 1.15); body.position.y = 0.22; catGroup.add(body);
  /* 头（身体前方、脸朝观众 z+） */
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), gold);
  head.position.set(0, 0.3, 0.55); head.scale.set(1, 0.95, 1); catGroup.add(head);
  /* 口鼻 */
  var muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), gold);
  muzzle.position.set(0, 0.26, 0.72); catGroup.add(muzzle);
  /* 鼻头 */
  var nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), black);
  nose.position.set(0, 0.3, 0.84); catGroup.add(nose);
  /* 眼睛（面向观众） */
  var eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), black);
  eyeL.position.set(-0.12, 0.38, 0.68); catGroup.add(eyeL);
  var eyeR = eyeL.clone(); eyeR.position.x = 0.12; catGroup.add(eyeR);
  /* 金毛大垂耳（两侧垂下） */
  var earL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), dark);
  earL.position.set(-0.3, 0.32, 0.5); earL.scale.set(0.7, 1.6, 0.6); catGroup.add(earL);
  var earR = earL.clone(); earR.position.x = 0.3; catGroup.add(earR);
  /* 四条腿（两侧趴着） */
  var legM = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.2, 8), gold);
  var legs = [[-0.36, 0.1, 0.15], [0.36, 0.1, 0.15], [-0.36, 0.1, -0.25], [0.36, 0.1, -0.25]];
  legs.forEach(function (p) { var l = legM.clone(); l.position.set(p[0], p[1], p[2]); catGroup.add(l); });
  /* 尾巴（后部翘起，可摆动） */
  catTail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 0.6, 8), gold);
  catTail.position.set(0, 0.32, -0.72); catTail.rotation.x = -0.9; catGroup.add(catTail);
  catGroup.position.set(3.5, 0.06, -3.35);
  catGroup.userData.type = 'dog';
  scene.add(catGroup);
  interactives.push({ mesh: catGroup, type: 'dog' });
}

/* 洞洞板下方靠墙的泰迪熊玩偶（坐姿朝观众，暖棕毛绒，颜色鲜明） */
/* 泰迪熊 + 金毛：卡通贴图版（真实照片 → 卡通化 → 抠图 → billboard 立体形象）
   用带透明背景的贴图做公告板，随视角保持正面，比几何建模真实且可爱 */
      /* 泰迪熊 + 金毛：卡通贴图版（真实照片 → 卡通化 → 抠图 → billboard 立体形象）
   用带透明背景的贴图做公告板，随视角保持正面，比几何建模真实且可爱 */

function buildSleepingDog() {
  var g = new THREE.Group();
  var gold = new THREE.MeshBasicMaterial({ color: 0xe3a83a });    /* 鲜明金黄（不受光照，夜晚也可见） */
  var goldL = new THREE.MeshBasicMaterial({ color: 0xf2c469 });    /* 浅金黄（胸/口鼻/爪） */
  var dark = new THREE.MeshBasicMaterial({ color: 0xc9882a });     /* 深金黄（耳/背） */
  var eyeMat = new THREE.MeshBasicMaterial({ color: 0x2b1f18 });
  var noseM = new THREE.MeshBasicMaterial({ color: 0x3a2418 });
  var blushM = new THREE.MeshBasicMaterial({ color: 0xf2a9a0 });
  /* 身体：趴卧，前后方向（+z 为头朝向观众） */
  var body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 14), gold);
  body.scale.set(1.1, 0.55, 1.35); body.position.set(0, 0.16, -0.05); g.add(body);
  /* 头：朝 +z（面向观众），微微侧向熊 */
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), gold);
  head.position.set(0, 0.26, 0.32); g.add(head);
  /* 口鼻：浅金黄小圆 */
  var snout = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), goldL);
  snout.position.set(0, 0.24, 0.46); snout.scale.set(1, 0.7, 0.8); g.add(snout);
  /* 鼻子 */
  var nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), noseM);
  nose.position.set(0, 0.27, 0.53); g.add(nose);
  /* 大垂耳（两侧耷拉） */
  var earM = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), dark);
  var earL = earM.clone(); earL.position.set(-0.19, 0.3, 0.2); earL.scale.set(0.7, 1.4, 0.6); g.add(earL);
  var earR = earM.clone(); earR.position.set(0.19, 0.3, 0.2); earR.scale.set(0.7, 1.4, 0.6); g.add(earR);
  /* 闭眼（两道眯眼线，朝观众） */
  var eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.02), eyeMat); eyeL.position.set(-0.09, 0.31, 0.47); g.add(eyeL);
  var eyeR = eyeL.clone(); eyeR.position.x = 0.09; g.add(eyeR);
  /* 粉色腮红 */
  var bl = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), blushM); bl.position.set(-0.14, 0.2, 0.42); g.add(bl);
  var br = bl.clone(); br.position.set(0.14, 0.2, 0.42); g.add(br);
  /* 前爪：头两侧前伸 */
  var pawM = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.26, 10), goldL);
  var pawL = pawM.clone(); pawL.position.set(-0.2, 0.1, 0.28); pawL.rotation.x = 0.5; g.add(pawL);
  var pawR = pawM.clone(); pawR.position.set(0.2, 0.1, 0.28); pawR.rotation.x = 0.5; g.add(pawR);
  /* 后腿：收拢在身后 */
  var hipM = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.18, 10), gold);
  var hipL = hipM.clone(); hipL.position.set(-0.18, 0.1, -0.35); hipL.rotation.x = -0.4; g.add(hipL);
  var hipR = hipM.clone(); hipR.position.set(0.18, 0.1, -0.35); hipR.rotation.x = -0.4; g.add(hipR);
  /* 尾巴：贴地 */
  var tail = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), gold);
  tail.position.set(0, 0.15, -0.5); tail.scale.set(1, 0.7, 1.2); g.add(tail);
  g.position.set(2.95, 0.02, -2.85);
  g.rotation.y = -0.25;   /* 微微转向熊，依偎感 */
  g.userData.type = 'dog';
  scene.add(g);
  interactives.push({ mesh: g, type: 'dog' });
}

/* 窗外阳光光斑（白天从窗洒进室内的光影） */
