/* =========================================================
   site/site.js — 主站交互（加载动画/星云/视差/作品浮窗/钥匙扣板/头像跟随）
   数据来自 data/works.js（workDetails/keychainWorks）
   ========================================================= */
'use strict';

var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', function () {
    /* ===== 1. 作品封面：把 data-color 写入 CSS 变量 ===== */
    document.querySelectorAll('.work-card__cover[data-color]').forEach(function (c) {
      c.style.setProperty('--c', c.dataset.color);
    });

    /* ===== 2. 加载动画 0% → 100% ===== */
    (function runLoader() {
      var loader = document.getElementById('loader');
      var num = document.getElementById('loaderNum');
      var bar = document.getElementById('loaderBar');
      if (!loader) return;

      document.body.style.overflow = 'hidden';

      if (prefersReduced) {
        num.textContent = '100%';
        bar.style.width = '100%';
        loader.classList.add('is-done');
        document.body.style.overflow = '';
        setTimeout(function () { loader.style.display = 'none'; }, 650);
        return;
      }

      var p = 0;
      function tick() {
        p += Math.random() * 8 + 4;
        if (p > 100) p = 100;
        num.textContent = Math.floor(p) + '%';
        bar.style.width = p + '%';
        if (p < 100) {
          setTimeout(tick, 70 + Math.random() * 70);
        } else {
          setTimeout(function () {
            loader.classList.add('is-done');
            document.body.style.overflow = '';
            setTimeout(function () { loader.style.display = 'none'; }, 650);
          }, 250);
        }
      }
      setTimeout(tick, 150);
    })();

    /* ===== 3. 滚动揭示（只进不退） ===== */
    (function reveals() {
      var items = document.querySelectorAll('.reveal');
      if (prefersReduced || !('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-revealed'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-revealed');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      items.forEach(function (el) { io.observe(el); });
    })();

    /* ===== 4. 顶部导航：滚动后磨砂玻璃 ===== */
    (function stickyNav() {
      var nav = document.getElementById('topnav');
      if (!nav) return;
      function onScroll() {
        if (window.scrollY > 40) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    /* ===== 5. 平滑滚动（顶部导航 / 锚点 / 挂卡） ===== */
    function smoothScrollTo(target) {
      var el = document.querySelector(target);
      if (!el) return;
      var navH = 72;
      var top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          smoothScrollTo(href);
        }
      });
    });

    /* ===== 6. Hero 星云：Canvas 绚烂流动星海（鼠标流动 + 主题变色 + 保留流星点缀） ===== */
    (function nebulaCanvas() {
      if (prefersReduced) return;
      var canvas = document.getElementById('heroNebula');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var hero = document.getElementById('hero');
      var W = 0, H = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var parts = [];
      var mouse = { x: -9999, y: -9999, active: false };
      var scrollP = 0;
      var theme = document.body.getAttribute('data-theme') || 'nebulae';

      var palettes = {
        nebulae: [[165,180,252],[139,122,255],[96,165,250],[244,114,182],[167,139,250],[94,234,212],[255,255,255]],
        silver: [[203,213,225],[148,163,184],[100,116,139],[56,189,248],[165,243,252],[226,232,240],[255,255,255]],
        gold: [[231,192,106],[240,201,107],[255,220,150],[244,63,94],[160,113,56],[255,180,120],[255,255,230]]
      };

      function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

      function initParts() {
        var count = Math.round(Math.min(460, Math.max(220, W / 3.6)));
        parts = [];
        var colors = palettes[theme] || palettes.nebulae;
        for (var i = 0; i < count; i++) {
          var big = Math.random() < 0.13;
          var c = pick(colors);
          parts.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: big ? (2.2 + Math.random() * 3.4) : (0.4 + Math.random() * 1.6),
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2 - 0.05,
            c: c,
            glow: big ? 9 : 3.2,
            a: big ? 0.24 + Math.random() * 0.42 : 0.16 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            freq: 0.4 + Math.random() * 0.9,
            amp: 0.12 + Math.random() * 0.4
          });
        }
      }

      function resize() {
        var r = hero.getBoundingClientRect();
        W = r.width; H = r.height;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParts();
      }

      function frame(t) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        var tms = t * 0.00016;
        var fade = Math.max(0, 1 - scrollP * 1.25);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.vx += Math.sin(tms * p.freq + p.phase) * 0.0016;
          p.vy += Math.cos(tms * p.freq * 0.8 + p.phase) * 0.0012;
          if (mouse.active) {
            var dx = p.x - mouse.x, dy = p.y - mouse.y;
            var d2 = dx * dx + dy * dy;
            var R = 250;
            if (d2 < R * R && d2 > 0.01) {
              var d = Math.sqrt(d2);
              var f = (1 - d / R) * 0.14;
              p.vx += (-dy / d) * f - (dx / d) * 0.09 * (1 - d / R);
              p.vy += (dx / d) * f - (dy / d) * 0.09 * (1 - d / R);
            }
          }
          var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (sp > 0.95) { p.vx = p.vx * 0.95 / sp; p.vy = p.vy * 0.95 / sp; }
          p.x += p.vx + Math.sin(tms + p.phase) * p.amp;
          p.y += p.vy + Math.cos(tms * 1.3 + p.phase) * p.amp * 0.8;
          if (p.x < -40) p.x = W + 40; else if (p.x > W + 40) p.x = -40;
          if (p.y < -40) p.y = H + 40; else if (p.y > H + 40) p.y = -40;

          var alpha = p.a * fade;
          if (alpha < 0.012) continue;
          var tw = 0.72 + 0.28 * Math.sin(tms * 2 + p.phase);
          var a = Math.min(1, alpha * tw);
          var col = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = col + a + ')';
          ctx.fill();
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * p.glow);
          g.addColorStop(0, col + (a * 0.4) + ')');
          g.addColorStop(1, col + '0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * p.glow, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(frame);
      }

      window.addEventListener('resize', resize);
      new MutationObserver(function () {
        theme = document.body.getAttribute('data-theme') || 'nebulae';
        initParts();
      }).observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

      window.__nebula = {
        setMouse: function (x, y, on) { mouse.x = x; mouse.y = y; mouse.active = on; },
        setScroll: function (p) { scrollP = p; }
      };

      resize();
      requestAnimationFrame(frame);
    })();

    /* ===== 6.1 CSS 流星点缀 ===== */
    (function shooting() {
      if (prefersReduced) return;
      var shootBox = document.getElementById('heroShooting');
      if (!shootBox) return;
      var SHOOT = 3;
      for (var j = 0; j < SHOOT; j++) {
        var m = document.createElement('span');
        m.className = 'shooting';
        m.style.top = (4 + Math.random() * 36).toFixed(1) + '%';
        m.style.right = (-(Math.random() * 14)).toFixed(1) + '%';
        m.style.setProperty('--sd', (5 + Math.random() * 5).toFixed(1) + 's');
        m.style.setProperty('--sd-delay', (Math.random() * 8).toFixed(1) + 's');
        shootBox.appendChild(m);
      }
    })();

    /* ===== 7. Hero：鼠标视差 + 房子 3D 转动 + 滚动四散转场 ===== */
    (function parallax() {
      if (prefersReduced) return;
      var hero = document.getElementById('hero');
      var bg = document.getElementById('heroBg');
      var house = document.getElementById('heroHouse');
      var mount = document.querySelector('.hero__mount');
      var neb = window.__nebula;
      var mx = 0, my = 0, scrollP = 0, raf = null;
      if (!hero || !bg) return;

      function update() {
        bg.style.transform = 'translate(' + (mx * -30).toFixed(1) + 'px, ' + (my * -30).toFixed(1) + 'px)';
        if (house) {
          var ry = mx * 16, rx = -my * 10;
          var tx = scrollP * -150, ty = -scrollP * 170;
          var sc = 1 - scrollP * 0.55;
          var rot = scrollP * -20;
          house.style.transform =
            'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ') rotate(' + rot.toFixed(1) + 'deg) perspective(900px) rotateY(' + ry.toFixed(1) + 'deg) rotateX(' + rx.toFixed(1) + 'deg)';
          house.style.opacity = String(Math.max(0, 1 - scrollP * 1.3));
        }
        if (mount) {
          mount.style.transform = 'translateY(' + (scrollP * 110).toFixed(1) + 'px) scaleX(' + (1 + scrollP * 0.14).toFixed(3) + ')';
          mount.style.opacity = String(Math.max(0, 1 - scrollP * 1.15));
        }
        if (neb) neb.setScroll(scrollP);
      }

      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
        if (neb) neb.setMouse(e.clientX - r.left, e.clientY - r.top, true);
        update();
      });
      hero.addEventListener('mouseleave', function () {
        mx = 0; my = 0;
        if (neb) neb.setMouse(-9999, -9999, false);
        update();
      });
      window.addEventListener('scroll', function () {
        var h = hero.offsetHeight || 1;
        scrollP = Math.min(1, Math.max(0, window.scrollY / h));
        if (!raf) {
          raf = requestAnimationFrame(function () { raf = null; update(); });
        }
      }, { passive: true });
    })();

    /* ===== 7.5 星空主题切换（记住选择） ===== */
    (function themeSwitch() {
      var root = document.body;
      var btns = document.querySelectorAll('[data-theme-btn]');
      if (!btns.length) return;
      var saved = null;
      try { saved = localStorage.getItem('portfolio-theme'); } catch (e) {}
      if (saved && ['nebulae', 'silver', 'gold'].indexOf(saved) > -1) {
        root.setAttribute('data-theme', saved);
      }
      function sync() {
        var cur = root.getAttribute('data-theme') || 'nebulae';
        btns.forEach(function (b) {
          var on = b.getAttribute('data-theme-btn') === cur;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
      }
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var t = b.getAttribute('data-theme-btn');
          root.setAttribute('data-theme', t);
          try { localStorage.setItem('portfolio-theme', t); } catch (e) {}
          sync();
        });
      });
      sync();
    })();

    /* ===== 8. 作品浮窗 ===== */
    var openModal; /* 暴露给钥匙扣模块调用 */
    (function modal() {
      var modal = document.getElementById('workModal');
      if (!modal) return;
      var cover = document.getElementById('modalCover');
      var cat = document.getElementById('modalCat');
      var title = document.getElementById('modalTitle');
      var desc = document.getElementById('modalDesc');
      var list = document.getElementById('modalList');
      var gallery = document.getElementById('modalGallery');
      var modalBody = modal.querySelector('.modal__body');

      function open(key) {
        var d = workDetails[key];
        if (!d) return;
        cat.textContent = d.cat;
        title.textContent = d.title;
        desc.textContent = d.desc;
        list.innerHTML = '';
        (d.list || []).forEach(function (li) {
          var node = document.createElement('li');
          node.textContent = li;
          list.appendChild(node);
        });

        // 封面：有 cover 图片就用图片，否则用 color 渐变
        cover.innerHTML = '';
        var coverLoaded = false;
        function hideLoading() {
          if (!coverLoaded) {
            coverLoaded = true;
            modal.classList.remove('is-loading');
          }
        }
        if (d.cover) {
          cover.classList.add('has-img');
          cover.style.removeProperty('--c');
          var coverImg = document.createElement('img');
          coverImg.onload = hideLoading;
          coverImg.onerror = hideLoading;
          coverImg.src = d.cover;
          coverImg.alt = d.title;
          cover.appendChild(coverImg);
        } else {
          cover.classList.remove('has-img');
          cover.style.setProperty('--c', d.color || 'linear-gradient(135deg, #1a221a, #243024)');
          hideLoading();
        }

        // 图集：渲染作品的所有图
        gallery.innerHTML = '';
        (d.gallery || []).forEach(function (item) {
          var fig = document.createElement('figure');
          if (item.wide) fig.className = 'is-wide';
          
          if (item.isLink) {
            // 链接类型：渲染成可点击的游戏入口按钮
            var linkBtn = document.createElement('a');
            linkBtn.href = item.src;
            linkBtn.target = '_blank';
            linkBtn.rel = 'noopener noreferrer';
            linkBtn.style.cssText = 'display:block;padding:40px 20px;text-align:center;background:rgba(163,230,53,0.08);border:1px solid rgba(163,230,53,0.3);border-radius:8px;color:#a3e635;text-decoration:none;font-family:JetBrains Mono,monospace;font-size:16px;transition:all 0.2s;';
            linkBtn.innerHTML = '🎮 ' + (item.caption || '点击打开') + ' ↗';
            linkBtn.addEventListener('mouseenter', function() {
              this.style.background = 'rgba(163,230,53,0.15)';
              this.style.boxShadow = '0 0 20px rgba(163,230,53,0.2)';
            });
            linkBtn.addEventListener('mouseleave', function() {
              this.style.background = 'rgba(163,230,53,0.08)';
              this.style.boxShadow = 'none';
            });
            fig.appendChild(linkBtn);
          } else {
            // 普通图片
            var img = document.createElement('img');
            img.src = item.src;
            img.alt = item.caption || '';
            img.loading = 'lazy';
            fig.appendChild(img);
            if (item.caption) {
              var cap = document.createElement('figcaption');
              cap.textContent = item.caption;
              fig.appendChild(cap);
            }
          }
          gallery.appendChild(fig);
        });

        // 游戏嵌入：如果作品有 gameEmbed 字段，直接显示游戏，隐藏文字介绍
        var existingGame = document.getElementById('modalGameEmbed');
        if (existingGame) existingGame.remove();
        
        // 恢复默认显示
        cover.style.display = '';
        cat.style.display = '';
        title.style.display = '';
        desc.style.display = '';
        list.style.display = '';
        gallery.style.display = '';
        
        if (d.gameEmbed && modalBody) {
          // 隐藏文字介绍部分
          cover.style.display = 'none';
          cat.style.display = 'none';
          title.style.display = 'none';
          desc.style.display = 'none';
          list.style.display = 'none';
          gallery.style.display = 'none';
          
          // 直接显示游戏
          var gameWrap = document.createElement('div');
          gameWrap.id = 'modalGameEmbed';
          gameWrap.style.cssText = 'margin:0;padding:0;text-align:center;';
          
          var iframe = document.createElement('iframe');
          iframe.src = d.gameEmbed;
          iframe.style.cssText = 'width:100%;max-width:460px;height:720px;border:none;border-radius:12px;background:#0a0e0a;display:block;margin:0 auto;';
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          
          gameWrap.appendChild(iframe);
          modalBody.appendChild(gameWrap);
        }

        modal.classList.add('is-open', 'is-loading');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // 兜底：3秒后强制隐藏 loading，避免一直卡着
        setTimeout(hideLoading, 3000);
      }
      function close() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      document.querySelectorAll('.work-card').forEach(function (card) {
        card.addEventListener('click', function () {
          open(card.dataset.work || 'more');
        });
      });
      modal.querySelectorAll('[data-close]').forEach(function (el) {
        el.addEventListener('click', close);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
      });

      /* 暴露 open 给外部模块（钥匙扣等） */
      openModal = open;
      window.openModal = open;
    })();

    /* ===== 9. 按钮点击涟漪反馈 ===== */
    (function ripple() {
      document.querySelectorAll('.hero__cta, .modal__close').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          var rect = btn.getBoundingClientRect();
          var span = document.createElement('span');
          var d = Math.max(rect.width, rect.height);
          span.style.cssText =
            'position:absolute;border-radius:50%;background:rgba(var(--accent-rgb),.35);' +
            'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - rect.left - d / 2) + 'px;' +
            'top:' + (e.clientY - rect.top - d / 2) + 'px;transform:scale(0);' +
            'animation:ripple .6s ease-out forwards;pointer-events:none;';
          var prev = btn.style.position;
          if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
          btn.appendChild(span);
          setTimeout(function () { span.remove(); btn.style.position = prev; }, 620);
        });
      });
      if (!document.getElementById('rippleKeyframes')) {
        var st = document.createElement('style');
        st.id = 'rippleKeyframes';
        st.textContent = '@keyframes ripple{to{transform:scale(2.4);opacity:0;}}';
        document.head.appendChild(st);
      }
    })();

    /* 钥匙扣数据：取 workDetails 中有 cover 的作品（外层作用域，供洞洞板/作品墙共用） */

    /* ===== 10. 钥匙扣板：动态生成 + 悬停摇晃 + 点击展开 ===== */
    (function keychainBoard() {
      var board = document.getElementById('keychainBoard');
      if (!board) return;

      /* 动态生成钥匙扣 DOM */
      keychainWorks.forEach(function (key) {
        var d = workDetails[key];
        if (!d || !d.cover) return;

        var kc = document.createElement('div');
        kc.className = 'keychain reveal';
        kc.dataset.work = key;

        var pin = document.createElement('span');
        pin.className = 'keychain__pin';
        kc.appendChild(pin);

        var str = document.createElement('span');
        str.className = 'keychain__string';
        kc.appendChild(str);

        var ring = document.createElement('span');
        ring.className = 'keychain__ring';
        kc.appendChild(ring);

        var panel = document.createElement('div');
        panel.className = 'keychain__panel';

        var img = document.createElement('img');
        img.src = d.cover;
        img.alt = d.title;
        img.loading = 'lazy';
        panel.appendChild(img);

        var label = document.createElement('div');
        label.className = 'keychain__label';

        var badge = document.createElement('span');
        badge.className = 'keychain__badge';
        badge.textContent = (d.cat || '').split('·')[0].trim() || 'WORK';
        label.appendChild(badge);

        var name = document.createElement('p');
        name.className = 'keychain__name';
        name.textContent = d.title;
        label.appendChild(name);

        panel.appendChild(label);
        kc.appendChild(panel);
        board.appendChild(kc);
      });

      /* 重新观察新生成的 reveal 元素 */
      if ('IntersectionObserver' in window && !prefersReduced) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('is-revealed');
              io.unobserve(en.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        board.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
      } else {
        board.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-revealed'); });
      }

      /* 悬停摇晃：鼠标移动时跟随鼠标轻微倾斜 + 进入时播放摇晃动画 */
      var swayTimers = {};
      board.querySelectorAll('.keychain').forEach(function (kc) {
        /* 鼠标进入 → 播放摇晃 keyframes */
        kc.addEventListener('mouseenter', function () {
          kc.classList.add('is-hovering');
          kc.classList.remove('is-swaying');
          /* 强制 reflow 以重启动画 */
          void kc.offsetWidth;
          kc.classList.add('is-swaying');
          clearTimeout(swayTimers[kc.dataset.work]);
          swayTimers[kc.dataset.work] = setTimeout(function () {
            kc.classList.remove('is-swaying');
          }, 600);
        });

        /* 鼠标离开 → 恢复 */
        kc.addEventListener('mouseleave', function () {
          kc.classList.remove('is-hovering');
          kc.style.transform = '';
        });

        /* 鼠标在钥匙扣上移动 → 轻微跟随倾斜 */
        kc.addEventListener('mousemove', function (e) {
          if (prefersReduced) return;
          var r = kc.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          var rotY = x * 12;
          var rotX = -y * 8;
          kc.style.transform = 'perspective(600px) rotateX(' + rotX.toFixed(1) + 'deg) rotateY(' + rotY.toFixed(1) + 'deg)';
        });

        /* 点击 → 打开作品浮窗 */
        kc.addEventListener('click', function () {
          var key = kc.dataset.work;
          if (key && workDetails[key]) {
            openModal(key);
          }
        });
      });
    })();

    /* ===== 11. 头像鼠标跟随 3D 旋转 ===== */
    (function avatar3D() {
      var avatar = document.getElementById('expAvatar');
      var inner = document.getElementById('avatarInner');
      if (!avatar || !inner || prefersReduced) return;

      avatar.addEventListener('mousemove', function (e) {
        var r = avatar.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        var rotY = x * 18;
        var rotX = -y * 12;
        inner.style.transform = 'perspective(800px) rotateX(' + rotX.toFixed(1) + 'deg) rotateY(' + rotY.toFixed(1) + 'deg)';
        avatar.classList.add('is-active');
      });

      avatar.addEventListener('mouseleave', function () {
        inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        avatar.classList.remove('is-active');
      });
    })();

});
