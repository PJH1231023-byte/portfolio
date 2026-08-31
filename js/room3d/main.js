/* =========================================================
   room3d/main.js — 房间启动核心：init / onResize / animate / flyTo / openRoom / closeRoom
   ⚠️ 依赖 state.js → textures.js → furniture/* → space/sky/filter → interaction/* 先加载
   ========================================================= */
'use strict';

function init() {
  if (inited) return; inited = true;
  var W = stage.clientWidth || 900, H = stage.clientHeight || 600;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;   /* 柔和阴影（Blender 质感） */
  renderer.toneMapping = THREE.ACESFilmicToneMapping; /* 照片级色调映射：去卡通感 */
  renderer.toneMappingExposure = 1.0;
  stage.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a2233);   /* 房间外暗背景，衬托室内 */

  /* 室内环境反射（PMREM）：让木质/金属/皮质物体有真实的高光反射，显著提升写实感 */
  (function buildEnv() {
    var pmrem = new THREE.PMREMGenerator(renderer);
    var es = new THREE.Scene();
    es.background = new THREE.Color(0xece2d0);
    var e1 = new THREE.DirectionalLight(0xfff1d2, 1.6); e1.position.set(2, 3, 1); es.add(e1);
    var e2 = new THREE.DirectionalLight(0xcfe0ff, 0.6); e2.position.set(-2, 1, 2); es.add(e2);
    var e3 = new THREE.DirectionalLight(0xffb37a, 0.4); e3.position.set(0, 1, -2); es.add(e3);
    scene.environment = pmrem.fromScene(es).texture;
    scene.environmentIntensity = 0.6;
  })();

  /* 第一人称视角：身处房间内，透视相机，旋转视线 */
  camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
  camera.position.set(-0.6, 2.2, 6.6);
  camera.lookAt(-0.8, 1.5, -2.2);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.6, -0.8);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  /* 防穿模：站在房间内第一视角，旋转限制在开口扇形内 */
  controls.enablePan = false;
  controls.minDistance = 3.4;
  controls.maxDistance = 9.5;
  controls.maxPolarAngle = Math.PI * 0.52;
  controls.minPolarAngle = Math.PI * 0.12;
  controls.minAzimuthAngle = -0.95;
  controls.maxAzimuthAngle = 0.95;

  /* 灯光：室内独立光照（窗外光仅"透进来一点光感"，不足以让房间曝光，保持明暗层次） */
  scene.add(new THREE.AmbientLight(0xfff2e6, 0.22));
  var hemi = new THREE.HemisphereLight(0xfff6ec, 0xbfa98d, 0.42);
  scene.add(hemi);
  sunLight = new THREE.DirectionalLight(0xfff1d2, 0.85);
  sunLight.position.set(-3, 6, -2);
  sunLight.target.position.set(-0.8, 0.6, 0.6);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.left = -7; sunLight.shadow.camera.right = 7;
  sunLight.shadow.camera.top = 7; sunLight.shadow.camera.bottom = -7;
  sunLight.shadow.camera.near = 0.5; sunLight.shadow.camera.far = 30;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);
  scene.add(sunLight.target);
  var fill = new THREE.DirectionalLight(0xd8e8ff, 0.15);
  fill.position.set(5, 4, 6);
  scene.add(fill);

  buildRoom();
  buildSky();
  bindSkyControls();
  bindComputerIcons();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  renderer.domElement.addEventListener('click', onPick);
  window.addEventListener('resize', onResize);
  window.__room3d = { scene: scene, camera: camera, raycaster: raycaster, renderer: renderer, interactives: interactives };
  /* 展示镜头：URL 带 ?focus=dog|bear|shelf|sofa|desk 时自动飞到目标前（调试/演示用，不带参数不影响） */
  var _f = (window.location.search.match(/focus=(\w+)/) || [])[1];
  if (_f) {
    setTimeout(function () {
      var _m = {
        dog: { p: [2.8, 1.2, -1.0], t: [3.1, 0.4, -2.8] },
        bear: { p: [2.3, 1.2, -1.1], t: [2.6, 0.5, -2.8] },
        shelf: { p: [-5.0, 1.6, -1.1], t: [-5.0, 1.3, -4.0] },
        sofa: { p: [5.3, 1.5, -0.1], t: [5.5, 1.1, -1.8] },
        desk: { p: [-0.5, 1.6, -1.5], t: [-1.2, 1.5, -3.2] }
      }[_f];
      if (_m) flyTo(_m.p, _m.t, null, 1300);
    }, 400);
  }
  animate();
}

function onResize() {
  if (!renderer) return;
  var W = stage.clientWidth || 900, H = stage.clientHeight || 600;
  camera.aspect = W / H; camera.updateProjectionMatrix();
  renderer.setSize(W, H);
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  if (camAnim) {
    camAnim.t += 16 / camAnim.dur;
    if (camAnim.t >= 1) {
      camera.position.copy(camAnim.toP); controls.target.copy(camAnim.toT);
      camAnim = null;
      if (camAnimOnDone) { var _d = camAnimOnDone; camAnimOnDone = null; _d(); }
    } else {
      var _e = camAnim.t * camAnim.t * (3 - 2 * camAnim.t);
      camera.position.lerpVectors(camAnim.fromP, camAnim.toP, _e);
      controls.target.lerpVectors(camAnim.fromT, camAnim.toT, _e);
    }
  }
  if (catTail && catGroup) {
    var _ct = Date.now() / 1000;
    catTail.rotation.z = (catHover ? Math.sin(_ct * 8) * 0.6 : 0);
    catGroup.position.y = 0.06 + (catHover ? Math.sin(_ct * 10) * 0.02 : 0);
  }
  if (chairSpin && chairHover) chairSpin.rotation.y += 0.018;   /* 鼠标触碰扶手椅：缓慢旋转 */
  var _now = Date.now() / 1000;
  if (starGroup) {
    starGroup.children.forEach(function (st) {
      var vis = st.material.userData.vis || 0;
      if (vis > 0) st.material.opacity = vis * (0.55 + 0.45 * Math.sin(_now * st.userData.tw + st.position.x * 17));
    });
  }
  if (skyAuto && overlay.classList.contains('is-open')) {
    timeOfDay += 0.006;
    if (timeOfDay > 24) timeOfDay -= 24;
    var sl = document.getElementById('skySlider');
    if (sl) sl.value = timeOfDay;
    updateSky(timeOfDay);
  }
  if (renderer && scene && camera && overlay.classList.contains('is-open')) renderer.render(scene, camera);
}

function flyTo(pos, lookAt, onDone, dur) {
  camAnim = {
    fromP: camera.position.clone(),
    fromT: controls.target.clone(),
    toP: new THREE.Vector3(pos[0], pos[1], pos[2]),
    toT: new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]),
    t: 0, dur: dur || 1200
  };
  camAnimOnDone = onDone || null;
}

function openRoom() {
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  init();
}
function closeRoom() {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* 房间启动绑定：DOM 就绪后获取元素、绑定房子点击进出、调试直达/自测 */
document.addEventListener('DOMContentLoaded', function () {
  overlay = document.getElementById('roomOverlay');
  stage = document.getElementById('roomStage3d');
  house = document.getElementById('heroHouse');
  closeBtn = document.getElementById('roomClose');
  if (!overlay || !stage) return;
  if (house) house.addEventListener('click', function (e) { e.preventDefault(); openRoom(); });
  if (closeBtn) closeBtn.addEventListener('click', closeRoom);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open') &&
        !document.querySelector('.computer.is-open,.item-info.is-open,.wall.is-open,.photo-zoom.is-open,.game.is-open')) {
      closeRoom();
    }
  });
  window.openRoom = openRoom;
  window.closeRoom = closeRoom;
  /* 调试直达：URL 带 ?autoclick=1 或 ?room=1 自动进入房间 */
  if (/autoclick=1|room=1/.test(window.location.search || '')) {
    setTimeout(function () {
      var hh = document.getElementById('heroHouse');
      if (hh && hh.dispatchEvent) hh.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      else if (window.openRoom) window.openRoom();
    }, 900);
  }
  /* 调试自测：URL 带 ?selftest=1 自动跑完整交互链路 */
  if (/selftest=1/.test(window.location.search || '')) {
    var _log = [];
    function _st(n, ok) { _log.push(n + ':' + (ok ? 'OK' : 'FAIL')); document.title = 'SELFTEST_RUNNING ' + _log.join('|'); }
    setTimeout(function () {
      var hh = document.getElementById('heroHouse');
      if (hh) hh.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      setTimeout(function () {
        var ov = document.getElementById('roomOverlay');
        _st('enterRoom', !!ov && ov.classList.contains('is-open'));
        if (window.openComputerScreen) window.openComputerScreen(); else { openComputerScreen(); }
        setTimeout(function () {
          var cs = document.getElementById('computerScreen');
          _st('computer', !!cs && cs.classList.contains('is-open'));
          if (window.openGame) window.openGame();
          setTimeout(function () {
            var g = document.getElementById('gameOverlay');
            _st('game', !!g && g.classList.contains('is-open'));
            if (window.closeGame) window.closeGame();
            if (window.openWall) window.openWall();
            setTimeout(function () {
              var w = document.getElementById('worksWall');
              _st('wall', !!w && w.classList.contains('is-open'));
              if (window.closeWall) window.closeWall();
              if (window.openPhotoWall) window.openPhotoWall();
              setTimeout(function () {
                var p = document.getElementById('photoWallZoom');
                _st('photoWall', !!p && p.classList.contains('is-open'));
                if (window.closePhotoWall) window.closePhotoWall();
                if (window.openPerson) window.openPerson();
                setTimeout(function () {
                  var pp = document.getElementById('personPanel');
                  _st('person', !!pp && pp.classList.contains('is-open'));
                  document.title = 'SELFTEST_DONE ' + _log.join('|');
                }, 400);
              }, 400);
            }, 400);
          }, 400);
        }, 700);
      }, 1300);
    });
  }
});
