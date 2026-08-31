/* =========================================================
   room3d/filter.js — 光线与色彩滤镜：updateSky（天色）/ toggleLamp（台灯）/ bindSkyControls（面板）
   整体色调调整集中在此
   ========================================================= */
'use strict';

function updateSky(t) {
  var daylight, sunH, sunVis, moonVis, starVis;
  var skyCol = new THREE.Color();
  if (t >= 5 && t < 8) {
    var k = (t - 5) / 3;
    daylight = 0.35 + k * 0.5;
    skyCol.lerpColors(new THREE.Color(0x35507a), new THREE.Color(0x9ac8f0), k);
    sunH = k; sunVis = 1; moonVis = 1 - k; starVis = 0.4 * (1 - k);
  } else if (t >= 8 && t < 17) {
    daylight = 0.85;
    skyCol.set(0xcfeaff);
    sunH = 1 - Math.abs((t - 12.5) / 4.5) * 0.3; sunVis = 1; moonVis = 0; starVis = 0;
  } else if (t >= 17 && t < 20) {
    var k2 = (t - 17) / 3;
    daylight = 0.85 - k2 * 0.5;
    skyCol.lerpColors(new THREE.Color(0xcfeaff), new THREE.Color(0x3a2a5e), k2);
    sunH = 1 - k2; sunVis = 1 - k2; moonVis = k2; starVis = 0.55 * k2;
  } else {
    daylight = 0.3;
    skyCol.set(0x0b1030);
    sunH = 0; sunVis = 0; moonVis = 1; starVis = 1;
  }
  if (skyMesh) skyMesh.material.color.copy(skyCol);
  if (sunMesh) { sunMesh.material.opacity = sunVis; sunMesh.visible = sunVis > 0.05; sunMesh.position.set(-1.4 + sunH * 2.8, 0.7 + sunH * 2.6, -5.3); }
  if (moonMesh) { moonMesh.material.opacity = moonVis; moonMesh.visible = moonVis > 0.05; }
  if (starGroup) starGroup.children.forEach(function (st) { st.material.userData.vis = starVis; st.material.opacity = starVis; });
  var ambient = scene.children.filter(function (o) { return o.isAmbientLight; })[0];
  if (ambient) ambient.intensity = 0.16 + daylight * 0.12;   /* 室内光独立，窗外光不造成曝光 */
  var hemi = scene.children.filter(function (o) { return o.isHemisphereLight; })[0];
  if (hemi) hemi.intensity = 0.18 + daylight * 0.2;
  var warm = scene.children.filter(function (o) { return o.isPointLight && o.position.y > 3; })[0];
  if (warm) warm.intensity = (lampOn ? 1.5 : 0.4) + daylight * 0.5;
  if (sunLight) sunLight.intensity = 0.2 + daylight * 0.62;   /* 窗外光仅"透进来一点光感" */
  if (sunspot) sunspot.material.opacity = daylight * 0.55;      /* 阳光光斑：白天洒进室内，夜晚消失 */
}


function toggleLamp() {
  lampOn = !lampOn;
  if (lampLight) lampLight.intensity = lampOn ? 2.2 : 0;
  var shade = lampMesh ? lampMesh.children[2] : null;
  if (shade && shade.material) shade.material.emissiveIntensity = lampOn ? 2.4 : 0.9;
  var btn = document.getElementById('lampToggle');
  if (btn) btn.textContent = lampOn ? '台灯 已开' : '台灯 关闭';
}


function bindSkyControls() {
  var sl = document.getElementById('skySlider');
  if (sl) sl.addEventListener('input', function () {
    timeOfDay = parseFloat(sl.value); updateSky(timeOfDay);
  });
  document.querySelectorAll('.room__sky-btn[data-t]').forEach(function (b) {
    b.addEventListener('click', function () {
      timeOfDay = parseFloat(b.getAttribute('data-t'));
      if (sl) sl.value = timeOfDay;
      updateSky(timeOfDay);
    });
  });
  var auto = document.getElementById('skyAuto');
  if (auto) auto.addEventListener('change', function () { skyAuto = auto.checked; });
  var lamp = document.getElementById('lampToggle');
  if (lamp) lamp.addEventListener('click', toggleLamp);
}

/* iMac 桌面贴图：Y2K 渐变 + 简历/游戏/项目三图标 */
