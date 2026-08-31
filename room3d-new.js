    /* ===== 12. 3D 房间（全新重建：完整封闭房间 · 参考雪原布局 · Y2K 治愈风 · 不穿模） ===== */
    (function room3d() {
      var overlay = document.getElementById('roomOverlay');
      var stage = document.getElementById('roomStage3d');
      var house = document.getElementById('heroHouse');
      var closeBtn = document.getElementById('roomClose');
      if (!overlay || !stage) return;

      var renderer, scene, camera, controls, raycaster, mouse;
      var interactives = [];
      var inited = false;
      var skyMesh, sunMesh, moonMesh, starGroup, lampLight, lampMesh, lampOn = false;
      var sunLight;
      var catGroup, catTail, catHover = false, camAnim = null, sunspot = null, camAnimOnDone = null;
      var timeOfDay = 14;
      var _todM = (window.location.search || '').match(/tod=(\d+(?:\.\d+)?)/);
      if (_todM) timeOfDay = parseFloat(_todM[1]);
      var skyAuto = false;
      var _texCache = {};

      /* ===== 新作品登记：《奥德赛》主题卡牌游戏 UI 系统（作品展示墙新增） ===== */
      if (typeof workDetails !== 'undefined') {
        workDetails['odyssey'] = {
          cat: 'UI · 游戏设计',
          title: '奥德赛 · 英雄之旅',
          cover: 'images/odyssey-01-title.jpg',
          desc: '「奥德赛 · 英雄之旅」是一款以古希腊史诗为背景的卡牌对战游戏 UI 系统。整套界面采用手绘卡通风格：粗犷的黑色描边、鲜艳的撞色搭配与木质描边相框，让厚重的神话题材兼具活泼与史诗感。从奥德修斯扬帆起航的初始界面，到公羊冲锋的史诗战场，再到胜利结算与宝箱奖励，四个核心界面完整覆盖了「出战 → 对局 → 结算 → 领奖」的游戏闭环。公羊、战船、长矛、希腊众神等主题元素贯穿始终，配合金币宝石资源体系与希腊回纹装饰，形成了高度统一的视觉语言。',
          list: [
            '初始界面：奥德修斯航海冒险场景，游戏标题 + START 入口 + 金币宝石资源显示',
            '战斗界面：双方卡牌对局、战力统计、回合控制与暂停，公羊冲锋的史诗战场',
            '结算界面：胜利场景，战果卷轴统计（伤害 / 掉落 / 回数 / 用时）+ 成就徽章',
            '奖励界面：宝箱开启场景，金币 / 宝石 / 特殊卡牌的奖励呈现与领取动效'
          ],
          gallery: [
            { src: 'images/odyssey-01-title.jpg', caption: '初始界面 · 奥德修斯航海冒险 + 标题 + START', wide: false },
            { src: 'images/odyssey-02-battle.jpg', caption: '战斗界面 · 双方卡牌对局 + 战力统计', wide: false },
            { src: 'images/odyssey-03-victory.jpg', caption: '结算界面 · 战果统计 + 成就徽章', wide: false },
            { src: 'images/odyssey-04-reward.jpg', caption: '奖励界面 · 宝箱开启 + 金币宝石卡牌', wide: false }
          ]
        };
        if (typeof keychainWorks !== 'undefined' && keychainWorks.indexOf('odyssey') < 0) keychainWorks.unshift('odyssey');
      }

      function tex(src) {
        if (_texCache[src]) return _texCache[src];
        var t = new THREE.TextureLoader().load(src);
        t.encoding = THREE.sRGBEncoding;
        _texCache[src] = t;
        return t;
      }

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

      /* 第一人称运镜：平滑飞向目标位置与视线 */
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

      /* ---------- 点击拾取 → 弹对应面板 / 运镜 ---------- */
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

      /* 橘猫碰触检测：鼠标悬停摇尾巴 */
      window.addEventListener('mousemove', function (e) {
        if (!renderer || !raycaster || !catGroup) return;
        var rect = renderer.domElement.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        var my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
        var hits = raycaster.intersectObjects(catGroup.children, true);
        catHover = hits.length > 0;
      });

      /* 窗外自然景贴图（蓝天 + 白云 + 远山 + 树，随天色联动变色） */
      function drawSkyCanvas() {
        var c = document.createElement('canvas'); c.width = 512; c.height = 512;
        var g = c.getContext('2d');
        var grad = g.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#7fb8f0');
        grad.addColorStop(0.55, '#bcd9f7');
        grad.addColorStop(1, '#eaf4ff');
        g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
        g.fillStyle = 'rgba(255,255,255,0.9)';
        for (var i = 0; i < 5; i++) {
          var x = Math.random() * 512, y = 30 + Math.random() * 150;
          g.beginPath(); g.arc(x, y, 24, 0, 7); g.arc(x + 30, y + 8, 19, 0, 7); g.arc(x - 30, y + 10, 17, 0, 7); g.fill();
        }
        g.fillStyle = '#7c9a68';
        g.beginPath(); g.moveTo(0, 340);
        for (var x = 0; x <= 512; x += 16) { g.lineTo(x, 340 - Math.abs(Math.sin(x / 60)) * 90); }
        g.lineTo(512, 512); g.lineTo(0, 512); g.closePath(); g.fill();
        g.fillStyle = '#5f8452';
        g.beginPath(); g.moveTo(0, 410);
        for (var x = 0; x <= 512; x += 16) { g.lineTo(x, 410 - Math.abs(Math.cos(x / 50)) * 70); }
        g.lineTo(512, 512); g.lineTo(0, 512); g.closePath(); g.fill();
        g.fillStyle = '#4f7a45';
        for (var i = 0; i < 7; i++) {
          var x = Math.random() * 512;
          g.fillRect(x, 380, 6, 70);
          g.beginPath(); g.arc(x + 3, 370, 17, 0, 7); g.fill();
        }
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 圆角盒子（去低多边形方块感，让家具更接近真实造型） */
      function roundedBox(w, h, d, r, seg) {
        var geo = new THREE.BoxGeometry(w, h, d, seg || 6, seg || 6, seg || 6);
        var pos = geo.attributes.position;
        var hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
        for (var i = 0; i < pos.count; i++) {
          var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          var cx = Math.max(-hx, Math.min(hx, x));
          var cy = Math.max(-hy, Math.min(hy, y));
          var cz = Math.max(-hz, Math.min(hz, z));
          var dx = x - cx, dy = y - cy, dz = z - cz;
          var dl = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          var k = r / dl;
          pos.setXYZ(i, cx + dx * k, cy + dy * k, cz + dz * k);
        }
        geo.computeVertexNormals();
        return geo;
      }

      /* 原木地板纹理（写实木纹：暖木渐变 + 细腻条纹 + 木节 + 板缝） */
      var _woodCanvas = null;
      function drawWoodCanvas() {
        var c = document.createElement('canvas'); c.width = 512; c.height = 512;
        var g = c.getContext('2d');
        var base = g.createLinearGradient(0, 0, 0, 512);
        base.addColorStop(0, '#e2c9a3'); base.addColorStop(0.5, '#d4b58a'); base.addColorStop(1, '#c9a77a');
        g.fillStyle = base; g.fillRect(0, 0, 512, 512);
        /* 木纹沟槽：加深 + 更细密，让颜色纹理有清晰层次（配合法线贴图显立体） */
        for (var i = 0; i < 160; i++) {
          var y = Math.random() * 512;
          g.fillStyle = 'rgba(150,105,60,' + (0.05 + Math.random() * 0.16) + ')';
          g.fillRect(0, y, 512, 1 + Math.random() * 3);
        }
        /* 木孔噪点：细密小点增强表面颗粒感 */
        for (var p = 0; p < 900; p++) {
          g.fillStyle = 'rgba(120,84,48,' + (0.05 + Math.random() * 0.12) + ')';
          g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random(), 1 + Math.random());
        }
        for (var k = 0; k < 6; k++) {
          var kx = Math.random() * 512, ky = Math.random() * 512;
          g.fillStyle = 'rgba(120,82,45,0.25)';
          g.beginPath(); g.ellipse(kx, ky, 8 + Math.random() * 10, 4 + Math.random() * 5, 0, 0, 7); g.fill();
          g.fillStyle = 'rgba(90,62,32,0.2)';
          g.beginPath(); g.ellipse(kx, ky, 4 + Math.random() * 5, 2 + Math.random() * 3, 0, 0, 7); g.fill();
        }
        for (var x = 0; x < 512; x += 128) {
          g.fillStyle = 'rgba(110,78,48,0.45)'; g.fillRect(x, 0, 3, 512);
          g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x + 3, 0, 2, 512);
        }
        _woodCanvas = c;
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(2, 1);
        return t;
      }

      var _wallCanvas = null;
      /* 微水泥墙面纹理（细腻颗粒噪点，哑光真实质感） */
      function drawWallCanvas() {
        var c = document.createElement('canvas'); c.width = 256; c.height = 256;
        var g = c.getContext('2d');
        g.fillStyle = '#e6ddd0'; g.fillRect(0, 0, 256, 256);
        for (var i = 0; i < 4200; i++) {
          g.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.06) + ')';
          g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
          g.fillStyle = 'rgba(132,112,84,' + (Math.random() * 0.06) + ')';
          g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
        }
        _wallCanvas = c;
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(4, 3);
        return t;
      }

      /* 从高度图（canvas 亮度）生成法线贴图（Sobel 算子）——材质的立体感来源
         降采样到 256 保证低端环境（软件渲染）也流畅，法线高频细节足够 */
      function normalFromCanvas(srcCanvas, strength) {
        var sw = Math.min(srcCanvas.width, 256), sh = Math.min(srcCanvas.height, 256);
        var sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
        var sg = sc.getContext('2d'); sg.drawImage(srcCanvas, 0, 0, sw, sh);
        var d = sg.getImageData(0, 0, sw, sh).data;
        var n = document.createElement('canvas'); n.width = sw; n.height = sh;
        var ng = n.getContext('2d');
        var out = ng.createImageData(sw, sh);
        var s = strength || 2;
        function idx(x, y) {
          if (x < 0) x = 0; else if (x >= sw) x = sw - 1;
          if (y < 0) y = 0; else if (y >= sh) y = sh - 1;
          return (y * sw + x) * 4;
        }
        function lum(i) { return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; }
        for (var y = 0; y < sh; y++) {
          var yw = y * sw;
          for (var x = 0; x < sw; x++) {
            var i = (yw + x) * 4;
            var tl = lum(idx(x - 1, y - 1)), t = lum(idx(x, y - 1)), tr = lum(idx(x + 1, y - 1));
            var ml = lum(idx(x - 1, y)), mr = lum(idx(x + 1, y));
            var bl = lum(idx(x - 1, y + 1)), b = lum(idx(x, y + 1)), br = lum(idx(x + 1, y + 1));
            var dx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
            var dy = (bl + 2 * b + br) - (tl + 2 * t + tr);
            var nx = -dx * s / 255, ny = -dy * s / 255, nz = 1;
            var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            out.data[i] = (nx / len * 0.5 + 0.5) * 255;
            out.data[i + 1] = (ny / len * 0.5 + 0.5) * 255;
            out.data[i + 2] = (nz / len * 0.5 + 0.5) * 255;
            out.data[i + 3] = 255;
          }
        }
        ng.putImageData(out, 0, 0);
        var nt = new THREE.CanvasTexture(n);   /* 法线贴图：不设 sRGB，保持线性数据 */
        nt.wrapS = nt.wrapT = THREE.RepeatWrapping;
        return nt;
      }

      /* 缓存木纹法线（与木纹纹理同源，沟槽/节疤/木孔有起伏） */
      var _woodNorm = null;
      function woodNormal() {
        if (_woodNorm) return _woodNorm;
        if (!_woodCanvas) { try { woodTexture(); } catch (e) {} }
        _woodNorm = normalFromCanvas(_woodCanvas, 2.4);
        _woodNorm.repeat.set(2, 1);
        return _woodNorm;
      }
      /* 缓存墙面法线（微水泥颗粒） */
      var _wallNorm = null;
      function wallNormal() {
        if (_wallNorm) return _wallNorm;
        if (!_wallCanvas) drawWallCanvas();
        _wallNorm = normalFromCanvas(_wallCanvas, 1.6);
        _wallNorm.repeat.set(4, 3);
        return _wallNorm;
      }

      /* 缓存木纹纹理（家具与地板共用，Blender 质感暖木） */
      var _woodTex = null;
      function woodTexture() {
        if (!_woodTex) _woodTex = drawWoodCanvas();
        return _woodTex;
      }

      /* ---------- 完整封闭房间（第一人称身处室内：原木地板 + 奶油微水泥墙 + 天花板，不穿模） ---------- */
      function buildRoom() {
        var floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8.5), new THREE.MeshStandardMaterial({ map: drawWoodCanvas(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.72 }));
        floor.position.set(0, -0.1, -0.25); scene.add(floor);
        var ceil = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 8.5), new THREE.MeshStandardMaterial({ color: 0xdfe0e2, roughness: 0.9 }));
        ceil.position.set(0, 4.3, -0.25); scene.add(ceil);
        var wallMat = new THREE.MeshStandardMaterial({ map: drawWallCanvas(), normalMap: wallNormal(), color: 0xffffff, roughness: 0.92 });
        var left = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 8.5), wallMat);
        left.position.set(-6, 2.2, -0.25); scene.add(left);
        var right = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.4, 8.5), wallMat);
        right.position.set(6, 2.2, -0.25); scene.add(right);
        var backL = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.4, 0.2), wallMat);
        backL.position.set(-3.4, 2.2, -4.5); scene.add(backL);
        var backR = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.4, 0.2), wallMat);
        backR.position.set(3.4, 2.2, -4.5); scene.add(backR);
        var winTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.0, 0.2), wallMat);
        winTop.position.set(0, 3.7, -4.5); scene.add(winTop);
        var winBot = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 0.2), wallMat);
        winBot.position.set(0, 0.45, -4.5); scene.add(winBot);

        buildRug();
        buildDesk();
        buildChair();
        buildPegboard();
        buildPhotos();
        buildShelf();
        buildSofa();
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
      function drawRugCanvas() {
        var c = document.createElement('canvas'); c.width = 256; c.height = 256;
        var g = c.getContext('2d');
        g.fillStyle = '#f2ead8'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
        g.strokeStyle = '#c98a5a'; g.lineWidth = 16; g.beginPath(); g.arc(128, 128, 108, 0, 7); g.stroke();
        g.strokeStyle = '#8fa08a'; g.lineWidth = 7; g.beginPath(); g.arc(128, 128, 94, 0, 7); g.stroke();
        g.fillStyle = 'rgba(201,138,90,0.35)';
        for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; g.beginPath(); g.arc(128 + Math.cos(a) * 70, 128 + Math.sin(a) * 70, 6, 0, 7); g.fill(); }
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }
      function buildRug() {
        var m = new THREE.Mesh(new THREE.CircleGeometry(1.7, 56), new THREE.MeshStandardMaterial({ map: drawRugCanvas(), roughness: 0.92 }));
        m.rotation.x = -Math.PI / 2; m.position.set(0, 0.03, -1.6); scene.add(m);
      }

      /* 靠后墙胡桃木大书桌（Blender 质感：深暖木圆角桌面 + 木质桌腿，屏幕朝观众） */
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
        var screen = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.07), new THREE.MeshStandardMaterial({ color: 0xd8dde6, roughness: 0.3, metalness: 0.35 }));
        screen.position.set(-0.9, 1.7, 0.1); g.add(screen);
        var bezel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.03), new THREE.MeshStandardMaterial({ color: 0x23262e, roughness: 0.4 }));
        bezel.position.set(-0.9, 1.7, 0.132); g.add(bezel);
        var panel = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.87), new THREE.MeshBasicMaterial({ map: drawDesktopCanvas() }));
        panel.position.set(-0.9, 1.7, 0.14); g.add(panel);
        var stand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.5, 0.14), new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.5, roughness: 0.4 }));
        stand.position.set(-0.9, 0.98, 0.08); g.add(stand);
        var base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.3), new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.5, roughness: 0.4 }));
        base.position.set(-0.9, 0.84, 0.08); g.add(base);
        /* 笔记本（桌面偏右，屏幕朝观众） */
        var nbBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: 0x3a4152, metalness: 0.4, roughness: 0.5 }));
        nbBase.position.set(0.95, 1.0, -0.1); g.add(nbBase);
        var nbScr = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.58, 0.04), new THREE.MeshStandardMaterial({ color: 0x4a5366, roughness: 0.6 }));
        nbScr.position.set(0.95, 1.3, -0.08); nbScr.rotation.x = -0.4; g.add(nbScr);
        var nbGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.5), new THREE.MeshBasicMaterial({ color: 0x7c8ac0 }));
        nbGlow.position.set(0.95, 1.3, -0.058); nbGlow.rotation.x = -0.4; g.add(nbGlow);
        /* 键盘（显示器前） */
        var kb = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.26), new THREE.MeshStandardMaterial({ color: 0xe8ecf3, roughness: 0.6 }));
        kb.position.set(-0.9, 0.94, 0.48); g.add(kb);
        /* 电话（桌面中左） */
        var phoneB = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.2), new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.5 }));
        phoneB.position.set(-0.05, 0.97, 0.42); g.add(phoneB);
        var phoneR = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: 0x9aa3b5, roughness: 0.5 }));
        phoneR.position.set(-0.05, 1.05, 0.44); phoneR.rotation.x = 0.3; g.add(phoneR);
        /* 茶具（桌面中右） */
        var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xffe3b8, roughness: 0.4 }));
        cup.position.set(0.45, 1.0, 0.45); g.add(cup);
        var saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.03, 16), new THREE.MeshStandardMaterial({ color: 0xfff2dc, roughness: 0.5 }));
        saucer.position.set(0.45, 0.95, 0.45); g.add(saucer);
        /* 彩色书本（桌面左后，色彩点缀） */
        var book1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.24), new THREE.MeshStandardMaterial({ color: 0xc95d33, roughness: 0.6 }));
        book1.position.set(0.35, 0.99, -0.28); g.add(book1);
        var book2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.17, 0.22), new THREE.MeshStandardMaterial({ color: 0x7aa8d8, roughness: 0.6 }));
        book2.position.set(0.2, 0.97, -0.27); book2.rotation.y = 0.25; g.add(book2);
        var book3 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0x8fa98f, roughness: 0.6 }));
        book3.position.set(0.32, 0.96, -0.38); book3.rotation.y = -0.15; g.add(book3);
        /* 小盆栽（桌面中左，绿色点缀） */
        var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.11, 10), new THREE.MeshStandardMaterial({ color: 0xb98a5e, roughness: 0.6 }));
        pot.position.set(-0.05, 0.94, -0.35); g.add(pot);
        var leafM = new THREE.MeshStandardMaterial({ color: 0x6f8f60, roughness: 0.8 });
        for (var li = 0; li < 4; li++) {
          var lf = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), leafM);
          lf.position.set(-0.05 + Math.cos(li * 1.7) * 0.05, 1.02 + Math.abs(Math.sin(li * 1.3)) * 0.04, -0.35 + Math.sin(li * 1.7) * 0.05);
          g.add(lf);
        }
        /* 主机（桌下地面右侧） */
        var tower = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.42), new THREE.MeshStandardMaterial({ color: 0xdfe3ec, metalness: 0.3, roughness: 0.5 }));
        tower.position.set(1.3, 0.35, 0.35); g.add(tower);
        var towerGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.08), new THREE.MeshBasicMaterial({ color: 0x7ad9b8 }));
        towerGlow.position.set(1.3, 0.42, 0.563); g.add(towerGlow);
        g.position.set(-0.8, 0.14, -3.6);
        g.userData.type = 'computer';
        scene.add(g);
        interactives.push({ mesh: g, type: 'computer' });
      }

      /* 桌前办公椅（复刻雪原：红色低多边形办公椅） */
      function buildChair() {
        var chair = new THREE.Group();
        var seat = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.16, 24), new THREE.MeshStandardMaterial({ color: 0xc0522d, roughness: 0.5 }));
        seat.position.y = 0.5; chair.add(seat);
        var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0x8a8f98, metalness: 0.5, roughness: 0.4 }));
        pole.position.y = 0.25; chair.add(pole);
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.05, 12), new THREE.MeshStandardMaterial({ color: 0x8a8f98, metalness: 0.5, roughness: 0.4 }));
        base.position.y = 0.03; chair.add(base);
        var backr = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.5, 6, 12), new THREE.MeshStandardMaterial({ color: 0xc0522d, roughness: 0.5 }));
        backr.position.set(0, 0.85, -0.28); backr.rotation.x = 0.25; chair.add(backr);
        chair.position.set(-0.8, 0.14, -2.2); chair.rotation.y = 0.35;
        scene.add(chair);
      }

      /* 左墙黑色钉板贴图（复刻雪原：文档+红图钉+海报+便签） */
      /* 洞洞板贴图：黑色板 + 规则圆孔阵列（洞洞质感） */
      function drawHoleboardCanvas() {
        var c = document.createElement('canvas'); c.width = 512; c.height = 512;
        var g = c.getContext('2d');
        g.fillStyle = '#2a2a2a'; g.fillRect(0, 0, 512, 512);
        g.fillStyle = '#141414';
        for (var y = 30; y < 510; y += 36) { for (var x = 30; x < 510; x += 36) { g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); } }
        g.fillStyle = 'rgba(255,255,255,0.05)';
        for (var y = 30; y < 510; y += 36) { for (var x = 30; x < 510; x += 36) { g.beginPath(); g.arc(x + 2, y + 2, 8, 0, 7); g.fill(); } }
        var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
      }

      /* 洞洞板（窗右侧后墙，上半个墙）：黑色带孔洞板 + 小钥匙扣作品集，可点击放大 */
      function buildPegboard() {
        var g = new THREE.Group();
        var board = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 0.12), new THREE.MeshStandardMaterial({ map: drawHoleboardCanvas(), roughness: 0.85 }));
        board.position.set(0, 1.0, 0); g.add(board);
        var ringMat = new THREE.MeshStandardMaterial({ color: 0xd8b64a, metalness: 0.8, roughness: 0.3 });
        var lineMat = new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.6, roughness: 0.4 });
        var keys = keychainWorks.slice(0, 9);
        keys.forEach(function (key, idx) {
          var d = workDetails[key];
          if (!d || !d.cover) return;
          var col = idx % 3, row = Math.floor(idx / 3);
          var px = (col - 1) * 0.68, py = 1.46 - row * 0.62;
          var img = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.38), new THREE.MeshBasicMaterial({ map: tex(d.cover) }));
          img.position.set(px, py, 0.08); g.add(img);
          var ring = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 16), ringMat);
          ring.position.set(px, py + 0.24, 0.09); g.add(ring);
          var line = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.07, 6), lineMat);
          line.position.set(px, py + 0.15, 0.09); g.add(line);
        });
        g.position.set(3.5, 1.5, -4.42);
        g.userData.type = 'wall';
        scene.add(g);
        interactives.push({ mesh: g, type: 'wall' });
      }

      /* 右墙照片墙（更高位置，圆/方异形彩色相框混搭，可点击放大） */
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
            var frame = new THREE.Mesh(new THREE.CircleGeometry(0.29, 28), new THREE.MeshStandardMaterial({ color: st.color, roughness: 0.4, side: THREE.DoubleSide }));
            frame.position.set(px, py, 0.04); g.add(frame);
            var img = new THREE.Mesh(new THREE.CircleGeometry(0.24, 28), new THREE.MeshBasicMaterial({ map: tex(shots[i]), side: THREE.DoubleSide }));
            img.position.set(px, py, 0.055); g.add(img);
          } else {
            var frame = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.64), new THREE.MeshStandardMaterial({ color: st.color, roughness: 0.4, side: THREE.DoubleSide }));
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
      function buildTrophy() {
        var g = new THREE.Group();
        var shelf = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 1.5), new THREE.MeshStandardMaterial({ color: 0x8a5a35, roughness: 0.6 }));
        shelf.position.y = 0.04; g.add(shelf);
        var troMat = new THREE.MeshStandardMaterial({ color: 0xf7d27a, metalness: 0.75, roughness: 0.25 });
        var cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.22, 20), troMat);
        cup.position.set(0, 0.3, 0); g.add(cup);
        var ear = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), troMat);
        ear.position.set(-0.13, 0.34, 0); g.add(ear);
        var ear2 = ear.clone(); ear2.position.x = 0.13; g.add(ear2);
        var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12), troMat);
        stem.position.set(0, 0.17, 0); g.add(stem);
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.05, 16), troMat);
        base.position.set(0, 0.09, 0); g.add(base);
        var topBall = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), troMat);
        topBall.position.set(0, 0.43, 0); g.add(topBall);
        g.position.set(5.0, 2.35, -1.7); g.rotation.y = -Math.PI / 2;
        scene.add(g);
      }

      /* 右墙角大型绿植（复刻雪原：龟背竹大叶，低多边形） */
      function buildPlant() {
        var g = new THREE.Group();
        var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.6, 20), new THREE.MeshStandardMaterial({ color: 0xb98a5e, roughness: 0.6 }));
        pot.position.y = 0.3; g.add(pot);
        var leafMat = new THREE.MeshStandardMaterial({ color: 0x6f8f60, roughness: 0.8, side: THREE.DoubleSide });
        for (var i = 0; i < 7; i++) {
          var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 1.15, 6), leafMat);
          stem.position.set(Math.cos(i * 1.05) * 0.2, 0.9 + i * 0.04, Math.sin(i * 1.05) * 0.2);
          stem.rotation.z = Math.cos(i * 1.05) * 0.32;
          g.add(stem);
          var leaf = new THREE.Mesh(new THREE.CircleGeometry(0.3, 14), leafMat);
          leaf.position.set(Math.cos(i * 1.05) * 0.48, 1.2 + i * 0.07, Math.sin(i * 1.05) * 0.48);
          leaf.rotation.z = 0.4;
          leaf.scale.set(1, 1.5, 1);
          g.add(leaf);
        }
        g.position.set(5.3, 0.14, -3.6);
        g.userData.type = 'plant';
        scene.add(g);
        interactives.push({ mesh: g, type: 'plant' });
      }

      /* 后墙书架（Blender 质感：浅暖木圆角，底部贴地面，多层搁板摆满书） */
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
        g.position.set(-5.0, 0.02, -4.15); g.rotation.y = 0;   /* 移除左墙后书架贴后墙左侧 */
        g.userData.type = 'shelf';
        scene.add(g);
      }

      /* 右墙照片墙下贴墙长沙发（复古皮沙发：深棕皮 + 木腿 + 彩色抱枕） */
      function buildSofa() {
        var g = new THREE.Group();
        var sof = new THREE.MeshStandardMaterial({ color: 0x8fa8c8, roughness: 0.5 });   /* 雾蓝布艺（与陶土橙形成冷暖对比） */
        var dark = new THREE.MeshStandardMaterial({ color: 0x7e9cbe, roughness: 0.55 });
        var base = new THREE.Mesh(roundedBox(3.0, 0.42, 0.85, 0.12, 5), sof); base.position.y = 0.21; g.add(base);
        var back = new THREE.Mesh(roundedBox(3.0, 0.75, 0.24, 0.1, 5), sof); back.position.set(0, 0.7, -0.32); g.add(back);
        var pad = new THREE.Mesh(roundedBox(2.9, 0.1, 0.76, 0.05, 5), dark); pad.position.set(0, 0.45, 0.02); g.add(pad);
        var armL = new THREE.Mesh(roundedBox(0.2, 0.55, 0.9, 0.07, 5), sof); armL.position.set(-1.42, 0.33, 0); g.add(armL);
        var armR = armL.clone(); armR.position.x = 1.42; g.add(armR);
        /* 彩色抱枕（橙/雾蓝/浅粉/黄绿四色），为深色沙发增加丰富色彩 */
        var pill = [ { c: 0xc95d33, p: [-0.95, 0.52, 0.05] }, { c: 0xe0b0a0, p: [0.95, 0.52, 0.05] }, { c: 0xd98a5a, p: [-0.55, 0.5, -0.12] }, { c: 0x9aaa83, p: [0.55, 0.5, -0.12] } ];
        pill.forEach(function (q) {
          var pp = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 14), new THREE.MeshStandardMaterial({ color: q.c, roughness: 0.75 }));
          pp.scale.set(1.35, 0.85, 0.5); pp.position.set(q.p[0], q.p[1], q.p[2]); pp.rotation.x = 0.3; g.add(pp);
        });
        var legMat = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xffffff, roughness: 0.6 });
        [[-1.3, -0.3], [1.3, -0.3], [-1.3, 0.3], [1.3, 0.3]].forEach(function (p) {
          var l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 10), legMat);
          l.position.set(p[0], 0.11, p[1]); g.add(l);
        });
        g.position.set(5.5, 0.02, -1.9); g.rotation.y = -Math.PI / 2;
        scene.add(g);
      }

      /* 沙发前圆形矮桌（深木纹桌面 + 木质支柱底座） */
      function buildCoffeeTable() {
        var g = new THREE.Group();
        var woodM = new THREE.MeshStandardMaterial({ map: woodTexture(), normalMap: woodNormal(), color: 0xa97c4f, roughness: 0.55 });
        var top = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.07, 28), woodM);
        top.position.y = 0.42; g.add(top);
        var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.4, 14), woodM);
        leg.position.y = 0.2; g.add(leg);
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.05, 18), woodM);
        base.position.y = 0.025; g.add(base);
        g.position.set(4.3, 0.02, -1.9);
        scene.add(g);
      }

      /* 洞洞板下方地板蜷缩的橘猫（鼠标碰触摇尾巴） */
      /* 洞洞板下方地板趴着的金毛犬（大型犬，脸朝向观众，鼠标碰触摇尾巴） */
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
      function buildBearPlush() {
        var btex = tex('images/bear-dog-cutout.png');
        var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: btex, transparent: true, depthWrite: false }));
        sp.scale.set(0.92, 1.15, 1);
        sp.position.set(2.5, 0.58, -2.9);
        sp.userData.type = 'bear';
        scene.add(sp);
        interactives.push({ mesh: sp, type: 'bear' });
        var sh = new THREE.Mesh(new THREE.CircleGeometry(0.5, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false }));
        sh.rotation.x = -Math.PI / 2; sh.position.set(2.5, 0.02, -2.9); scene.add(sh);
      }

      /* 金毛趴在泰迪熊身边睡觉（面向观众，能看清狗脸：闭眼/垂耳/粉腮红，鲜明金黄） */
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
      function buildSunspot() {
        var c = document.createElement('canvas'); c.width = 256; c.height = 256;
        var g = c.getContext('2d');
        var rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        rg.addColorStop(0, 'rgba(255,244,196,0.8)');
        rg.addColorStop(0.6, 'rgba(255,238,180,0.4)');
        rg.addColorStop(1, 'rgba(255,238,180,0)');
        g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
        var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
        sunspot = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false }));
        sunspot.rotation.x = -Math.PI / 2;
        sunspot.position.set(0, 0.08, -2.6);
        scene.add(sunspot);
      }

      /* 后墙书桌后方落地窗（窗外自然景），田字窗框 + 两侧窗帘 + 顶部帘杆 */
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
        /* 窗帘：墨绿布帘（为房间增加饱和色彩层次） */
        var curMat = new THREE.MeshStandardMaterial({ color: 0x8fa08a, roughness: 0.92 });
        var curL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.3, 0.07), curMat); curL.position.set(-2.15, 1.66, 0.05); g.add(curL);
        var curR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.3, 0.07), curMat); curR.position.set(2.15, 1.66, 0.05); g.add(curR);
        var curTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.28, 0.07), curMat); curTop.position.set(0, 3.32, 0.05); g.add(curTop);
        var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 4.0, 12), new THREE.MeshStandardMaterial({ color: 0x6b5543, roughness: 0.6 }));
        rod.rotation.z = Math.PI / 2; rod.position.set(0, 3.4, -0.06); g.add(rod);
        g.position.set(0, 0.14, -4.45);
        scene.add(g);
      }

      /* 卡通 AI 形象：真正坐在桌前椅上（底部贴椅面，不悬空），点击弹出个人介绍 */
      function buildAvatar3D() {
        var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('images/avatar-3d-sit.png'), transparent: true, depthWrite: false, alphaTest: 0.05 }));
        sp.scale.set(1.0, 1.66, 1);
        sp.position.set(-0.8, 1.42, -1.78);
        sp.userData.type = 'avatar';
        scene.add(sp);
        interactives.push({ mesh: sp, type: 'avatar' });
      }

      /* 窗外弯月贴图（月牙形状） */
      function drawMoonCanvas() {
        var c = document.createElement('canvas'); c.width = 128; c.height = 128;
        var g = c.getContext('2d');
        g.fillStyle = '#fff6e0';
        g.beginPath(); g.arc(60, 64, 50, 0, 7); g.fill();
        g.globalCompositeOperation = 'destination-out';
        g.beginPath(); g.arc(80, 52, 44, 0, 7); g.fill();
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 窗外天空：自然景板 + 太阳 + 弯月 + 星海光点（与进入前的户外天空前后呼应） */
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
      function drawStarCanvas() {
        var c = document.createElement('canvas'); c.width = 64; c.height = 64;
        var g = c.getContext('2d');
        var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        rg.addColorStop(0, 'rgba(255,255,255,1)');
        rg.addColorStop(0.35, 'rgba(255,255,255,0.75)');
        rg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 高落地灯（复古黄铜，可开关，靠左墙、离桌较远、比电脑高，灯罩高位） */
      function buildLamp() {
        lampMesh = new THREE.Group();
        var brass = new THREE.MeshStandardMaterial({ color: 0xc9974f, metalness: 0.6, roughness: 0.35 });
        var base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.08, 20), brass);
        base.position.y = 0.04; lampMesh.add(base);
        var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.9, 12), brass);
        pole.position.y = 1.05; lampMesh.add(pole);
        var shade = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xffd3a3, roughness: 0.4, emissive: 0xffc983, emissiveIntensity: 0.9 }));
        shade.position.y = 2.05; lampMesh.add(shade);
        var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfff3d6, transparent: true, opacity: 0.25 }));
        bulb.position.y = 2.02; lampMesh.add(bulb);
        lampMesh.position.set(-3.2, 0.02, -2.8);
        lampMesh.userData.type = 'lamp';
        scene.add(lampMesh);
        interactives.push({ mesh: lampMesh, type: 'lamp' });
        lampLight = new THREE.PointLight(0xffc983, 0, 9);
        lampLight.position.set(-3.2, 2.1, -2.8);
        scene.add(lampLight);
      }

      /* 时间 → 窗外天色 + 室内光照联动 */
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
      function drawDesktopCanvas() {
        var c = document.createElement('canvas'); c.width = 1024; c.height = 640;
        var g = c.getContext('2d');
        var grd = g.createLinearGradient(0, 0, 1024, 640);
        grd.addColorStop(0, '#eaf4ff'); grd.addColorStop(0.5, '#e8dcff'); grd.addColorStop(1, '#e0f6ec');
        g.fillStyle = grd; g.fillRect(0, 0, 1024, 640);
        g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.arc(840, 120, 120, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.arc(160, 500, 160, 0, 7); g.fill();
        g.fillStyle = 'rgba(122,82,112,0.9)';
        g.font = '600 32px "PingFang SC", "Microsoft YaHei", sans-serif';
        g.textAlign = 'center';
        g.fillText('黄佩嘉的 iMac', 512, 62);
        var icons = [
          { x: 300, label: '简历', sub: '个人介绍', color: '#ff8fbd', type: 'doc' },
          { x: 512, label: '游戏', sub: '贪吃蛇', color: '#7ab8ff', type: 'game' },
          { x: 724, label: '项目', sub: '含钥匙扣作品集', color: '#bfe8d4', type: 'folder' }
        ];
        icons.forEach(function (ic) {
          if (ic.type === 'doc') {
            g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(ic.x - 40, 200, 80, 92, 12); g.fill();
            g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 26, 212, 52, 40, 8); g.fill();
            g.fillStyle = '#ffffff'; g.fillRect(ic.x - 18, 222, 36, 4); g.fillRect(ic.x - 18, 230, 36, 4); g.fillRect(ic.x - 18, 238, 22, 4);
            g.fillStyle = '#ececec'; g.beginPath(); g.moveTo(ic.x + 40, 200); g.lineTo(ic.x + 18, 200); g.lineTo(ic.x + 40, 222); g.closePath(); g.fill();
          } else if (ic.type === 'game') {
            g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(ic.x - 40, 200, 80, 92, 12); g.fill();
            g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 30, 220, 60, 44, 12); g.fill();
            g.fillStyle = '#ffffff';
            g.beginPath(); g.arc(ic.x - 12, 242, 5, 0, 7); g.fill();
            g.beginPath(); g.arc(ic.x + 12, 242, 5, 0, 7); g.fill();
            g.fillRect(ic.x - 3, 231, 6, 12); g.fillRect(ic.x - 9, 237, 12, 6);
          } else {
            g.fillStyle = ic.color; g.beginPath(); g.roundRect(ic.x - 40, 204, 80, 88, 10); g.fill();
            g.fillStyle = 'rgba(255,255,255,0.55)';
            g.beginPath(); g.moveTo(ic.x - 40, 204); g.lineTo(ic.x - 20, 204); g.lineTo(ic.x - 12, 222); g.lineTo(ic.x - 40, 222); g.closePath(); g.fill();
          }
          g.fillStyle = '#7a5270';
          g.font = '600 26px "PingFang SC", sans-serif';
          g.fillText(ic.label, ic.x, 340);
          g.font = '14px sans-serif';
          g.fillStyle = 'rgba(122,82,112,0.6)';
          g.fillText(ic.sub, ic.x, 360);
        });
        var t = new THREE.CanvasTexture(c);
        t.encoding = THREE.sRGBEncoding;
        return t;
      }

      /* 电脑第一视角桌面：点 iMac → 全屏桌面（简历/游戏/项目） */
      function openComputerScreen() {
        var cs = document.getElementById('computerScreen');
        if (!cs) return;
        cs.classList.add('is-open');
        cs.setAttribute('aria-hidden', 'false');
      }
      function closeComputerScreen() {
        var cs = document.getElementById('computerScreen');
        if (!cs) return;
        cs.classList.remove('is-open');
        cs.setAttribute('aria-hidden', 'true');
      }
      function bindComputerIcons() {
        var cs = document.getElementById('computerScreen');
        if (!cs) return;
        cs.querySelectorAll('[data-target]').forEach(function (ic) {
          ic.addEventListener('click', function () {
            var target = ic.getAttribute('data-target');
            if (target === 'resume' && window.openPerson) window.openPerson();
            else if (target === 'game' && window.openGame) window.openGame();
            else if (target === 'project' && window.openWall) window.openWall();
          });
        });
        var closeBtn2 = document.getElementById('computerClose');
        if (closeBtn2) closeBtn2.addEventListener('click', closeComputerScreen);
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && cs.classList.contains('is-open')) {
            closeComputerScreen();
            e.stopImmediatePropagation();
          }
        }, true);
      }

      /* 物品信息浮窗（狗 / 绿植 / 奖杯） */
      var ITEM_INFO = {
        dog: { title: '我的金毛 · 睡午觉', body: '它趴在泰迪熊身边睡得正香，脑袋枕着熊的脚掌，耳朵耷拉着，是家里最治愈的小管家。' },
        bear: { title: '泰迪熊玩偶', body: '靠在墙边的浅棕色泰迪熊，是我的童年伙伴，也是金毛最好的靠枕。' },
        plant: { title: '我的绿植', body: '角落的绿植给房间添了生机——创作要像植物一样，向下扎根、向上生长。' },
        shelf: { title: '我的小书架', body: '多层书架摆满了我爱看的书——灵感都藏在这些书页里。' }
      };
      function openItemInfo(key) {
        var info = document.getElementById('itemInfo');
        if (!info) return;
        var d = ITEM_INFO[key] || { title: key, body: '' };
        var t = document.getElementById('itemInfoTitle'); if (t) t.textContent = d.title;
        var b = document.getElementById('itemInfoBody'); if (b) b.textContent = d.body;
        info.classList.add('is-open');
        info.setAttribute('aria-hidden', 'false');
      }
      function closeItemInfo() {
        var info = document.getElementById('itemInfo');
        if (!info) return;
        info.classList.remove('is-open');
        info.setAttribute('aria-hidden', 'true');
      }
      (function bindItemInfo() {
        var info = document.getElementById('itemInfo');
        if (!info) return;
        var cb = document.getElementById('itemInfoClose');
        if (cb) cb.addEventListener('click', closeItemInfo);
        info.addEventListener('click', function (e) {
          if (e.target === info) closeItemInfo();
        });
      })();

      /* ---------- 进入 / 退出房间（点击 Hero 房子进入，首次点击懒初始化 3D） ---------- */
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
      if (house) house.addEventListener('click', function (e) {
        e.preventDefault();
        openRoom();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeRoom);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open') &&
            !document.querySelector('.computer.is-open,.item-info.is-open,.wall.is-open,.photo-zoom.is-open,.game.is-open')) {
          closeRoom();
        }
      });
      window.openRoom = openRoom;
      window.closeRoom = closeRoom;

      /* 调试/直达：URL 带 ?autoclick=1（或 ?room=1）时模拟真实点击房子进入房间（验证点击绑定链路） */
      if (/autoclick=1|room=1/.test(window.location.search || '')) {
        setTimeout(function () {
          var hh = document.getElementById('heroHouse');
          if (hh && hh.dispatchEvent) {
            hh.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          } else if (window.openRoom) {
            window.openRoom();
          }
        }, 900);
      }

      /* 调试自测：URL 带 ?selftest=1 时自动跑完整交互链路，结果写入 document.title（headless 读取验证） */
      if (/selftest=1/.test(window.location.search || '')) {
        var _log = [];
        function _st(n, ok) { _log.push(n + ':' + (ok ? 'OK' : 'FAIL')); document.title = 'SELFTEST_RUNNING ' + _log.join('|'); }
        setTimeout(function () {
          var hh = document.getElementById('heroHouse');
          if (hh) hh.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          setTimeout(function () {
            var ov = document.getElementById('roomOverlay');
            _st('enterRoom', !!ov && ov.classList.contains('is-open'));
            if (window.openComputerScreen) window.openComputerScreen();
            else { openComputerScreen(); }
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
            }, 400);
          }, 700);
        }, 1300);
      }
    })();

