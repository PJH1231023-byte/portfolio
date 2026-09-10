/* =========================================================
   interaction/panels.js — 房间内面板：人物介绍 / 照片墙放大 / 作品墙 / 电脑贪吃蛇
   ========================================================= */
'use strict';
document.addEventListener('DOMContentLoaded', function () {
    /* ===== 12.1 人物介绍面板 ===== */
    var openPerson = (function () {
      var panel = document.getElementById('personPanel');
      if (!panel) return function () {};
      function open() {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
      function close() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      }
      panel.querySelectorAll('[data-person-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      panel.querySelectorAll('.person__tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var key = tab.getAttribute('data-person-tab');
          panel.querySelectorAll('.person__tab').forEach(function (t) {
            t.classList.toggle('is-active', t === tab);
          });
          panel.querySelectorAll('.person__pane').forEach(function (pane) {
            pane.classList.toggle('is-active', pane.getAttribute('data-person-pane') === key);
          });
        });
      });
      window.closePerson = close;
      window.openPerson = open;
      return open;
    })();


    /* ===== 12.1b 照片墙放大面板 ===== */
    var openPhotoWall = (function () {
      var el = document.getElementById('photoWallZoom');
      if (!el) return function () {};
      function open() { el.classList.add('is-open'); document.body.classList.add('room-locked'); }
      function close() { el.classList.remove('is-open'); document.body.classList.remove('room-locked'); }
      var btn = document.getElementById('photoZoomClose');
      if (btn) btn.addEventListener('click', close);
      var back = el.querySelector('.photo-zoom__backdrop');
      if (back) back.addEventListener('click', close);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && el.classList.contains('is-open')) { close(); e.stopImmediatePropagation(); }
      }, true);
      window.closePhotoWall = close;
      window.openPhotoWall = open;
      return open;
    })();


    /* ===== 12.2 作品墙面板 ===== */
    var openWall = (function () {
      var panel = document.getElementById('worksWall');
      var board = document.getElementById('wallBoard');
      if (!panel) return function () {};
      function open() {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
      function close() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      }
      /* 生成作品墙钥匙扣（复用 keychain 结构 + 交互） */
      if (board && keychainWorks) {
        keychainWorks.forEach(function (key) {
          var d = workDetails[key];
          if (!d || !d.cover) return;
          var kc = document.createElement('div');
          kc.className = 'keychain';
          kc.dataset.work = key;
          var pin = document.createElement('span'); pin.className = 'keychain__pin'; kc.appendChild(pin);
          var str = document.createElement('span'); str.className = 'keychain__string'; kc.appendChild(str);
          var ring = document.createElement('span'); ring.className = 'keychain__ring'; kc.appendChild(ring);
          var panelEl = document.createElement('div'); panelEl.className = 'keychain__panel';
          var img = document.createElement('img'); img.src = d.cover; img.alt = d.title; img.loading = 'lazy';
          panelEl.appendChild(img);
          var label = document.createElement('div'); label.className = 'keychain__label';
          var badge = document.createElement('span'); badge.className = 'keychain__badge';
          badge.textContent = (d.cat || '').split('·')[0].trim() || 'WORK';
          label.appendChild(badge);
          var name = document.createElement('p'); name.className = 'keychain__name'; name.textContent = d.title;
          label.appendChild(name);
          panelEl.appendChild(label);
          kc.appendChild(panelEl);
          board.appendChild(kc);
          kc.addEventListener('mouseenter', function () {
            kc.classList.add('is-hovering'); kc.classList.remove('is-swaying');
            void kc.offsetWidth; kc.classList.add('is-swaying');
            setTimeout(function () { kc.classList.remove('is-swaying'); }, 600);
          });
          kc.addEventListener('mouseleave', function () {
            kc.classList.remove('is-hovering');
            kc.style.transform = '';
          });
          kc.addEventListener('click', function () {
            if (workDetails[key]) openModal(key);
          });
        });
      }
      panel.querySelectorAll('[data-wall-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      window.closeWall = close;
      window.openWall = open;
      return open;
    })();


    /* ===== 13. 电脑贪吃蛇小游戏 ===== */
    var openGame = (function () {
      var overlay = document.getElementById('gameOverlay');
      if (!overlay) return function () {};
      var canvas = document.getElementById('gameCanvas');
      var ctx = canvas.getContext('2d');
      var scoreEl = document.getElementById('gameScore');
      var N = 20, cell = canvas.width / N;
      var snake, dir, nextDir, food, score, timer, over;

      function placeFood() {
        do {
          food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
      }
      function reset() {
        snake = [{ x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }];
        dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
        score = 0; over = false;
        if (scoreEl) scoreEl.textContent = '0';
        placeFood();
        draw();
      }
      function step() {
        if (over) return;
        dir = nextDir;
        var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) { over = true; draw(); return; }
        for (var i = 0; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) { over = true; draw(); return; }
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 10; if (scoreEl) scoreEl.textContent = String(score);
          placeFood();
        } else {
          snake.pop();
        }
        draw();
      }
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb') || '165,180,252';
        ctx.strokeStyle = 'rgba(120,140,200,.07)';
        ctx.lineWidth = 1;
        for (var i = 1; i < N; i++) {
          ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
        }
        /* 食物 */
        ctx.fillStyle = 'rgb(' + accent + ')';
        ctx.shadowColor = 'rgb(' + accent + ')';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        /* 蛇 */
        for (var k = 0; k < snake.length; k++) {
          var s = snake[k];
          var pad = k === 0 ? 1 : 2;
          ctx.fillStyle = 'rgba(140,205,255,' + (1 - (k / snake.length) * 0.55).toFixed(2) + ')';
          ctx.shadowColor = 'rgba(140,205,255,.55)';
          ctx.shadowBlur = 6;
          ctx.fillRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2);
        }
        ctx.shadowBlur = 0;
        if (over) {
          ctx.fillStyle = 'rgba(255,255,255,.92)';
          ctx.font = '600 22px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 8);
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255,255,255,.6)';
          ctx.fillText('RESTART · 空格 / 按钮', canvas.width / 2, canvas.height / 2 + 20);
        }
      }
      function open() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        reset();
        timer = setInterval(step, 130);
      }
      function close() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (timer) { clearInterval(timer); timer = null; }
      }
      var KEYS = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
        W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
      };
      document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('is-open')) return;
        if (KEYS[e.key]) {
          var nd = KEYS[e.key];
          if (nd[0] === -dir.x && nd[1] === -dir.y) return;
          nextDir = { x: nd[0], y: nd[1] };
          e.preventDefault();
        }
        if (e.key === ' ' && over) reset();
      });
      overlay.querySelectorAll('[data-game-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      var restart = document.getElementById('gameRestart');
      if (restart) restart.addEventListener('click', function () { reset(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
          close();
          e.stopImmediatePropagation();
        }
      }, true);
      window.openGame = open;
      window.closeGame = close;
      return open;
    })();
});
    /* ===== 12.1 人物介绍面板 ===== */
    var openPerson = (function () {
      var panel = document.getElementById('personPanel');
      if (!panel) return function () {};
      function open() {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
      function close() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      }
      panel.querySelectorAll('[data-person-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      panel.querySelectorAll('.person__tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var key = tab.getAttribute('data-person-tab');
          panel.querySelectorAll('.person__tab').forEach(function (t) {
            t.classList.toggle('is-active', t === tab);
          });
          panel.querySelectorAll('.person__pane').forEach(function (pane) {
            pane.classList.toggle('is-active', pane.getAttribute('data-person-pane') === key);
          });
        });
      });
      window.closePerson = close;
      window.openPerson = open;
      return open;
    })();


    /* ===== 12.1b 照片墙放大面板 ===== */
    var openPhotoWall = (function () {
      var el = document.getElementById('photoWallZoom');
      if (!el) return function () {};
      function open() { el.classList.add('is-open'); document.body.classList.add('room-locked'); }
      function close() { el.classList.remove('is-open'); document.body.classList.remove('room-locked'); }
      var btn = document.getElementById('photoZoomClose');
      if (btn) btn.addEventListener('click', close);
      var back = el.querySelector('.photo-zoom__backdrop');
      if (back) back.addEventListener('click', close);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && el.classList.contains('is-open')) { close(); e.stopImmediatePropagation(); }
      }, true);
      window.closePhotoWall = close;
      window.openPhotoWall = open;
      return open;
    })();


    /* ===== 12.2 作品墙面板 ===== */
    var openWall = (function () {
      var panel = document.getElementById('worksWall');
      var board = document.getElementById('wallBoard');
      if (!panel) return function () {};
      function open() {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
      function close() {
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
      }
      /* 生成作品墙钥匙扣（复用 keychain 结构 + 交互） */
      if (board && keychainWorks) {
        keychainWorks.forEach(function (key) {
          var d = workDetails[key];
          if (!d || !d.cover) return;
          var kc = document.createElement('div');
          kc.className = 'keychain';
          kc.dataset.work = key;
          var pin = document.createElement('span'); pin.className = 'keychain__pin'; kc.appendChild(pin);
          var str = document.createElement('span'); str.className = 'keychain__string'; kc.appendChild(str);
          var ring = document.createElement('span'); ring.className = 'keychain__ring'; kc.appendChild(ring);
          var panelEl = document.createElement('div'); panelEl.className = 'keychain__panel';
          var img = document.createElement('img'); img.src = d.cover; img.alt = d.title; img.loading = 'lazy';
          panelEl.appendChild(img);
          var label = document.createElement('div'); label.className = 'keychain__label';
          var badge = document.createElement('span'); badge.className = 'keychain__badge';
          badge.textContent = (d.cat || '').split('·')[0].trim() || 'WORK';
          label.appendChild(badge);
          var name = document.createElement('p'); name.className = 'keychain__name'; name.textContent = d.title;
          label.appendChild(name);
          panelEl.appendChild(label);
          kc.appendChild(panelEl);
          board.appendChild(kc);
          kc.addEventListener('mouseenter', function () {
            kc.classList.add('is-hovering'); kc.classList.remove('is-swaying');
            void kc.offsetWidth; kc.classList.add('is-swaying');
            setTimeout(function () { kc.classList.remove('is-swaying'); }, 600);
          });
          kc.addEventListener('mouseleave', function () {
            kc.classList.remove('is-hovering');
            kc.style.transform = '';
          });
          kc.addEventListener('click', function () {
            if (workDetails[key]) openModal(key);
          });
        });
      }
      panel.querySelectorAll('[data-wall-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      window.closeWall = close;
      window.openWall = open;
      return open;
    })();


    /* ===== 13. 电脑贪吃蛇小游戏 ===== */
    var openGame = (function () {
      var overlay = document.getElementById('gameOverlay');
      if (!overlay) return function () {};
      var canvas = document.getElementById('gameCanvas');
      var ctx = canvas.getContext('2d');
      var scoreEl = document.getElementById('gameScore');
      var N = 20, cell = canvas.width / N;
      var snake, dir, nextDir, food, score, timer, over;

      function placeFood() {
        do {
          food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
      }
      function reset() {
        snake = [{ x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }];
        dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
        score = 0; over = false;
        if (scoreEl) scoreEl.textContent = '0';
        placeFood();
        draw();
      }
      function step() {
        if (over) return;
        dir = nextDir;
        var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) { over = true; draw(); return; }
        for (var i = 0; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) { over = true; draw(); return; }
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score += 10; if (scoreEl) scoreEl.textContent = String(score);
          placeFood();
        } else {
          snake.pop();
        }
        draw();
      }
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb') || '165,180,252';
        ctx.strokeStyle = 'rgba(120,140,200,.07)';
        ctx.lineWidth = 1;
        for (var i = 1; i < N; i++) {
          ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
        }
        /* 食物 */
        ctx.fillStyle = 'rgb(' + accent + ')';
        ctx.shadowColor = 'rgb(' + accent + ')';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.34, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        /* 蛇 */
        for (var k = 0; k < snake.length; k++) {
          var s = snake[k];
          var pad = k === 0 ? 1 : 2;
          ctx.fillStyle = 'rgba(140,205,255,' + (1 - (k / snake.length) * 0.55).toFixed(2) + ')';
          ctx.shadowColor = 'rgba(140,205,255,.55)';
          ctx.shadowBlur = 6;
          ctx.fillRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2);
        }
        ctx.shadowBlur = 0;
        if (over) {
          ctx.fillStyle = 'rgba(255,255,255,.92)';
          ctx.font = '600 22px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 8);
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255,255,255,.6)';
          ctx.fillText('RESTART · 空格 / 按钮', canvas.width / 2, canvas.height / 2 + 20);
        }
      }
      function open() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        reset();
        timer = setInterval(step, 130);
      }
      function close() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (timer) { clearInterval(timer); timer = null; }
      }
      var KEYS = {
        ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
        w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
        W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0]
      };
      document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('is-open')) return;
        if (KEYS[e.key]) {
          var nd = KEYS[e.key];
          if (nd[0] === -dir.x && nd[1] === -dir.y) return;
          nextDir = { x: nd[0], y: nd[1] };
          e.preventDefault();
        }
        if (e.key === ' ' && over) reset();
      });
      overlay.querySelectorAll('[data-game-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      var restart = document.getElementById('gameRestart');
      if (restart) restart.addEventListener('click', function () { reset(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
          close();
          e.stopImmediatePropagation();
        }
      }, true);
      window.openGame = open;
      window.closeGame = close;
      return open;
    })();
