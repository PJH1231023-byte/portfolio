/* =========================================================
   furniture/window.js — buildWindow
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildWindow() {
  var g = new THREE.Group();
  var frMat = new THREE.MeshStandardMaterial({ color: 0xd9b98c, roughness: 0.5 });
  var fL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), frMat); fL.position.set(-1.62, 1.62, 0); g.add(fL);
  var fR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), frMat); fR.position.set(1.62, 1.62, 0); g.add(fR);
  var fT = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 0.14), frMat); fT.position.set(0, 3.24, 0); g.add(fT);
  var fB = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 0.14), frMat); fB.position.set(0, 0.08, 0); g.add(fB);
  var glass = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.1), new THREE.MeshBasicMaterial({ color: 0xdff0ff, transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
  glass.position.set(0, 1.66, 0.03); g.add(glass);
  /* 田字中框：横中框 + 竖中框 */
  var fM = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.07, 0.07), frMat); fM.position.set(0, 1.66, 0.07); g.add(fM);
  var fV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 3.1, 0.07), frMat); fV.position.set(0, 1.66, 0.07); g.add(fV);
  /* 窗帘：暖米白布帘 + 程序化褶皱纹理（竖向布料起伏 + 顶部挂帘波浪 + 底部垂坠），真实布感 */
  var curTex = drawCurtainCanvas('#f0e6d4');
  var curMat = new THREE.MeshStandardMaterial({ map: curTex, roughness: 0.95 });
  var curL = new THREE.Mesh(new THREE.BoxGeometry(1.12, 3.3, 0.06), curMat); curL.position.set(-2.18, 1.66, 0.05); g.add(curL);
  var curR = new THREE.Mesh(new THREE.BoxGeometry(1.12, 3.3, 0.06), curMat); curR.position.set(2.18, 1.66, 0.05); g.add(curR);
  var curTop = new THREE.Mesh(new THREE.BoxGeometry(3.44, 0.3, 0.06), curMat); curTop.position.set(0, 3.32, 0.05); g.add(curTop);
  var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 4.0, 12), new THREE.MeshStandardMaterial({ color: 0x6b5543, roughness: 0.6 }));
  rod.rotation.z = Math.PI / 2; rod.position.set(0, 3.4, -0.06); g.add(rod);
  g.position.set(0, 0.14, -4.45);
  scene.add(g);
}

/* 卡通 AI 形象：真正坐在桌前椅上（底部贴椅面，不悬空），点击弹出个人介绍 */
