/* =========================================================
   furniture/photos.js — buildPhotos
   改样子改这里；配色建议在文件内顶部统一常量
   ========================================================= */
'use strict';

function buildPhotos() {
  var g = new THREE.Group();
  var shots = [
    'images/photo-life-1.png', 'images/photo-life-2.png', 'images/photo-life-3.png',
    'images/photo-life-4.png', 'images/photo-life-5.png', 'images/photo-life-6.png'
  ];
  var styles = [
    { shape: 'circle', color: 0xf0d9ae },
    { shape: 'square', color: 0xffffff },
    { shape: 'circle', color: 0xa8c0a8 },
    { shape: 'square', color: 0xd8c9b0 },
    { shape: 'circle', color: 0xe3b7a9 },
    { shape: 'square', color: 0x9aa3b5 }
  ];
  for (var i = 0; i < 6; i++) {
    var col = i % 3, row = Math.floor(i / 3);
    var st = styles[i];
    var px = (col - 1) * 0.72, py = 2.6 - row * 0.8;
    if (st.shape === 'circle') {
      var frame = new THREE.Mesh(new THREE.CircleGeometry(0.29, 28), texturedMaterial(st.color, 'plastic', 1, 0.45));
      frame.position.set(px, py, 0.04); g.add(frame);
      var img = new THREE.Mesh(new THREE.CircleGeometry(0.24, 28), new THREE.MeshBasicMaterial({ map: tex(shots[i]), side: THREE.DoubleSide }));
      img.position.set(px, py, 0.055); g.add(img);
    } else {
      var frame = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.64), texturedMaterial(st.color, 'plastic', 1, 0.45));
      frame.position.set(px, py, 0.04); g.add(frame);
      var img = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.56), new THREE.MeshBasicMaterial({ map: tex(shots[i]) }));
      img.position.set(px, py, 0.055); g.add(img);
    }
  }
  g.position.set(5.9, 0.24, -1.1); g.rotation.y = -Math.PI / 2;
  g.userData.type = 'photos';
  scene.add(g);
  interactives.push({ mesh: g, type: 'photos' });
}

/* 右上角搁板 + 金色奖杯（复刻雪原：标准奖杯造型，置于墙上架，位置合理） */
