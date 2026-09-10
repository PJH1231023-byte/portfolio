/* =========================================================
   furniture/desk.js — buildDesk
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildDesk() {
  var g = new THREE.Group();
  var top = new THREE.Mesh(roundedBox(3.2, 0.13, 1.5, 0.05, 5), new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xc9a070, roughness: 0.55 }));
  top.position.y = 0.86; g.add(top);
  var legMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.6 });
  [[-1.4, -0.55], [1.4, -0.55], [-1.4, 0.55], [1.4, 0.55]].forEach(function (p) {
    var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.78, 16), legMat);
    leg.position.set(p[0], 0.4, p[1]); g.add(leg);
  });
  /* 台式 iMac（桌面偏左，银白一体机复刻雪原） */
  var screen = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.07), texturedMaterial(0xd8dde6, 'plastic', 2, 0.25));
  screen.position.set(-0.9, 1.7, 0.1); g.add(screen);
  var bezel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.03), texturedMaterial(0x23262e, 'plastic', 2, 0.4));
  bezel.position.set(-0.9, 1.7, 0.132); g.add(bezel);
  var panel = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.87), new THREE.MeshBasicMaterial({ map: drawDesktopCanvas() }));
  panel.position.set(-0.9, 1.7, 0.14); g.add(panel);
  var stand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.5, 0.14), texturedMaterial(0x9aa3b5, 'plastic', 1, 0.3));
  stand.position.set(-0.9, 0.98, 0.08); g.add(stand);
  var base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.3), texturedMaterial(0x9aa3b5, 'plastic', 1, 0.3));
  base.position.set(-0.9, 0.84, 0.08); g.add(base);
  /* 笔记本（桌面偏右，屏幕朝观众） */
  var nbBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.6), texturedMaterial(0x3a4152, 'plastic', 2, 0.45));
  nbBase.position.set(0.95, 1.0, -0.1); g.add(nbBase);
  var nbScr = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.58, 0.04), texturedMaterial(0x4a5366, 'plastic', 2, 0.55));
  nbScr.position.set(0.95, 1.3, -0.08); nbScr.rotation.x = -0.4; g.add(nbScr);
  var nbGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.5), new THREE.MeshBasicMaterial({ color: 0x7c8ac0 }));
  nbGlow.position.set(0.95, 1.3, -0.058); nbGlow.rotation.x = -0.4; g.add(nbGlow);
  /* 键盘（显示器前） */
  var kb = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.26), texturedMaterial(0xe8ecf3, 'plastic', 3, 0.45));
  kb.position.set(-0.9, 0.94, 0.48); g.add(kb);
  /* 复古桌面闹钟（红漆钟体 + 白色钟面 + 双黄铜铃铛 + 指针 + 底座脚）——具体物品而非方块 */
  var clockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 22), texturedMaterial(0xc0502e, 'plastic', 1, 0.35));
  clockBody.position.set(-0.05, 1.0, 0.42); g.add(clockBody);
  var clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.092, 22), new THREE.MeshBasicMaterial({ color: 0xfff7e6 }));
  clockFace.position.set(-0.05, 1.005, 0.472); g.add(clockFace);
  var bellMat = texturedMaterial(0xd9c98a, 'metal', 1, 0.3);
  var bellL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), bellMat); bellL.position.set(-0.09, 1.07, 0.42); g.add(bellL);
  var bellR = bellL.clone(); bellR.position.x = -0.01; g.add(bellR);
  var handH = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.05, 0.01), new THREE.MeshBasicMaterial({ color: 0x3a3a3a }));
  handH.position.set(-0.05, 1.018, 0.475); g.add(handH);
  var handM = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.035, 0.01), new THREE.MeshBasicMaterial({ color: 0x6b4a2a }));
  handM.position.set(-0.05, 1.008, 0.475); g.add(handM);
  var footM = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.018, 0.07), texturedMaterial(0x8a8f98, 'metal', 1, 0.35));
  var footL = footM.clone(); footL.position.set(-0.085, 0.948, 0.42); g.add(footL);
  var footR = footM.clone(); footR.position.set(-0.015, 0.948, 0.42); g.add(footR);
  /* 茶具（桌面中右） */
  var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16), texturedMaterial(0xffe3b8, 'plastic', 1, 0.16));
  cup.position.set(0.45, 1.0, 0.45); g.add(cup);
  var cupHandle = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.013, 8, 14), texturedMaterial(0xffe3b8, 'plastic', 1, 0.16));
  cupHandle.position.set(0.55, 1.03, 0.45); cupHandle.rotation.z = 0.35; g.add(cupHandle);
  var saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.03, 16), texturedMaterial(0xfff2dc, 'plastic', 1, 0.2));
  saucer.position.set(0.45, 0.95, 0.45); g.add(saucer);
  /* 彩色书本（桌面左后，色彩点缀） */
  var book1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.24), texturedMaterial(0xc95d33, 'fabric', 1));
  book1.position.set(0.35, 0.99, -0.28); g.add(book1);
  var book2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.17, 0.22), texturedMaterial(0x7aa8d8, 'fabric', 1));
  book2.position.set(0.2, 0.97, -0.27); book2.rotation.y = 0.25; g.add(book2);
  var book3 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.2), texturedMaterial(0x8fa98f, 'fabric', 1));
  book3.position.set(0.32, 0.96, -0.38); book3.rotation.y = -0.15; g.add(book3);
  /* 书脊：每本书正面加一条深色书脊线，更接近真实书本 */
  var spineM = texturedMaterial(0x5a4a3a, 'fabric', 1, 0.7);
  var sp1 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.2, 0.235), spineM); sp1.position.set(0.43, 0.99, -0.28); g.add(sp1);
  var sp2 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.16, 0.215), spineM); sp2.position.set(0.28, 0.97, -0.27); g.add(sp2);
  var sp3 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.195), spineM); sp3.position.set(0.4, 0.96, -0.38); g.add(sp3);
  /* 小盆栽（桌面中左，绿色点缀） */
  var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.11, 10), texturedMaterial(0xb98a5e, 'plastic', 1, 0.55));
  pot.position.set(-0.05, 0.94, -0.35); g.add(pot);
  /* 笔筒（陶土筒 + 几支斜插彩色笔） */
  var penPot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.13, 14), texturedMaterial(0xa97a4d, 'plastic', 1, 0.55));
  penPot.position.set(0.5, 0.985, 0.05); g.add(penPot);
  var penCols = [0xc95d33, 0x7aa8d8, 0x8fa98f, 0xd9c26a];
  for (var pi = 0; pi < 4; pi++) {
    var pen = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.17, 6), texturedMaterial(penCols[pi], 'plastic', 1, 0.3));
    pen.position.set(0.5 + (pi - 1.5) * 0.024, 1.08, 0.05 + (pi % 2) * 0.02);
    pen.rotation.z = (pi - 1.5) * 0.14; pen.rotation.x = 0.12; g.add(pen);
  }
  var leafM = new THREE.MeshStandardMaterial({ color: 0x6f8f60, roughness: 0.8 });
  for (var li = 0; li < 4; li++) {
    var lf = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), leafM);
    lf.position.set(-0.05 + Math.cos(li * 1.7) * 0.05, 1.02 + Math.abs(Math.sin(li * 1.3)) * 0.04, -0.35 + Math.sin(li * 1.7) * 0.05);
    g.add(lf);
  }
  /* 主机（桌下地面右侧） */
  var tower = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.42), texturedMaterial(0xdfe3ec, 'plastic', 2, 0.4));
  tower.position.set(1.3, 0.35, 0.35); g.add(tower);
  var towerGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.08), new THREE.MeshBasicMaterial({ color: 0x7ad9b8 }));
  towerGlow.position.set(1.3, 0.42, 0.563); g.add(towerGlow);
  g.position.set(-0.8, 0.14, -3.6);
  g.userData.type = 'computer';
  scene.add(g);
  interactives.push({ mesh: g, type: 'computer' });
}

/* 桌前办公椅（复刻雪原：红色低多边形办公椅） */
