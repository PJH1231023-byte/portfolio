/* =========================================================
   room3d/space.js — 空间本体：buildRoom 组装墙体/地板/家具（摆放参照 layout 常量区）
   ========================================================= */
'use strict';

function buildRoom() {
  var floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8.5), new THREE.MeshStandardMaterial({ map: drawWoodCanvas(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.72 }));
  floor.position.set(0, -0.1, -0.25); scene.add(floor);
  var ceil = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8.5), new THREE.MeshStandardMaterial({ color: 0xdfe0e2, roughness: 0.9 }));
  ceil.position.set(0, 4.3, -0.25); scene.add(ceil);
  var wallMat = new THREE.MeshStandardMaterial({ map: drawWallCanvas(), normalMap: wallNormal(), color: 0xffffff, roughness: 0.92 });
  var left = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 8.5), wallMat);
  left.position.set(-6, 2.19, -0.25); scene.add(left);
  var right = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 8.5), wallMat);
  right.position.set(6, 2.19, -0.25); scene.add(right);
  var backL = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.4, 0.2), wallMat);
  backL.position.set(-3.4, 2.19, -4.5); scene.add(backL);
  var backR = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.4, 0.2), wallMat);
  backR.position.set(3.4, 2.19, -4.5); scene.add(backR);
  var winTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 0.2), wallMat);
  winTop.position.set(0, 3.69, -4.5); scene.add(winTop);
  var winBot = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 0.2), wallMat);
  winBot.position.set(0, 0.44, -4.5); scene.add(winBot);

  buildRug();
  buildDesk();
  buildChair();
  buildPegboard();
  buildPhotos();
  buildShelf();
  buildSofa();
  buildBeanBag();   /* 书柜前懒人沙发 */
  buildCoffeeTable();
  // buildGoldenDog();  /* 已按用户要求去掉金毛，函数保留备用 */
  buildSunspot();
  buildWindow();
  buildLamp();
  buildBearPlush();   /* 泰迪熊+金毛：照片贴图版（卡通化+抠图 billboard） */
  // buildSleepingDog(); /* 几何版金毛趴睡，已被贴图版替代，函数保留备用 */

  /* 柔和阴影：家具投影 + 地板/墙接收，形成体积感与环境光遮蔽般的明暗 */
  scene.traverse(function (o) {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });
}

/* 桌前圆地毯（暖米底 + 双色描边圈，像参考图的条纹地毯） */
