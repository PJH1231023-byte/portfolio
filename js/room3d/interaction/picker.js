/* =========================================================
   interaction/picker.js — 点击拾取（onPick）+ 悬停检测（金毛等）
   ========================================================= */
'use strict';

function onPick(e) {
  if (!renderer || !raycaster) return;
  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var hits = raycaster.intersectObjects(interactives.map(function (o) { return o.mesh; }), true);
  if (!hits.length) return;
  var node = hits[0].object;
  while (node && !node.userData.type) node = node.parent;
  if (!node) return;
  switch (node.userData.type) {
    case 'wall': if (window.openWall) window.openWall(); break;
    case 'computer':
      /* 第一人称运镜：坐到橙色椅、面向电脑，然后放大屏幕看三文件 */
      flyTo([-0.9, 1.32, -2.15], [-1.7, 1.85, -3.5], function () { openComputerScreen(); }, 1300);
      break;
    case 'photos':
      /* 第一人称运镜：站到沙发前看照片墙，然后展示全部照片 */
      flyTo([4.2, 1.5, -1.1], [5.9, 2.0, -1.1], function () { if (window.openPhotoWall) window.openPhotoWall(); }, 1300);
      break;
    case 'dog': openItemInfo('dog'); break;
    case 'bear': openItemInfo('bear'); break;
    case 'plant': openItemInfo('plant'); break;
    case 'shelf': openItemInfo('shelf'); break;
    case 'lamp': toggleLamp(); break;
    case 'avatar': if (window.openPerson) window.openPerson(); break;
    default: break;
  }
}

window.addEventListener('mousemove', function (e) {
  if (!renderer || !raycaster || !catGroup) return;
  var rect = renderer.domElement.getBoundingClientRect();
  var mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  var my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
  var hits = raycaster.intersectObjects(catGroup.children, true);
  catHover = hits.length > 0;
  if (chairSpin) {
    var ch = raycaster.intersectObjects(chairSpin.children, true);
    chairHover = ch.length > 0;
  }
});
