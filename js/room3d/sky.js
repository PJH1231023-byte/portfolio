/* =========================================================
   room3d/sky.js — buildSky：窗外天穹（日/月/星空，随天色联动）
   窗外景色贴图在 textures.js
   ========================================================= */
'use strict';

function buildSky() {
  skyMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.2), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0xcfeaff, map: drawSkyCanvas() }));
  skyMesh.position.set(0, 1.8, -5.5);
  skyMesh.lookAt(0, 1.8, -1);
  scene.add(skyMesh);
  sunMesh = new THREE.Mesh(new THREE.CircleGeometry(0.5, 44), new THREE.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0 }));
  sunMesh.position.set(-1.0, 2.9, -5.3);
  sunMesh.lookAt(0, 1.8, -1);
  scene.add(sunMesh);
  moonMesh = new THREE.Mesh(new THREE.CircleGeometry(0.34, 44), new THREE.MeshBasicMaterial({ color: 0xfff6e0, transparent: true, opacity: 0, map: drawMoonCanvas() }));
  moonMesh.position.set(1.0, 2.9, -5.3);
  moonMesh.lookAt(0, 1.8, -1);
  scene.add(moonMesh);
  /* 星空光点：发光圆点贴图，随夜晚闪烁 */
  var starMap = drawStarCanvas();
  starGroup = new THREE.Group();
  var starMat = new THREE.MeshBasicMaterial({ map: starMap, transparent: true, opacity: 0, depthWrite: false });
  for (var s = 0; s < 120; s++) {
    var sz = 0.06 + Math.random() * 0.2;
    var st = new THREE.Mesh(new THREE.PlaneGeometry(sz, sz), starMat.clone());
    st.position.set(-1.6 + Math.random() * 3.2, 0.4 + Math.random() * 2.9, -5.3);
    st.lookAt(0, 1.8, -1);
    st.userData.tw = 0.5 + Math.random() * 1.6;
    starGroup.add(st);
  }
  scene.add(starGroup);
  updateSky(timeOfDay);
}

/* 星星发光光点贴图（径向渐变圆点） */
