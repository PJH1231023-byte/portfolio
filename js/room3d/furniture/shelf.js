/* =========================================================
   furniture/shelf.js — buildShelf
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildShelf() {
  var g = new THREE.Group();
  var wood = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xe0c69e, roughness: 0.6 });
  var backMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xd2b285, roughness: 0.7 });
  /* 厚实侧板 + 顶板 + 底板：完整木柜框架，贴着墙那一侧也是清晰木头侧板，不再"像墙" */
  var frameMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xd9b98c, roughness: 0.6 });
  var sideL = new THREE.Mesh(roundedBox(0.16, 2.4, 0.62, 0.05, 4), frameMat); sideL.position.set(-1.0, 1.2, 0); g.add(sideL);
  var sideR = sideL.clone(); sideR.position.x = 1.0; g.add(sideR);
  var top = new THREE.Mesh(roundedBox(2.16, 0.14, 0.62, 0.05, 4), frameMat); top.position.set(0, 2.4, 0); g.add(top);
  var bot = new THREE.Mesh(roundedBox(2.16, 0.12, 0.62, 0.05, 4), frameMat); bot.position.set(0, 0.06, 0); g.add(bot);
  var back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 0.06), backMat); back.position.set(0, 1.2, -0.27); g.add(back);
  var bookCols = [0xc95d33, 0x7aa8d8, 0x8fa98f, 0xe0b080, 0xa8b6d8, 0xc9a070, 0xe0a08a];
  for (var i = 0; i < 5; i++) {
    var shelf = new THREE.Mesh(roundedBox(2.0, 0.06, 0.6, 0.03, 4), wood); shelf.position.set(0, 0.12 + i * 0.54, 0); g.add(shelf);
    if (i < 4) {
      for (var b = 0; b < 7; b++) {
        var bh = 0.28 + Math.random() * 0.14;
        var book = new THREE.Mesh(roundedBox(0.09, bh, 0.34, 0.02, 3), new THREE.MeshStandardMaterial({ color: bookCols[Math.floor(Math.random() * bookCols.length)], roughness: 0.5 }));
        book.position.set(-0.85 + b * 0.28, 0.15 + i * 0.54 + bh / 2, 0.05); g.add(book);
      }
    }
  }
  g.position.set(-4.72, 0.02, -4.15); g.rotation.y = 0;   /* 贴后墙左侧、离左墙留缝：两侧板完整可见，不与墙重合 */
  g.userData.type = 'shelf';
  scene.add(g);
}

/* 右墙照片墙下贴墙长沙发（复古皮沙发：深棕皮 + 木腿 + 彩色抱枕） */
